from django.contrib.auth import get_user_model
from rest_framework import generics
from .serializers import UserListSerializer
from .paginations import UserListPagination

# Create your views here.
class UserList(generics.ListAPIView):
    """
    List all users.
    """
    pagination_class = UserListPagination
    queryset = get_user_model().objects.all()
    serializer_class = UserListSerializer
