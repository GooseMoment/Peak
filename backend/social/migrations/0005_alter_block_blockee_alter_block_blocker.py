# Generated by Django 4.2.7 on 2024-04-04 07:46

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('social', '0004_alter_following_followee_alter_following_follower'),
    ]

    operations = [
        migrations.AlterField(
            model_name='block',
            name='blockee',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='blockers', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='block',
            name='blocker',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='blockees', to=settings.AUTH_USER_MODEL),
        ),
    ]