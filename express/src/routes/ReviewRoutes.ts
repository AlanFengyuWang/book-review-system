import HttpStatusCodes from "@src/common/HttpStatusCodes";

import ReviewService from "@src/services/ReviewService";
import { IReview } from "@src/models/Review";
import { IReq, IRes } from "./types/express/misc";

// **** Functions **** //

/**
 * Get all reviews for a book.
 */
async function getAllForBook(req: IReq, res: IRes) {
	const bookId = +req.params.bookId;
	const reviews = await ReviewService.getAllForBook(bookId);
	return res.status(HttpStatusCodes.OK).json({ reviews });
}

/**
 * Add one review.
 */
async function add(req: IReq<{ review: IReview }>, res: IRes) {
	const { review } = req.body;
	await ReviewService.addOne(review);
	return res.status(HttpStatusCodes.CREATED).end();
}

/**
 * Update one review.
 */
async function update(req: IReq<{ review: IReview }>, res: IRes) {
	const { review } = req.body;
	await ReviewService.updateOne(review);
	return res.status(HttpStatusCodes.OK).end();
}

/**
 * Delete one review.
 */
async function delete_(req: IReq, res: IRes) {
	const id = +req.params.id;
	await ReviewService.delete(id);
	return res.status(HttpStatusCodes.OK).end();
}

// **** Export default **** //
export default {
	getAllForBook,
	add,
	update,
	delete: delete_,
} as const;
