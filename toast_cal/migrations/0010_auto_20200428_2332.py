# Generated by Django 3.0.4 on 2020-04-28 23:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('toast_cal', '0009_auto_20200427_2020'),
    ]

    operations = [
        migrations.RenameField(
            model_name='calendar',
            old_name='calendar',
            new_name='calendarId',
        ),
        migrations.RenameField(
            model_name='calendar',
            old_name='end_date',
            new_name='end',
        ),
        migrations.RenameField(
            model_name='calendar',
            old_name='start_date',
            new_name='start',
        ),
        migrations.AddField(
            model_name='calendar',
            name='category',
            field=models.CharField(default='time', max_length=30),
        ),
    ]
