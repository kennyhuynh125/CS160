from django.urls import path

from . import views

urlpatterns = [
    path('', views.ListUser.as_view()),
    path('createuser', views.AddUser.as_view()),
    path('loguser', views.LogUser.as_view()),
    path('addcard', views.AddNewCard.as_view()),
    path('getcards/<int:userId>', views.ListCardsByUser.as_view()),
]
