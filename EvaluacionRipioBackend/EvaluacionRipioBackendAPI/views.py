from django.db.models import Q
from datetime import timezone
from django.utils.datetime_safe import datetime
from rest_framework import status, generics, permissions
from rest_framework.authtoken.admin import User
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.authtoken.serializers import AuthTokenSerializer

from knox.models import AuthToken
from knox.views import LoginView as KnoxLoginView

from .serializers import UserSerializer, RegisterSerializer, CoinSerializer
from django.contrib.auth import login
from .models import Transaction, Blockchain, Coin, Wallet
from .serializers import TransactionSerializer


class RegisterAPI(generics.GenericAPIView):
    """
        Registra un usuario devolviendo el token generado.
    """
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })


class LoginAPI(KnoxLoginView):
    """
        Inicia sesion de un usuario.
    """
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return super(LoginAPI, self).post(request, format=None)


@api_view(['POST'])
def blockchain_api_view(request):

    """
        Mina la blockchain generando un nuevo bloque para las transacciones no confirmadas.
    """

    if request.method == 'POST':
        try:
            token = AuthToken.objects.get(token_key=request.data['token'][:8])
            if token and token.expiry > datetime.now(timezone.utc):
                blockchain = Blockchain.objects.first()
                if blockchain.mine():
                    return Response('Minado correctamente', status=status.HTTP_200_OK)
            return Response('Error al minar', status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response('', status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET', 'POST'])
def coin_api_view(request):

    """
        'GET': Devuelve los activos existentes.
        'POST': Crea un nuevo activo.
    """

    if request.method == 'GET':
        coins = Coin.objects.all()
        coin_serializer = CoinSerializer(coins, many=True)
        return Response(coin_serializer.data, status=status.HTTP_200_OK)

    if request.method == 'POST':
        coin_serializer = CoinSerializer(data=request.data)
        exist_coin = False
        try:
            exist_coin = Coin.objects.get(name=request.data['name'])
        except Exception:
            exist_coin = False
        if coin_serializer.is_valid() and not exist_coin:
            coin_serializer.save()
            return Response(coin_serializer.data, status=status.HTTP_201_CREATED)
        return Response(coin_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
def transaction_api_view(request):
    """
        'GET': Devuelve todas las transacciones existentes.
        'POST': Crea una nueva transaccion.
    """

    if request.method == 'GET':
        transactions = Transaction.objects.all()
        transactions_serializer = TransactionSerializer(transactions, many=True)
        return Response(transactions_serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        transactions_serializer = TransactionSerializer(data=request.data)
        amount_ok = True
        try:
            wallet_id = Wallet.objects.get(id=request.data['origin_wallet'])
            amount_ok = wallet_id.right_amount(int(request.data['amount']), request.data['coin'])
        except Exception:
            wallet_id = False
        if not amount_ok:
            return Response('', status=status.HTTP_400_BAD_REQUEST)
        if transactions_serializer.is_valid() and wallet_id:
            transactions_serializer.save()
            return Response(transactions_serializer.data, status=status.HTTP_201_CREATED)

        return Response('', status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def balance_wallet_api_view(request):
    """
        Recibe un token.
        Devuelve el balance de una billetera
    """

    if request.method == 'POST':
        result = []
        try:
            coins = Coin.objects.all()
            token = AuthToken.objects.get(token_key=request.data['token'][:8])
            if token and token.expiry > datetime.now(timezone.utc):
                wallet_id = Wallet.objects.get(user_id=token.user_id)
                for coin in coins:
                    sent_transactions = Transaction.objects.filter(origin_wallet=wallet_id.id, confirmed=True, coin=coin.id)
                    received_transactions = Transaction.objects.filter(destination_wallet=wallet_id.id, confirmed=True, coin=coin.id)
                    amount_recived = 0
                    amount_sent = 0
                    for transaction in sent_transactions:
                        amount_sent += transaction.amount
                    for transaction in received_transactions:
                        amount_recived += transaction.amount

                    super_user = Wallet.objects.get(id=wallet_id.id).user.is_superuser
                    if super_user:
                        admin_transactions = Transaction.objects.filter(origin_wallet=wallet_id.id,
                                                                        destination_wallet=wallet_id.id,
                                                                        confirmed=True, coin=coin.id)
                        for transaction in admin_transactions:
                            amount_recived += transaction.amount

                    amount_total = amount_recived - amount_sent
                    result.append({'moneda': coin.name, 'cantidad': amount_total, 'clave': coin.key})
                return Response(result, status=status.HTTP_200_OK)
            return Response(result, status=status.HTTP_401_UNAUTHORIZED)
        except Exception:
            return Response(result, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def history_transactions_api_view(request):
    """
        Recibe un token.
        Devuelve el historial de transacciones de un usuario.
    """

    if request.method == 'POST':
        result = []
        try:
            token = AuthToken.objects.get(token_key=request.data['token'][:8])
            if token.expiry > datetime.now(timezone.utc):
                wallet_id = Wallet.objects.get(user_id=token.user_id)
                super_user = wallet_id.user.is_superuser
                if super_user:
                    transactions = Transaction.objects.all()
                else:
                    transactions = Transaction.objects.filter(Q(origin_wallet=wallet_id.id) | Q(destination_wallet=wallet_id.id))
                transactions.order_by('-timestamp')

                for transaction in transactions:
                    result.append({
                        'origin_wallet': transaction.origin_wallet,
                        'destination_wallet': transaction.destination_wallet,
                        'amount': transaction.amount,
                        'confirmed': 'Confirmada' if transaction.confirmed else 'No confirmada',
                        'coin': transaction.coin.name,
                        'timestamp': transaction.timestamp.strftime('%d-%m-%Y %H:%M:%S')
                    })
                return Response(result, status=status.HTTP_200_OK)
            return Response('', status=status.HTTP_401_UNAUTHORIZED)
        except Exception:
            return Response('', status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def wallet_api_view(request):

    """
        Recibe un token.
        Devuelve la billetera correspondiente a un usuario.
    """

    if request.method == 'POST':
        result = ''
        try:
            token = AuthToken.objects.get(token_key=request.data['token'][:8])
            if token.expiry > datetime.now(timezone.utc):
                wallet_id = Wallet.objects.get(user_id=token.user_id)
                if wallet_id:
                    result = wallet_id.id
        except Exception:
            return Response(str(result), status=status.HTTP_200_OK)

        return Response(str(result), status=status.HTTP_200_OK)


@api_view(['POST'])
def logout_api_view(request):
    """
        Recibe un token.
        Elimina dicho token.
    """

    if request.method == 'POST':
        try:
            token = AuthToken.objects.get(token_key=request.data['token'][:8])
            token.delete()
            return Response('', status=status.HTTP_200_OK)
        except Exception:
            return Response('', status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def super_user_check_view(request):
    """
        Recibe un token.
        Verifica si ese token corresponde a un superusuario.
    """

    if request.method == 'POST':
        try:
            is_superuser = AuthToken.objects.get(token_key=request.data['token'][:8]).user.is_superuser
            if is_superuser:
                return Response('true', status=status.HTTP_200_OK)
            else:
                return Response('false', status=status.HTTP_200_OK)
        except Exception:
            return Response('false', status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def unauthorized_transactions_api_view(request):
    """
        Recibe un token.
        Devuelve la cantidad de transaccions no confirmadas existentes.
    """

    if request.method == 'POST':
        result = []
        try:
            token = AuthToken.objects.get(token_key=request.data['token'][:8])
            if token.expiry > datetime.now(timezone.utc):
                transactions = Transaction.objects.filter(confirmed=False)
                transactions.order_by('-timestamp')
                aux = 0
                for transaction in transactions:
                    aux += 1
                return Response(str(aux), status=status.HTTP_200_OK)
            return Response('', status=status.HTTP_401_UNAUTHORIZED)
        except Exception:
            return Response('', status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def user_detail_view(request):

    """
        Recibe un token.
        Devuelve los detalles del usuario asociado al token.
    """

    if request.method == 'POST':
        try:
            user = AuthToken.objects.get(token_key=request.data['token'][:8]).user
            if user:
                data = {
                    'username': user.username,
                    'email': user.email,
                    'admin': 'Si' if user.is_superuser else 'No',
                }
                return Response(data, status=status.HTTP_200_OK)
            return Response({
                    'username': '',
                    'email': '',
                    'admin': '',
                }, status=status.HTTP_200_OK)
        except Exception:
            return Response({
                    'username': '',
                    'email': '',
                    'admin': '',
                }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def create_amount_admin_view(request):

    """
        Asigna saldo de un activo al administrador.
    """

    if request.method == 'POST':
        try:
            user = User.objects.get(is_superuser=True)
            admin_wallet = Wallet.objects.get(user_id=user.id)
            coin = Coin.objects.get(name=request.data['name'])
            data = {'origin_wallet': admin_wallet.id,
                    'destination_wallet': admin_wallet.id,
                    'amount': request.data['amount'],
                    'coin': str(coin.id)}
            transactions_serializer = TransactionSerializer(data=data)
            if transactions_serializer.is_valid():
                transactions_serializer.save()
                blockchain = Blockchain.objects.first()
                blockchain.mine_for_admin()
                return Response('', status=status.HTTP_201_CREATED)
            return Response('', status=status.HTTP_400_BAD_REQUEST)

        except Exception:
            return Response('', status=status.HTTP_400_BAD_REQUEST)
