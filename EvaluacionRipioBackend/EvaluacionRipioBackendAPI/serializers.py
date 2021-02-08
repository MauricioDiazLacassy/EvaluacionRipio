from rest_framework import serializers
from .models import Blockchain, Block, Transaction, Wallet, Coin
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username', 'email')


class RegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'], validated_data['email'], validated_data['password'])

        return user


class BlockchainSerializer(serializers.ModelSerializer):

    class Meta:
        model = Blockchain
        fields = '__all__'


class BlockSerializer(serializers.ModelSerializer):

    class Meta:
        model = Block
        fields = '__all__'


class TransactionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Transaction
        fields = '__all__'


class TransactionHistorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Transaction
        fields = ('origin_wallet', 'destination_wallet',
                  'amount', 'confirmed', 'coin', 'timestamp')


class WalletSerializer(serializers.ModelSerializer):

    class Meta:
        model = Wallet
        fields = 'id'


class CoinSerializer(serializers.ModelSerializer):

    class Meta:
        model = Coin
        fields = '__all__'

