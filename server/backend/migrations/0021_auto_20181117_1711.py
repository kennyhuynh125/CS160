# Generated by Django 2.1.2 on 2018-11-18 01:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0020_auto_20181117_1556'),
    ]

    operations = [
        migrations.AlterField(
            model_name='address',
            name='aptNo',
            field=models.CharField(max_length=200, null=True),
        ),
    ]
