from django.db import models

# Create your models here.

class User(models.Model):
    username = models.CharField(max_length=200, unique=True)
    password = models.CharField(max_length=200)
    firstName = models.CharField(max_length=200, null=True)
    lastName = models.CharField(max_length=200, null=True)
    email = models.EmailField(max_length=255, null=True)
    allowDetour = models.BooleanField(default=False)

class Payment(models.Model):
    userId = models.IntegerField()
    ccName = models.CharField(max_length=200)
    ccType = models.CharField(max_length=200)
    ccNumber = models.CharField(max_length=200)
    ccExpirationMonth = models.IntegerField(default=0)
    ccExpirationYear = models.IntegerField(default=0)
    ccCVV = models.IntegerField(default=0)
    ccIsDefault = models.BooleanField(default=False)

class Driver(models.Model):
    userId = models.IntegerField()
    status = models.IntegerField(default=-1)
    currentLatitude = models.DecimalField(max_digits=11, decimal_places=8, default=0)
    currentLongitude = models.DecimalField(max_digits=11, decimal_places=8, default=0)
    # carInfo? <-- not needed probably
    