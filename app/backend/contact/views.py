from .models import Contact
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import status
from .serializers import *
from django.core.mail import send_mail

@api_view(['POST'])
@permission_classes([AllowAny])
def contact_us(request):
    if request.method == 'POST':
        serializer = ContactSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            name = serializer.validated_data['name']
            email = serializer.validated_data['email']
            message = serializer.validated_data['message']

            subject = 'New Contact Form Submission'
            message_body = f'Name: {name}\nEmail: {email}\nMessage: {message}'
            from_email = None
            recipient_list = ['bmitchum.dev@gmail.com']

            send_mail(subject, message_body, from_email, recipient_list, fail_silently=False)
            return Response(serializer.data, status = status.HTTP_201_CREATED)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)