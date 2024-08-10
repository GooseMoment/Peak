# Generated by Django 4.2.14 on 2024-08-07 08:25

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0010_emailverificationtoken_delete_useremailconfirmation'),
    ]

    operations = [
        migrations.AlterModelTable(
            name='emailverificationtoken',
            table='email_verification_tokens',
        ),
        migrations.CreateModel(
            name='PasswordRecoveryToken',
            fields=[
                ('token', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('locale', models.CharField(max_length=128)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('expires_at', models.DateTimeField(blank=True, null=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'password_recovery_tokens',
            },
        ),
    ]