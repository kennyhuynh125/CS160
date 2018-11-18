from datetime import datetime
from django.core import serializers
from django.shortcuts import render
from django.forms.models import model_to_dict
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import get_object_or_404
from django.db.models import Q

from rest_framework import generics
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from .models import User, Payment, Driver, RideRequests
from .serializer import UserSerializer, UserCreateSerializer, PaymentSerializer, DriverSerializer, RideRequestsSerializer
from django.conf import settings

import googlemaps
import json

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
        user_id = request.data['userId']
        try:
            driver = Driver.objects.get(userId=user_id)
            return Response(False)
        except Driver.DoesNotExist:          
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
        try:
            driver = Driver.objects.get(userId=user_id)          
            driver.currentLatitude = latitude
            driver.currentLongitude = longitude
            driver.save()
            return Response(True)
        except Exception as e:
            print(e);
            return Response(False)

# status = 0 unavailable
# status = 1 idle
# status = 2 driving
# status = 3 driving + rerouted 
# status = 4 receiving payment? -> allows api to reset status to 1
class UpdateDriverStatus(generics.ListCreateAPIView):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
    def post(self, request):
        try:
            user_id = request.data['userId']
            status = request.data['status']
            driver = Driver.objects.get(userId=user_id)
            if (status==0 | status==1) & (driver.status==2 | driver.status==3):
                return Response(False)
            else: 
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
        driver = Driver.objects.get(fixedDriverId=driver_id)
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
        driver = Driver.objects.get(fixedDriverId=driver_id)
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
        shortestTime = 1800
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

class GetDriverLocation(generics.ListCreateAPIView):
    queryset = Driver.objects.all()
    def post(self, request):
        try:
            driver = Driver.objects.get(userId=request.data['driverId'])
            json_data=[]
            json_obj={}
            json_obj['driverLatitude'] = driver.currentLatitude
            json_obj['driverLongitude'] = driver.currentLongitude
            json_data.append(json_obj)
            return Response(json_data)
        except ObjectDoesNotExist:
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
        # Status 0 = not available 1=idle 2=driving 3=already rerouted
        # valid cases: idle -> driving, driving-> already rerouted
        if accepted:
            driverUpdate = Driver.objects.get(userID=request.data['driverUserId'])
            driverUpdate.status = driverUpdate.status + 1
        try:
            currentRequest.save()
            if accepted:
                driverUpdate.save()
            return Response(accepted)
        except Exception as e:
            print(e)
            return Response(False)
            

class GetDurationAndDistance(generics.ListCreateAPIView):
    queryset = Driver.objects.all()
    def post(self, request):
        json_data = []
        json_obj = {}
        duration = getDuration(request.data['startLat'], request.data['startLong'], request.data['destLat'], request.data['destLong'])
        distance = getDistance(request.data['startLat'], request.data['startLong'], request.data['destLat'], request.data['destLong'])
        json_obj['duration'] = int(round(duration / 60)) # since it comes in seconds
        json_obj['distance'] = round(distance / 1610, 1)
        json_data.append(json_obj)
        return Response(json_data)

# Query proceedure:
# Input: Customer Location, Destination, customerID
# Search driver table for closest driver
# Driver valid statuses: 1 = idle 2=driving but can be rerouted once 3=do not reroute
# Notify driver? I believe their client auto scans so the request should be picked up if it is theirs.
# Respond to customer

class AddRequest(generics.ListCreateAPIView):
    queryset = RideRequests.objects.all()
    def post(self, request):
    #fixedDrivers is not functional
        validDrivers = RideRequests.objects.filter(Q(destinationLatitude=request.data['destinationLatitude'])&Q(destinationLongitude=request.data['destinationLongitude'])&Q(driver__status=1))
        print(validDrivers)
        closestDriver = None
        shortestTime = 1800
        # Check first reroutes, both destinations have to be the same
        for driver in validDrivers:
            maxDistance = 1610
            distance = getDistance(request.data['customerLatitude'], request.data['customerLongitude'], driver.currentLatitude, driver.currentLongitude )
            time = getDistance(request.data['customerLatitude'], request.data['customerLongitude'], driver.currentLatitude, driver.currentLongitude )
            if (distance < maxDistance):
                shortestTime = time
                closestDriver = driver
        if closestDriver == None:
            validDrivers = Driver.objects.filter(Q(status=1))
            for driver in validDrivers:
                time = getDistance(request.data['customerLatitude'], request.data['customerLongitude'], driver.currentLatitude, driver.currentLongitude )
                if (time < shortestTime):
                    shortestTime = time
                    closestDriver = driver
        if closestDriver != None:
            request.data['driverId'] = closestDriver.id
            request.data['driverLatitude'] = closestDriver.currentLatitude
            request.data['driverLongitude'] = closestDriver.currentLongitude
            getPathPoints(request.data['customerLatitude'], request.data['customerLongitude'], closestDriver.currentLatitude, closestDriver.currentLongitude)
        data_serializer = RideRequestsSerializer(data=request.data)
        if data_serializer.is_valid():
            instance = data_serializer.save()
            json_data = []
            json_obj = {}
            json_obj['id'] = instance.id
            json_obj['duration'] = time
            json_data.append(json_obj)
            return Response(json_data)
        else:
            return Response(False)       
        
class PathTest(generics.ListCreateAPIView):        
    queryset = RideRequests.objects.all()
    def post(self, request):
        
        #Query: Gets all drivers who are not rerouted, and also are headed to the same destination
        validDrivers = Driver.objects.filter(Q(status=1))
        fullset = set()
        for aDriver in validDrivers:
            print(aDriver.userId)
            #This is problematic: Need to update finished requests for this function to work properly
            #Error case: Current driver is driving to SFO, has a ride history of driving to OAK, new request from user to OAK
            #Fix?: Update accepted column to 2 when ride is complete?
            fullset = fullset.union(RideRequests.objects.filter(Q(destinationLatitude=request.data['destinationLatitude'])&Q(destinationLongitude=request.data['destinationLongitude'])&Q(driverId=aDriver.userId)&Q(accepted=1)))
        #Hacky fix implementation: Tell frontend to ping drivers for a route. Exposes unecessary driver data.
        json_data = []
        json_obj = set()
        print(fullset)
        #Adds all reroutable drivers to this list
        for aRequest in fullset:
            json_obj.add(aRequest.driverId)
        json_data.append(json_obj)
        print(json_data)
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
    
def getPathPoints(latitude, longitude, destLatitude, destLongitude):
    firstLocation = str(latitude) + ", " + str(longitude)
    destLocation = str(destLatitude) + ", " + str(destLongitude)
    now = datetime.now()
    
    directions_result = gmaps.directions(firstLocation,
                         destLocation,
                         mode="driving",
                         departure_time=now)
    print(directions_result[0].keys())
    print(directions_result[0]['warnings'])
