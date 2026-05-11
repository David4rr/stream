import { DetailPage } from "@/components/detail/detail-page";
import type {
  DramaDetailResponse,
  RecommendationsResponse,
} from "@/types/detail";
import { notFound } from "next/navigation";
import { getComments, ensureContentItem } from "@/app/actions/comment-actions";

interface PageProps {
  params: Promise<{
    kategori: string;
    provider: string;
    id: string;
    type: string;
  }>;
}

const API_BASE_URL = process.env.API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not defined in environment variables");
}

async function getDramaDetail(id: string, type: number) {
  const response = await fetch(
    `${API_BASE_URL}/v2/drama/detail/${id}?type=${type}`,
    {
      cache: "force-cache",
      next: { revalidate: 300 },
    },
  );

  if (!response.ok) return null;
  return response.json() as Promise<DramaDetailResponse>;
}

async function getDramaRecommendations() {
  const response = await fetch(`${API_BASE_URL}/v2/drama/recommendations`, {
    cache: "force-cache",
    next: { revalidate: 300 },
  });

  if (!response.ok) return { success: false, data: [] };
  return response.json() as Promise<RecommendationsResponse>;
}

/**
 * This route handles: /drama/detail/[id]/[type]
 *
 * Next.js routes [provider]/detail/[id]/[type] with higher priority than [...slug],
 * so drama URLs like /drama/detail/42000002888/1 land here
 * (provider="detail", id="42000002888", type="1").
 */
export default async function Page({ params }: PageProps) {
  const { kategori, id, type: typeStr } = await params;

  // Only drama uses this route pattern
  if (kategori !== "drama") {
    notFound();
  }

  const dramaType = parseInt(typeStr, 10);
  if (isNaN(dramaType)) {
    notFound();
  }

  const [detailData, recommendationsData] = await Promise.all([
    getDramaDetail(id, dramaType),
    getDramaRecommendations(),
  ]);

  if (!detailData) notFound();

  const contentItemId = await ensureContentItem({
    sourceId: detailData.data.id,
    providerKey: `d${dramaType}`,
    categoryName: "Drama",
  });

  const commentsData = contentItemId ? await getComments(contentItemId) : null;

  return (
    <DetailPage
      kategori="drama"
      provider={`d${dramaType}`}
      dramaData={detailData.data}
      urlDramaId={id}
      chapterCount={detailData.chapterCount}
      recommendations={
        recommendationsData.success ? recommendationsData.data : []
      }
      type={dramaType}
      initialComments={commentsData?.success ? commentsData.data : []}
      contentItemId={contentItemId}
    />
  );
}
