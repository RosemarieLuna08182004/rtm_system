import { APP_TERM_LINE } from "@/constants";
import { fetchTermLinesThunk } from "@/hooks";
import { termLineInitial } from "@/shared";
import { TermLineTables } from "@/types/tables";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const termLineSlice = createSlice({
	name: APP_TERM_LINE,
	initialState: termLineInitial,
	reducers: {},
	extraReducers: (builder) => {
			builder
			.addCase(fetchTermLinesThunk.pending, (state) => {
					state.status = 'loading';
			})
			.addCase(fetchTermLinesThunk.fulfilled, (state, action: PayloadAction<TermLineTables>) => {
					state.status = 'succeeded';
					state.termLines = action.payload;
			})
			.addCase(fetchTermLinesThunk.rejected, (state, action) => {
					state.status = 'failed';
					state.error = action.error.message || 'Failed to fetch termlines';
			});
	},
});

export default termLineSlice.reducer;