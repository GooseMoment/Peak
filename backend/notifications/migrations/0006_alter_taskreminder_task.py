# Generated by Django 4.2.7 on 2024-04-02 11:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0006_remove_task_reminder_datetime'),
        ('notifications', '0005_alter_notification_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='taskreminder',
            name='task',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reminders', to='tasks.task'),
        ),
    ]
