export interface Review {
  id: string | number;
  quality_rating: number;
  behavior_rating: number;
  time_rating: number;
  communication_rating: number;
  comment?: string;
}

export interface CreateReviewPayload {
  quality_rating: number;
  behavior_rating: number;
  time_rating: number;
  communication_rating: number;
  comment?: string;
}
