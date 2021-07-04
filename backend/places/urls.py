from django.urls import path, include
from .views import (
    PlaceList, PlaceCreate, PlaceRetrieveUpdateDestroy
)


urlpatterns = [
    path('', PlaceCreate.as_view()),
    path('user/<uid>/', PlaceList.as_view()),
    path('<pk>/', PlaceRetrieveUpdateDestroy.as_view()),
]
