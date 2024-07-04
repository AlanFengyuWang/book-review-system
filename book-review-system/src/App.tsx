import React from "react";
import logo from "./logo.svg";
import "./App.css";
import BookForm from "./components/BookForm";
import UserList from "./components/UserList";
import UserForm from "./components/UserForm";
import BooksList from "./components/BooksList";
import { Box } from "@mui/material";

function App() {
	return (
		<div className="App">
			{/* <BookForm /> */}
			{/* <UserForm /> */}
			{/* <UserList /> */}
			<Box sx={{ marginBottom: 4 }}>
				<BookForm />
			</Box>
			<BooksList />
			{/* <header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code>src/App.tsx</code> and save to reload.
				</p>
				<a
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React
				</a>
			</header> */}
		</div>
	);
}

export default App;
