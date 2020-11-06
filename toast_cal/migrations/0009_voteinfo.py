# Generated by Django 3.0.4 on 2020-11-07 02:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('toast_cal', '0008_auto_20201106_1753'),
    ]

    operations = [
        migrations.CreateModel(
            name='VoteInfo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('voteId', models.IntegerField()),
                ('stdudentID', models.CharField(max_length=30)),
                ('comment', models.TextField(blank=True, null=True)),
            ],
            options={
                'db_table': 'VoteInfo',
            },
        ),
    ]