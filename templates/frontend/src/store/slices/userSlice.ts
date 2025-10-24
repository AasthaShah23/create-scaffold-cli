import { createAction, createSlice } from "@reduxjs/toolkit";

export type UserType = {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	role: string;
	permissions: string[];
	token: string;
};
export type UserAuth = {
	challenge: string;
	userId: string;
	sessionId: string;
};
export type UserState = UserType & UserAuth;

const initialState: UserState = {
	// UserType defaults
	id: "",
	firstName: "",
	lastName: "",
	email: "",
	phoneNumber: "",
	role: "",
	permissions: [],
	token: "",

	// UserAuth defaults
	challenge: "",
	userId: "",
	sessionId: "",
};

export const resetStore = createAction("reset/store");

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setAuthSession: (state, action) => {
			state.challenge = action.payload.challenge;
			state.userId = action.payload.userId;
			state.sessionId = action.payload.sessionId;
		},
		setUser: (state, action) => {
			state.id = action.payload.id ?? state.id;
			state.firstName = action.payload.firstName ?? state.firstName;
			state.lastName = action.payload.lastName ?? state.lastName;
			state.email = action.payload.email ?? state.email;
			state.phoneNumber = action.payload.phoneNumber ?? state.phoneNumber;
			state.role = action.payload.role ?? state.role;
			state.permissions = action.payload.permissions ?? state.permissions;
			state.token = action.payload.token ?? state.token;
		},

		clearUser: (state) => {
			state.id = initialState.id;
			state.firstName = initialState.firstName;
			state.lastName = initialState.lastName;
			state.email = initialState.email;
			state.role = initialState.role;
			state.permissions = initialState.permissions;
			state.token = initialState.token;
		},

		clearUserAuth: (state) => {
			state.challenge = initialState.challenge;
			state.userId = initialState.userId;
			state.sessionId = initialState.sessionId;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(resetStore, () => initialState);
	},
});

export const { setUser, setAuthSession, clearUser } = userSlice.actions;
