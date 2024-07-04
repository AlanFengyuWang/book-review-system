import { useFormik } from "formik";
import * as Yup from "yup";
import { TextField, Button, Box, Typography } from "@mui/material";
import { addBook } from "../services/bookService";
import { useQueryClient } from "react-query";

const BookForm = () => {
	const queryClient = useQueryClient();

	const formik = useFormik({
		initialValues: { title: "", author: "" },
		validationSchema: Yup.object({
			title: Yup.string().required("Required"),
			author: Yup.string().required("Required"),
		}),
		onSubmit: async (values, { resetForm }) => {
			try {
				const new_values = { id: -1, ...values };
				await addBook({ book: new_values });
				alert("Book added successfully");
				resetForm();
				queryClient.invalidateQueries("books"); // Invalidate the books query
			} catch (error) {
				console.error("Error adding book:", error);
				alert("Failed to add book");
			}
		},
	});

	return (
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
			<Typography variant="h4" gutterBottom>
				Add a New Book
			</Typography>
			<form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
				<TextField
					name="title"
					label="Title"
					variant="outlined"
					fullWidth
					margin="normal"
					value={formik.values.title}
					onChange={formik.handleChange}
					error={formik.touched.title && Boolean(formik.errors.title)}
					helperText={formik.touched.title && formik.errors.title}
				/>
				<TextField
					name="author"
					label="Author"
					variant="outlined"
					fullWidth
					margin="normal"
					value={formik.values.author}
					onChange={formik.handleChange}
					error={
						formik.touched.author && Boolean(formik.errors.author)
					}
					helperText={formik.touched.author && formik.errors.author}
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
	);
};

export default BookForm;
