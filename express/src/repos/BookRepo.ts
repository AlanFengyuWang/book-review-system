import { IBook } from "@src/models/Book";
// import { getRandomInt } from "@src/util/misc";
// import orm from "./MockOrm";
import db from "../config/db";

// **** Functions **** //

// src/repos/BookRepo.ts

async function getOne(title: string): Promise<any> {
	const result = await db.oneOrNone<IBook>(
		"SELECT * FROM books WHERE title = $1",
		[title]
	);
	return result;
}

async function persists(id: number): Promise<boolean> {
	const result = await db.oneOrNone<{ id: number }>(
		"SELECT id FROM books WHERE id = $1",
		[id]
	);
	return !!result;
}

/**
 * Get all books.
 */
async function getAll(): Promise<IBook[]> {
	return db.any("SELECT * FROM books");
}

async function add(book: { title: string; author: string }): Promise<void> {
	await db.none("INSERT INTO books(title, author) VALUES($1, $2)", [
		book.title,
		book.author,
	]);
}

async function update(book: {
	id: number;
	title: string;
	author: string;
}): Promise<void> {
	const existingBook = await db.oneOrNone<IBook>(
		"SELECT * FROM books WHERE id = $1",
		[book.id]
	);

	if (existingBook) {
		await db.none(
			"UPDATE books SET title = $1, author = $2 WHERE id = $3",
			[book.title, book.author, book.id]
		);
	} else {
		throw new Error(`Book with ID ${book.id} does not exist.`);
	}
}

async function delete_(id: number): Promise<void> {
	try {
		// Check if the book exists
		const book = await db.oneOrNone<IBook>(
			"SELECT * FROM books WHERE id = $1",
			[id]
		);

		if (!book) {
			throw new Error("Book not found");
		}

		// Delete the book
		await db.none("DELETE FROM books WHERE id = $1", [id]);
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error("An unknown error occurred");
		}
	}
}

// Below is for the temporary json database:
// /**
//  * Get one book by title.
//  */
// async function getOne(title: string): Promise<IBook | null> {
// 	const db = await orm.openDb();
// 	for (const book of db.books) {
// 		if (book.title === title) {
// 			return book;
// 		}
// 	}
// 	return null;
// }

// /**
//  * See if a book with the given id exists.
//  */
// async function persists(id: number): Promise<boolean> {
// 	const db = await orm.openDb();
// 	for (const book of db.books) {
// 		if (book.id === id) {
// 			return true;
// 		}
// 	}
// 	return false;
// }

// async function getAll(): Promise<IBook[]> {
// 	const db = await orm.openDb();
// 	return db.books;
// }

/**
 * Add one book.
 */
// async function add(book: IBook): Promise<void> {
// 	const db = await orm.openDb();
// 	book.id = getRandomInt();
// 	db.books.push(book);
// 	return orm.saveDb(db);
// }

/**
 * Update a book.
 */
// async function update(book: IBook): Promise<void> {
// 	const db = await orm.openDb();
// 	for (let i = 0; i < db.books.length; i++) {
// 		if (db.books[i].id === book.id) {
// 			const dbBook = db.books[i];
// 			db.books[i] = {
// 				...dbBook,
// 				title: book.title,
// 				author: book.author,
// 			};
// 			return orm.saveDb(db);
// 		}
// 	}
// }

/**
 * Delete one book.
 */
// async function delete_(id: number): Promise<void> {
// 	const db = await orm.openDb();
// 	for (let i = 0; i < db.books.length; i++) {
// 		if (db.books[i].id === id) {
// 			db.books.splice(i, 1);
// 			return orm.saveDb(db);
// 		}
// 	}
// }

// **** Export default **** //

export default {
	getOne,
	persists,
	getAll,
	add,
	update,
	delete: delete_,
} as const;
