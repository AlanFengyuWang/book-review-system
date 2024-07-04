import { IReview } from "@src/models/Review";
import { getRandomInt } from "@src/util/misc";
import orm from "./MockOrm";

// **** Functions **** //

/**
 * Get all reviews for a book.
 */
async function getAllForBook(bookId: number): Promise<IReview[]> {
	const db = await orm.openDb();
	return db.reviews.filter((review) => review.bookId === bookId);
}

/**
 * See if a review with the given id exists.
 */
async function persists(id: number): Promise<boolean> {
	const db = await orm.openDb();
	for (const review of db.reviews) {
		if (review.id === id) {
			return true;
		}
	}
	return false;
}

/**
 * Add one review.
 */
async function add(review: IReview): Promise<void> {
	const db = await orm.openDb();
	review.id = getRandomInt();
	db.reviews.push(review);
	return orm.saveDb(db);
}

/**
 * Update a review.
 */
async function update(review: IReview): Promise<void> {
	const db = await orm.openDb();
	for (let i = 0; i < db.reviews.length; i++) {
		if (db.reviews[i].id === review.id) {
			const dbReview = db.reviews[i];
			db.reviews[i] = {
				...dbReview,
				text: review.text,
				rating: review.rating,
				bookId: review.bookId,
			};
			return orm.saveDb(db);
		}
	}
}

/**
 * Delete one review.
 */
async function delete_(id: number): Promise<void> {
	const db = await orm.openDb();
	for (let i = 0; i < db.reviews.length; i++) {
		if (db.reviews[i].id === id) {
			db.reviews.splice(i, 1);
			return orm.saveDb(db);
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
