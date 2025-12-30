
/**
 * Generates an optimized image URL using Supabase transformations.
 * Note: Transformations require a Supabase project with the feature enabled.
 */
export const getOptimizedImageUrl = (url: string, width: number = 400, quality: number = 70): string => {
  if (!url) return 'https://picsum.photos/400/300';
  
  // If it's a Supabase storage URL, we can append transformation parameters
  if (url.includes('supabase.co/storage/v1/render/image/public')) {
      return `${url}?width=${width}&quality=${quality}&format=webp`;
  }
  
  // Fallback for demo: Append simple width param if supported by CDN, else return original
  return url;
};
