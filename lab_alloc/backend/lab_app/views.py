from django.shortcuts import render
# from django.http import JsonResponse
from django.db import transaction
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from lab_app.models import *
from rest_framework import generics
from lab_app.serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import date, datetime, timedelta
from rest_framework import status
from django.db.models import Q
import qrcode
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

RESET_DATE = '2025-02-13'
SCHEDULE_STATUS = False
SCHEDULE_REQUEST_STATUS = False

def calculate_day():
    cur_date = datetime.now().date()
    sessions = Schedules.objects.filter(schedule_date=cur_date).order_by('lab_id','schedule_from')
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

        if (cur_date - RESET_DATE).days % 7 == 0:
            calculate_week()

def calculate_week():
    cur_date = datetime.now().date()
    start = cur_date - timedelta(days = 7)
    queryset = Daily.objects.filter(date__lte = cur_date, date__gte = start).values('lab_id').annotate(total_hours=sum('hours'), num_bookings=sum('num_bookings'))
    if queryset:
        week_num = (cur_date - RESET_DATE).days // 7
        for ele in queryset:
            Week.objects.create(
                week_label = f'{start} - {cur_date}',
                week_num = week_num,
                lab_id = ele['lab_id'],
                total_hours = ele['total_hours'],
                num_bookings = ele['total_hours']
            )

class ScheduleProcessor:
    def __init__(self):
        self.day = dict()
        self.cur_date = datetime.now().date()
        self.ordered = dict()

    def process_labs(self):
        cur_time = datetime.now().time()
        # labs = Schedules.objects.filter(schedule_date=self.cur_date, schedule_from__gt=cur_time).order_by("schedule_from")
        labs = Schedules.objects.filter(schedule_date=self.cur_date).order_by("schedule_from")

        for lab in labs:
            if lab.lab_id_id not in self.day:
                self.day[lab.lab_id_id] = [[(lab.schedule_from, lab.schedule_to)]]
                self.ordered[lab.lab_id_id] = [(lab.schedule_from, lab.schedule_to)]
            else:
                flag = True
                for session in self.day[lab.lab_id_id]:
                    if lab.schedule_from >= session[-1][1]:
                        session.append((lab.schedule_from, lab.schedule_to))
                        self.ordered[lab.lab_id_id].append((lab.schedule_from, lab.schedule_to))
                        flag = False
                        break

                if flag:
                    self.day[lab.lab_id_id].append([(lab.schedule_from, lab.schedule_to)])
                    self.ordered[lab.lab_id_id].append((lab.schedule_from, lab.schedule_to))


    def add_session(self, new_session, lab_id):
        cur_time = datetime.now().time()
        updated_levels = []
        capacity = Laboratory.objects.get(lab_id=lab_id).lab_capacity

        if lab_id not in self.ordered:
            self.ordered[lab_id] = []

        self.ordered[lab_id] = [session for session in self.ordered[lab_id] if session[0] >= cur_time]

        self.ordered[lab_id].append(new_session)
        self.ordered[lab_id].sort(key = lambda x : x[0])

        for session in self.ordered[lab_id]:
            if not updated_levels:
                updated_levels.append([session])
            else:
                flag = False
                for index, level in enumerate(updated_levels):
                    if session[0] >= level[-1][1]:
                        if len(updated_levels) >= capacity:
                            self.ordered[lab_id] = []
                            self.process_labs()
                            return False

                        updated_levels[index].append(session)
                        flag = True
                        break

                if not flag:
                    updated_levels.append([session])
        self.day[lab_id] = updated_levels
        return True

schedule_processor = ScheduleProcessor()
schedule_processor.process_labs()


# class ScheduleCreateAPIView(APIView):
#     def post(self, request):
#         data = request.data.copy()
#         data['lab_id'] = Laboratory.objects.get(lab_name = data['lab_name']).lab_id
#         data.pop('lab_name')

