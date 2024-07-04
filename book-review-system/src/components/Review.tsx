import React from "react";
import { useQuery, useQueryClient } from "react-query";
import { Typography, Divider, Button, Box } from "@mui/material";
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

	const {
		data: reviews,
		error,
		isLoading,
	} = useQuery(["reviews", bookId], () => fetchReviews(bookId));

	const handleDelete = async (id: number) => {
		try {
			await deleteReview(id);
			queryClient.invalidateQueries(["reviews", bookId]); // Invalidate the reviews query to refetch the data
		} catch (err) {
			console.error("Failed to delete review", err);
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
					<Box key={review.id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 1 }}>
						<li>
							{review.text} - Rating: {review.rating}
						</li>
						<Button
							variant="outlined"
							color="error"
							size="small"
							onClick={() => handleDelete(review.id)}
						>
							Delete
						</Button>
					</Box>
				))}
			</ul>
			<Divider />
		</>
	);
};

export default Reviews;
