import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchFavorites = createAsyncThunk(
  "favorites/fetchFavorites",
  async (token) => {
    const res = await fetch("http://localhost:4000/api/favorites", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  }
);

export const addFavorite = createAsyncThunk(
  "favorites/addFavorite",
  async ({ token, bookId }) => {
    await fetch("http://localhost:4000/api/favorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bookId }),
    });
    return bookId;
  }
);

// generated-by-copilot: update the comment for a specific favorited book
export const updateFavoriteComment = createAsyncThunk(
  "favorites/updateFavoriteComment",
  async ({ token, bookId, comment }) => {
    const res = await fetch(`http://localhost:4000/api/favorites/${bookId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ comment }),
    });
    return res.json();
  }
);

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: { items: [], status: "idle" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        // After adding, fetch the updated favorites list to ensure UI is in sync
      })
      // generated-by-copilot: update comment in-place without a full re-fetch
      .addCase(updateFavoriteComment.fulfilled, (state, action) => {
        const item = state.items.find((i) => i.id === action.payload.bookId);
        if (item) item.comment = action.payload.comment;
      });
  },
});

export default favoritesSlice.reducer;
