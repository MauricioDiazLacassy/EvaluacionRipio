from django.contrib import admin

from .models import Transaction, Block, Blockchain, Coin, Wallet

admin.site.register(Transaction)
admin.site.register(Block)
admin.site.register(Blockchain)
admin.site.register(Coin)
admin.site.register(Wallet)