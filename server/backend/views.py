from datetime import datetime
from django.core import serializers
from django.shortcuts import render
from django.forms.models import model_to_dict
from django.core.exceptions import ObjectDoesNotExist

from rest_framework import generics
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from .models import User, Payment, Driver, RideRequests
from .serializer import UserSerializer, UserCreateSerializer, PaymentSerializer, DriverSerializer, RideRequestsSerializer
from django.conf import settings

import googlemaps
import os



GOOGLE_API_KEY = os.environ.get('GOOGLE_MAPS_API_KEY')
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
        driver = Driver.objects.get(id=int(request.data['userId']));
        if driver:
            return Response(False)
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
        driver = Driver.objects.get(userId=user_id)
        driver.currentLatitude = latitude
        driver.currentLongitude = longitude
        try:
            driver.save()
            return Response(True)
        except Exception as e:
            print(e);
            return Response(False)


class UpdateDriverStatus(generics.ListCreateAPIView):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
    def post(self, request):
        try:
            user_id = request.data['userId']
            status = request.data['status']
            driver = Driver.objects.get(userId=user_id)
            driver.status = status
            driver.save()
            return Response(driver.status)
        except Exception as e:
            print(e)
            return Response(False)

class UpdateFixedDriverStatus(generics.ListCreateAPIView):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
    def post(self, request):
        driver_id = request.data['fixedDriverId']
        status = request.data['status']
        driver = Driver.objects.get(id=driver_id)
        driver.status = status
        try:
            driver.save()
            return Response(True)
        except:
            return Response(False)


class UpdateFixedDriverLocation(generics.ListCreateAPIView):
    queryset = Driver.objects.all();
    serializer_class = DriverSerializer
    def post(self, request):
        driver_id = request.data['fixedDriverId']
        latitude = request.data['latitude']
        longitude = request.data['longitude']
        driver = Driver.objects.get(id=driver_id)
        driver.currentLatitude = latitude
        driver.currentLongitude = longitude
        try:
            driver.save()
            return Response(True)
        except:
            return Response(False)


class GetDriver(generics.ListCreateAPIView):
    queryset = Driver.objects.all()
    def post(self, request):
        #Gets all drivers with "1" status in db
        availableDrivers = Driver.objects.filter(status=1)
         #Sets shortestTime to some really big amount to begin with
        shortestTime = 9223372036854775807
        closestDriver = None
        for driver in availableDrivers:
            time = getDuration(request.data['latitude'], request.data['longitude'], driver.currentLatitude, driver.currentLongitude)
            if (time < shortestTime):
                shortestTime = time
                closestDriver = driver
        json_data=[]
        json_obj={}
        json_obj['driverLatitude'] = closestDriver.currentLatitude
        json_obj['driverLongitude'] = closestDriver.currentLongitude
        json_obj['duration'] = int(round(shortestTime / 60))
        json_obj['driverUserId'] = closestDriver.userId
        json_obj['driverId'] = closestDriver.id
        json_data.append(json_obj)
        return Response(json_data)


class AddRequest(generics.ListCreateAPIView):
    queryset = RideRequests.objects.all()
    def post(self, request):
        data_serializer = RideRequestsSerializer(data=request.data)
        if data_serializer.is_valid():
            instance = data_serializer.save()
            return Response(instance.id)
        else:
            return Response(False)


class GetRequestByDriverUserId(generics.ListCreateAPIView):
    queryset = RideRequests.objects.all()
    def post(self, request):
        try:
            currentRequest = RideRequests.objects.get(userId=request.data['driverUserId'], accepted=0)
            json_data = []
            json_obj = {}
            if request:
                json_obj['requestId'] = currentRequest.id
                json_obj['driverId'] = currentRequest.driverId
                json_obj['userId'] = currentRequest.userId
                json_obj['customerLatitude'] = currentRequest.customerLatitude
                json_obj['customerLongitude'] = currentRequest.customerLongitude
                json_obj['destinationLatitude'] = currentRequest.destinationLatitude
                json_obj['destinationLongitude'] = currentRequest.destinationLongitude
                json_obj['accepted'] = 0 if currentRequest.accepted is None else currentRequest.accepted
                json_data.append(json_obj)
            return Response(json_data)
        except ObjectDoesNotExist:
            return Response([])


class GetRequestByRequestId(generics.ListCreateAPIView):
    queryset = RideRequests.objects.all()
    def post(self, request):
        try:
            currentRequest = RideRequests.objects.get(id=request.data['requestId'])
            json_data = []
            json_obj = {}
            if request:
                json_obj['requestId'] = currentRequest.id
                json_obj['driverId'] = currentRequest.driverId
                json_obj['userId'] = currentRequest.userId
                json_obj['customerLatitude'] = currentRequest.customerLatitude
                json_obj['customerLongitude'] = currentRequest.customerLongitude
                json_obj['destinationLatitude'] = currentRequest.destinationLatitude
                json_obj['destinationLongitude'] = currentRequest.destinationLongitude
                json_obj['accepted'] = 0 if currentRequest.accepted is None else currentRequest.accepted
                json_data.append(json_obj)
            return Response(json_data)
        except ObjectDoesNotExist:
            return Response([])


class UpdateRequest(generics.ListCreateAPIView):
    queryset = RideRequests.objects.all()
    def post(self, request):
        accepted = request.data['accepted'];
        currentRequest = RideRequests.objects.get(userId=request.data['driverUserId'], accepted=0)
        currentRequest.accepted = accepted
        try:
            currentRequest.save()
            return Response(accepted)
        except Exception as e:
            print(e)
            return Response(False)
            

class GetDurationAndDistance(generics.ListCreateAPIView):
    queryset = Driver.objects.all()
    def post(self, request):
        starting_latitude = request.data['startLat']
        starting_longitude = request.data['startLong']
        destination_latitude = request.data['destLat']
        destination_longitude = request.data['destLong']
        json_data = []
        json_obj = {}
        duration = getDuration(starting_latitude, starting_longitude, destination_latitude, destination_longitude)
        distance = getDistance(starting_latitude, starting_longitude, destination_latitude, destination_longitude)
        json_obj['duration'] = int(round(duration / 60)) # since it comes in seconds
        json_obj['distance'] = round(distance / 1610, 1)
        json_data.append(json_obj)
        return Response(json_data)


def getDuration(latitude, longitude, destLatitude, destLongitude):
    firstLocation = str(latitude) + ", " + str(longitude)
    destLocation = str(destLatitude) + ", " + str(destLongitude)
    now = datetime.now()
    directions_result = gmaps.directions(firstLocation,
                         destLocation,
                         mode="driving",
                         departure_time=now)
    return directions_result[0]['legs'][0]['duration_in_traffic']['value']

def getDistance(latitude, longitude, destLatitude, destLongitude):
    firstLocation = str(latitude) + ", " + str(longitude)
    destLocation = str(destLatitude) + ", " + str(destLongitude)
    now = datetime.now()
    directions_result = gmaps.directions(firstLocation,
                         destLocation,
                         mode="driving",
                         departure_time=now)
    return directions_result[0]['legs'][0]['distance']['value']
