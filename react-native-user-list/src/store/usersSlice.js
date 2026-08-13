import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import { fetchUsersPage, PAGE_SIZE } from "../api/userApi";
import { storage } from "../utils/storage";

const initialState = {
  users: [],          
  page: 0,             
  hasMore: true,       
  searchQuery: "",
  status: "idle",       
  error: null,
  isOffline: false,     
};


export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async ({ initial = false } = {}, { getState, rejectWithValue }) => {
    const { users } = getState();
    const nextPage = initial ? 1 : users.page + 1;

    try {
      const { users: pageUsers, totalCount } = await fetchUsersPage(nextPage, PAGE_SIZE);

      const combined = initial ? pageUsers : [...users.users, ...pageUsers];

      await storage.saveUsers(combined);
      await storage.savePage(nextPage);

      const hasMore = totalCount != null ? combined.length < totalCount : pageUsers.length === PAGE_SIZE;

      return { users: combined, page: nextPage, hasMore, fromCache: false };
    } catch (networkError) {
      // Offline
      const cachedUsers = await storage.getUsers();
      const cachedPage = await storage.getPage();

      if (cachedUsers && cachedUsers.length > 0) {
        return {
          users: cachedUsers,
          page: cachedPage ?? 1,
          hasMore: false, 
          fromCache: true,
        };
      }

      return rejectWithValue(networkError.message || "Network request failed");
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state, action) => {
        const isInitial = action.meta.arg?.initial;
        state.status = isInitial ? "loading" : "loadingMore";
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        const { users, page, hasMore, fromCache } = action.payload;
        state.status = "succeeded";
        state.users = users;
        state.page = page;
        state.hasMore = hasMore;
        state.isOffline = fromCache;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const { setSearchQuery } = usersSlice.actions;
export default usersSlice.reducer;

// ---------- Selectors ----------

const selectUsersState = (state) => state.users;
export const selectAllUsers = (state) => state.users.users;
export const selectSearchQuery = (state) => state.users.searchQuery;
export const selectStatus = (state) => state.users.status;
export const selectHasMore = (state) => state.users.hasMore;
export const selectIsOffline = (state) => state.users.isOffline;
export const selectError = (state) => state.users.error;

// Memoized so the FlatList only re-renders when the actual filtered
// result changes, not on every unrelated state update.
export const selectFilteredUsers = createSelector(
  [selectAllUsers, selectSearchQuery],
  (users, searchQuery) => {
    if (!searchQuery.trim()) return users;
    const query = searchQuery.trim().toLowerCase();
    return users.filter((user) => user.name.toLowerCase().includes(query));
  }
);

export { selectUsersState };
