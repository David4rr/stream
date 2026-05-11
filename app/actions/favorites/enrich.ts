/**
 * Favorites Enrichment Functions
 */

import { FavoriteDrama } from './types';

function createFallback(fav: FavoriteDrama, pk: string, sid: string): FavoriteDrama {
  let category: string;
  if (pk.startsWith('d')) {
    category = 'drama';
  } else if (pk.startsWith('a')) {
    category = 'anime';
  } else if (pk === 'rebahin' || pk === 'indoxxi' || pk.startsWith('movie')) {
    category = 'movies';
  } else if (pk.startsWith('komik') || pk.startsWith('manga')) {
    category = 'manga';
  } else {
    category = 'anime';
  }

  const type = pk.startsWith('d') ? parseInt(pk.replace(/\D/g, ''), 10) || 1 : undefined;

  const title = fav.title && !fav.title.includes(' • ')
    ? fav.title
    : 'Data tidak tersedia';

  return {
    ...fav,
    title,
    coverImage: fav.coverImage ?? undefined,
    description: fav.description || pk,
    category: fav.category || category,
    providerKey: pk,
    sourceId: String(sid),
    type: type,
  };
}

export async function enrichSingleFavorite(favorite: FavoriteDrama, apiBaseUrl: string): Promise<FavoriteDrama> {
  const providerKey = favorite.contentItem?.providerKey || favorite.providerKey;
  const sourceId = favorite.sourceId
    ? String(favorite.sourceId)
    : String(favorite.contentItem?.sourceId);

  if (favorite.title && !favorite.title.includes(' • ') && favorite.category && favorite.providerKey && favorite.sourceId) {
    return favorite;
  }

  if (!providerKey || !sourceId) {
    return favorite;
  }

  try {
    let detailUrl: string;
    let category: string;

    if (providerKey.startsWith('d')) {
      const type = parseInt(providerKey.replace(/\D/g, ''), 10);
      detailUrl = `${apiBaseUrl}/v2/drama/detail/${sourceId}?type=${type}`;
      category = 'drama';
    } else {
      if (providerKey === 'animein' || providerKey.startsWith('ani')) {
        category = 'anime';
      } else if (providerKey === 'rebahin' || providerKey === 'indoxxi' || providerKey.startsWith('movie')) {
        category = 'movies';
      } else if (providerKey === 'komikku' || providerKey.startsWith('komik') || providerKey.startsWith('manga')) {
        category = 'manga';
      } else {
        category = 'anime';
      }

      detailUrl = `${apiBaseUrl}/${category}/${providerKey}/detail/${sourceId}`;
    }

    const detailResponse = await fetch(detailUrl, {
      cache: 'force-cache',
      next: { revalidate: 300 },
    });

    if (detailResponse.ok) {
      const detailResult = await detailResponse.json();

      if (detailResult.success && detailResult.data && detailResult.data.title) {
        let coverImage = detailResult.data.coverImage || favorite.coverImage;
        if (!coverImage && detailResult.data.chapters && detailResult.data.chapters.length > 0) {
          const firstChapter = detailResult.data.chapters[0];
          if (firstChapter.coverImage) {
            coverImage = firstChapter.coverImage;
          } else if (firstChapter.poster) {
            coverImage = firstChapter.poster;
          } else if (firstChapter.image) {
            coverImage = firstChapter.image;
          }
        }

        return {
          ...favorite,
          title: detailResult.data.title,
          coverImage: coverImage,
          description: detailResult.data.description || favorite.description || `${detailResult.data.chapterCount || 0} chapters available`,
          category: category,
          providerKey: providerKey,
          sourceId: String(sourceId),
          type: parseInt(providerKey.replace(/\D/g, ''), 10) || undefined,
        };
      }
    }

    return favorite;
  } catch (error) {
    return favorite;
  }
}

export async function enrichFavoritesBatch(favorites: FavoriteDrama[], apiBaseUrl: string): Promise<FavoriteDrama[]> {
  const alreadyEnriched: FavoriteDrama[] = [];
  const needsEnrichment: FavoriteDrama[] = [];

  for (const fav of favorites) {
    const hasValidTitle = fav.title && !fav.title.includes(' • ');
    const hasCompleteData = hasValidTitle && fav.category && fav.providerKey && fav.sourceId;

    if (hasCompleteData) {
      alreadyEnriched.push(fav);
    } else if (!fav.contentItem?.providerKey) {
      const providerKey = fav.providerKey;
      const sourceId = fav.sourceId;

      if (providerKey && sourceId && hasValidTitle) {
        alreadyEnriched.push(fav);
      } else if (providerKey && sourceId) {
        const fallback = createFallback(fav, providerKey, sourceId);
        alreadyEnriched.push(fallback);
      } else {
        alreadyEnriched.push({
          ...fav,
          title: hasValidTitle ? fav.title : 'Data tidak tersedia',
          category: fav.category || 'unknown',
        });
      }
    } else {
      needsEnrichment.push(fav);
    }
  }

  const enriched = await Promise.all(
    needsEnrichment.map(async (fav: FavoriteDrama) => {
      const providerKey = fav.contentItem!.providerKey;
      const sourceId = fav.sourceId
        ? String(fav.sourceId)
        : String(fav.contentItem!.sourceId);

      try {
        return await enrichSingleFavorite(fav, apiBaseUrl);
      } catch (error) {
        return createFallback(fav, providerKey, sourceId);
      }
    })
  );

  return [...alreadyEnriched, ...enriched];
}
