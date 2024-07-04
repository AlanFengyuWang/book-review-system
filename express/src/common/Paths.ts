/**
 * Express router paths go here.
 */

export default {
	Base: "/api",
	Users: {
		Base: "/users",
		Get: "/all",
		Add: "/add",
		Update: "/update",
		Delete: "/delete/:id",
	},
	Books: {
		Base: "/books",
		Get: "/all",
		Add: "/add",
		Update: "/update",
		Delete: "/delete/:id",
	},
	Reviews: {
		Base: "/reviews",
		getAllForBook: "/all/:id",
		Add: "/add",
		Update: "/update",
		Delete: "/delete/:id",
	},
} as const;
