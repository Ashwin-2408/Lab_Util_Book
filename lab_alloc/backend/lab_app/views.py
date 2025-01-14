from django.shortcuts import render
# from django.http import JsonResponse
from rest_framework.decorators import api_view
from lab_app.models import Schedules
from rest_framework import generics
from lab_app.serializers import ScheduleSerializer
# Create your views here.
# @api_view(["GET"])
# def api_home(request, *args, **kwargs):
#     data = Schedules.objects.all().order_by("?").first(

class ScheduleListCreateAPIView(generics.ListCreateAPIView):
    queryset = Schedules.objects.all()
    serializer_class = ScheduleSerializer

    def perform_create(self, serializer):
        return super().perform_create(serializer)

schedule_list_create_view = ScheduleListCreateAPIView.as_view()

class ScheduleDetailAPIView(generics.RetrieveAPIView):
    queryset = Schedules.objects.all()
    serializer_class = ScheduleSerializer
    lookup_field = 'username'

