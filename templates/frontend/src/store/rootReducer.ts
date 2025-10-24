import { combineSlices } from "@reduxjs/toolkit";
import { userSlice } from "./slices/userSlice";


export const rootReducer = combineSlices({
	user: userSlice.reducer,
});
