from django.urls import path
from . import views
urlpatterns = [
    path('schedule/<str:lab_name>/<int:month>/',views.schedule_list_view),
    path('schedule/create',views.schedule_create_view),
    path('laboratory',views.laboratory_list_create_view),
    path('user',views.user_list_create_view),
]