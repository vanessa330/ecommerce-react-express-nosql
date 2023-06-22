// import {  combineReducers } from "redux";
import thunk from "redux-thunk";
import authReducer from "./reducers";
import { configureStore } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage";

// const rootReducer = combineReducers({ authReducer });

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  // storage,
};

const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk]
})
export const persistor = persistStore(store);
