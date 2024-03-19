from django.contrib import admin
from .models import Drawer

@admin.register(Drawer)
class DrawerAdmin(admin.ModelAdmin):
    pass