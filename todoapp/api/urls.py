from django.contrib import admin
from django.urls import path, include
from .views import (api_overview, task_list, task_list_detail,
                    task_create, task_update, task_delete)

urlpatterns = [
    path('', api_overview, name='todoapp'),
    path('task-list/', task_list, name='task-list'),
    path('task-detail/<int:pk>/', task_list_detail, name='task-detail'),
    path('task-create/', task_create, name='task-create'),
    path('task-update/<int:pk>/', task_update, name='task-update'),
    path('task-delete/<int:pk>/', task_delete, name='task-delete')
]
