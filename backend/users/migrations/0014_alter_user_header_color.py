# Generated by Django 4.2.15 on 2024-08-10 20:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0013_alter_user_header_color'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='header_color',
            field=models.CharField(default='grey', max_length=128),
        ),
    ]