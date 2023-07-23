import { configureStore } from '@reduxjs/toolkit';
import places from '../modules/places';
import tourPlacesReducer from '../modules/tourPlaces';
import kakaoReducer from '../modules/kakao';
import searchKeyword from '../modules/searchKeyword';
import planReducer from '../modules/plan';
const store = configureStore({
  reducer: { places, tourPlacesReducer, kakaoReducer, searchKeyword, planReducer },
  devTools: process.env.NODE_ENV !== 'production'
});

export default store;
