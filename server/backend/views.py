from django.shortcuts import render
from django.core import serializers
from django.forms.models import model_to_dict

from rest_framework import generics
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from .models import User, Payment, Driver
from .serializer import UserSerializer, UserCreateSerializer, PaymentSerializer, DriverSerializer
from django.conf import settings

import googlemaps

GOOGLE_API_KEY = getattr(settings, 'API_KEY', None)
gmaps = googlemaps.Client(key=GOOGLE_API_KEY)

# gets all the users in our database and sends it as a Response
class ListUser(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    renderer_classes = (JSONRenderer,)
    # convert to JSON data and send it over via Response
    def get(self, request):
        data = self.get_queryset()
        json_data = []
        for item in data:
            json_obj = {}
            json_obj['id'] = item.id
            json_obj['username'] = item.username
            json_obj['password'] = item.password
            json_data.append(json_obj)
        return Response(json_data)
        
    
#  creates new user and saves it to db
class AddUser(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    def post(self, request):
        data_serializer = UserCreateSerializer(data=request.data)
        # checks if request info is valid <-- unique username
        if data_serializer.is_valid():
            data_serializer.save() # saves user to database
            return Response(True)
        else:
            return Response(False)

class LogUser(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    def post(self, request):
        data = self.get_queryset();
        username = request.data['username']
        password = request.data['password']
        for user in data:
            if user.username.lower() == username.lower() and user.password == password:
                return Response(user.id)
        return Response(None)

class ListCardsByUser(generics.ListCreateAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    renderer_classes = (JSONRenderer,)
    def get(self, request, userId):
        data = Payment.objects.filter(userId=userId)
        json_data = []
        for card in data:
            json_obj = {}
            json_obj['ccName'] = card.ccName
            json_obj['ccType'] = card.ccType
            json_obj['ccNumber'] = card.ccNumber
            json_obj['ccExpirationMonth'] = card.ccExpirationMonth
            json_obj['ccExpirationYear'] = card.ccExpirationYear
            json_obj['ccCVV'] = card.ccCVV
            json_obj['ccIsDefault'] = card.ccIsDefault
            json_data.append(json_obj)
        return Response(json_data)

class AddNewCard(generics.ListCreateAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    def post(self, request):
        data_serializer = PaymentSerializer(data=request.data)
        # check if info is valid
        if data_serializer.is_valid():
            data_serializer.save()
            return Response(True)
        else:
            return Response(False)

class Location(generics.RetrieveAPIView):
    def get_queryset(self):
        return None
    serializer_class = UserSerializer
    def get(self, request, latitude, longitude):
        reverse_geocode_result = gmaps.reverse_geocode((float(latitude), float(longitude)))
        return Response(reverse_geocode_result)

class AddDriver(generics.ListCreateAPIView):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
    def post(self, request):
        data_serializer = DriverSerializer(data=request.data)
        if data_serializer.is_valid():
            data_serializer.save()
            return Response(True)
        else:
            return Response(False)

class UpdateDriverLocation(generics.ListCreateAPIView):
    queryset = Driver.objects.all();
    serializer_class = DriverSerializer
    def post(self, request):
        user_id = request.data['userId']
        latitude = request.data['latitude']
        longitude = request.data['longitude']
        driver = Driver.objects.get(id=user_id)
        driver.currentLatitude = latitude
        driver.currentLongitude = longitude
        try:
            driver.save()
            return Response(True)
        except:
            return Response(False)

class UpdateDriverStatus(generics.ListCreateAPIView):
    queryset = Driver.objects.all();
    serializer_class = DriverSerializer
    def post(self, request):
        user_id = request.data['userId']
        status = request.data['status']
        driver = Driver.objects.get(id=user_id)
        driver.status = status
        try:
            driver.save()
            return Response(True)
        except:
            return Response(False)
    