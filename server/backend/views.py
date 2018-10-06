from django.shortcuts import render
from django.core import serializers
from django.forms.models import model_to_dict

from rest_framework import generics
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from .models import User, Payment
from .serializer import UserSerializer, UserCreateSerializer, PaymentSerializer

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
        print(request.data);
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

class AddNewCard(generics.CreateAPIView):
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