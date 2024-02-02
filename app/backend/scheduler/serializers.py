from rest_framework import serializers
from .models import Appointment

class AppointmentSerializer(serializers.ModelSerializer):
    users = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = ('id', 'users', 'date', 'time', 'video')

    def get_users(self, obj):
        return [user.first_name for user in obj.users.all()]