import { APP_TERM } from "@/constants";
import { fetchTermsByChapterThunk, fetchTermThunk } from "@/hooks";
import { termInitial } from "@/shared";
import { TermTable, TermTables } from "@/types/tables";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const termSlice = createSlice({
	name: APP_TERM,
	initialState: termInitial,
	reducers: {},
	extraReducers: (builder) => {
			builder
			.addCase(fetchTermsByChapterThunk.pending, (state) => {
					state.status = 'loading';
			})
			.addCase(fetchTermsByChapterThunk.fulfilled, (state, action: PayloadAction<TermTables>) => {
					state.status = 'succeeded';
					state.terms = action.payload;
			})
			.addCase(fetchTermsByChapterThunk.rejected, (state, action) => {
					state.status = 'failed';
					state.error = action.error?.message || 'Failed to fetch terms';
			})

			.addCase(fetchTermThunk.pending, (state) => {
					state.termStatus = 'loading';
			})
			.addCase(fetchTermThunk.fulfilled, (state, action: PayloadAction<TermTable>) => {
					state.termStatus = 'succeeded';
					state.term = action.payload;
			})
			.addCase(fetchTermThunk.rejected, (state, action) => {
					state.termStatus = 'failed';
					state.error = action.error?.message || 'Failed to fetch terms';
			});
	},
});

export default termSlice.reducer;