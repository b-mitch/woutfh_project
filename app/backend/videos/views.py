from django.shortcuts import render
from django.http import HttpResponse

def videos(request):
    return HttpResponse("Videos")
