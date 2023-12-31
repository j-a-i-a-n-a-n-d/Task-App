from django.db import models

# Create your models here.


class TodoModel(models.Model):
    title = models.CharField(max_length=100)
    memo = models.TextField(blank=True)
    created = models.DateTimeField(auto_now_add=True)
    datecompleted = models.DateTimeField(null=True, blank=True)
    important = models.BooleanField(default=False)
    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return self.title
