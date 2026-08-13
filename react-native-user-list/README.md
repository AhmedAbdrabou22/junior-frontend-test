# User List App (Expo + Redux)

A performance-optimized Expo app that fetches users from
`https://jsonplaceholder.typicode.com/users`, stores them in Redux, caches
them offline with AsyncStorage, and renders them in a virtualized,
searchable, paginated `FlatList`.

## Setup (Expo SDK 54)

This project targets **Expo SDK 54** (React Native 0.81, React 19.1). SDK 54
is the current stable SDK, so the Expo Go app currently on the App
Store / Play Store supports it out of the box — no need to hunt down an
older Expo Go build.

```bash
# 1. Install dependencies
npm install

# 2. Let Expo double-check every package matches the versions SDK 54 expects
npx expo install --fix

# 3. Start the dev server
npx expo start
```

Then scan the QR code with Expo Go (Android/iOS), or press `i` / `a` for a
simulator, or `w` for web.

> If you're starting from this folder inside an existing Expo template,
> just copy `App.js` and the `src/` folder over yours, then run
> `npm install` followed by `npx expo install --fix` so every native
> dependency lines up with your installed `expo` version.

### If Expo Go still won't open the project

- **Mismatched SDK**: Expo Go on your phone only ever supports the single
  latest SDK version. Run `npx expo start` and check the terminal/dev
  tools banner — if it says your project is on a different SDK than your
  installed Expo Go, either:
  - update this project (`npx expo install expo@latest && npx expo install --fix`), or
  - use a **development build** instead of Expo Go (`npx expo prebuild` +
    `npx expo run:android` / `run:ios`), which isn't locked to a single SDK.
- Old Expo Go APKs for older SDKs are no longer distributed by Expo
  (they were retired), so "downgrade Expo Go" isn't a supported path
  anymore — upgrading the project (as done here) is the reliable fix.

> **Note on AsyncStorage:** stick to
> `@react-native-async-storage/async-storage@2.2.0` (already pinned in
> `package.json`). Versions `3.x` currently break native builds on SDK 54+
> — this is a known upstream issue, not something in this project's code.

## Project structure

```
App.js                        # Redux <Provider> + entry point
src/
  api/userApi.js              # fetch + address transformation, real server pagination (_page/_limit)
  utils/storage.js             # AsyncStorage wrapper (offline cache)
  store/
    store.js                  # configureStore
    usersSlice.js             # async thunk, cache fallback, memoized search selector
  components/
    UserCard.js               # memoized, reusable card (name/email/address)
    SearchBar.js               # debounced search input
    ListFooter.js              # Load More button / loading / end-of-list states
  screens/
    UserListScreen.js         # wires Redux to FlatList + all optimizations
```

## How each requirement is implemented

**Redux state management** — `usersSlice.js` holds the accumulated user
list, current page, `hasMore`, search query, and request status. A single
`createAsyncThunk` (`fetchUsers`) handles both the first load and "Load
More" via an `{ initial }` flag.

**API integration** — `userApi.js` calls jsonplaceholder with real
`_page`/`_limit` query params (json-server, which powers jsonplaceholder,
supports this natively) and reads the `x-total-count` response header to
know precisely when there's no more data, rather than guessing.

**Offline support** — On every successful fetch, the full accumulated list
is written to AsyncStorage (`storage.saveUsers`). If a fetch fails (e.g. no
network), the thunk falls back to whatever was last cached instead of
showing an error screen, and the UI shows an "Offline — showing cached
data" banner.

**FlatList optimization**
- `getItemLayout` — card height is fixed (`CARD_HEIGHT`), so FlatList never
  measures rows on the fly.
- `keyExtractor` / `renderItem` are wrapped in `useCallback` so they're
  referentially stable across re-renders.
- `UserCard` is wrapped in `React.memo` with a custom comparator, so typing
  in the search box doesn't re-render every row that didn't change.
- Tuned `initialNumToRender`, `maxToRenderPerBatch`, `windowSize`,
  `updateCellsBatchingPeriod`, and `removeClippedSubviews` for smoother
  scrolling on larger lists.
- Filtering is done through a memoized `createSelector` (`selectFilteredUsers`)
  so it's only recomputed when the user list or search query actually
  changes.

**UserCard** — Pure, reusable, memoized component taking `name`, `email`,
`address` as props. No Redux or API knowledge inside it.

**Search bar** — `SearchBar.js` debounces local input (250ms) before
dispatching to Redux, avoiding a re-filter/re-render on every keystroke.

**Pagination ("Load More")** — `PAGE_SIZE = 5` in `userApi.js`. The
`ListFooter` shows a "Load More" button (also auto-triggered by
`onEndReached` when scrolling near the bottom), a spinner while the next
page loads, and an end-of-list message once `hasMore` is `false`.
jsonplaceholder only has 10 users total, so with `PAGE_SIZE = 5` you'll see
exactly one "Load More" tap before reaching the end — bump `PAGE_SIZE` down
(e.g. to 3) if you want to demo more pages.

**Data transformation** — `transformAddress()` in `userApi.js` combines
`address.street`, `address.city`, and `address.zipcode` into a single
`"street, city, zipcode"` string at the API layer, before it ever reaches
Redux or the UI.

## Notes / possible extensions

- Add `NetInfo` (`@react-native-community/netinfo`) to detect connectivity
  proactively instead of only reacting to a failed fetch.
- Add a `debounce` from `lodash` instead of the manual `setTimeout` in
  `SearchBar` if you're already pulling in lodash elsewhere.
- Persist Redux state with `redux-persist` instead of the manual
  AsyncStorage calls in `usersSlice.js` if the app grows more slices.
