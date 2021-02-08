from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.utils import json

from .models import Wallet
from hashlib import sha256


@receiver(post_save, sender=User)
def create_wallet(sender, instance, created, **kwargs):

    if created:
        json_dict = {
            'email': instance.email,
            'username': instance.username,
            'id': instance.id,
        }
        aux = json.dumps(json_dict, sort_keys=True)
        identificador_wallet = sha256(aux.encode()).hexdigest()
        Wallet.objects.create(id=identificador_wallet, user=instance)