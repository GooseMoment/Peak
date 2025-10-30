from django.test import TestCase
from unittest.mock import patch

from users.models import User
from user_setting.models import UserSetting
from social.models import Following
from .models import Notification


class NotificationForFollowingTest(TestCase):
    def create_temp_users(self):
        self.alpha = User.objects.create(
            username="alpha", email="alpha@example.com", password=""
        )
        self.beta = User.objects.create(
            username="beta", email="beta@example.com", password=""
        )

    def test_create_notification_for_automatic_following_acceptance(self):
        """Test that notifications are created correctly when a following is automatically accepted"""
        self.create_temp_users()

        # Set beta to automatically accept follow requests (no manual approval)
        beta_setting = UserSetting.objects.get(user=self.beta)
        beta_setting.follow_request_approval_manually = False
        beta_setting.save()

        # Mock pushNotificationToUser to avoid actual push notifications during testing
        with patch("notifications.signals.pushNotificationToUser") as mock_push:
            # Create a following request (this should be automatically accepted due to the signal)
            following = Following.objects.create(
                follower=self.alpha, followee=self.beta, status=Following.REQUESTED
            )

            # Refresh from database to get the updated status after signal processing
            following.refresh_from_db()

            # Verify the following was automatically accepted
            self.assertEqual(following.status, Following.ACCEPTED)

            # Check that the correct notifications were created
            notifications = Notification.objects.filter(following=following).order_by(
                "created_at"
            )

            # Should have exactly 2 notifications for automatic acceptance:
            # 1. FOR_FOLLOW_REQUEST_ACCEPTED for the follower (alpha)
            # 2. FOR_FOLLOW for the followee (beta)
            self.assertEqual(notifications.count(), 2)

            follow_request_accepted_notification = notifications.filter(
                type=Notification.FOR_FOLLOW_REQUEST_ACCEPTED,
                user=self.alpha,  # follower receives this notification
            ).first()
            self.assertIsNotNone(follow_request_accepted_notification)
            if follow_request_accepted_notification:
                self.assertEqual(
                    follow_request_accepted_notification.following, following
                )

            follow_notification = notifications.filter(
                type=Notification.FOR_FOLLOW,
                user=self.beta,  # followee receives this notification
            ).first()
            self.assertIsNotNone(follow_notification)
            if follow_notification:
                self.assertEqual(follow_notification.following, following)

            # Verify push notifications were called for both users
            self.assertEqual(mock_push.call_count, 2)

    def test_create_notification_for_manual_following_request(self):
        """Test that only a follow request notification is created for manual approval"""
        self.create_temp_users()

        # Set beta to require manual approval for follow requests
        beta_setting = UserSetting.objects.get(user=self.beta)
        beta_setting.follow_request_approval_manually = True
        beta_setting.follow_request_approval_for_followings = False
        beta_setting.save()

        # Mock pushNotificationToUser to avoid actual push notifications during testing
        with patch("notifications.signals.pushNotificationToUser") as mock_push:
            # Create a following request (this should remain REQUESTED due to manual approval setting)
            following = Following.objects.create(
                follower=self.alpha, followee=self.beta, status=Following.REQUESTED
            )

            # Refresh from database
            following.refresh_from_db()

            # Verify the following status remained REQUESTED
            self.assertEqual(following.status, Following.REQUESTED)

            # Check that only the follow request notification was created
            notifications = Notification.objects.filter(following=following)

            # Should have exactly 1 notification for manual approval:
            # 1. FOR_FOLLOW_REQUEST for the followee (beta)
            self.assertEqual(notifications.count(), 1)

            follow_request_notification = notifications.first()
            self.assertIsNotNone(follow_request_notification)
            if follow_request_notification:
                self.assertEqual(
                    follow_request_notification.type, Notification.FOR_FOLLOW_REQUEST
                )
                self.assertEqual(
                    follow_request_notification.user, self.beta
                )  # followee receives this
                self.assertEqual(follow_request_notification.following, following)

            # Verify push notification was called once
            self.assertEqual(mock_push.call_count, 1)

    def test_create_notification_for_mutual_following_acceptance(self):
        """Test that notifications are created correctly for mutual following (auto-accept for existing followers)"""
        self.create_temp_users()

        # Set beta to require manual approval but auto-accept for existing followers
        beta_setting = UserSetting.objects.get(user=self.beta)
        beta_setting.follow_request_approval_manually = True
        beta_setting.follow_request_approval_for_followings = True
        beta_setting.save()

        # Create a reversed following first (beta follows alpha and it's accepted)
        Following.objects.create(
            follower=self.beta, followee=self.alpha, status=Following.ACCEPTED
        )

        # Clear any notifications created for the reversed following
        Notification.objects.all().delete()

        # Mock pushNotificationToUser to avoid actual push notifications during testing
        with patch("notifications.signals.pushNotificationToUser") as mock_push:
            # Create a following request (alpha follows beta)
            # This should be automatically accepted because beta already follows alpha
            following = Following.objects.create(
                follower=self.alpha, followee=self.beta, status=Following.REQUESTED
            )

            # Refresh from database to get the updated status after signal processing
            following.refresh_from_db()

            # Verify the following was automatically accepted due to mutual following setting
            self.assertEqual(following.status, Following.ACCEPTED)

            # Check that the correct notifications were created
            notifications = Notification.objects.filter(following=following).order_by(
                "created_at"
            )

            # Should have exactly 2 notifications for automatic acceptance:
            # 1. FOR_FOLLOW_REQUEST_ACCEPTED for the follower (alpha)
            # 2. FOR_FOLLOW for the followee (beta)
            self.assertEqual(notifications.count(), 2)

            follow_request_accepted_notification = notifications.filter(
                type=Notification.FOR_FOLLOW_REQUEST_ACCEPTED,
                user=self.alpha,  # follower receives this notification
            ).first()
            self.assertIsNotNone(follow_request_accepted_notification)

            follow_notification = notifications.filter(
                type=Notification.FOR_FOLLOW,
                user=self.beta,  # followee receives this notification
            ).first()
            self.assertIsNotNone(follow_notification)

            # Verify push notifications were called for both users
            self.assertEqual(mock_push.call_count, 2)
