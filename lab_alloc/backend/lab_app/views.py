from django.shortcuts import render
# from django.http import JsonResponse
from rest_framework.decorators import api_view
from lab_app.models import Schedules, User, Laboratory
from rest_framework import generics
from lab_app.serializers import ScheduleSerializer, LaboratorySerializer, UserSerializer
from datetime import datetime
from rest_framework.views import APIView
from rest_framework.response import Response


class ScheduleCreateAPIView(APIView):
    def post(self, request):
        data = request.data.copy()
        data['lab_id'] = Laboratory.objects.get(lab_name = data['lab_name']).lab_id
        data.pop('lab_name')

        serializer = ScheduleSerializer(data=data)
        if(serializer.is_valid()):
            serializer.save()
            return Response({"message":"Successfully created a session"})

schedule_create_view = ScheduleCreateAPIView.as_view()

class ScheduleListAPIView(generics.ListAPIView):
    queryset = Schedules.objects.all()
    serializer_class = ScheduleSerializer

schedule_list_view = ScheduleListAPIView.as_view() 

class ScheduleListDetailAPIView(generics.ListAPIView):
    queryset = Schedules.objects.all()
    serializer_class = ScheduleSerializer

    def get_queryset(self):
        lab_name = self.kwargs.get('lab_name')
        date_str = self.kwargs.get('date')

        try:
            lab_id = Laboratory.objects.get(lab_name=lab_name).lab_id
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except Exception as e:
            print("Error : ",e)
            return Schedules.objects.none()
        
        try:
            queryset = self.queryset.filter(lab_id = lab_id)
            queryset = queryset.filter(schedule_date = date)
            return queryset
        except Exception as e:
            print("Error while fetching from Schedule : ",e)
            return Schedules.objects.none()

schedule_list_detail_view = ScheduleListDetailAPIView.as_view()

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

class LaboratoryUpdateAPIView(generics.UpdateAPIView):
    queryset = Laboratory.objects.all()
    serializer_class = LaboratorySerializer
    lookup_field = 'lab_id'

    def perform_update(self, serializer):
        instance = serializer.save()