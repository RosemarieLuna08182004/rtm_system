import { APP_CHAPTER } from '@/constants';
import { fetchChaptersThunk, fetchChapterThunk } from '@/hooks';
import { chapterInitial } from '@/shared';
import { ChapterTable, ChapterTables } from '@/types/tables';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const chapterSlice = createSlice({
  name: APP_CHAPTER,
  initialState: chapterInitial,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChaptersThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchChaptersThunk.fulfilled, (state, action: PayloadAction<ChapterTables>) => {
        state.status = 'succeeded';
        state.chapters = action.payload;
      })
      .addCase(fetchChaptersThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch chapters';
      })
      .addCase(fetchChapterThunk.pending, (state) => {
        state.chapterState = 'loading';
      })
      .addCase(fetchChapterThunk.fulfilled, (state, action: PayloadAction<ChapterTable>) => {
        state.chapterState = 'succeeded';
        state.chapter = action.payload;
      })
      .addCase(fetchChapterThunk.rejected, (state, action) => {
        state.chapterState = 'failed';
        state.error = action.error.message || 'Failed to fetch chapter';
      });
  },
});

export default chapterSlice.reducer;
  