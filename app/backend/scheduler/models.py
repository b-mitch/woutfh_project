from django.db import models
from users.models import CustomUser

class Appointment(models.Model):
    id = models.AutoField(primary_key=True)
    users = models.ManyToManyField(CustomUser, related_name='users')
    date = models.DateField()
    time = models.CharField(max_length=50)
    video = models.CharField(max_length=100)

    def __str__(self):
        return "Appointment #{}".format(self.id)


