from django.db import models
from hashlib import sha256
from django.forms.models import model_to_dict
from django.contrib.auth.models import User
import json


class Blockchain(models.Model):
    """
        Modelo de Blockchain encargada de almacenar los bloques.
    """

    difficulty = models.IntegerField(default=2)
    last_block_id = models.IntegerField(default=1)

    class Meta:
        verbose_name = 'Blockchain'
        verbose_name_plural = 'Blockchains'

    def proof_of_work(self, block):
        """
            Retraso la creacion del nuevo bloque.
            Se computa el hash hasta conseguir que comience con tantos ceros como la dificultad lo indica.
        """
        block.nonce = 0
        computed_hash = block.compute_hash()
        while not computed_hash.startswith('0'*self.difficulty):
            block.nonce += 1
            computed_hash = block.compute_hash()
        return computed_hash

    def add_block(self, block, proof):
        """
            Arega un nuevo bloque a la blockchain.
            Incluye la verificacion de consistencia de los hash.
        """
        last_block = Block.objects.get(id=self.last_block_id)
        previous_hash = last_block.hash
        if previous_hash != block.previous_hash:
            return False
        if not self.is_valid_proof(block, proof):
            return False
        block.hash = proof
        block.save()
        self.last_block_id = block.id
        self.save()
        return True

    def is_valid_proof(self, block, block_hash):
        """
            Verifica si el inicio del hash generado cumple el patron "0" * difficultad.
        """
        return block_hash.startswith('0'*self.difficulty) and block_hash == block.compute_hash()

    def check_chain_validity(self, cls, chain):
        """
            Se recorren los bloques del Blockchain verificando
             si los hash son correctos para cada uno de ellos
        """
        result = True
        previous_hash = "0"
        for block in chain:
            block_hash = block.hash
            delattr(block, "hash")
            if not cls.is_valid_proof(block, block.hash) or previous_hash != block.previous_hash:
                result = False
                break
            block.hash, previous_hash = block_hash, block_hash

        return result

    def add_or_remove_transactions(self, unconfirmed_transactions, new_block):
        """
            Confirma las transacciones pendientes al agregar un bloque.
            Confirma por timestamp ascendente y verifica saldo luego de cada transaccion confirmada.
        """

        for transaction in unconfirmed_transactions:
            wallet_id = Wallet.objects.get(id=transaction.origin_wallet)
            if wallet_id.right_amount(transaction.amount, transaction.coin):
                transaction.confirmed = True
                transaction.block = new_block
                transaction.save()
            else:
                transaction.delete()

    def mine(self):
        """
            Crea un nuevo bloque y lo añade a la blockchain con las transacciones no confirmadas.
        """
        unconfirmed_transactions = Transaction.objects.filter(confirmed=False).reverse()
        if not unconfirmed_transactions:
            return True
        last_block = Block.objects.get(id=self.last_block_id)
        new_block = Block(id=last_block.id + 1, previous_hash=last_block.hash, chain=self)
        proof = self.proof_of_work(new_block)
        self.add_block(new_block, proof)
        self.add_or_remove_transactions(unconfirmed_transactions, new_block)

        return new_block.id

    def mine_for_admin(self):
        """
             Confirma las transacciones realizadas de admin a admin.
             Estas transacciones son generadas al crear el saldo de un activo
        """
        user = User.objects.get(is_superuser=True)
        admin_wallet = Wallet.objects.get(user_id=user.id)
        unconfirmed_transactions = Transaction.objects.filter(origin_wallet=admin_wallet.id,
                                                              destination_wallet=admin_wallet.id,
                                                              confirmed=False)
        if not unconfirmed_transactions:
            return True
        last_block = Block.objects.get(id=self.last_block_id)
        new_block = Block(id=last_block.id + 1, previous_hash=last_block.hash, chain=self)
        proof = self.proof_of_work(new_block)
        self.add_block(new_block, proof)
        for transaction in unconfirmed_transactions:
            transaction.confirmed = True
            transaction.block = new_block
            transaction.save()
        return new_block.id


class Block(models.Model):
    """
            Modelo de Bloque encargado de contener transacciones.
    """

    id = models.IntegerField(primary_key=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    nonce = models.IntegerField(default=0)
    hash = models.CharField(max_length=200)
    previous_hash = models.CharField(max_length=200, null=True, blank=True)
    chain = models.ForeignKey(Blockchain, on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'Bloque'
        verbose_name_plural = 'Bloques'
        ordering = ['-id']

    def compute_hash(self):
        """
            Genera el hash correspondiente a una instancia de bloque,
             utilizando el valor de todos sus atributos.
        """
        block_string = json.dumps(model_to_dict(self), sort_keys=True)
        return sha256(block_string.encode()).hexdigest()


class Coin(models.Model):
    """
        Modelo de activos.
    """
    id = models.AutoField(primary_key=True, editable=False)
    name = models.CharField(max_length=100, null=False, blank=False)
    key = models.CharField(max_length=5, null=False, blank=False)


class Transaction(models.Model):
    """
        Modelo de transaccion.
    """

    origin_wallet = models.CharField(max_length=200, blank=False, null=False)
    destination_wallet = models.CharField(max_length=200,blank=False, null=False)
    amount = models.FloatField()
    coin = models.ForeignKey(Coin, null=False, blank=False, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    confirmed = models.BooleanField(default=False)
    block = models.ForeignKey(Block, null=True, blank=True, on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'Transaccion'
        verbose_name_plural = 'Transacciones'
        ordering = ['-timestamp']

    def new_transaction(self, origin_wallet, destination, amount, coin):
        """
            Se crea una nueva transaccion no confirmada.
        """
        new_transaction = Transaction(origin_wallet, destination, amount, coin)
        new_transaction.save()


class Wallet(models.Model):

    """
        Modelo de billetera.
    """

    id = models.CharField(primary_key=True, max_length=200, blank=False, null=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wallet')

    def right_amount(self, amount, coin_id):
        """
             Dado un monto y un activo verifica si la billetera contiene un saldo mayor a ese monto
             en ese activo.
        """
        try:
            sent_transactions = Transaction.objects.filter(origin_wallet=self.id, confirmed=True,
                                                       coin=coin_id)
        except Exception:
            sent_transactions = []
        try:
            received_transactions = Transaction.objects.filter(destination_wallet=self.id, confirmed=True,
                                                           coin=coin_id)
        except:
            received_transactions = []
        amount_recived = 0
        amount_sent = 0
        for transaction in sent_transactions:
            amount_sent += transaction.amount
        for transaction in received_transactions:
            amount_recived += transaction.amount

        super_user = Wallet.objects.get(id=self.id).user.is_superuser
        if super_user:
            admin_transactions = Transaction.objects.filter(origin_wallet=self.id, destination_wallet=self.id,
                                                            confirmed=True, coin=coin_id)
            for transaction in admin_transactions:
                amount_recived += transaction.amount

        total_amount = amount_recived - amount_sent
        return True if ((total_amount - amount) >= 0 and total_amount > 0) else False
