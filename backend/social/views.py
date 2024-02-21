from django.http import HttpRequest

def post_follow_request(request: HttpRequest, user_id):
    pass

def patch_follow_request(request: HttpRequest, user_id):
    pass

def delete_follow_request(request: HttpRequest, user_id):
    pass

def get_profile(request: HttpRequest, user_id):
    pass

def get_followers(request: HttpRequest, user_id):
    pass

def get_followings(request: HttpRequest, user_id):
    pass

def get_blocks(request: HttpRequest):
    pass

def post_block(request: HttpRequest, user_id):
    pass

def delete_block(request: HttpRequest, user_id):
    pass

def get_daily_report(request: HttpRequest, user_id, date):
    pass

def get_following_feed(request: HttpRequest, date):
    pass

def get_explore_feed(request: HttpRequest, user_id):
    pass

def get_emojis(request: HttpRequest):
    pass

def post_reaction(request: HttpRequest, task_id, emoji):
    pass

def delete_reaction(request: HttpRequest, task_id):
    pass

def post_comment_to_task(request: HttpRequest, task_id, comment):
    pass

def post_comment_to_daily_comment(request: HttpRequest, date, comment):
    pass

def post_peck(request: HttpRequest, task_id):
    pass