#         serializer = ScheduleSerializer(data=data)
#         if(serializer.is_valid()):
#             schedule_from = serializer.validated_data['schedule_from']
#             schedule_to = serializer.validated_data['schedule_to']
#             lab_id = serializer.validated_data['lab_id'].lab_id
#             if schedule_processor.add_session((schedule_from, schedule_to), lab_id):
#                 serializer.save()
#                 return Response({"Message": "Successfully created a session"})
#             else:
#                 return Response({"Message" : "Cannot create a session"})

# schedule_create_view = ScheduleCreateAPIView.as_view()

class ScheduleCreateAPIView(APIView):
    def post(self, request):
        try:
            session_id= request.data.get('data')
            session_record = ScheduleRequest.objects.get(id=session_id)

            schedule_record = {
                "username": session_record.username.username,
                "lab_id": session_record.lab_id.lab_id,
                "schedule_date": session_record.schedule_date,
                "schedule_from": session_record.schedule_from,
                "schedule_to": session_record.schedule_to,
            }

            serializer = ScheduleSerializer(data=schedule_record)
            if serializer.is_valid():
                schedule_from = serializer.validated_data['schedule_from']
                schedule_to = serializer.validated_data['schedule_to']
                lab_id = serializer.validated_data['lab_id'].lab_id
                if schedule_processor.add_session((schedule_from, schedule_to), lab_id):
                    serializer.save()
                    return Response({"message": "Successfully Created Session"}, status=status.HTTP_201_CREATED)
            return Response({"message": "Validation Error", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        except ScheduleRequest.DoesNotExist:
            return Response({"message": "Session ID not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"message": "Error While Creating Session", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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

class DailyListAPIView(generics.ListAPIView):
    queryset = Daily.objects.all()
    serializer_class = DailySerializer

daily_list_view = DailyListAPIView.as_view()

class DailyListDetailAPIView(generics.ListAPIView):
    queryset = Daily.objects.all()
    serializer_class = DailySerializer

    def get_queryset(self):
        try:
            date_count = self.kwargs.get('date')
            start_date = datetime.strptime(RESET_DATE, "%Y-%m-%d").date()
            start = start_date + timedelta(days=5*(date_count - 1))
            end = start_date + timedelta(days=5*date_count)
            records = self.queryset.filter(date__range=(start, end)).order_by('lab_id', 'date')
            return records
        except Exception as e:
            Response({"Message" : "Error While Fetching Date"}, status=404)

daily_list_detail_view = DailyListDetailAPIView.as_view()

# class WeekListDetailAPIView(generics.ListAPIView):
#     queryset = Week.objects.all()
#     serializer_class = WeekSerializer

#     def get_queryset(self):
#         try:
#             week = self.kwargs.get('week')
#             records = self.queryset.filter(week_num__gte = week, week_num__lte = week + 5).order_by('lab_id', 'week_num')
#             print("Records",records)
#         except Exception as e:
#             Response({"Message" : "Error While Fetching Week"}, status = 404)

class WeekListDetailAPIView(generics.ListAPIView):
    serializer_class = WeekSerializer

    def get_queryset(self):
        try:
            week = self.kwargs.get('week')
            if week is not None:
                week = int(week)

            records = Week.objects.filter(
                week_num__gte=week,
                week_num__lte=week + 4
            ).order_by('lab_id', 'week_num')
            return records 

        except Exception as e:
            print("Error while fetching week:", str(e))
            return Week.objects.none()

week_list_detail_view = WeekListDetailAPIView.as_view()

class WeekListAPIView(generics.ListAPIView):
    queryset = Week.objects.all()
    serializer_class = WeekSerializer

week_list_view = WeekListAPIView.as_view()

class ScheduleRequestListAPIView(generics.ListAPIView):
    serializer_class = ScheduleRequestSerializer
    def get_queryset(self):
        return ScheduleRequest.objects.order_by('schedule_date')

    def list(self, request, *args, **kwargs):
        page_state = request.query_params.get('page_state', 0)
        page_state = int(page_state) * 10
        
        queryset = self.get_queryset()
        total_count = queryset.count()
        paginated_queryset = queryset[page_state:page_state + 10]
        serializer = self.get_serializer(paginated_queryset, many=True)
        return Response({"data" : serializer.data, "total" : total_count})


schedule_request_list_view = ScheduleRequestListAPIView.as_view()

class ScheduleRequestCreateView(APIView):
    def post(self, request):
        cur_date = datetime.now().date()
        data = request.data.copy()
        data['lab_id'] = Laboratory.objects.get(lab_name = data['lab_name']).lab_id
        data.pop('lab_name')
        data['decision_date'] = cur_date
        serializer = ScheduleRequestSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"Message" : "Successfully Submitted the Form"}, status=201)
        else:
            return Response({"Message" : "Error while submitting form"}, status=500)

schedule_request_create_view = ScheduleRequestCreateView.as_view()

class ScheduleRequestUpdateView(APIView):
    def patch(self, request, id):
        try:
            schedule_request = ScheduleRequest.objects.get(id=id)
            
            with transaction.atomic():
                schedule_request.status = request.data.get("status", schedule_request.status)
                schedule_request.approved_by_id = request.data.get("approved_by", schedule_request.approved_by_id)
                
                if schedule_request.status == 'approved':
                    schedule_data = {
                        "username": schedule_request.username.username,
                        "lab_id": schedule_request.lab_id.lab_id,
                        "schedule_date": schedule_request.schedule_date,
                        "schedule_from": schedule_request.schedule_from,
                        "schedule_to": schedule_request.schedule_to,
                    }
                    schedule_serializer = ScheduleSerializer(data=schedule_data)
                    
                    if schedule_serializer.is_valid():
                        if schedule_processor.add_session((schedule_request.schedule_from, schedule_request.schedule_to), schedule_request.lab_id.lab_id):
                            schedule_serializer.save()
                    else:
                        return Response({"error": schedule_serializer.errors}, status=400)
                schedule_request.save()
            return Response({"message": "Schedule updated successfully"}, status=200)

        except ScheduleRequest.DoesNotExist:
            return Response({"error": "Schedule request not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

schedule_request_update_view = ScheduleRequestUpdateView.as_view()

class AdminListAPIView(generics.ListAPIView):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer

admin_list_view = AdminListAPIView.as_view()

@csrf_exempt
def handleQR(request, user_name):
    cur_date = datetime.now().date()
    cur_time = datetime.now().time()

    record = Schedules.objects.filter(
        username=user_name,
        schedule_date=cur_date,
        schedule_from__lte=cur_time,
        schedule_to__gte=cur_time
    ).first()
    
    if record:
        data = ScheduleSerializer(record).data
        if record.status is None:
            record.status = "In Progress"
        elif record.status == "In Progress":
            record.status = "Completed"
        elif record.status == "Blocked":
            return JsonResponse({"Message": "Blocked"}, status=403)
        elif record.status == "Completed":
            return JsonResponse({"Message": "Already Completed"}, status=403)

        record.save(update_fields=["status"])
        return JsonResponse({"Message": record.status}, status=200)
    else:
        return JsonResponse({"Message": "No Schedule Found"}, status=404)

class UserScheduleDetailAPIView(APIView):
    def get(self, request, username):
        if not username:
            return JsonResponse({"Error": "Username is required"}, status=400)
        cur_date = datetime.now().date()
        cur_time = datetime.now().time()

        records = Schedules.objects.filter(username=username, schedule_date=cur_date, schedule_to__gte=cur_time)

        lab_records = Laboratory.objects.values("lab_id", "lab_name")
        final_records = records.filter(lab_id__in=lab_records.values_list("lab_id", flat=True))
        data = list(final_records.values())
        return JsonResponse(data, status=200, safe=False)
    
user_detail_api_view = UserScheduleDetailAPIView.as_view()

class ScheduleRequestModifiedView(generics.ListAPIView):
    serializer_class = ScheduleRequestSerializer
    def get_queryset(self):
        cur_date = datetime.now().date()
        cur_time = datetime.now().time()
        return ScheduleRequest.objects.filter(
            Q(schedule_date__gt = cur_date) | 
            Q(schedule_date = cur_date, schedule_to__gte = cur_time))

schedule_req_mod_view = ScheduleRequestModifiedView.as_view()

class MaintenanceListAPIView(generics.ListAPIView):
    serializer_class = MaintenanceSerializer
    queryset = Maintenance.objects.all()
    # def get_queryset(self):
    #     cur_date = datetime.now().date()
    #     cur_time = datetime.now().time()
    #     return Maintenance.objects.filter(
    #         Q(end_date__gt = cur_date) |
    #         Q(end_date = cur_date, end_time__gte = cur_time)
    #     )

main_list_view = MaintenanceListAPIView.as_view()

class MaintenanceListAllAPIView(generics.ListAPIView):
    serializer_class = MaintenanceSerializer
    queryset = Maintenance.objects.all()

main_list_all_view = MaintenanceListAllAPIView.as_view()

class MaintenanceInstanceListAPIView(generics.ListAPIView):
    serializer_class = MaintenanceSerializer

    def get_queryset(self):
        selected_date = self.kwargs.get('custom_date')
        selected_lab = self.kwargs.get('custom_lab')

        if not selected_date or not selected_lab:
            raise ValidationError({"Message": "date or lab not sent"})
        
        lab = get_object_or_404(Laboratory, lab_name=selected_lab)

        return Maintenance.objects.filter(
            lab_id = lab.lab_id,
            start_date__lte = selected_date,
            end_date__gte = selected_date
        ).order_by('start_date')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        if not queryset.exists():
            return Response({"Message": "No Maintenance is Scheduled"}, status=404)

        serializer = self.get_serializer(queryset, many=True)
        return Response({"data": serializer.data}, status=200)

instance_api_view = MaintenanceInstanceListAPIView.as_view()

class MaintenanceCreateAPIView(APIView):
    def post(self, request):
        data = request.data.copy()
        lab_name = data.get('lab_name')
        
        try:
            lab_id = Laboratory.objects.get(lab_name=lab_name).lab_id
        except Laboratory.DoesNotExist:
            return Response({"Error": "Invalid Lab Name"}, status=400)

        data.pop('lab_name')
        data['lab_id'] = lab_id
        serializer = MaintenanceSerializer(data=data)

        with transaction.atomic():
            if serializer.is_valid():
                serializer.save()

                schedule_request_queryset = ScheduleRequest.objects.filter(
                    Q(schedule_date__range=(data['start_date'], data['end_date'])) |
                    (Q(schedule_date=data['start_date']) & Q(schedule_from__range=(data['start_time'], data['end_time']))) |
                    (Q(schedule_date=data['start_date']) & Q(schedule_to__range=(data['start_time'], data['end_time'])))
                )

                for instance in schedule_request_queryset:
                    schedule_req_serializer = ScheduleRequestSerializer(
                        instance, data={'status': 'blocked'}, partial=True
                    )
                    if schedule_req_serializer.is_valid():
                        schedule_req_serializer.save()

                schedule_queryset = Schedules.objects.filter(
                    Q(schedule_date__range=(data['start_date'], data['end_date'])) |
                    (Q(schedule_date=data['start_date']) & Q(schedule_from__range=(data['start_time'], data['end_time']))) |
                    (Q(schedule_date=data['start_date']) & Q(schedule_to__range=(data['start_time'], data['end_time'])))
                )

                for instance in schedule_queryset:
                    schedule_serializer = ScheduleSerializer(
                        instance, data={'status': 'blocked'}, partial=True
                    )
                    if schedule_serializer.is_valid():
                        schedule_serializer.save()

                return Response({"Message": "Created Maintenance Session"}, status=201)
            else:
                return Response({"Error": serializer.errors}, status=400)

main_list_create = MaintenanceCreateAPIView.as_view()