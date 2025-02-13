from django.db import models
from django.core.exceptions import ValidationError
# Create your models here.
class User(models.Model):
    username = models.CharField(max_length = 20, primary_key=True)
    email = models.EmailField()
    password = models.CharField(max_length = 128)

class Laboratory(models.Model):
    lab_id = models.AutoField(primary_key=True)
    lab_name = models.CharField(max_length=30, unique=True)
    lab_capacity = models.IntegerField(default=5)
    icon_name = models.CharField(max_length=20, null=True)
    fallback_icon_url = models.URLField(null=True, blank=True)

class Schedules(models.Model):
    id = models.AutoField(primary_key=True)
    username = models.ForeignKey(User, on_delete=models.CASCADE)
    lab_id = models.ForeignKey(Laboratory, on_delete=models.CASCADE)
    schedule_date = models.DateField()
    schedule_from = models.TimeField()
    schedule_to = models.TimeField()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['username', 'lab_id', 'schedule_date','schedule_from','schedule_to'], name='unique_schedule_per_user_lab')
        ]

class Daily(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateField()
    lab_id = models.ForeignKey(Laboratory, on_delete=models.CASCADE)
    hours = models.FloatField()
    num_bookings = models.IntegerField()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['date', 'lab_id'], name='daily_unique')
        ]