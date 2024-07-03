import { IBook } from "@src/models/Book";
import { getRandomInt } from "@src/util/misc";
import orm from "./MockOrm";

// **** Functions **** //

/**
 * Get one book by title.
 */
async function getOne(title: string): Promise<IBook | null> {
	const db = await orm.openDb();
	for (const book of db.books) {
		if (book.title === title) {
			return book;
		}
	}
	return null;
}

/**
 * See if a book with the given id exists.
 */
async function persists(id: number): Promise<boolean> {
	const db = await orm.openDb();
	for (const book of db.books) {
		if (book.id === id) {
			return true;
		}
	}
	return false;
}

/**
 * Get all books.
 */
async function getAll(): Promise<IBook[]> {
	const db = await orm.openDb();
	return db.books;
}

/**
 * Add one book.
 */
async function add(book: IBook): Promise<void> {
	const db = await orm.openDb();
	book.id = getRandomInt();
	db.books.push(book);
	return orm.saveDb(db);
}

/**
 * Update a book.
 */
async function update(book: IBook): Promise<void> {
	const db = await orm.openDb();
	for (let i = 0; i < db.books.length; i++) {
		if (db.books[i].id === book.id) {
			const dbBook = db.books[i];
			db.books[i] = {
				...dbBook,
				title: book.title,
				author: book.author,
				reviews: book.reviews,
			};
			return orm.saveDb(db);
		}
	}
}

/**
 * Delete one book.
 */
async function delete_(id: number): Promise<void> {
	const db = await orm.openDb();
	for (let i = 0; i < db.books.length; i++) {
		if (db.books[i].id === id) {
			db.books.splice(i, 1);
			return orm.saveDb(db);
		}
	}
}

// **** Export default **** //

export default {
	getOne,
	persists,
	getAll,
	add,
	update,
	delete: delete_,
} as const;
