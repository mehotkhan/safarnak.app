/**
 * Entity Info Helper
 * 
 * Extracts title, location, imageUrl, and other info from post relatedEntity
 * Supports trip, tour, and place entity types
 */

export interface EntityInfo {
  title: string;
  location: string;
  imageUrl: string | null;
  coordinates: { latitude: number; longitude: number } | null;
  type: 'trip' | 'tour' | 'place' | null;
  id: string | null;
}

/**
 * Get entity information from a post's relatedEntity
 * 
 * @param post - Post object with relatedEntity
 * @returns EntityInfo object with extracted information
 * 
 * @example
 * const entityInfo = getEntityInfo(post);
 * if (entityInfo.type === 'trip') {
 *   router.push(`/(app)/(trips)/${entityInfo.id}`);
 * }
 */
export function getEntityInfo(post: any): EntityInfo {
  if (!post?.relatedEntity) {
    return {
      title: '',
      location: '',
      imageUrl: null,
      coordinates: null,
      type: null,
      id: null,
    };
  }

  if (post.type === 'trip') {
    return {
      title: post.relatedEntity.destination || 'Trip',
      location: post.relatedEntity.destination || '',
      imageUrl: null,
      coordinates: post.relatedEntity.tripCoordinates || null,
      type: 'trip',
      id: post.relatedId || null,
    };
  } else if (post.type === 'tour') {
    return {
      title: post.relatedEntity.title || 'Tour',
      location: post.relatedEntity.location || '',
      imageUrl: post.relatedEntity.imageUrl || null,
      coordinates: post.relatedEntity.tourCoordinates || null,
      type: 'tour',
      id: post.relatedId || null,
    };
  } else if (post.type === 'place') {
    return {
      title: post.relatedEntity.name || 'Place',
      location: post.relatedEntity.location || '',
      imageUrl: post.relatedEntity.imageUrl || null,
      coordinates: post.relatedEntity.placeCoordinates || null,
      type: 'place',
      id: post.relatedId || null,
    };
  }

  return {
    title: '',
    location: '',
    imageUrl: null,
    coordinates: null,
    type: null,
    id: null,
  };
}

