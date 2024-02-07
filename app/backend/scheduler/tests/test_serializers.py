from django.test import TestCase
from django.utils import timezone
from scheduler.serializers import AppointmentSerializer
from scheduler.models import Appointment 
from users.models import CustomUser

class AppointmentSerializerTests(TestCase):
    def setUp(self):
        # Create sample users
        self.user1 = CustomUser.objects.create(username='user1', first_name='John')
        self.user2 = CustomUser.objects.create(username='user2', first_name='Jane')

        # Create a sample appointment with users
        self.appointment = Appointment.objects.create(
            date=timezone.now().date(),
            time='10:00',
            video='Test Video'
        )
        self.appointment.users.add(self.user1, self.user2)

    def test_valid_data_serialization(self):
        # Test valid data serialization
        serializer = AppointmentSerializer(instance=self.appointment)
        self.assertTrue(serializer.is_valid())
        serialized_data = serializer.data
        self.assertEqual(serialized_data['date'], self.appointment.date.strftime('%Y-%m-%d'))
        self.assertEqual(serialized_data['time'], '10:00')
        self.assertEqual(serialized_data['video'], 'Test Video')
        self.assertEqual(serialized_data['users'], ['John', 'Jane'])

    def test_custom_field_get_users(self):
        # Test the custom field get_users
        serializer = AppointmentSerializer(instance=self.appointment)
        serialized_data = serializer.data
        self.assertEqual(serialized_data['users'], ['John', 'Jane'])

    def test_invalid_data_serialization(self):
        # Test invalid data serialization
        invalid_data = {
            'date': timezone.now().date(),
            'time': '',  # Empty time field
            'video': 'Test Video'
        }
        serializer = AppointmentSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('time', serializer.errors)  # Check for time validation error

    def test_deserialization(self):
        # Test deserialization
        appointment_data = {
            'date': timezone.now().date(),
            'time': '10:00',
            'video': 'Test Video'
        }
        appointment_instance = Appointment.objects.create(**appointment_data)
        serializer = AppointmentSerializer(instance=appointment_instance)
        self.assertEqual(serializer.data['date'], appointment_data['date'].strftime('%Y-%m-%d'))
        self.assertEqual(serializer.data['time'], '10:00 AM')
        self.assertEqual(serializer.data['video'], 'Zoom Meeting')
