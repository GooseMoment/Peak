# Generated by Django 4.2.18 on 2025-02-24 19:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('social', '0012_alter_reaction_emoji'),
    ]

    operations = [
        migrations.AlterField(
            model_name='following',
            name='status',
            field=models.CharField(choices=[('requested', 'request by follower'), ('accepted', 'accepted by followee'), ('rejected', 'rejected by followee'), ('canceled', 'canceled by follower')], max_length=128),
        ),
    ]
