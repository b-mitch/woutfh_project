from rest_framework.test import APITestCase
from rest_framework import status
from .models import CustomUser, Availability

class RegisterViewTest(APITestCase):
    def test_register_user(self):
        url = '/register/'
        data = {'username': 'testuser', 'password': 'testpassword'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_register_invalid_data(self):
        url = '/register/'
        data = {'username': '', 'password': 'testpassword'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class UsersViewTest(APITestCase):
    def test_get_users_authenticated(self):
        url = '/users/'
        user = CustomUser.objects.create(username='testuser')
        self.client.force_authenticate(user=user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_users_unauthenticated(self):
        url = '/users/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class UserViewTest(APITestCase):
    def test_get_user_authenticated(self):
        url = '/user/'
        user = CustomUser.objects.create(username='testuser')
        token = user.auth_token
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_user_unauthenticated(self):
        url = '/user/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class DayAvailabilityViewTest(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create(username='testuser')
        self.availability = Availability.objects.create(
            user=self.user, 
            year=2024, 
            month=2, 
            day=7, 
            times={'10:00': '11:00', '12:00': '13:00'}
        )

    def test_get_day_availability(self):
        url = '/availability/2024/2/7/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class AvailabilityViewTest(APITestCase):
    def test_create_availability(self):
        url = '/availability/'
        data = {'times': {'10:00': '11:00', '12:00': '13:00'}}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class UpdateAvailabilityViewTest(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create(username='testuser')
        self.availability = Availability.objects.create(
            user=self.user, 
            year=2024, 
            month=2, 
            day=7, 
            times={'10:00': '11:00', '12:00': '13:00'}
        )

    def test_update_availability_authenticated(self):
        url = '/update_availability/2024/2/7/'
        user = CustomUser.objects.create(username='testuser')
        token = user.auth_token
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        data = {'times': {'10:00': '13:00'}}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_update_availability_unauthenticated(self):
        url = '/update_availability/2024/2/7/'
        data = {'times': {'10:00': '13:00'}}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
