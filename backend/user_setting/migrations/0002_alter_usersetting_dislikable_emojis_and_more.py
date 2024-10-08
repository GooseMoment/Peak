# Generated by Django 4.2.7 on 2024-04-04 07:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('social', '0005_alter_block_blockee_alter_block_blocker'),
        ('user_setting', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usersetting',
            name='dislikable_emojis',
            field=models.ManyToManyField(blank=True, related_name='dislikables', to='social.emoji'),
        ),
        migrations.AlterField(
            model_name='usersetting',
            name='favorite_emojis',
            field=models.ManyToManyField(blank=True, related_name='favorites', to='social.emoji'),
        ),
        migrations.AlterField(
            model_name='usersetting',
            name='follow_list_privacy',
            field=models.CharField(choices=[('public', 'for public'), ('protected', 'for protected'), ('private', 'for private')], default='public', max_length=128),
        ),
    ]
