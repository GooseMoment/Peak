# Generated by Django 4.2.14 on 2024-10-02 08:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0013_task_order'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='task',
            name='due_time',
        ),
        migrations.RemoveField(
            model_name='task',
            name='due_tz',
        ),
        migrations.AddField(
            model_name='task',
            name='due_datetime',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='task',
            name='due_type',
            field=models.CharField(blank=True, max_length=8, null=True),
        ),
    ]