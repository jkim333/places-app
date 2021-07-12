from django.db import models
from django.contrib.auth import get_user_model

# Create your models here.
class Place(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    address = models.CharField(max_length=100)
    creator = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='places')
    lat = models.DecimalField(max_digits=9, decimal_places=6)
    lon = models.DecimalField(max_digits=9, decimal_places=6)
    image = models.ImageField()

    def __str__(self):
        return self.title