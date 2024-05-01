# Generated by Django 4.2.11 on 2024-05-01 10:57

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('notifications', '0007_remove_notification_task_notification_task_reminder_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='WebPushSubscription',
            fields=[
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('deleted_at', models.DateTimeField(blank=True, null=True)),
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('subscription_info', models.JSONField()),
                ('browser', models.CharField(max_length=128)),
                ('user_agent', models.CharField(blank=True, max_length=500)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
