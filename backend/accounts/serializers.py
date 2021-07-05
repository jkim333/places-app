from rest_framework import serializers
from django.contrib.auth import get_user_model
from places.serializers import PlaceListSerializer


class UserListSerializer(serializers.ModelSerializer):
    """
    A serializer used for listing users.
    """
    places = PlaceListSerializer(many=True, read_only=True)

    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'places']