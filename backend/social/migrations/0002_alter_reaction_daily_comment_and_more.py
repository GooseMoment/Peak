# Generated by Django 4.2.7 on 2024-02-20 15:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0001_initial'),
        ('social', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reaction',
            name='daily_comment',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='social.dailycomment'),
        ),
        migrations.AlterField(
            model_name='reaction',
            name='parent_type',
            field=models.CharField(choices=[('task', 'For task'), ('daily_comment', 'For daily comment')]),
        ),
        migrations.AlterField(
            model_name='reaction',
            name='task',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='tasks.task'),
        ),
    ]
