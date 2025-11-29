/**
 * Entity Info Helper
 * 
 * Extracts title, location, imageUrl, and other info from post relatedEntity
 * Supports trip (with isHosted flag) and place entity types
 */

export interface EntityInfo {
  title: string;
  location: string;
  imageUrl: string | null;
  coordinates: { latitude: number; longitude: number } | null;
  type: 'trip' | 'place' | null;
  isHosted?: boolean;
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

  if (post.type === 'trip' || post.type === 'tour') {
    // Unified Trip model: tour is now trip with isHosted = true
    const isHosted = post.relatedEntity?.isHosted || post.type === 'tour';
    return {
      title: isHosted 
        ? (post.relatedEntity?.title || post.relatedEntity?.destination || 'Trip')
        : (post.relatedEntity?.destination || 'Trip'),
      location: isHosted
        ? (post.relatedEntity?.tripLocation || post.relatedEntity?.location || '')
        : (post.relatedEntity?.destination || ''),
      imageUrl: isHosted ? (post.relatedEntity?.imageUrl || null) : null,
      coordinates: post.relatedEntity?.coordinates || post.relatedEntity?.tripCoordinates || null,
      type: 'trip',
      isHosted,
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

