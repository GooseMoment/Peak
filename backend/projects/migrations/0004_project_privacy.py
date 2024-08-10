# Generated by Django 4.2.14 on 2024-08-07 11:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0003_alter_project_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='privacy',
            field=models.CharField(choices=[('public', 'for public'), ('protected', 'for protected'), ('private', 'for private')], default='public', max_length=128),
            preserve_default=False,
        ),
    ]
