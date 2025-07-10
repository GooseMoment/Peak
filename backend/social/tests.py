from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient

from users.models import User
from .models import Block, Following

from typing import cast


class FollowingTest(APITestCase):
    def create_temp_users(self):
        self.alpha = User.objects.create(
            username="alpha", email="alpha@example.com", password=""
        )
        self.beta = User.objects.create(
            username="beta", email="beta@example.com", password=""
        )
        self.gamma = User.objects.create(
            username="gamma", email="gamma@example.com", password=""
        )

    def reverse(self, follower_username: str, followee_username: str) -> str:
        return reverse(
            "followings",
            kwargs={"follower": follower_username, "followee": followee_username},
        )

    def get_forbidden(self, follower_username: str, followee_username: str):
        path = self.reverse(
            follower_username,
            followee_username,
        )
        res = self.client.get(path)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def put_forbidden(self, follower_username: str, followee_username: str):
        path = self.reverse(
            follower_username,
            followee_username,
        )
        res = self.client.put(path)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def patch_forbidden(
        self, follower_username: str, followee_username: str, following_status: str
    ):
        path = self.reverse(
            follower_username,
            followee_username,
        )
        res = self.client.patch(path, data={"status": following_status})
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def delete_forbidden(self, follower_username: str, followee_username: str):
        path = self.reverse(
            follower_username,
            followee_username,
        )
        res = self.client.patch(path)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_follow_you_blocked(self):
        self.create_temp_users()
        Block.objects.create(blocker=self.alpha, blockee=self.beta)

        # try to follow whom you blocked
        self.client.force_authenticate(user=self.alpha)
        self.put_forbidden(self.alpha.username, self.beta.username)

    def test_follow_user_blocked_you(self):
        self.create_temp_users()
        Block.objects.create(blocker=self.beta, blockee=self.alpha)

        # try to follow the user who blocked you
        self.client.force_authenticate(user=self.alpha)
        self.put_forbidden(self.alpha.username, self.beta.username)

    def test_get_following_blocked(self):
        self.create_temp_users()
        self.client.force_authenticate(user=self.gamma)

        # should fail when you get a following whose follower is blocked by you
        Following.objects.create(
            follower=self.alpha, followee=self.beta, status=Following.REQUESTED
        )
        Block.objects.create(blocker=self.gamma, blockee=self.alpha)
        self.get_forbidden(self.alpha.username, self.beta.username)

        Block.objects.filter(blocker=self.gamma, blockee=self.alpha).delete()

        # should fail when you get a following whose followee is blocked by you
        Block.objects.create(blocker=self.gamma, blockee=self.beta)
        self.get_forbidden(self.alpha.username, self.beta.username)

        Block.objects.filter(blocker=self.gamma, blockee=self.beta).delete()

        # should fail when you get a following whose follower has blocked you
        Block.objects.create(blocker=self.alpha, blockee=self.gamma)
        self.get_forbidden(self.alpha.username, self.beta.username)

        Block.objects.filter(blocker=self.alpha, blockee=self.gamma).delete()

        # should fail when you get a following whose followee has blocked you
        Block.objects.create(blocker=self.beta, blockee=self.gamma)
        self.get_forbidden(self.alpha.username, self.beta.username)

    def test_put_following_forbidden(self):
        self.create_temp_users()
        self.client.force_authenticate(user=self.gamma)

        # fail to PUT a Following not related to me
        self.put_forbidden(self.alpha.username, self.beta.username)

        # fail to PUT a Following whose followee is me
        self.put_forbidden(self.alpha.username, self.gamma.username)

    def test_patch_following_forbidden(self):
        self.create_temp_users()
        self.client.force_authenticate(user=self.gamma)

        Following.objects.create(
            follower=self.alpha, followee=self.beta, status=Following.REQUESTED
        )

        # fail to PATCH a Following not related to me
        self.patch_forbidden(
            self.alpha.username, self.beta.username, Following.ACCEPTED
        )

        Following.objects.create(
            follower=self.gamma, followee=self.beta, status=Following.REQUESTED
        )

        # fail to PATCH a Following whose follower is me
        self.patch_forbidden(
            self.gamma.username, self.beta.username, Following.ACCEPTED
        )

    def test_delete_following_forbidden(self):
        self.create_temp_users()
        self.client.force_authenticate(user=self.gamma)

        Following.objects.create(
            follower=self.alpha, followee=self.beta, status=Following.REQUESTED
        )

        # fail to DELETE a Following not related to me
        self.delete_forbidden(self.alpha.username, self.beta.username)

        Following.objects.create(
            follower=self.alpha, followee=self.gamma, status=Following.REQUESTED
        )

        # fail to DELETE a Following whose followee is me
        self.delete_forbidden(self.alpha.username, self.gamma.username)

    def test_following_flow(self):
        self.create_temp_users()

        alpha_client = APIClient()
        alpha_client.force_authenticate(user=self.alpha)

        beta_client = APIClient()
        beta_client.force_authenticate(user=self.beta)

        path = self.reverse(
            self.alpha.username,
            self.beta.username,
        )

        # missing follow
        res = alpha_client.get(path)
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)

        # attempt to delete when a following does not exist
        res = alpha_client.delete(path)
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)

        # send follow request
        res = alpha_client.put(path)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(
            Following.objects.filter(
                follower=self.alpha, followee=self.beta, status=Following.REQUESTED
            ).exists()
        )

        # duplicate request
        res = alpha_client.put(path)
        self.assertEqual(res.status_code, status.HTTP_208_ALREADY_REPORTED)

        # alpha checks if the following exists
        res = alpha_client.get(path)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(cast(dict, res.data)["status"], Following.REQUESTED)

        # beta checks if the following exists
        res = beta_client.get(path)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(cast(dict, res.data)["status"], Following.REQUESTED)

        # alpha cancels the follow request
        res = alpha_client.delete(path)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(
            Following.objects.filter(
                follower=self.alpha, followee=self.beta, status=Following.CANCELED
            ).exists()
        )

        # cancel follow (second time)
        res = alpha_client.delete(path)
        self.assertEqual(
            res.status_code,
            status.HTTP_208_ALREADY_REPORTED,
            "Expected 208 for canceling follow twice.",
        )

        # 0. alpha sends follow request again and beta rejects it
        # 1. alpha sends follow request again(2) and beta accepts it
        for following_status in (Following.REJECTED, Following.ACCEPTED):
            alpha_client.put(path)
            beta_client.patch(path, data={"status": following_status})
            self.assertEqual(res.status_code, status.HTTP_200_OK)
            self.assertTrue(
                Following.objects.filter(
                    follower=self.alpha, followee=self.beta, status=following_status
                ).exists()
            )

        res = beta_client.get(path)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # alpha cancels the following
        res = alpha_client.delete(path)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(
            Following.objects.filter(
                follower=self.alpha, followee=self.beta, status=Following.CANCELED
            ).exists()
        )
