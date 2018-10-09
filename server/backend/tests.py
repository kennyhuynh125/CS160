from django.test import TestCase

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
        User.objects.create(username="driver")
        Driver.objects.create(userId=1)
        Driver.objects.create(userId=1, status=1)

    def testUserIsDriver(self):
        driver = Driver.objects.get(id=1)
        user_driver = User.objects.filter(id=driver.userId)
        expected_length = user_driver.count()
        self.assertEquals(expected_length, 1)
    
    def testDriverStatus(self):
        driver = Driver.objects.get(id=2)
        expected_status = driver.status
        self.assertEquals(expected_status, 1)
    

