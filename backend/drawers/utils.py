from .models import Drawer


def normalize_drawers_order(drawers, ordering):
    ordered_drawers = drawers.order_by(ordering)

    for idx, drawer in enumerate(ordered_drawers, start=0):
        drawer.order = idx

    Drawer.objects.bulk_update(ordered_drawers, ["order"])
