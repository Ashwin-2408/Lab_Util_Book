from django.shortcuts import render
# from django.http import JsonResponse
from rest_framework.decorators import api_view
from lab_app.models import Schedules, User, Laboratory
from rest_framework import generics
from lab_app.serializers import ScheduleSerializer, LaboratorySerializer, UserSerializer
# Create your views here.
# @api_view(["GET"])
# def api_home(request, *args, **kwargs):
#     data = Schedules.objects.all().order_by("?").first(

class ScheduleListCreateAPIView(generics.ListCreateAPIView):
    queryset = Schedules.objects.all()
    serializer_class = ScheduleSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
        
    def perform_create(self, serializer):
        return super().perform_create(serializer)

schedule_list_create_view = ScheduleListCreateAPIView.as_view()

# class ScheduleDetailAPIView(generics.RetrieveAPIView):
#     queryset = Schedules.objects.all()
#     serializer_class = ScheduleSerializer
#     lookup_field = 'username'

# schedule_detail_view = ScheduleDetailAPIView.as_view()

# class ScheduleUpdateAPIView(generics.UpdateAPIView):
#     queryset = Schedules.objects.all()
#     serializer_class = ScheduleSerializer


class LaboratoryListCreateAPIView(generics.ListCreateAPIView):
    queryset = Laboratory.objects.all()
    serializer_class = LaboratorySerializer

    def perform_create(self, serializer):
        return super().perform_create(serializer)

laboratory_list_create_view = LaboratoryListCreateAPIView.as_view()

# class LaboratoryDetailAPIView(generics.RetrieveAPIView):
#     queryset = Laboratory.objects.all()
#     serializer_class = LaboratorySerializer
#     lookup_field = 'lab_name'

# laboratory_detail_view = LaboratoryDetailAPIView.as_view()

class UserListCreateAPIView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        return super().perform_create(serializer)

user_list_create_view = UserListCreateAPIView.as_view()