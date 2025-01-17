from django.shortcuts import render
# from django.http import JsonResponse
from rest_framework.decorators import api_view
from lab_app.models import Schedules, User, Laboratory
from rest_framework import generics
from lab_app.serializers import ScheduleSerializer, LaboratorySerializer, UserSerializer

class ScheduleListCreateAPIView(generics.ListCreateAPIView):
    queryset = Schedules.objects.all()
    serializer_class = ScheduleSerializer

    def get_queryset(self):
        lab_name = self.request.query_params.get(['lab_name'], None)
        month = self.request.query_params.get(['month'],None)
        
        queryset = self.queryset
        if lab_name:
            queryset = queryset.filter(lab_name=lab_name)
        if month:
            queryset = queryset.filter(schedule_from__month = month)
        
        return queryset

    def perform_create(self, serializer):
        serializer.save()

schedule_list_create_view = ScheduleListCreateAPIView.as_view()

class LaboratoryListCreateAPIView(generics.ListCreateAPIView):
    queryset = Laboratory.objects.all()
    serializer_class = LaboratorySerializer

    def perform_create(self, serializer):
        return super().perform_create(serializer)

laboratory_list_create_view = LaboratoryListCreateAPIView.as_view()

class UserListCreateAPIView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        return super().perform_create(serializer)

user_list_create_view = UserListCreateAPIView.as_view()