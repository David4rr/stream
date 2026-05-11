import type { Drama, Movie } from "../types";

export function mapDramaToMovie(drama: Drama): Movie {
  return {
    id: drama.id,
    title: drama.title,
    poster: drama.coverImage,
    episodes: drama.chapterCount,
    views: drama.playCount ?? undefined,
    type: drama.type,
  };
}

export function mapDramasToMovies(dramas: Drama[]): Movie[] {
  return dramas.map(mapDramaToMovie);
}

export function createCategoryFromDramas(
  id: string,
  title: string,
  dramas: Drama[],
): { id: string; title: string; movies: Movie[] } {
  return {
    id,
    title,
    movies: mapDramasToMovies(dramas),
  };
}
