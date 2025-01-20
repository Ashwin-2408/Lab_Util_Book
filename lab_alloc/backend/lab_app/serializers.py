from rest_framework import serializers
from .models import Schedules, Laboratory, User
class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedules
        fields = [
            'username',
            'lab_id',
            'schedule_date',
            'schedule_from',
            'schedule_to',
        ]

class LaboratorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Laboratory
        fields = [
            'lab_name',
            'lab_capacity',
            'lab_vacancy',
            'icon_name',
            'fallback_icon_url'
        ]

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'password',
        ]