# tests/test_serializers.py

from django.test import TestCase
from users.serializers import CustomUserSerializer, AvailabilitySerializer
from users.models import CustomUser, Availability
from rest_framework.authtoken.models import Token
from rest_framework.test import APIRequestFactory, force_authenticate
from django.contrib.auth.models import AnonymousUser

class CustomUserSerializerTests(TestCase):
    def test_create_user(self):
        data = {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john@example.com',
            'username': 'johndoe',
            'password': 'testpassword'
        }
        serializer = CustomUserSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()

        self.assertEqual(user.first_name, 'John')
        self.assertEqual(user.last_name, 'Doe')
        self.assertEqual(user.email, 'john@example.com')
        self.assertEqual(user.username, 'johndoe')
        self.assertTrue(user.check_password('testpassword'))

class AvailabilitySerializerTests(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = CustomUser.objects.create(username='testuser', email='test@example.com')
        self.token = Token.objects.create(user=self.user)
        self.availability_data = {
            'year': 2023,
            'month': 1,
            'day': 1,
            'times': ['9:00 AM', '10:00 AM', '11:00 AM']
        }

    def test_create_availability_authenticated_user(self):
        request = self.factory.post('/api/availability/', self.availability_data)
        force_authenticate(request, user=self.user, token=self.token)
        serializer = AvailabilitySerializer(data=self.availability_data, context={'request': request})
        self.assertTrue(serializer.is_valid())
        availability = serializer.save()

        self.assertEqual(availability.user_id, self.user)
        self.assertEqual(availability.year, 2023)
        self.assertEqual(availability.month, 1)
        self.assertEqual(availability.day, 1)
        self.assertEqual(availability.times, ['9:00 AM', '10:00 AM', '11:00 AM'])

    def test_create_availability_unauthenticated_user(self):
        request = self.factory.post('/api/availability/', self.availability_data)
        force_authenticate(request, user=AnonymousUser())
        serializer = AvailabilitySerializer(data=self.availability_data, context={'request': request})
        self.assertFalse(serializer.is_valid())
        self.assertIn('user_id', serializer.errors)
