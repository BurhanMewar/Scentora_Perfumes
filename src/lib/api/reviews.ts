import type { ProductReviewItem, ReviewSummary } from "@/lib/review-types";

export type ReviewFeed = {
  reviews: ProductReviewItem[];
  summary: ReviewSummary;
};

export async function getProductReviewFeed(_productId?: string, _limit?: number): Promise<ReviewFeed> {
  void _productId;
  void _limit;
  return {
    reviews: [],
    summary: {
      totalReviews: 0,
      averageRating: 0,
      verifiedPurchaseReviews: 0,
      ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    },
  };
}
