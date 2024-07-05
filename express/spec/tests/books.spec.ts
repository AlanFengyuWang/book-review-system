import supertest, { Test } from "supertest";
import TestAgent from "supertest/lib/agent";
import insertUrlParams from "inserturlparams";
import { defaultErrMsg as ValidatorErr } from "jet-validator";
import app from "@src/server";

import BookRepo from "@src/repos/BookRepo";
import Book, { IBook } from "@src/models/Book";
import HttpStatusCodes from "@src/common/HttpStatusCodes";

import Paths from "spec/support/Paths";
import apiCb from "spec/support/apiCb";
import { TApiCb } from "spec/types/misc";
import { BOOK_NOT_FOUND_ERR } from "@src/services/ReviewService";

// Dummy books for GET req
const getDummyBooks = (): IBook[] => {
	return [
		Book.newBook("Book 1", "Author 1"),
		Book.newBook("Book 2", "Author 2"),
		Book.newBook("Book 3", "Author 3"),
	];
};

// Tests
describe("BookRouter", () => {
	let agent: TestAgent<Test>;

	// Run before all tests
	beforeAll((done) => {
		agent = supertest.agent(app);
		done();
	});

	// Get all books
	describe(`"GET:${Paths.Books.Get}"`, () => {
		// Setup API
		const api = (cb: TApiCb) => agent.get(Paths.Books.Get).end(apiCb(cb));

		// Success
		it(
			"should return a JSON object with all the books and a status code " +
				`of "${HttpStatusCodes.OK}" if the request was successful.`,
			(done) => {
				// Add spy
				const data = getDummyBooks();
				spyOn(BookRepo, "getAll").and.resolveTo(data);
				// Call API
				api((res) => {
					expect(res.status).toBe(HttpStatusCodes.OK);
					expect(res.body).toEqual({ books: data });
					done();
				});
			}
		);
	});

	// Test add book
	describe(`"POST:${Paths.Books.Add}"`, () => {
		const ERROR_MSG = `${ValidatorErr}"book".`,
			DUMMY_BOOK = getDummyBooks()[0];

		// Setup API
		const callApi = (book: IBook | null, cb: TApiCb) =>
			agent.post(Paths.Books.Add).send({ book }).end(apiCb(cb));

		// Test add book success
		it(
			`should return a status code of "${HttpStatusCodes.CREATED}" if the ` +
				"request was successful.",
			(done) => {
				// Spy
				spyOn(BookRepo, "add").and.resolveTo();
				// Call api
				callApi(DUMMY_BOOK, (res) => {
					expect(res.status).toBe(HttpStatusCodes.CREATED);
					done();
				});
			}
		);

		// Missing param
		it(
			`should return a JSON object with an error message of "${ERROR_MSG}" ` +
				`and a status code of "${HttpStatusCodes.BAD_REQUEST}" if the book ` +
				"param was missing.",
			(done) => {
				// Call api
				callApi(null, (res) => {
					expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
					expect(res.body.error).toBe(ERROR_MSG);
					done();
				});
			}
		);
	});

	// Update book
	describe(`"PUT:${Paths.Books.Update}"`, () => {
		const ERROR_MSG = `${ValidatorErr}"book".`,
			DUMMY_BOOK = getDummyBooks()[0];

		// Setup API
		const callApi = (book: IBook | null, cb: TApiCb) =>
			agent.put(Paths.Books.Update).send({ book }).end(apiCb(cb));

		// Success
		it(
			`should return a status code of "${HttpStatusCodes.OK}" if the ` +
				"request was successful.",
			(done) => {
				// Setup spies
				spyOn(BookRepo, "update").and.resolveTo();
				spyOn(BookRepo, "persists").and.resolveTo(true);
				// Call api
				callApi(DUMMY_BOOK, (res) => {
					expect(res.status).toBe(HttpStatusCodes.OK);
					done();
				});
			}
		);

		// Param missing
		it(
			`should return a JSON object with an error message of "${ERROR_MSG}" ` +
				`and a status code of "${HttpStatusCodes.BAD_REQUEST}" if the book ` +
				"param was missing.",
			(done) => {
				// Call api
				callApi(null, (res) => {
					expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
					expect(res.body.error).toBe(ERROR_MSG);
					done();
				});
			}
		);

		// Book not found
		it(
			"should return a JSON object with the error message of " +
				`"${BOOK_NOT_FOUND_ERR}" and a status code of ` +
				`"${HttpStatusCodes.NOT_FOUND}" if the id was not found.`,
			(done) => {
				// Call api
				callApi(DUMMY_BOOK, (res) => {
					expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
					expect(res.body.error).toBe(BOOK_NOT_FOUND_ERR);
					done();
				});
			}
		);
	});

	// Delete book
	describe(`"DELETE:${Paths.Books.Delete}"`, () => {
		// Call API
		const callApi = (id: number, cb: TApiCb) =>
			agent
				.delete(insertUrlParams(Paths.Books.Delete, { id }))
				.end(apiCb(cb));

		// Success
		it(
			`should return a status code of "${HttpStatusCodes.OK}" if the ` +
				"request was successful.",
			(done) => {
				// Setup spies
				spyOn(BookRepo, "delete").and.resolveTo();
				spyOn(BookRepo, "persists").and.resolveTo(true);
				// Call api
				callApi(5, (res) => {
					expect(res.status).toBe(HttpStatusCodes.OK);
					done();
				});
			}
		);

		// Book not found
		it(
			"should return a JSON object with the error message of " +
				`"${BOOK_NOT_FOUND_ERR}" and a status code of ` +
				`"${HttpStatusCodes.NOT_FOUND}" if the id was not found.`,
			(done) => {
				// Setup spies
				callApi(-1, (res) => {
					expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
					expect(res.body.error).toBe(BOOK_NOT_FOUND_ERR);
					done();
				});
			}
		);
	});
});
