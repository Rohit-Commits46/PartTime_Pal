import { configureStore, combineReducers } from "@reduxjs/toolkit";
import recommendationReducer from "./suggestionSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// Create a root reducer
const rootReducer = combineReducers({
  recommendationData: recommendationReducer,
});

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  // You can add blacklist or whitelist here if needed
};

// Create persisted root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store with persisted reducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;