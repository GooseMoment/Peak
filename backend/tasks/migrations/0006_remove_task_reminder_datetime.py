# Generated by Django 4.2.7 on 2024-04-02 11:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0005_alter_task_privacy'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='task',
            name='reminder_datetime',
        ),
    ]
