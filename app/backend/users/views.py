from .models import CustomUser
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import status
from .serializers import *
from rest_framework_simplejwt.tokens import Token

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    if request.method == 'POST':
        serializer = CustomUserSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_201_CREATED)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def users(request):
    if request.method == 'GET':
        user = CustomUser.objects.all()

        serializer = CustomUserSerializer(user, context={'request': request}, many=True)

        return Response(serializer.data)

@api_view(['GET'])
def user(request):
    if request.method == 'GET':
        token = request.auth  # This retrieves the JWT token from the request.
        
        if token is not None and isinstance(token, Token):
            # Access the user ID from the decoded payload.
            user_id = token.payload.get('user_id')
            user = CustomUser.objects.filter(id=user_id)
            serializer = CustomUserSerializer(user, context={'request': request}, many=True)
            return Response(serializer.data)
        else:
            # Handle the case where the token is invalid or not provided.
            return Response({"detail": "Invalid or missing token"}, status=status.HTTP_401_UNAUTHORIZED)
    
@api_view(['GET'])
def day_availability(request, year, month, day):
    try:
        availability = Availability.objects.filter(year=year, month=month, day=day)
    except Availability.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':

        serializer = AvailabilitySerializer(availability, context={'request': request}, many=True)
        filtered_data = [{'times': item['times']} for item in serializer.data]
        return Response(filtered_data)
    
@api_view(['POST'])
def availability(request):
    if request.method == 'POST':
        serializer = AvailabilitySerializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    
    
@api_view(['PUT'])
def update_availability(request, year, month, day):
    token = request.auth
    try:
        if token is not None and isinstance(token, Token):
            user_id = token.payload.get('user_id')
            availability = Availability.objects.get(user_id=user_id, year=year, month=month, day=day)
        else:
            return Response({"detail": "Invalid or missing token"}, status=status.HTTP_401_UNAUTHORIZED)
    except Availability.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'PUT':
        serializer = AvailabilitySerializer(availability, data=request.data, context={'request': request}, partial=True)

        if serializer.is_valid():
            availability.times = serializer.validated_data['times']
            availability.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
        
