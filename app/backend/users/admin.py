from django.contrib import admin
from .models import CustomUser, Availability

class CustomUserAdmin(admin.ModelAdmin):
    model = CustomUser

admin.site.register(Availability)
admin.site.register(CustomUser, CustomUserAdmin)