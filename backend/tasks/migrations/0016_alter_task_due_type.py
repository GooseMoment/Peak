# Generated by Django 4.2.14 on 2024-10-07 04:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0015_alter_task_due_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='due_type',
            field=models.CharField(blank=True, choices=[('due_date', 'due_date'), ('due_datetime', 'due_datetime')], max_length=12, null=True),
        ),
    ]