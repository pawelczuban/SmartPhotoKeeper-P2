from firebase_admin import storage
import datetime
import os


def get_object_key(user_id: str, album_id: str, photo_id, name: str | None) -> str:
    """
    Creates the URI based on the user ID, album ID and photo ID
    """
    ext = os.path.splitext(name)[-1] if name else ""
    return f"{user_id}/albums/{album_id}/{photo_id}{ext}"


def generate_signed_url(object_key: str, expiration_minutes: int = 15) -> str:
    """
    Generates a signed URL for downloading a photo from Google Cloud Storage.

    :param object_key: Unique key of the photo
    :param expiration_minutes: Expiration time for the signed URL (default is 15 minutes).
    :return: Signed URL for downloading the photo.
    """
    bucket = storage.bucket("smart-photos")

    signed_url = bucket.blob(object_key).generate_signed_url(
        version="v4",
        expiration=datetime.timedelta(minutes=expiration_minutes),
        method="GET"
    )

    return signed_url


def generate_upload_signed_url(object_key: str, expiration_minutes: int = 15) -> str:
    """
    Generates a signed URL for uploading a photo to Google Cloud Storage.

    :param object_key: Unique key of the photo
    :param expiration_minutes: Expiration time for the signed URL (default is 15 minutes).
    :return: Signed URL for uploading the photo.
    """
    bucket = storage.bucket("smart-photos")

    signed_url = bucket.blob(object_key).generate_signed_url(
        version="v4",
        expiration=datetime.timedelta(minutes=expiration_minutes),
        method="PUT"
    )

    return signed_url
