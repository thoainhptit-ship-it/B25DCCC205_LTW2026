import { createSlice } from '@reduxjs/toolkit';

const matchesSlice = createSlice({
  name: 'matches', initialState: [],
  reducers: {
    setMatches: (_state, action) => action.payload,
    addMatch: (state, action) => { state.push(action.payload); },
    removeMatch: (state, action) => state.filter((match) => match.id !== action.payload),
    setGoals: (state, action) => state.map((match) => match.id === action.payload.id ? { ...match, homeGoals: action.payload.homeGoals, awayGoals: action.payload.awayGoals } : match),
  },
});
export const { setMatches, addMatch, removeMatch, setGoals } = matchesSlice.actions;
export const selectMatches = (state) => state.matches;
export default matchesSlice.reducer;
