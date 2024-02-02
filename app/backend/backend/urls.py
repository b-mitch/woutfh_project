from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('scheduler.urls')),
    path('api/users/', include('users.urls')),
    path('api/videos/', include('videos.urls')),
    path('api/contact/', include('contact.urls')),
]
