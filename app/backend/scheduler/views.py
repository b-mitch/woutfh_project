from .models import Appointment
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import *
from rest_framework_simplejwt.tokens import Token

@api_view(['GET', 'POST'])
def appointments(request):
    token = request.auth
    if request.method == 'GET':
        if token is not None and isinstance(token, Token):
            user_id = token.payload.get('user_id')
            appointments = Appointment.objects.filter(users__id=user_id)
    
            serializer = AppointmentSerializer(appointments, context={'request': request}, many=True)

            return Response(serializer.data)
        else:
            return Response({"detail": "Invalid or missing token"}, status=status.HTTP_401_UNAUTHORIZED)

    elif request.method == 'POST':
        if token is not None and isinstance(token, Token):
            serializer = AppointmentSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"detail": "Invalid or missing token"}, status=status.HTTP_401_UNAUTHORIZED)
    
@api_view(['PUT', 'DELETE'])
def appointment(request, id):
    token = request.auth
    try:
        if token is not None and isinstance(token, Token):
            user_id = token.payload.get('user_id')
            appointment = Appointment.objects.get(id=id, CustomUser__id=user_id)
        else:
            return Response({"detail": "Invalid or missing token"}, status=status.HTTP_401_UNAUTHORIZED)
    except Appointment.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = AppointmentSerializer(appointment, data=request.data,context={'request': request}, partial=True)
        if serializer.is_valid():
            appointment.video = serializer.validated_data['video']
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        appointment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

