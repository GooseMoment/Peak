from django.contrib import admin
from .models import User

# https://docs.djangoproject.com/en/4.2/ref/contrib/admin/#django.contrib.admin.register
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    pass