import { IReview } from "./Review";

//  **** Variables **** //
const INVALID_BOOK_CONSTRUCTOR_PARAM =
	"titleOrObj arg must be a string or an object " +
	"with the appropriate book keys.";

// **** Types **** //
export interface IBook {
	id: number;
	title: string;
	author: string;
	reviews: IReview[];
}

// **** Book Functions **** //

/**
 * Create new Book.
 */
function newBook(
	title?: string,
	author?: string,
	id?: number, // id last cause usually set by db
	reviews?: IReview[]
): IBook {
	return {
		id: id ?? -1,
		title: title ?? "",
		author: author ?? "",
		reviews: reviews ?? [],
	};
}

/**
 * Get book instance from object.
 */
function bookFrom(param: object): IBook {
	if (!isBook(param)) {
		throw new Error(INVALID_BOOK_CONSTRUCTOR_PARAM);
	}
	const p = param as IBook;
	return newBook(p.title, p.author, p.id, p.reviews);
}

/**
 * See if the param meets criteria to be a book.
 * This can make the function more robust
 */
function isBook(arg: unknown): boolean {
	return (
		!!arg &&
		typeof arg === "object" &&
		"id" in arg &&
		typeof arg.id === "number" &&
		"title" in arg &&
		typeof arg.title === "string" &&
		"author" in arg &&
		typeof arg.author === "string" &&
		(!("reviews" in arg) || Array.isArray((arg as IBook).reviews)) // Make reviews optional
	);
}

export default {
	newBook,
	bookFrom,
	isBook,
} as const;
