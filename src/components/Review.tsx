import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllReviews, deleteReview } from "../redux/reviewSlice";
import { RootState, AppDispatch } from "../redux/store";
import { Review } from "../types/Review";

const Reviews: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { reviews, loading, error } = useSelector(
    (state: RootState) => state.reviews
  );

  useEffect(() => {
    dispatch(fetchAllReviews());
  }, [dispatch]);

  const handleDelete = (id_Review: string) => {
    dispatch(deleteReview(id_Review));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Review Management</h2>
      {loading && <p className="text-gray-600 italic">Loading...</p>}
      {error && (
        <p className="text-red-600">
          {typeof error === "string" ? error : JSON.stringify(error)}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.length > 0 ? (
          reviews.map((review: Review) => (
            <div
              key={review.id_Review}
              className="bg-white border border-gray-300 rounded shadow p-4 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-blue-600 mb-2">
                  {review.fullname}
                </h3>
                <p className="text-sm text-gray-700">
                  <strong>Rating:</strong> {review.ratingNumber}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Comment:</strong> {review.comment}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Trip Quest:</strong> {review.tripQuestName}
                </p>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  View
                </button>
                <button
                  onClick={() => handleDelete(review.id_Review)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-600">
            No reviews found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Reviews;
