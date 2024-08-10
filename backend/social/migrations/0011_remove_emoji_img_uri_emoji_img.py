# Generated by Django 4.2.14 on 2024-08-10 15:49

from django.db import migrations, models
import social.models


class Migration(migrations.Migration):

    dependencies = [
        ('social', '0010_rename_dailycomment_quote_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='emoji',
            name='img_uri',
        ),
        migrations.AddField(
            model_name='emoji',
            name='img',
            field=models.ImageField(blank=True, null=True, upload_to=social.models.get_file_path),
        ),
    ]