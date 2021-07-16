from rest_framework.pagination import PageNumberPagination

class PlaceListPagination(PageNumberPagination):
    page_size = 2