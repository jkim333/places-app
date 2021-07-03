from django.forms.models import model_to_dict
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Place
from .serializers import PlaceListSerializer, PlaceCreateSerializer


class PlaceList(generics.ListAPIView):
    """
    List all places for a given user.
    """
    serializer_class = PlaceListSerializer

    def get_queryset(self):
        uid = self.kwargs.get('uid')
        queryset = Place.objects.filter(creator=uid)
        return queryset


class PlaceCreate(generics.CreateAPIView):
    """
    Create a place by the authenticated user.
    """
    serializer_class = PlaceCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        """
        Override this method to return 'creator', 'lat', and 'lon' fields as well upon successful place creation.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        headers = self.get_success_headers(serializer.data)
        return Response(model_to_dict(instance), status=status.HTTP_201_CREATED, headers=headers)

