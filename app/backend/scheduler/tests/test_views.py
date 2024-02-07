from rest_framework.test import APITestCase
from rest_framework import status
from .models import Appointment
from users.models import CustomUser
from .serializers import AppointmentSerializer
from rest_framework_simplejwt.tokens import AccessToken
from django.utils import timezone

class AppointmentsViewTest(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create(username='testuser')
        self.access_token = AccessToken.for_user(self.user)

    def test_get_appointments_authenticated(self):
        url = '/appointments/'
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {str(self.access_token)}')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_appointments_unauthenticated(self):
        url = '/appointments/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_appointment_authenticated(self):
        url = '/appointments/'
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {str(self.access_token)}')
        data = {'video': 'Test Video'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_appointment_unauthenticated(self):
        url = '/appointments/'
        data = {'video': 'Test Video'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class AppointmentViewTest(APITestCase):
    def setUp(self):
        # Create users
        self.user1 = CustomUser.objects.create(username='user1')
        self.user2 = CustomUser.objects.create(username='user2')
        # Create appointment
        self.appointment = Appointment.objects.create(
            date=timezone.now().date(),
            time='10:00',
            video='Test Video'
        )
        # Associate users with the appointment
        self.appointment.users.add(self.user1, self.user2)
        # Create access tokens for users
        self.access_token = AccessToken.for_user(self.user1)

    def test_update_appointment_authenticated(self):
        url = f'/appointment/{self.appointment.id}/'
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {str(self.access_token)}')
        data = {'video': 'Updated Video'}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_update_appointment_unauthenticated(self):
        url = f'/appointment/{self.appointment.id}/'
        data = {'video': 'Updated Video'}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_appointment_authenticated(self):
        url = f'/appointment/{self.appointment.id}/'
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {str(self.access_token)}')
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_appointment_unauthenticated(self):
        url = f'/appointment/{self.appointment.id}/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
