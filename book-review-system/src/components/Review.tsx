import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Typography, Divider, Button, Box, CircularProgress } from "@mui/material";
import { getAllReviewsForBook, deleteReview } from "../services/reviewService";

interface Review {
    id: number;
    text: string;
    rating: number;
    bookId: number;
}

const fetchReviews = async (bookId: number): Promise<Review[]> => {
    const response = await getAllReviewsForBook(bookId);
    return response.reviews;
};

interface ReviewsProps {
    bookId: number;
}

const Reviews: React.FC<ReviewsProps> = ({ bookId }) => {
    const queryClient = useQueryClient();
    const [deletingReviewId, setDeletingReviewId] = useState<number | null>(null);

    const {
        data: reviews,
        error,
        isLoading,
    } = useQuery(["reviews", bookId], () => fetchReviews(bookId));

    const handleDelete = async (id: number) => {
        setDeletingReviewId(id);
        try {
            await deleteReview(id);
            queryClient.invalidateQueries(["reviews", bookId]); // Invalidate the reviews query to refetch the data
            setDeletingReviewId(null);
        } catch (err) {
            console.error("Failed to delete review", err);
            setDeletingReviewId(null);
        }
    };

    if (isLoading) return <div>Loading reviews...</div>;
    if (error) return <div>Error loading reviews...</div>;

    return (
        <>
            <Typography component="div" variant="body2">
                Reviews:
            </Typography>
            <ul>
                {reviews?.map((review) => (
                    <li key={review.id}>
                        {review.text} - Rating: {review.rating}
                        <Button
                            variant="outlined"
                            color="secondary"
                            size="small"
                            onClick={() => handleDelete(review.id)}
                            sx={{ float: "right", color: "red", marginLeft: 1 }}
                            disabled={deletingReviewId === review.id}
                        >
                            {deletingReviewId === review.id ? (
                                <CircularProgress size={14} />
                            ) : (
                                "Delete"
                            )}
                        </Button>
                    </li>
                ))}
            </ul>
            <Divider />
        </>
    );
};

export default Reviews;
