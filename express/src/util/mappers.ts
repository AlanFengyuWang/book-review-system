// src/utils/mappers.ts
import { IReview } from "@src/models/Review";
import { DbReview } from "@src/types/db";

export function mapDbToModel(dbReview: DbReview): IReview {
	return {
		id: dbReview.id,
		text: dbReview.text,
		rating: dbReview.rating,
		bookId: dbReview.bookid, // Map to the TypeScript model
		userId: dbReview.userid, // Map to the TypeScript model
	};
}

export function mapModelToDb(review: IReview): DbReview {
	return {
		id: review.id,
		text: review.text,
		rating: review.rating,
		bookid: review.bookId, // Map from the TypeScript model
		userid: review.userId, // Map from the TypeScript model
	};
}
