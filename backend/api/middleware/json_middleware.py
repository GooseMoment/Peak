# modified from https://gist.github.com/LucasRoesler/700d281d528ecb7895c0?permalink_comment_id=2902138#gistcomment-2902138

from django.http import HttpRequest, HttpResponse, QueryDict
from django.core.exceptions import TooManyFieldsSent

import json

class JSONMiddleware:
    """
    Process application/json requests data from GET and POST requests.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request: HttpRequest):
        if (not request.META.get('CONTENT_TYPE')) or (not 'application/json' in request.META.get('CONTENT_TYPE')):
            return self.get_response(request)
        
        try:
            data = json.loads(request.body)

            q_data = QueryDict('', mutable=True)
            for key, value in data.items():
                if isinstance(value, list):
                    for x in value:
                        q_data.update({key: x})
                else:
                    q_data.update({key: value})

            if request.method == 'GET':
                request.GET = q_data

            if request.method == 'POST' or request.method == 'PATCH':
                request.POST = q_data

            return self.get_response(request)
        
        except (json.JSONDecodeError, TooManyFieldsSent):
            return HttpResponse("JSON Decode Error", status=400)