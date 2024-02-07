from django.test import TestCase
from scheduler.models import Appointment
from django.utils import timezone
from users.models import CustomUser

class AppointmentModelTests(TestCase):
    def setUp(self):
        # Create a sample appointment
        self.appointment = Appointment.objects.create(
            date=timezone.now().date(),
            time='12:00',
            video='Test Video'
        )
        # Create sample users
        self.user1 = CustomUser.objects.create(username='user1')
        self.user2 = CustomUser.objects.create(username='user2')

    # Test the appointment creation
    def test_appointment_creation(self):
        self.assertEqual(self.appointment.date, timezone.now().date())
        self.assertEqual(self.appointment.time, '12:00')
        self.assertEqual(self.appointment.video, 'Test Video')

    def test_appointment_users(self):
        # Test that appointment can associate with users
        self.appointment.users.add(self.user1, self.user2)
        self.assertIn(self.user1, self.appointment.users.all())
        self.assertIn(self.user2, self.appointment.users.all())

    # Test the appointment string representation
    def test_appointment_str(self):
        self.assertEqual(str(self.appointment), "Appointment #{}".format(self.appointment.id))
    