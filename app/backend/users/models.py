from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    
    def __str__(self):
        return self.username

class Availability(models.Model):
    user_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    year = models.IntegerField(default=2023)
    month = models.IntegerField(default=1)
    day = models.IntegerField(default=1)
    times = models.JSONField()

    def __str__(self):
        return self.user.username
