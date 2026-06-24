export function isFavorite(mediaId, favorites = []) {
  return favorites?.some(
    (favorite) => favorite.id === mediaId
  ) || false;
}