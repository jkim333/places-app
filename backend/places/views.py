from django.http import Http404
from django.forms.models import model_to_dict
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Place
from .serializers import PlaceListSerializer, PlaceCreateSerializer, PlaceUpdateSerializer
from .permissions import IsOwnerOrReadOnly


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
    parser_classes = [MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):
        """
        Override this method to return 'creator', 'lat', and 'lon' fields as well upon successful place creation.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        headers = self.get_success_headers(serializer.data)
        output = model_to_dict(instance)
        output.update({'image': request.build_absolute_uri(output['image'].url)})
        return Response(output, status=status.HTTP_201_CREATED, headers=headers)


class PlaceRetrieveUpdateDestroy(APIView):
    """
    Retrieve a single place for a given place id.
    Update or delete a place if the user making this request is the creator of the place.
    """
    permission_classes = [IsOwnerOrReadOnly]

    def get_object(self, pk):
        try:
            return Place.objects.get(pk=pk)
        except Place.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        place = self.get_object(pk)
        serializer = PlaceListSerializer(place)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        place = self.get_object(pk)
        self.check_object_permissions(request, place)
        serializer = PlaceUpdateSerializer(place, data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            return Response(model_to_dict(instance))
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk, format=None):
        place = self.get_object(pk)
        self.check_object_permissions(request, place)
        place.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
