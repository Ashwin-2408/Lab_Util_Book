from django.urls import path
from . import views
urlpatterns = [
    path('schedule/<str:lab_name>/<str:date>/',views.schedule_list_detail_view),
    path('schedule/create',views.schedule_create_view),
    path('laboratory',views.laboratory_list_create_view),
    path('user',views.user_list_create_view),
    path('schedule',views.schedule_list_view),
    path('daily',views.daily_list_view),
    path('daily/<str:date>/',views.daily_list_detail_view)
    # path('laboratory/<int:pk>/update/',views.lab_update_view)
]