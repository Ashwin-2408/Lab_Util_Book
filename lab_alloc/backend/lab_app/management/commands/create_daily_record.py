from django.core.management.base import BaseCommand
from datetime import datetime
from lab_app.models import Daily, Schedules

class Command(BaseCommand):
    help = "Create daily lab utilization records"

    def handle(self, *args, **kwargs):
        cur_date = datetime.now().date()
        sessions = Schedules.objects.filter(schedule_date=cur_date).order_by('schedule_from')
        lab_mapping = dict()
        for index, session in enumerate(sessions):
            if session.lab_id not in lab_mapping:
                lab_mapping[session.lab_id] = [session]
            else:
                lab_mapping[session.lab_id].append(session)

        for key in lab_mapping:
            start = lab_mapping[key][0]
            count = 0
            end = lab_mapping[key][0]
            for session in lab_mapping[key]:
                if session.schedule_from < end.schedule_to:
                    end = session
                else:
                    count += (end.schedule_to.hour - start.schedule_from.hour) + (end.schedule_to.minute - start.schedule_from.minute) / 60

                    if index + 1 < len(lab_mapping[key]):
                        start = lab_mapping[key][index + 1]
                        end = lab_mapping[key][index + 1]
                
            count += (end.schedule_to.hour - start.schedule_from.hour) + (end.schedule_to.minute - start.schedule_from.minute) / 60

            Daily.objects.create(
                date = cur_date,
                lab_id = key,
                hours = count,
                num_bookings = len(lab_mapping[key])
            )
    
        self.stdout.write(self.style.SUCCESS("Daily record created"))