from rest_framework import serializers
from .models import Schedules
class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedules
        fields = [
            'username',
            'lab_id'
            'schedule_date',
            'schedule_from',
            'schedule_to'
        ]