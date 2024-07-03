import axios from "axios";

const BASE_URL = "/api/books";

export const getAllBooks = async () => {
	const response = await axios.get(`${BASE_URL}/all`);
	return response.data;
};

export const addBook = async (book: any) => {
  console.log(`book = ${JSON.stringify(book)}, url = ${BASE_URL}/add`)
	const response = await axios.post(`${BASE_URL}/add`, book);
	return response.data;
};

export const updateBook = async (book: any) => {
	const response = await axios.put(`${BASE_URL}/update`, book);
	return response.data;
};

export const deleteBook = async (id: number) => {
	const response = await axios.delete(`${BASE_URL}/delete/${id}`);
	return response.data;
};
