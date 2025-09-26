from rest_framework import serializers
from django.db.models import Model
from django.utils.translation import gettext_lazy as _


class DualityRelatedField(serializers.RelatedField):
    serializer_class: type[serializers.ModelSerializer]
    model: Model

    default_error_messages = {
        "required": _("This field is required."),
        "does_not_exist": _('Invalid pk "{pk_value}" - object does not exist.'),
        "incorrect_type": _("Incorrect type. Expected pk value, received {data_type}."),
    }

    def __init__(self, serializer_class: type[serializers.ModelSerializer], **kwargs):
        assert serializer_class.Meta.model is not None, (
            "`serializer_class.Meta.model should not be None."
        )

        self.serializer_class = serializer_class
        self.model = serializer_class.Meta.model
        super().__init__(queryset=self.model.objects.all(), **kwargs)

    # Python prmitive data(UUID as str) -> Model field data(object)
    # mostly based on rest_framework.relations.PrimaryKeyRelatedField.to_internal_value
    def to_internal_value(self, data):
        queryset = self.get_queryset()
        if not isinstance(data, str):
            self.fail("incorrect_type", data_type=type(data).__name__)

        try:
            return queryset.get(pk=data)
        except self.model.DoesNotExist:
            self.fail("does_not_exist", pk_value=data)

    # Model field data(object) -> Python primitive data(dict)
    def to_representation(self, value):
        return self.serializer_class(value).data


class ReorderSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    order = serializers.IntegerField(min_value=0)
