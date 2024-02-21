# Generated by Django 4.2.7 on 2024-02-20 15:58

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0001_initial'),
        ('social', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('notifications', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notification',
            name='follow_request',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='social.following'),
        ),
        migrations.AlterField(
            model_name='notification',
            name='reaction',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='social.reaction'),
        ),
        migrations.AlterField(
            model_name='notification',
            name='task',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='tasks.task'),
        ),
        migrations.AlterField(
            model_name='notification',
            name='type',
            field=models.CharField(choices=[('task', 'for task'), ('reaction', 'for reaction'), ('follow', 'for follow'), ('follow_request', 'for follow request'), ('follow_request_accepted', 'for follow request accpeted'), ('pecked', 'for pecked'), ('trending_up', 'for trending up'), ('trending_down', 'for trending down')]),
        ),
        migrations.AlterField(
            model_name='notification',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
