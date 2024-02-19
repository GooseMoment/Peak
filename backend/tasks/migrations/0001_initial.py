# Generated by Django 4.2.7 on 2024-02-19 06:19

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('drawers', '0002_initial'),
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Repeat',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('startedAt', models.DateTimeField()),
                ('weekdays', models.BinaryField(default=b'0000000', max_length=7)),
                ('week_frequency', models.IntegerField(default=0)),
                ('month', models.IntegerField(default=0)),
                ('day', models.IntegerField(default=0)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.user')),
            ],
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField()),
                ('privacy', models.CharField()),
                ('completed_at', models.DateTimeField()),
                ('due_date', models.DateField()),
                ('due_time', models.TimeField()),
                ('priority', models.IntegerField()),
                ('memo', models.TextField()),
                ('reminder_datetime', models.DateTimeField()),
                ('drawer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='drawers.drawer')),
                ('repeat', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='tasks.repeat')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.user')),
            ],
        ),
    ]
