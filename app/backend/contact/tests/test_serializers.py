from django.test import TestCase
from django.utils import timezone
from contact.serializers import ContactSerializer
from contact.models import Contact

class ContactSerializerTests(TestCase):
    def test_valid_data_serialization(self):
        # Test valid data serialization
        valid_data = {
            'date': timezone.now(),
            'name': 'John Doe',
            'email': 'john@example.com',
            'message': 'Hello, this is a test message.'
        }
        serializer = ContactSerializer(data=valid_data)
        self.assertTrue(serializer.is_valid())
        serialized_data = serializer.data
        self.assertEqual(serialized_data['name'], valid_data['name'])
        self.assertEqual(serialized_data['email'], valid_data['email'])
        self.assertEqual(serialized_data['message'], valid_data['message'])

    def test_invalid_data_serialization(self):
        # Test invalid data serialization
        invalid_data = {
            'date': timezone.now(),
            'email': 'invalid_email',  # Invalid email format
            'message': ''  # Empty message
        }
        serializer = ContactSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)  # Check for email validation error
        self.assertIn('message', serializer.errors)  # Check for message validation error

    def test_deserialization(self):
        # Test deserialization
        valid_data = {
            'date': timezone.now(),
            'name': 'Jane Doe',
            'email': 'jane@example.com',
            'message': 'Another test message.'
        }
        contact_instance = Contact.objects.create(**valid_data)
        serializer = ContactSerializer(instance=contact_instance)
        self.assertEqual(serializer.data['name'], valid_data['name'])
        self.assertEqual(serializer.data['email'], valid_data['email'])
        self.assertEqual(serializer.data['message'], valid_data['message'])
