from rest_framework import serializers
from .models import Availability, CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('first_name', 'last_name', 'email', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)  # as long as the fields are the same, we can just use this
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

class AvailabilitySerializer(serializers.ModelSerializer):
    # pull user id from logged in user
    user_id = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Availability
        fields = ('user_id', 'year', 'month', 'day', 'times')
