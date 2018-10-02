from django.urls import path

from . import views

urlpatterns = [
    path('', views.ListUser.as_view()),
    path('createuser', views.AddUser.as_view()),
    path('loguser', views.LogUser.as_view()),
]
