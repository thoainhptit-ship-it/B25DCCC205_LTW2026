import { configureStore } from '@reduxjs/toolkit';
import matches from './features/matchesSlice';
import goal from './features/goalSlice';
export const store = configureStore({ reducer: { matches, goal } });
