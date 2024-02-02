from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from . import views

urlpatterns = [
    path('token/obtain/', jwt_views.TokenObtainPairView.as_view(), name='token_create'),  # override sjwt stock token
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.register, name='register'),
    path('account/', views.user, name='user'),
    path('all/', views.users, name='users'),
    path('availability/<int:year>/<int:month>/<int:day>/', views.day_availability, name='availability'),
    path('availability/', views.availability, name='availability'),
    path('updateavailability/<int:year>/<int:month>/<int:day>/', views.update_availability, name='update_availability'),
]

