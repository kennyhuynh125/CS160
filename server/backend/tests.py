from django.test import TestCase

# Create your tests here.
from .models import User

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

