from fastapi import APIRouter, Depends, FastAPI, HTTPException
from typing import Annotated, List, Any
from app.config import get_firebase_user_from_token
from app.schema import User, Album, CreateAlbumRequest, PhotoRequest, SignedPut
from app.storage import generate_signed_url, generate_upload_signed_url, get_object_key
from firebase_admin import firestore
from datetime import datetime

router = APIRouter()
db = firestore.client()  # You could refactor this later into a dependency
app = FastAPI()



def prepare_album_response(album_data: dict[str, Any], album_id: str, user_id: str):
    if cover := album_data.get("cover"):
        object_key = get_object_key(user_id, album_id, cover['id'], cover['filename'])
        album_data["src"] = generate_signed_url(object_key, expiration_minutes=60)
    else:
        album_data["src"] = "https://via.placeholder.com/300"
    return Album(**album_data, id=album_id)

@router.get("/albums")
async def get_albums(user: Annotated[User, Depends(get_firebase_user_from_token)]) -> List[Album]:
    """Fetch all albums for the authenticated user"""
    albums_ref = db.collection("users").document(user.id).collection("albums")
    albums = albums_ref.stream()
    return [prepare_album_response(album.to_dict(), album.id, user.id) for album in albums]


@router.post("/albums")
async def create_album(album: CreateAlbumRequest, user: Annotated[User, Depends(get_firebase_user_from_token)]):
    """Create a new album for the authenticated user"""
    album_data = album.model_dump()
    album_ref = db.collection("users").document(user.id).collection("albums").document()
    album_ref.set(album_data)
    return prepare_album_response(album_data, album_ref.id, user.id)


@router.get("/albums/{album_id}")
async def get_album(album_id: str, user: Annotated[User, Depends(get_firebase_user_from_token)]):
    """Get a specific album for the authenticated user with signed URLs for cover and photos"""
    album_ref = db.collection("users").document(user.id).collection("albums").document(album_id)
    album = album_ref.get()

    if not album.exists:
        raise HTTPException(status_code=404, detail="Album not found")

    album_data = album.to_dict()
    photos_ref = album_ref.collection("photos")

    photos_with_urls = []
    for photo_ref in photos_ref.stream():
        photo_data = photo_ref.to_dict()
        photo_data['id'] = photo_ref.id
        object_key = get_object_key(user.id, album_id, photo_ref.id, photo_data['filename'])
        photo_data['src'] = generate_signed_url(object_key, expiration_minutes=60)
        photos_with_urls.append(photo_data)

    return {
        "album": prepare_album_response(album_data, album_id, user.id),
        "photos": photos_with_urls
    }


@router.put("/albums/{album_id}")
async def update_album(album_id: str, album: CreateAlbumRequest, user: Annotated[User, Depends(get_firebase_user_from_token)]) -> Album:
    """Update a specific album for the authenticated user"""
    album_ref = db.collection("users").document(user.id).collection("albums").document(album_id)

    if not album_ref.get().exists:
        raise HTTPException(status_code=404, detail="Album not found")

    album_data = album.model_dump()
    album_ref.update(album_data)
    return prepare_album_response(album_data, album_ref.id, user.id)


@router.get("/albums/{album_id}/photos/{photo_id}")
async def get_photo(album_id: str, photo_id: str, user: Annotated[User, Depends(get_firebase_user_from_token)]):
    """Get a specific photo URL"""
    photo_ref = db.collection("users").document(user.id).collection("albums").document(album_id).collection("photos").document(photo_id).get()

    if not photo_ref.exists:
        raise HTTPException(status_code=404, detail=f"Photo {photo_id} not found")

    photo_data = photo_ref.to_dict()
    photo_data['id'] = photo_ref.id
    object_key = get_object_key(user.id, album_id, photo_ref.id, photo_data['filename'])
    photo_data['src'] = generate_signed_url(object_key, expiration_minutes=60)
    return photo_data


@router.post("/albums/{album_id}/photos")
async def upload_photo(album_id: str, photo: PhotoRequest, user: Annotated[User, Depends(get_firebase_user_from_token)]):
    """Endpoint to start the photo upload process"""
    photo_data = photo.dict()
    photo_data["upload_date"] = datetime.utcnow().isoformat()

    # Save photo metadata in Firestore
    photo_ref = db.collection("users").document(user.id).collection("albums").document(album_id).collection("photos").document()
    photo_ref.set(photo_data)

    # Get the Google Cloud Storage bucket
    object_key = get_object_key(user.id, album_id, photo_ref.id, photo.filename)
    presigned_put = generate_upload_signed_url(object_key)

    return SignedPut(filename=photo.filename, url=presigned_put, id=photo_ref.id)
