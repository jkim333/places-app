from rest_framework import serializers
from geopy.geocoders import Nominatim
from .models import Place

geolocator = Nominatim(user_agent='myGeoencoder')

class PlaceCreateSerializer(serializers.ModelSerializer):
    """
    A serializer for creating a place by the authenticated user.
    """
    class Meta:
        model = Place
        fields = ['id', 'title', 'description', 'address']
    
    def create(self, validated_data):
        """
        Override this method to add 'creator', 'lat', and 'lon' fields in addition to the user input.
        """
        address = validated_data.get('address')
        try:
            location = geolocator.geocode(address)
            lat = round(location.latitude * 10**6) / 10**6
            lon = round(location.longitude * 10**6) / 10**6
            if lat == None or lon == None:
                raise serializers.ValidationError({'address': 'We could not locate this address. Please try again with another address.'})
        except:
            raise serializers.ValidationError({'address': 'We could not locate this address. Please try again with another address.'})
        
        validated_data['creator'] = self.context['request'].user
        validated_data['lat'] = lat
        validated_data['lon'] = lon
        return self.Meta.model.objects.create(**validated_data)


class PlaceListSerializer(serializers.ModelSerializer):
    """
    A serializer for Listing all places for a given user.
    """
    class Meta:
        model = Place
        fields = ['id', 'title', 'description', 'address', 'creator', 'lat', 'lon', ]