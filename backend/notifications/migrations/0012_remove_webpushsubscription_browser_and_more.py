# Generated by Django 4.2.14 on 2024-07-27 08:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notifications', '0011_taskreminder_delta'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='webpushsubscription',
            name='browser',
        ),
        migrations.AddField(
            model_name='webpushsubscription',
            name='locale',
            field=models.CharField(blank=True, max_length=128, null=True),
        ),
    ]
