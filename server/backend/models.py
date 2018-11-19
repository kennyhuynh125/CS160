from django.db import models

# Create your models here.

class User(models.Model):
    username = models.CharField(max_length=200, unique=True)
    password = models.CharField(max_length=200)
    firstName = models.CharField(max_length=200, null=True)
    lastName = models.CharField(max_length=200, null=True)
    email = models.EmailField(max_length=255, null=True)

class Payment(models.Model):
    userId = models.IntegerField()
    ccName = models.CharField(max_length=200)
    ccType = models.CharField(max_length=200)
    ccNumber = models.CharField(max_length=200)
    ccExpirationMonth = models.IntegerField(default=0)
    ccExpirationYear = models.IntegerField(default=0)
    ccCVV = models.IntegerField(default=0)
    ccIsDefault = models.BooleanField(default=False)

class Address(models.Model):
    userId = models.IntegerField()
    firstName = models.CharField(max_length=200)
    lastName = models.CharField(max_length=200)
    street = models.CharField(max_length=200)
    aptNo = models.CharField(max_length=200, null=True)
    city = models.CharField(max_length=200)
    state = models.CharField(max_length=200)
    country = models.CharField(max_length=200)
    zipCode = models.IntegerField(default=94544)


class Driver(models.Model):
    userId = models.IntegerField(null=True)
    status = models.IntegerField(default=-1)
    currentLatitude = models.FloatField(default=0)
    currentLongitude = models.FloatField(default=0)
    fixedDriverId = models.IntegerField(null=True)

class RideRequests(models.Model):
    driverId = models.IntegerField(null=False)
    userId = models.IntegerField(null=True)
    customerLatitude = models.FloatField(default=0)
    customerLongitude = models.FloatField(default=0)
    destinationLatitude = models.FloatField(default=0)
    destinationLongitude = models.FloatField(default=0)
    driverLatitude = models.FloatField(default=0, null=True)
    driverLongitude = models.FloatField(default=0, null=True)
    accepted = models.IntegerField(default=0)