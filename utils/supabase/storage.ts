interface GetImagesUrlParams {
	path: string;
}

export function getImagesUrl({ path }: GetImagesUrlParams): string {
	return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_STORAGE_BUCKET}/${path}`;
}
