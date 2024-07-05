import supertest, { Test } from "supertest";
import TestAgent from "supertest/lib/agent";
import insertUrlParams from "inserturlparams";
import { defaultErrMsg as ValidatorErr } from "jet-validator";
import app from "@src/server";

import ReviewRepo from "@src/repos/ReviewRepo";
import BookRepo from "@src/repos/BookRepo";
import Review, { IReview } from "@src/models/Review";
import HttpStatusCodes from "@src/common/HttpStatusCodes";
import {
	REVIEW_NOT_FOUND_ERR,
	DUPLICATE_REVIEW_ERR,
	BOOK_NOT_FOUND_ERR,
} from "@src/services/ReviewService";

import Paths from "spec/support/Paths";
import apiCb from "spec/support/apiCb";
import { TApiCb } from "spec/types/misc";

// Dummy reviews for GET req
const getDummyReviews = (): IReview[] => {
	return [
		Review.newReview("Great book!", 5, 1, 1),
		Review.newReview("Not bad", 3, 2, 1),
		Review.newReview("Terrible", 1, 3, 1),
	];
};

// Tests
describe("ReviewRouter", () => {
	let agent: TestAgent<Test>;

	// Run before all tests
	beforeAll((done) => {
		agent = supertest.agent(app);
		done();
	});

	// Get all reviews for a book
	describe(`"GET:${Paths.Reviews.getAllForBook}"`, () => {
		// Setup API
		const api = (bookId: number, cb: TApiCb) =>
			agent
				.get(insertUrlParams(Paths.Reviews.getAllForBook, { bookId }))
				.end(apiCb(cb));

		// Success
		it(
			"should return a JSON object with all the reviews for the book and a status code " +
				`of "${HttpStatusCodes.OK}" if the request was successful.`,
			(done) => {
				// Add spy
				const data = getDummyReviews();
				spyOn(ReviewRepo, "getAllForBook").and.resolveTo(data);
				// Call API
				api(1, (res) => {
					expect(res.status).toBe(HttpStatusCodes.OK);
					done();
				});
			}
		);
	});

	// Test add review
	describe(`"POST:${Paths.Reviews.Add}"`, () => {
		const ERROR_MSG = `${ValidatorErr}"review".`,
			DUMMY_REVIEW = getDummyReviews()[0];

		// Setup API
		const callApi = (review: IReview | null, cb: TApiCb) =>
			agent.post(Paths.Reviews.Add).send({ review }).end(apiCb(cb));

		// Missing param
		it(
			`should return a JSON object with an error message of "${ERROR_MSG}" ` +
				`and a status code of "${HttpStatusCodes.BAD_REQUEST}" if the review ` +
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
				`"${HttpStatusCodes.BAD_REQUEST}" if the book id was not found.`,
			(done) => {
				spyOn(BookRepo, "persists").and.resolveTo(false);
				// Call api
				callApi(DUMMY_REVIEW, (res) => {
					expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
					expect(res.body.error).toBe(BOOK_NOT_FOUND_ERR);
					done();
				});
			}
		);
	});

	// Update review
	describe(`"PUT:${Paths.Reviews.Update}"`, () => {
		const ERROR_MSG = `${ValidatorErr}"review".`,
			DUMMY_REVIEW = getDummyReviews()[0];

		// Setup API
		const callApi = (review: IReview | null, cb: TApiCb) =>
			agent.put(Paths.Reviews.Update).send({ review }).end(apiCb(cb));

		// Success
		it(
			`should return a status code of "${HttpStatusCodes.OK}" if the ` +
				"request was successful.",
			(done) => {
				// Setup spies
				spyOn(ReviewRepo, "update").and.resolveTo();
				spyOn(ReviewRepo, "persists").and.resolveTo(true);
				// Call api
				callApi(DUMMY_REVIEW, (res) => {
					expect(res.status).toBe(HttpStatusCodes.OK);
					done();
				});
			}
		);

		// Param missing
		it(
			`should return a JSON object with an error message of "${ERROR_MSG}" ` +
				`and a status code of "${HttpStatusCodes.BAD_REQUEST}" if the review ` +
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

		// Review not found
		it(
			"should return a JSON object with the error message of " +
				`"${REVIEW_NOT_FOUND_ERR}" and a status code of ` +
				`"${HttpStatusCodes.NOT_FOUND}" if the id was not found.`,
			(done) => {
				// Call api
				callApi(DUMMY_REVIEW, (res) => {
					expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
					expect(res.body.error).toBe(REVIEW_NOT_FOUND_ERR);
					done();
				});
			}
		);
	});

	// Delete review
	describe(`"DELETE:${Paths.Reviews.Delete}"`, () => {
		// Call API
		const callApi = (id: number, cb: TApiCb) =>
			agent
				.delete(insertUrlParams(Paths.Reviews.Delete, { id }))
				.end(apiCb(cb));

		// Success
		it(
			`should return a status code of "${HttpStatusCodes.OK}" if the ` +
				"request was successful.",
			(done) => {
				// Setup spies
				spyOn(ReviewRepo, "delete").and.resolveTo();
				spyOn(ReviewRepo, "persists").and.resolveTo(true);
				// Call api
				callApi(5, (res) => {
					expect(res.status).toBe(HttpStatusCodes.OK);
					done();
				});
			}
		);

		// Review not found
		it(
			"should return a JSON object with the error message of " +
				`"${REVIEW_NOT_FOUND_ERR}" and a status code of ` +
				`"${HttpStatusCodes.NOT_FOUND}" if the id was not found.`,
			(done) => {
				// Setup spies
				callApi(-1, (res) => {
					expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
					expect(res.body.error).toBe(REVIEW_NOT_FOUND_ERR);
					done();
				});
			}
		);
	});
});
