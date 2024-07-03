import axios from "axios";

const BASE_URL = "/api/reviews";

export const getAllReviewsForBook = async (bookId: number) => {
	const response = await axios.get(`${BASE_URL}/all/${bookId}`);
	return response.data;
};

export const addReview = async (review: any) => {
	const response = await axios.post(`${BASE_URL}/add`, review);
	return response.data;
};

export const updateReview = async (review: any) => {
	const response = await axios.put(`${BASE_URL}/update`, review);
	return response.data;
};

export const deleteReview = async (id: number) => {
	const response = await axios.delete(`${BASE_URL}/delete/${id}`);
	return response.data;
};
