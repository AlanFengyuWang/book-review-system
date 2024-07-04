const INVALID_REVIEW_CONSTRUCTOR_PARAM =
	"textOrObj arg must be a string or an object " +
	"with the appropriate review keys.";

export interface IReview {
	id: number;
	text: string;
	rating: number;
	bookId: number;
	userId: number;
}

// **** Review Functions **** //

/**
 * Create new Review.
 */
function newReview(
	text?: string,
	rating?: number,
	bookId?: number,
	id?: number, // id last cause usually set by db
	userId?: number
): IReview {
	return {
		id: id ?? -1,
		text: text ?? "",
		rating: rating ?? 0,
		bookId: bookId ?? -1,
		userId: userId ?? -1,
	};
}

/**
 * Get review instance from object.
 */
function reviewFrom(param: object): IReview {
	if (!isReview(param)) {
		throw new Error(INVALID_REVIEW_CONSTRUCTOR_PARAM);
	}
	const p = param as IReview;
	return newReview(p.text, p.rating, p.bookId, p.id);
}

/**
 * See if the param meets criteria to be a review.
 */
function isReview(arg: unknown): boolean {
	return (
		!!arg &&
		typeof arg === "object" &&
		"id" in arg &&
		typeof arg.id === "number" &&
		"text" in arg &&
		typeof arg.text === "string" &&
		"rating" in arg &&
		typeof arg.rating === "number" &&
		"bookId" in arg &&
		typeof arg.bookId === "number" &&
		"userId" in arg &&
		typeof arg.userId === "number"
	);
}

// **** Export default **** //

export default {
	newReview,
	reviewFrom,
	isReview,
} as const;
