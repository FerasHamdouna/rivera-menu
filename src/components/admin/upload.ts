import { createClient } from '@/lib/supabase/browser';
import { IMAGES_BUCKET } from '@/lib/supabase/env';

/** Encodes a canvas as WebP (keeps transparency), falling back to JPEG where WebP encoding isn't supported. */
export function canvasToBlob(canvas: HTMLCanvasElement, quality = 0.82): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b && b.type === 'image/webp' ? resolve(b) : canvas.toBlob((j) => (j ? resolve(j) : reject(new Error('encode failed'))), 'image/jpeg', quality)), 'image/webp', quality),
  );
}

/** Uploads to the public images bucket as the signed-in admin and returns the storage path. */
export async function uploadImage(folder: 'items' | 'logo', blob: Blob): Promise<string> {
  const ext = blob.type === 'image/svg+xml' ? 'svg' : blob.type === 'image/jpeg' ? 'jpg' : blob.type === 'image/png' ? 'png' : 'webp';
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await createClient().storage.from(IMAGES_BUCKET).upload(path, blob, { contentType: blob.type, cacheControl: '31536000' });
  if (error) throw error;
  return path;
}

export function publicUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${IMAGES_BUCKET}/${path}`;
}

export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('not an image'));
    img.src = URL.createObjectURL(file);
  });
}
