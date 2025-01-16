from django.urls import path
from . import views
urlpatterns = [
    path('schedule',views.schedule_list_create_view),
    path('laboratory',views.laboratory_list_create_view),
    path('user',views.user_list_create_view)
]