import React, { useState } from "react";
import {
	List,
	ListItem,
	ListItemText,
	Typography,
	Box,
	Button,
	CircularProgress,
} from "@mui/material";
import { useQuery, useQueryClient } from "react-query";
import { deleteBook, getAllBooks } from "../services/bookService";
import Reviews from "./Review";
import ReviewForm from "./ReviewForm";
import { deleteReview, getAllReviewsForBook } from "../services/reviewService";

interface Book {
	id: number;
	title: string;
	author: string;
}

const fetchBooks = async (): Promise<Book[]> => {
	const response = await getAllBooks();
	console.log(`book = ${JSON.stringify(response)}`);
	return response.books;
};

const BooksList: React.FC = () => {
	const queryClient = useQueryClient();

	const { data, error, isLoading } = useQuery<Book[]>("books", fetchBooks);
	const [deletingBook, setDeletingBookId] = useState<number | null>(null);

	const handleDelete = async (id: number) => {
		setDeletingBookId(id);
		try {
			// delete all comments first
			const allReviews = await getAllReviewsForBook(id);
			console.log(`allReviews = ${JSON.stringify(allReviews)}`);
			for (var review of allReviews?.reviews) {
				await deleteReview(review.id);
			}
			await deleteBook(id);
			queryClient.invalidateQueries("books"); // Invalidate the books query after deletion
			setDeletingBookId(null);
		} catch (err) {
			console.error("Failed to delete book", err);
			setDeletingBookId(null);
		}
	};

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error loading books...</div>;

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				padding: 4,
				backgroundColor: "#f0f4f8",
			}}
		>
			<Typography variant="h4" gutterBottom>
				Book List
			</Typography>
			<List sx={{ width: "100%", maxWidth: 600 }}>
				{data?.map((book) => (
					<Box key={book.id} sx={{ mb: 2 }}>
						<ListItem
							key={book.id}
							alignItems="flex-start"
							sx={{
								backgroundColor: "#ffffff",
								marginBottom: 2,
								borderRadius: 2,
								boxShadow: 1,
							}}
						>
							<ListItemText
								primary={
									<Box
										sx={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
										}}
									>
										<Typography variant="h6">
											{book.title}
										</Typography>
										<Button
											variant="outlined"
											color="secondary"
											onClick={() =>
												handleDelete(book.id)
											}
										>
											{deletingBook === book.id ? (
												<CircularProgress size={20} />
											) : (
												"Delete"
											)}
											{/* Delete */}
										</Button>
									</Box>
								}
								secondary={
									<>
										<Typography
											component="span"
											variant="body2"
											color="textPrimary"
										>
											{`Author: ${book.author}`}
										</Typography>
										<Reviews bookId={book.id} />
									</>
								}
							/>
						</ListItem>
						<ReviewForm bookId={book.id} />
					</Box>
				))}
			</List>
		</Box>
	);
};

export default BooksList;
