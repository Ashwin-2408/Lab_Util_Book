from django.test import TestCase
from .models import Laboratory, ScheduleRequest
from rest_framework.test import APIClient
from lab_app.models import Laboratory, Admin, ScheduleRequest, User, Schedules
from datetime import datetime, date, time
from django.urls import reverse

class LabAPITest(TestCase):
    def setUp(self):
        self.lab1 = Laboratory.objects.create(lab_name="Physics Lab", lab_capacity=30)
        self.lab2 = Laboratory.objects.create(lab_name="Chemistry Lab", lab_capacity=25)
        self.client = APIClient()
    
    def test_get_labs(self):
        url = reverse("laboratory")
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertContains(response, "Physics Lab")
        self.assertContains(response, "Chemistry Lab")

    def test_create_lab(self):
        url = reverse("laboratory")
        data = {"lab_name": "Biology Lab", "capacity": 20}
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, 201)
        self.assertEqual(Laboratory.objects.count(), 3)
        self.assertEqual(Laboratory.objects.last().lab_name, "Biology Lab")


class ScheduleRequestTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(username="George", email="george@gmail.com", password='password')
        self.lab = Laboratory.objects.create(lab_name="Physics Lab", lab_capacity=30)
        self.admin = Admin.objects.create(username='adminuser', password='password', department='physics', name="name", email="admin@gmail.com")
        self.client = APIClient()

    def test_create_schedule_request(self):
        schedule = ScheduleRequest.objects.create(
            username=self.user,
            lab_id=self.lab,
            schedule_date=date.today(),
            schedule_from=time(9, 0),
            schedule_to=time(11, 0),
            status="pending",
            decision_date=date.today()
        )

        self.assertEqual(schedule.username.username, self.user.username)
        self.assertEqual(schedule.lab_id.lab_id, self.lab.lab_id)
        self.assertEqual(schedule.status, "pending")

    def test_update_schedule_request(self):
        schedule = ScheduleRequest.objects.create(
            username=self.user,
            lab_id=self.lab,
            schedule_date=date.today(),
            schedule_from=time(9, 0),
            schedule_to=time(11, 0),
            status="pending"
        )
        
        schedule.status = "approved"
        schedule.save()
        updated_schedule = ScheduleRequest.objects.get(id=schedule.id)
        self.assertEqual(updated_schedule.status, "approved")

    def test_delete_schedule_request(self):
        schedule = ScheduleRequest.objects.create(
            username=self.user,
            lab_id=self.lab,
            schedule_date=date.today(),
            schedule_from=time(9, 0),
            schedule_to=time(11, 0),
            status="pending"
        )
        
        schedule_id = schedule.id
        schedule.delete()
        
        with self.assertRaises(ScheduleRequest.DoesNotExist):
            ScheduleRequest.objects.get(id=schedule_id)

    def test_default_status(self):
        schedule = ScheduleRequest.objects.create(
            username=self.user,
            lab_id=self.lab,
            schedule_date=date.today(),
            schedule_from=time(9, 0),
            schedule_to=time(11, 0)
        )
        
        self.assertEqual(schedule.status, "pending")

    def test_relationship_with_foreign_keys(self):
        schedule = ScheduleRequest.objects.create(
            username=self.user,
            lab_id=self.lab,
            schedule_date=date.today(),
            schedule_from=time(10, 0),
            schedule_to=time(12, 0),
            approved_by=self.admin
        )
        
        self.assertEqual(schedule.username, self.user)
        self.assertEqual(schedule.lab_id, self.lab)
        self.assertEqual(schedule.approved_by, self.admin)

class URLTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(username="George", email="george@gmail.com", password='password')
        self.lab = Laboratory.objects.create(lab_name="Physics Lab", lab_capacity=30)
        self.admin = Admin.objects.create(username='adminuser', password='password', department='physics', name="name", email="admin@gmail.com")
        self.client = APIClient()
    
    def test_laboratory_endpoint(self):
        response = self.client.get(reverse('laboratory'))
        self.assertEqual(response.status_code,200)

        response = self.client.post(reverse('laboratory'),
        {
            'lab_name': 'Chemistry',
            'lab_capacity': '25'
        })

        self.assertEqual(response.status_code, 201)
    
    def test_schedules_request_enpoint(self):
        response = self.client.get(reverse('schedule_req'))
        self.assertEqual(response.status_code, 200)

        data = {
            'username': self.user.username,
            'lab_name': self.lab.lab_name,
            'schedule_date': date.today(),
            'schedule_from': '12:00:00',
            'schedule_to': '14:00:00',
            'status': 'pending'
        }
        response = self.client.post(reverse('schedule_req_create'), data)

        self.assertEqual(response.status_code, 201)
        response = self.client.patch(reverse('schedule_req_update_view', args=[1]), {
            'status': 'approved',
            'approved_by': 'adminuser'
        })

        self.assertEqual(response.status_code, 200)

        response = self.client.patch(reverse('schedule_req_update_view', args=[1]), {
            'status': 'approved',
            'approved_by': 'admin1'
        })

        self.assertEqual(response.status_code, 400)

    def test_schedule_req_mod_view(self):
        response = self.client.get(reverse('schedule_req_mod_view'))
        self.assertEqual(response.status_code,200)
    
    def test_main_list_create(self):
        response = self.client.post(reverse('main_list_create'), {
            'username' : "adminuser",
            "lab_name" : "Physics Lab",
            'start_date': date.today(),
            'start_time': '12:00:00',
            'end_date' : date.today(),
            'end_time': '14:00:00',
            'main_reason': 'Regular Check'
        })
        self.assertEqual(response.status_code, 201)