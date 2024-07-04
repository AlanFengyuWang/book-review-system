import HttpStatusCodes from "@src/common/HttpStatusCodes";

import BookService from "@src/services/BookService";
import { IBook } from "@src/models/Book";
import { IReq, IRes } from "./types/express/misc";

// **** Functions **** //

/**
 * Get all books.
 */
async function getAll(_: IReq, res: IRes) {
	const books = await BookService.getAll();
	return res.status(HttpStatusCodes.OK).json({ books });
}

/**
 * Add one book.
 */
async function add(req: IReq<{ book: IBook }>, res: IRes) {
	const { book } = req.body;
	await BookService.addOne(book);
	return res.status(HttpStatusCodes.CREATED).end();
}

/**
 * Update one book.
 */
async function update(req: IReq<{ book: IBook }>, res: IRes) {
	const { book } = req.body;
	await BookService.updateOne(book);
	return res.status(HttpStatusCodes.OK).end();
}

/**
 * Delete one book.
 */
async function delete_(req: IReq, res: IRes) {
	const id = +req.params.id;
	await BookService.delete(id);
	return res.status(HttpStatusCodes.OK).end();
}

// **** Export default **** //
export default {
	getAll,
	add,
	update,
	delete: delete_,
} as const;
