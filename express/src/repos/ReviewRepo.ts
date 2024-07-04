import { IReview } from "@src/models/Review";
// import { getRandomInt } from "@src/util/misc";
// import orm from "./MockOrm";

// **** Functions **** //

import db from "../config/db";
import { DbReview } from "@src/types/db";
// import { mapDbToModel } from "@src/util/mappers";

// **** Functions **** //

/**
 * Get all reviews for a book.
 */
async function getAllForBook(bookId: number): Promise<DbReview[]> {
	const result = await db.any<DbReview>(
		"SELECT * FROM reviews WHERE bookId = $1",
		[bookId]
	);
	return result;
}

/**
 * See if a review with the given id exists.
 */
async function persists(id: number): Promise<boolean> {
	const result = await db.oneOrNone<{ id: number }>(
		"SELECT id FROM reviews WHERE id = $1",
		[id]
	);
	return !!result;
}

/**
 * Add one review.
 */
async function add(review: IReview): Promise<void> {
	await db.none(
		"INSERT INTO reviews (text, rating, bookId, userId) VALUES ($1, $2, $3, $4)",
		[review.text, review.rating, review.bookId, review.userId]
	);
}

/**
 * Update a review.
 */
async function update(review: IReview): Promise<void> {
	const existingReview = await db.oneOrNone<IReview>(
		"SELECT * FROM reviews WHERE id = $1",
		[review.id]
	);

	if (existingReview) {
		await db.none(
			"UPDATE reviews SET text = $1, rating = $2, bookId = $3, userId = $4 WHERE id = $5",
			[
				review.text,
				review.rating,
				review.bookId,
				review.userId,
				review.id,
			]
		);
	} else {
		throw new Error(`Review with ID ${review.id} does not exist.`);
	}
}

/**
 * Delete one review.
 */
async function delete_(id: number): Promise<void> {
	try {
		// Check if the review exists
		const review = await db.oneOrNone<IReview>(
			"SELECT * FROM reviews WHERE id = $1",
			[id]
		);

		if (!review) {
			throw new Error("Review not found");
		}

		// Delete the review
		await db.none("DELETE FROM reviews WHERE id = $1", [id]);
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error("An unknown error occurred");
		}
	}
}

// **** Export default **** //

export default {
	getAllForBook,
	persists,
	add,
	update,
	delete: delete_,
} as const;

// Below was for testing storing to the database.json
// /**
//  * Get all reviews for a book.
//  */
// async function getAllForBook(bookId: number): Promise<IReview[]> {
// 	const db = await orm.openDb();
// 	return db.reviews.filter((review) => review.bookId === bookId);
// }

/**
 * See if a review with the given id exists.
 */
// async function persists(id: number): Promise<boolean> {
// 	const db = await orm.openDb();
// 	for (const review of db.reviews) {
// 		if (review.id === id) {
// 			return true;
// 		}
// 	}
// 	return false;
// }

// /**
//  * Add one review.
//  */
// async function add(review: IReview): Promise<void> {
// 	const db = await orm.openDb();
// 	review.id = getRandomInt();
// 	db.reviews.push(review);
// 	return orm.saveDb(db);
// }

// /**
//  * Update a review.
//  */
// async function update(review: IReview): Promise<void> {
// 	const db = await orm.openDb();
// 	for (let i = 0; i < db.reviews.length; i++) {
// 		if (db.reviews[i].id === review.id) {
// 			const dbReview = db.reviews[i];
// 			db.reviews[i] = {
// 				...dbReview,
// 				text: review.text,
// 				rating: review.rating,
// 				bookId: review.bookId,
// 			};
// 			return orm.saveDb(db);
// 		}
// 	}
// }

// /**
//  * Delete one review.
//  */
// async function delete_(id: number): Promise<void> {
// 	const db = await orm.openDb();
// 	for (let i = 0; i < db.reviews.length; i++) {
// 		if (db.reviews[i].id === id) {
// 			db.reviews.splice(i, 1);
// 			return orm.saveDb(db);
// 		}
// 	}
// }

// **** Export default **** //

// export default {
// 	getAllForBook,
// 	persists,
// 	add,
// 	update,
// 	delete: delete_,
// } as const;
