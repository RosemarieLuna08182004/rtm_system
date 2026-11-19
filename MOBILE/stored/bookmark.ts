import { APP_BOOKMARK } from "@/constants";
import { fetchBookmarksThunk } from "@/hooks";
import { bookmarkInitial } from "@/shared";
import { TermTables } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const bookmarkSlice = createSlice({
	name: APP_BOOKMARK,
	initialState: bookmarkInitial,
	reducers: {},
	extraReducers: (builder) => {
			builder
			.addCase(fetchBookmarksThunk.pending, (state) => {
					state.status = 'loading';
			})
			.addCase(fetchBookmarksThunk.fulfilled, (state, action: PayloadAction<TermTables>) => {
					state.status = 'succeeded';
					state.bookmarks = action.payload;
			})
			.addCase(fetchBookmarksThunk.rejected, (state, action) => {
					state.status = 'failed';
					state.error = action.error.message || 'Failed to fetch bookmarks';
			});
	},
});

export default bookmarkSlice.reducer;