from rest_framework import serializers
from rest_framework.serializers import raise_errors_on_nested_writes
from rest_framework.utils import model_meta
from geopy.geocoders import Nominatim
from .models import Place

geolocator = Nominatim(user_agent='myGeoencoder')

class PlaceCreateSerializer(serializers.ModelSerializer):
    """
    A serializer for creating a place by the authenticated user.
    """
    class Meta:
        model = Place
        fields = ['id', 'title', 'description', 'address', 'image']
    
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
        fields = ['id', 'title', 'description', 'address', 'creator', 'lat', 'lon']


class PlaceUpdateSerializer(serializers.ModelSerializer):
    """
    A serizlier for updating a place 'description' and 'address'.
    """
    class Meta:
        model = Place
        fields = ['id', 'description', 'address']

    def update(self, instance, validated_data):
        """
        Override this method to update 'lat' and 'lon' fields in addition to the user input.
        """
        raise_errors_on_nested_writes('update', self, validated_data)
        info = model_meta.get_field_info(instance)

        # Simply set each attribute on the instance, and then save it.
        # Note that unlike `.create()` we don't need to treat many-to-many
        # relationships as being a special case. During updates we already
        # have an instance pk for the relationships to be associated with.
        m2m_fields = []
        for attr, value in validated_data.items():
            if attr in info.relations and info.relations[attr].to_many:
                m2m_fields.append((attr, value))
            else:
                setattr(instance, attr, value)

        address = validated_data.get('address')
        try:
            location = geolocator.geocode(address)
            lat = round(location.latitude * 10**6) / 10**6
            lon = round(location.longitude * 10**6) / 10**6
            if lat == None or lon == None:
                raise serializers.ValidationError({'address': 'We could not locate this address. Please try again with another address.'})
        except:
            raise serializers.ValidationError({'address': 'We could not locate this address. Please try again with another address.'})
        instance.lat = lat
        instance.lon = lon

        instance.save()

        # Note that many-to-many fields are set after updating instance.
        # Setting m2m fields triggers signals which could potentially change
        # updated instance and we do not want it to collide with .update()
        for attr, value in m2m_fields:
            field = getattr(instance, attr)
            field.set(value)

        return instance
