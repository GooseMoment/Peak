# Generated by Django 4.2.11 on 2024-07-20 05:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0010_alter_task_due_tz'),
    ]

    operations = [
        migrations.AlterModelTable(
            name='repeat',
            table='repeats',
        ),
        migrations.AlterModelTable(
            name='task',
            table='tasks',
        ),
    ]
