from django.db import models
# Create your models here.
class User(models.Model):
    username = models.CharField(max_length = 20, primary_key=True)
    email = models.EmailField()
    password = models.CharField(max_length = 128)

class Laboratory(models.Model):
    lab_id = models.AutoField(primary_key=True, default=1)
    lab_name = models.CharField(max_length=30, unique=True)

class Schedules(models.Model):
    id = models.AutoField(primary_key=True, default = 1)
    username = models.ForeignKey(User, on_delete=models.CASCADE)
    lab_id = models.ForeignKey(Laboratory, on_delete=models.CASCADE)
    schedule_date = models.DateField()
    schedule_from = models.TimeField()
    schedule_to = models.TimeField()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['username', 'lab_id', 'schedule_date','schedule_from','schedule_to'], name='unique_schedule_per_user_lab')
        ]