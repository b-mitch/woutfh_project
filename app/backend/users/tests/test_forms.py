from django.test import TestCase
from .forms import UserForm
from .models import CustomUser

class UserFormTest(TestCase):

    def test_valid_form(self):
        # Create a dictionary of valid form data
        form_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password1': 'testpassword123',
            'password2': 'testpassword123',
        }
        form = UserForm(data=form_data)
        self.assertTrue(form.is_valid())

    def test_blank_data(self):
        # Test if form is invalid when submitted with blank data
        form = UserForm(data={})
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors, {
            'username': ['This field is required.'],
            'email': ['This field is required.'],
            'password1': ['This field is required.'],
            'password2': ['This field is required.'],
        })

    def test_password_mismatch(self):
        # Test if form is invalid when password1 and password2 don't match
        form_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password1': 'testpassword123',
            'password2': 'differentpassword',
        }
        form = UserForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors, {
            'password2': ["The two password fields didn't match."],
        })

    def test_unique_username(self):
        # Test if form is invalid when username already exists
        existing_user = CustomUser.objects.create_user(username='existinguser', email='existing@example.com', password='existingpassword')
        form_data = {
            'username': 'existinguser',  # Username already exists
            'email': 'test@example.com',
            'password1': 'testpassword123',
            'password2': 'testpassword123',
        }
        form = UserForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors, {
            'username': ['A user with that username already exists.'],
        })

    def test_email_unique(self):
        # Test if form is invalid when email already exists
        existing_user = CustomUser.objects.create_user(username='existinguser', email='existing@example.com', password='existingpassword')
        form_data = {
            'username': 'testuser',
            'email': 'existing@example.com',  # Email already exists
            'password1': 'testpassword123',
            'password2': 'testpassword123',
        }
        form = UserForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors, {
            'email': ['This email address is already in use. Please supply a different email address.'],
        })

