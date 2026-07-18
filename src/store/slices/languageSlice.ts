import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type LanguageCode = "en" | "ar";

interface LanguageState {
  language: LanguageCode;
}

const initialState: LanguageState = {
  language: "en",
};

export const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<LanguageCode>) => {
      state.language = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
