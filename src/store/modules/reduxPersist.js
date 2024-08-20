import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

export default function createPersisted (reducers){
  const persistedReducers = persistReducer(
    {
      key: 'CONSUMIR-API',
      storage,
      whitelist: ['auth'],
    },
    reducers
  );

  return persistedReducers;
};
