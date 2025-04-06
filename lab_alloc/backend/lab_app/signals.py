from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.timezone import make_aware
from datetime import datetime, date, timedelta, timezone, time
import pytz
from .models import Schedules
from .tasks import time_exceed_lab_session, complete_lab_session
from utils.google_calendar import add_event_to_calendar
from .models import Laboratory

@receiver(post_save, sender=Schedules)
def schedule_lab_sessions(sender, instance, created, **kwargs):
    print(f"Signal received for session ID: {instance.id}")

    if created:
        print(f"New session created: {instance.id}, Scheduling tasks...")
        today = date.today()

        if not instance.schedule_from or not instance.schedule_to:
            print(f"Missing schedule times for session {instance.id}")
            return
        
        ist = pytz.timezone("Asia/Kolkata")
        session_start_ist = datetime.strptime(f"{instance.schedule_date} {instance.schedule_from}", "%Y-%m-%d %H:%M:%S") + timedelta(minutes=10)
        session_start_aware = ist.localize(session_start_ist)
        session_start_utc = session_start_aware.astimezone(timezone.utc)
        time_exceed_lab_session.apply_async((instance.id,), eta=session_start_utc)

        session_end_ist = datetime.strptime(f"{instance.schedule_date} {instance.schedule_to}", "%Y-%m-%d %H:%M:%S")
        session_end_aware = ist.localize(session_end_ist)
        session_end_utc = session_end_aware.astimezone(timezone.utc)
        complete_lab_session.apply_async((instance.id,), eta=session_end_utc)

        lab_name = Laboratory.objects.get(lab_id=instance.lab_id.lab_id).lab_name
        try:
            add_event_to_calendar(
                summary=f"{lab_name}",
                description=f"Lab booked for session {lab_name}",
                event_date = instance.schedule_date,
                start_time = instance.schedule_from,
                end_time = instance.schedule_to,
            )
            print("Created an Event")
        except Exception as e:
            print("Not created", e)