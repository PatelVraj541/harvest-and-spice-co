import type { ImageLoaderProps } from "next/image";

/**
 * Custom Next.js image loader for Cloudinary
 * Usage: <Image loader={cloudinaryLoader} src="public_id" ... />
 */
export function cloudinaryLoader({ src, width, quality }: ImageLoaderProps): string {
  const params = [
    `w_${width}`,
    `q_${quality || "auto"}`,
    "f_auto",
    "c_fill",
  ];

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  // If src is already a full URL, return it with transforms
  if (src.startsWith("https://")) {
    return src;
  }

  return `https://res.cloudinary.com/${cloudName}/image/upload/${params.join(",")}/${src}`;
}
