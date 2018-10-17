from django.test import TestCase
from decimal import *

# Create your tests here.
from .models import User, Payment, Driver

class UserModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        User.objects.create(username="test")
        User.objects.create(password="test")

    def testUsernameContent(self):
        user = User.objects.get(id=1)
        expected_username = user.username
        self.assertEquals(expected_username, 'test')
    
    def testPasswordContent(self):
        user = User.objects.get(id=2)
        expected_password = user.password
        self.assertEquals(expected_password, 'test')
    
    def testUsernameCaseInsensitive(self):
        user = User.objects.get(id=1)
        expected_username = user.username
        name = 'TEST'
        self.assertEquals(expected_username.lower(), name.lower())
    
class DriverModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        User.objects.create(username="driver1")
        User.objects.create(username="driver2")
        User.objects.create(username="driver3")
        Driver.objects.create(userId=1)
        Driver.objects.create(userId=2, status=1)
        Driver.objects.create(userId=3, status=0, currentLatitude=37.317, currentLongitude=100)

    def testUserIsDriver(self):
        driver = Driver.objects.get(id=1)
        user_driver = User.objects.filter(id=driver.userId)
        expected_length = user_driver.count()
        self.assertEquals(expected_length, 1)
    
    def testDriverStatus(self):
        driver = Driver.objects.get(id=2)
        expected_status = driver.status
        self.assertEquals(expected_status, 1)
    
    def testDriverLatitude(self):
        driver = Driver.objects.get(id=3)
        expected_latitude = driver.currentLatitude
        self.assertEquals(expected_latitude, 37.317)
    
    def testDriverLongitude(self):
        driver = Driver.objects.get(id=3)
        expected_longitude = driver.currentLongitude
        self.assertEquals(expected_longitude, 100)
    
    def testUpdateDriverLatitude(self):
        driver = Driver.objects.get(id=3)
        driver.currentLatitude = 50.50
        driver.save()
        expected_latitude = driver.currentLatitude
        self.assertEquals(expected_latitude, 50.50)
    
    def testUpdateDriverLongitude(self):
        driver = Driver.objects.get(id=3)
        driver.currentLongitude = 1
        driver.save()
        expected_longitude = driver.currentLongitude
        self.assertEquals(expected_longitude, 1)
    
    def testUpdateDriverStatus(self):
        driver = Driver.objects.get(id=2)
        driver.status = 0
        driver.save()
        expected_status = driver.status
        self.assertEquals(expected_status, 0)

    

