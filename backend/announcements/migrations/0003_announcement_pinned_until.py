# Generated by Django 4.2.15 on 2024-09-24 13:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('announcements', '0002_announcement_lang'),
    ]

    operations = [
        migrations.AddField(
            model_name='announcement',
            name='pinned_until',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
