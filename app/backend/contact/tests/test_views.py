from rest_framework.test import APITestCase
from rest_framework import status
from django.core.mail import send_mail
from unittest.mock import patch
from django.urls import reverse


class ContactUsViewTest(APITestCase):
    def test_contact_us_view(self):
        url = reverse('contact_us')
        data = {
            'name': 'John Doe',
            'email': 'johndoe@example.com',
            'message': 'Test message'
        }

        with patch('django.core.mail.send_mail') as mocked_send_mail:
            response = self.client.post(url, data, format='json')

            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            self.assertTrue(mocked_send_mail.called)
            self.assertEqual(mocked_send_mail.call_count, 1)
            self.assertEqual(mocked_send_mail.call_args[0][0], 'New Contact Form Submission')
            self.assertIn('Name: John Doe', mocked_send_mail.call_args[0][1])
            self.assertIn('Email: johndoe@example.com', mocked_send_mail.call_args[0][1])
            self.assertIn('Message: Test message', mocked_send_mail.call_args[0][1])

    def test_contact_us_view_invalid_data(self):
        url = reverse('contact_us')
        data = {}  # invalid data

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
