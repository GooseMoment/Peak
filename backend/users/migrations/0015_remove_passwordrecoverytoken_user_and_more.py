# Generated by Django 4.2.15 on 2024-09-26 17:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0014_alter_user_header_color'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='passwordrecoverytoken',
            name='user',
        ),
        migrations.DeleteModel(
            name='EmailVerificationToken',
        ),
        migrations.DeleteModel(
            name='PasswordRecoveryToken',
        ),
    ]