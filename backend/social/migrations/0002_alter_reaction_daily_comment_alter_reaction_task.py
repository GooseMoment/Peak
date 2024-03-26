# Generated by Django 4.2.7 on 2024-03-19 07:22

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0002_alter_task_repeat'),
        ('social', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reaction',
            name='daily_comment',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='social.dailycomment'),
        ),
        migrations.AlterField(
            model_name='reaction',
            name='task',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='tasks.task'),
        ),
    ]
