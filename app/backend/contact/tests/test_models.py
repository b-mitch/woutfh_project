from django.test import TestCase
from contact.models import Contact
from django.utils import timezone

class ContactModelTests(TestCase):
    def setUp(self):
        # Create a sample contact
        self.contact = Contact.objects.create(
            date=timezone.now(),
            name='Test User',
            email='test@gmail.com',
            message='Test message'
        )
    # Test the contact creation
    def test_contact_creation(self):
        self.assertEqual(self.contact.date, timezone.now())
        self.assertEqual(self.contact.name, 'Test User')
        self.assertEqual(self.contact.email, 'test@gmail.com')
        self.assertEqual(self.contact.message, 'Test message')
    # Test the contact string representation
    def test_contact_str(self):
        self.assertEqual(str(self.contact), "Contact #{}".format(self.contact.id))

    