import RouteError from "@src/common/RouteError";
import HttpStatusCodes from "@src/common/HttpStatusCodes";

import ReviewRepo from "@src/repos/ReviewRepo";
import { IReview } from "@src/models/Review";
import { mapDbToModel } from "@src/util/mappers";
import BookRepo from "@src/repos/BookRepo";

// **** Variables **** //

export const REVIEW_NOT_FOUND_ERR = "Review not found";
export const DUPLICATE_REVIEW_ERR = "User has already reviewed this book";
export const BOOK_NOT_FOUND_ERR = "Book not found";

// **** Functions **** //

/**
 * Get all reviews for a book.
 */
async function getAllForBook(bookId: number): Promise<IReview[]> {
	const dbReviews = await ReviewRepo.getAllForBook(bookId);
	return dbReviews.map(mapDbToModel);
}

/**
 * Add one review.
 */
async function addOne(review: IReview): Promise<void> {
	// Check if the book exists
	const bookExists = await BookRepo.persists(review.bookId);
	if (!bookExists) {
		throw new RouteError(HttpStatusCodes.BAD_REQUEST, BOOK_NOT_FOUND_ERR);
	}

	// Check if the user has already reviewed this book
	const existingReviews = await ReviewRepo.getAllForBook(review.bookId);
	if (existingReviews.some((r) => r.userid === review.userId)) {
		throw new RouteError(HttpStatusCodes.BAD_REQUEST, DUPLICATE_REVIEW_ERR);
	}
	return ReviewRepo.add(review);
}

/**
 * Update one review.
 */
async function updateOne(review: IReview): Promise<void> {
	const persists = await ReviewRepo.persists(review.id);
	if (!persists) {
		throw new RouteError(HttpStatusCodes.NOT_FOUND, REVIEW_NOT_FOUND_ERR);
	}
	// Return review
	return ReviewRepo.update(review);
}

/**
 * Delete a review by its id.
 */
async function delete_(id: number): Promise<void> {
	const persists = await ReviewRepo.persists(id);
	if (!persists) {
		throw new RouteError(HttpStatusCodes.NOT_FOUND, REVIEW_NOT_FOUND_ERR);
	}
	// Delete review
	return ReviewRepo.delete(id);
}

// **** Export default **** //

export default {
	getAllForBook,
	addOne,
	updateOne,
	delete: delete_,
} as const;
