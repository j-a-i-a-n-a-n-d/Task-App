from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import TaskSerializer
from .models import TodoModel


@api_view(['GET'])
def api_overview(request):
    api_urls = {
        'List': '/task-list/',
        'Detail View': '/task-detail/<str:pk>/',
        'Create': '/task-create/',
        'Update': '/task-update/<str:pk>/',
        'Delete': '/task-delete/<str:pk>/'
    }
    return Response(api_urls)


@api_view(['GET'])
def task_list(request):
    task = TodoModel.objects.all()
    serializers = TaskSerializer(task, many=True)
    return Response(serializers.data)


@api_view(['GET'])
def task_list_detail(request, pk):
    task = TodoModel.objects.get(id=pk)
    serializers = TaskSerializer(task, many=False)
    return Response(serializers.data)


@api_view(['POST'])
def task_create(request):
    serializers = TaskSerializer(data=request.data)
    if serializers.is_valid():
        serializers.save()
    return Response(serializers.data)


@api_view(['POST'])
def task_update(request, pk):
    task = TodoModel.objects.get(id=pk)
    serializers = TaskSerializer(instance=task, data=request.data)
    if serializers.is_valid():
        serializers.save()
    return Response(serializers.data)


@api_view(['DELETE'])
def task_delete(request, pk):
    task = TodoModel.objects.get(id=pk)
    task.delete()
    return Response('Item successfully deleted!')
