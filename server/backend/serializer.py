from rest_framework import serializers
from .models import User, Payment, Driver

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'id',
            'username',
            'password',
        )
        model = User

class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'id',
            'username',
            'password',
        )
        model = User

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'id',
            'userId',
            'ccName',
            'ccType',
            'ccNumber',
            'ccExpirationMonth',
            'ccExpirationYear',
            'ccCVV',
            'ccIsDefault',
        )
        model = Payment

class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'id',
            'userId',
            'status',
            'currentLatitude',
            'currentLongitude',
        )
        model = Driver