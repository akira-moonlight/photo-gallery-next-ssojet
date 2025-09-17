import unsplash from './unsplash';
import type { ImageProps } from './types';

// Function to fetch photos from Unsplash API
export async function fetchUnsplashPhotos(): Promise<ImageProps[]> {
  try {
    // Fetch photos from Unsplash API
    const response = await unsplash.photos.list({
      page: 1,
      perPage: 30, // Adjust number of photos as needed
      orderBy: 'popular'
    });

    if (response.type === 'success') {
      // Transform the API response to match our ImageProps interface
      const photos: ImageProps[] = response.response.results.map((photo: any) => ({
        id: photo.id,
        height: photo.height,
        width: photo.width,
        urls: {
          regular: photo.urls.regular,
          small: photo.urls.small,
          thumb: photo.urls.thumb,
        },
        alt_description: photo.alt_description,
      }));
      
      return photos;
    } else {
      console.error('Failed to fetch photos from Unsplash:', response.errors);
      return [];
    }
  } catch (error) {
    console.error('Error fetching photos from Unsplash API:', error);
    return [];
  }
}

let cachedResults;

export default async function getResults() {
  if (!cachedResults) {
    // Fetch photos from Unsplash API
    const photos = await fetchUnsplashPhotos();
    cachedResults = { resources: photos };
  }

  return cachedResults;
}
