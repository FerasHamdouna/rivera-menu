import { IMAGES_BUCKET, supabaseUrl } from './supabase/env';

/** Public URL of an uploaded image, or null when nothing is uploaded yet. */
export function imageUrl(path: string | null): string | null {
  return path ? `${supabaseUrl()}/storage/v1/object/public/${IMAGES_BUCKET}/${path}` : null;
}
