import { useFormik } from "formik";
import * as Yup from "yup";
import { TextField, Button } from "@mui/material";
import { addUser } from "../services/userService";

const UserForm = () => {
	const formik = useFormik({
		initialValues: { name: "", email: "" },
		validationSchema: Yup.object({
			name: Yup.string().required("Required"),
			email: Yup.string().required("Required"),
		}),
		onSubmit: async (values, { resetForm }) => {
			// handle form submission
			try {
				const userWithCreatedTime = {
					id: -1,
					...values,
					created: new Date(),
				};
				await addUser({user: userWithCreatedTime});
				alert("User added successfully");
				resetForm();
			} catch (error) {
				console.error("Error adding user:", error);
				alert("Failed to add user");
			}
		},
	});

	return (
		<>
			<form onSubmit={formik.handleSubmit}>
				<TextField
					name="name"
					label="Name"
					value={formik.values.name}
					onChange={formik.handleChange}
					error={formik.touched.name && Boolean(formik.errors.name)}
					helperText={formik.touched.name && formik.errors.name}
				/>
				<TextField
					name="email"
					label="Email"
					value={formik.values.email}
					onChange={formik.handleChange}
					error={formik.touched.email && Boolean(formik.errors.email)}
					helperText={formik.touched.email && formik.errors.email}
				/>
				<Button type="submit">Submit</Button>
			</form>
		</>
	);
};

export default UserForm;
