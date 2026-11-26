import { createSlice } from '@reduxjs/toolkit';
const initialState = { teamId: '1', target: '10', remaining: '2' };
const goalSlice = createSlice({
  name: 'goal', initialState,
  reducers: {
    setTeamId: (state, action) => { state.teamId = action.payload; },
    setTarget: (state, action) => { state.target = action.payload; },
    setRemaining: (state, action) => { state.remaining = action.payload; },
  },
});
export const { setTeamId, setTarget, setRemaining } = goalSlice.actions;
export default goalSlice.reducer;
