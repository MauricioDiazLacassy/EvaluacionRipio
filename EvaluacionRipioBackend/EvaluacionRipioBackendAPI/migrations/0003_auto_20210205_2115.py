# Generated by Django 3.1.6 on 2021-02-06 00:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('EvaluacionRipioBackendAPI', '0002_auto_20210205_2112'),
    ]

    operations = [
        migrations.AlterField(
            model_name='coin',
            name='key',
            field=models.CharField(max_length=5),
        ),
    ]
