import React, { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../services/userService";

interface User {
	id: number;
	name: string;
	email: string;
}

const UserList: React.FC = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const data = await getAllUsers();
				console.log("Fetched users:", data); // Log the fetched data to verify its structure
				setUsers(data.users); // Ensure data is an array
			} catch (err) {
				setError("Failed to fetch users");
			} finally {
				setLoading(false);
			}
		};

		fetchUsers();
	}, []);

	const handleDelete = async (id: number) => {
		try {
			await deleteUser(id);
			setUsers(users.filter((user) => user.id !== id));
		} catch (err) {
			setError("Failed to delete user");
		}
	};

	if (loading) return <div>Loading...</div>;
	if (error) return <div>{error}</div>;

	return (
		<div>
			<h1>User List</h1>
			<ul>
				{users.map((user) => (
					<li key={user.id}>
						{user.name} - {user.email}
						<button onClick={() => handleDelete(user.id)}>
							Delete
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default UserList;
