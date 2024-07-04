import RouteError from "@src/common/RouteError";
import HttpStatusCodes from "@src/common/HttpStatusCodes";

import BookRepo from "@src/repos/BookRepo";
import { IBook } from "@src/models/Book";

// **** Variables **** //

export const BOOK_NOT_FOUND_ERR = "Book not found";

// **** Functions **** //

/**
 * Get all books.
 */
function getAll(): Promise<IBook[]> {
	return BookRepo.getAll();
}

/**
 * Add one book.
 */
function addOne(book: IBook): Promise<void> {
	return BookRepo.add(book);
}

/**
 * Update one book.
 */
async function updateOne(book: IBook): Promise<void> {
	const persists = await BookRepo.persists(book.id);
	if (!persists) {
		throw new RouteError(HttpStatusCodes.NOT_FOUND, BOOK_NOT_FOUND_ERR);
	}
	// Return book
	return BookRepo.update(book);
}

/**
 * Delete a book by its id.
 */
async function _delete(id: number): Promise<void> {
	const persists = await BookRepo.persists(id);
	if (!persists) {
		throw new RouteError(HttpStatusCodes.NOT_FOUND, BOOK_NOT_FOUND_ERR);
	}
	// Delete book
	return BookRepo.delete(id);
}

// **** Export default **** //

export default {
	getAll,
	addOne,
	updateOne,
	delete: _delete,
} as const;
