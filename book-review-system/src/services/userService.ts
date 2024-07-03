import axios from "axios";

const BASE_URL = "/api/users";

export const getAllUsers = async () => {
	const response = await axios.get(`${BASE_URL}/all`);
	return response.data;
};

export const addUser = async (user: any) => {
	const response = await axios.post(`${BASE_URL}/add`, user);
	return response.data;
};

export const updateUser = async (user: any) => {
	const response = await axios.put(`${BASE_URL}/update`, user);
	return response.data;
};

export const deleteUser = async (id: number) => {
	const response = await axios.delete(`${BASE_URL}/delete/${id}`);
	return response.data;
};
