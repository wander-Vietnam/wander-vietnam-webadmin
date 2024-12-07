// types/Review.ts

export interface Review {
    id_Review: string;       // Unique identifier for the review
    id_User: string;         // ID of the user who made the review
    id_TripQuest: string;    // ID of the related trip or quest
    reviewDate: string;      // Date when the review was made
    ratingNumber: number;    // Rating value (e.g., 1-5)
    comment: string;         // Comment text for the review
    isDeleted: boolean;      // Flag to indicate if the review is deleted
    fullname: string;        // Full name of the user who made the review
    avatar: string;          // URL of the user's avatar
    tripQuestName: string;   // Name of the trip/quest associated with the review
  }
  