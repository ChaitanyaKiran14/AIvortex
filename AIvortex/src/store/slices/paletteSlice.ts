import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PaletteState } from '../../types';

const initialState: PaletteState = {
  showPalette: false
};

const paletteSlice = createSlice({
  name: 'palette',
  initialState,
  reducers: {
    togglePalette: (state, action: PayloadAction<boolean>) => {
      state.showPalette = action.payload;
    }
  }
});

export const { togglePalette } = paletteSlice.actions;
export default paletteSlice.reducer;