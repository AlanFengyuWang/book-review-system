import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TextField, Button, Box, Typography } from "@mui/material";
import { addReview } from "../services/reviewService";
import { useQueryClient } from "react-query";

interface ReviewFormProps {
	bookId: number;
}

// Seeded user
const userId = 1;

const ReviewForm: React.FC<ReviewFormProps> = ({ bookId }) => {
	const queryClient = useQueryClient();
	const [isFormVisible, setFormVisible] = useState(false);

	const formik = useFormik({
		initialValues: { text: "", rating: 1 },
		validationSchema: Yup.object({
			text: Yup.string().required("Required"),
			rating: Yup.number()
				.required("Required")
				.min(1, "Rating must be at least 1")
				.max(5, "Rating must be at most 5"),
		}),
		onSubmit: async (values, { resetForm }) => {
			try {
				const newReview = { id: -1, bookId, ...values, userId: userId };
				await addReview({ review: newReview });
				alert("Review added successfully");
				resetForm();
				queryClient.invalidateQueries(["reviews", bookId]); // Invalidate the reviews query
				setFormVisible(false); // Hide the form after submission
			} catch (error: any) {
				console.error("Error adding review:", error);
				if (error.response && error.response.data) {
					alert(error.response.data.error);
				} else {
					alert("Failed to add review");
				}
			}
		},
	});

	const toggleFormVisibility = () => {
		setFormVisible(!isFormVisible);
	};

	return (
		<Box sx={{ marginTop: 2 }}>
			<Button
				variant="contained"
				color="primary"
				onClick={toggleFormVisibility}
			>
				{isFormVisible ? "Hide Review Form" : "Add Review"}
			</Button>
			{isFormVisible && (
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						padding: 4,
						backgroundColor: "#f0f4f8",
						borderRadius: 2,
						boxShadow: 1,
						maxWidth: 500,
						margin: "auto",
						marginTop: 4,
					}}
				>
					<Typography variant="h6" gutterBottom>
						Add a Review
					</Typography>
					<form
						onSubmit={formik.handleSubmit}
						style={{ width: "100%" }}
					>
						<TextField
							name="text"
							label="Review"
							variant="outlined"
							fullWidth
							margin="normal"
							multiline
							rows={4}
							maxRows={10}
							value={formik.values.text}
							onChange={formik.handleChange}
							error={
								formik.touched.text &&
								Boolean(formik.errors.text)
							}
							helperText={
								formik.touched.text && formik.errors.text
							}
						/>
						<TextField
							name="rating"
							label="Rating"
							variant="outlined"
							type="number"
							fullWidth
							margin="normal"
							value={formik.values.rating}
							onChange={formik.handleChange}
							error={
								formik.touched.rating &&
								Boolean(formik.errors.rating)
							}
							helperText={
								formik.touched.rating && formik.errors.rating
							}
							inputProps={{ min: 0, max: 5, step: 0.1 }}
						/>
						<Button
							type="submit"
							variant="contained"
							color="primary"
							fullWidth
							sx={{ marginTop: 2 }}
						>
							Submit
						</Button>
					</form>
				</Box>
			)}
		</Box>
	);
};

export default ReviewForm;
