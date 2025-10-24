import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { rootReducer } from "./rootReducer";


const persistConfig = {
	key: "project_name",
	storage,
	whitelist: ["user"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
			},
		}),
});

export const persistor = persistStore(store);
export const useAppDispatch =
	useDispatch.withTypes<(typeof store)["dispatch"]>();
export const useAppSelector =
	useSelector.withTypes<ReturnType<(typeof store)["getState"]>>();
export const useAppStore = useStore.withTypes<typeof store>();
