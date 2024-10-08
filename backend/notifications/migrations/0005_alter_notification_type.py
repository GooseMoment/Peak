# Generated by Django 4.2.7 on 2024-03-27 10:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notifications', '0004_notification_peck'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notification',
            name='type',
            field=models.CharField(choices=[('task', 'for task'), ('reaction', 'for reaction'), ('follow', 'for follow'), ('follow_request', 'for follow request'), ('follow_request_accepted', 'for follow request accpeted'), ('peck', 'for peck'), ('trending_up', 'for trending up'), ('trending_down', 'for trending down')], max_length=128),
        ),
    ]
