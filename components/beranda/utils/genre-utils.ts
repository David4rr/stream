import type { Genre, Drama, MovieCategory } from "../types";
import { createCategoryFromDramas } from "./drama-mappers";

export function getGenreName(
  genre: Genre,
  kategori: "drama" | "anime" | "movies" | "manga",
): string {
  return (
    kategori === "anime" || kategori === "movies" || kategori === "manga"
      ? genre.genre
      : genre.genreName
  )?.toString() || "Unknown Genre";
}

export function genreToCategory(
  genre: Genre,
  dramas: Drama[],
  kategori: "drama" | "anime" | "movies" | "manga",
): MovieCategory {
  return createCategoryFromDramas(
    `genre-${genre.genreId}`,
    getGenreName(genre, kategori),
    dramas,
  );
}
