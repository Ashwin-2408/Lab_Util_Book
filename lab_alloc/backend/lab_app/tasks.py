from celery import shared_task
from django.utils.timezone import now
from django.core.mail import send_mail
from .models import Schedules, Laboratory, User
import requests

@shared_task
def complete_lab_session(session_id):
    try:
        session = Schedules.objects.get(id=session_id)
        lab_name = Laboratory.objects.get(lab_id = session.lab_id.lab_id).lab_name
        # user_email = User.objects.get(username = username).email
        user_email = "venkatesa212004@gmail.com"
        if session.status == 'In Progress':
            session.status = 'Completed'
            session.save()

            notification_response = requests.post(
                    "http://127.0.0.1:3001/notifications",
                    json={
                        "type": "success" if session.status == "Completed" else "error",
                        "title": f"Booking {session.status}",
                        "message": f"Your session got completed modified",
                        "timestamp": session.schedule_date.strftime("%Y-%m-%d %H:%M:%S"),
                        "category": lab_name
                    }
                )
            print("Response", notification_response.status_code)
    except Exception as e:
        print("Error",e)

@shared_task
def time_exceed_lab_session(session_id):
    session = Schedules.objects.get(id=session_id)
    lab_name = Laboratory.objects.get(lab_id = session.lab_id.lab_id).lab_name
    # user_email = User.objects.get(username = username).email
    user_email = "venkatesa212004@gmail.com"
    if not session.status:
        session.status = "Preempted"
        session.save()

@shared_task
def test_celery():
    print("Testing...")
    return "Completed Testing"