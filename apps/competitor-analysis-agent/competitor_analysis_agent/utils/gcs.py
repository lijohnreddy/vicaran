"""
Google Cloud Storage utility functions.
"""

from google.api_core import exceptions
from google.cloud import storage


def create_bucket_if_not_exists(
    bucket_name: str, project: str, location: str
) -> storage.Bucket:
    """
    Create a Google Cloud Storage bucket if it does not already exist.

    Args:
        bucket_name: The name of the bucket to create.
        project: The Google Cloud project ID.
        location: The location for the bucket.

    Returns:
        The created or existing storage bucket.
    """
    client = storage.Client(project=project)
    try:
        bucket = client.get_bucket(bucket_name)
        print(f"✅ Bucket {bucket_name} already exists.")
    except exceptions.NotFound:
        print(f" bucket {bucket_name} not found. Creating...")
        bucket = client.create_bucket(bucket_name, location=location)
        print(f"✅ Bucket {bucket_name} created successfully.")
    return bucket
