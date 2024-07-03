import { useFormik } from "formik";
import * as Yup from "yup";
import { TextField, Button } from "@mui/material";
import { log } from "console";
import { addBook } from "../services/bookService";

const BookForm = () => {
	const formik = useFormik({
		initialValues: { title: "", author: "" },
		validationSchema: Yup.object({
			title: Yup.string().required("Required"),
			author: Yup.string().required("Required"),
		}),
		onSubmit: async (values, { resetForm }) => {
			// handle form submission
			try {
				await addBook(values);
				alert("Book added successfully");
				resetForm();
			} catch (error) {
				console.error("Error adding book:", error);
				alert("Failed to add book");
			}
		},
	});

	return (
		<>
			<form onSubmit={formik.handleSubmit}>
				<TextField
					name="title"
					label="Title"
					value={formik.values.title}
					onChange={formik.handleChange}
					error={formik.touched.title && Boolean(formik.errors.title)}
					helperText={formik.touched.title && formik.errors.title}
				/>
				<TextField
					name="author"
					label="Author"
					value={formik.values.author}
					onChange={formik.handleChange}
					error={
						formik.touched.author && Boolean(formik.errors.author)
					}
					helperText={formik.touched.author && formik.errors.author}
				/>
				<Button type="submit">Submit</Button>
			</form>
		</>
	);
};

export default BookForm;
