// src/types/db.ts
export interface DbReview {
	id: number;
	text: string;
	rating: number;
	bookid: number; // Use the database field names
	userid: number; // Use the database field names
}
