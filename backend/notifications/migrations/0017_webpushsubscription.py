# Generated by Django 4.2.23 on 2025-07-12 10:15

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('peak_auth', '0003_authtoken'),
        ('notifications', '0016_delete_webpushsubscription'),
    ]

    operations = [
        migrations.CreateModel(
            name='WebPushSubscription',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('deleted_at', models.DateTimeField(blank=True, null=True)),
                ('locale', models.CharField(blank=True, max_length=128, null=True)),
                ('fail_cnt', models.IntegerField(default=0)),
                ('excluded_types', models.JSONField(default=list)),
                ('endpoint', models.URLField()),
                ('auth', models.CharField(max_length=128)),
                ('p256dh', models.CharField(max_length=128)),
                ('expiration_time', models.FloatField(blank=True, null=True)),
                ('token', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='web_push_subscription', to=settings.KNOX_TOKEN_MODEL)),
            ],
            options={
                'db_table': 'web_push_subscriptions',
            },
        ),
    ]
