import React, { useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  setSearchQuery,
  selectFilteredUsers,
  selectSearchQuery,
  selectStatus,
  selectHasMore,
  selectIsOffline,
  selectError,
} from "../store/usersSlice";
import { UserCard, CARD_HEIGHT } from "../components/UserCard";
import { SearchBar } from "../components/SearchBar";
import { ListFooter } from "../components/ListFooter";

export default function UserListScreen() {
  const dispatch = useDispatch();

  const users = useSelector(selectFilteredUsers);
  const searchQuery = useSelector(selectSearchQuery);
  const status = useSelector(selectStatus);
  const hasMore = useSelector(selectHasMore);
  const isOffline = useSelector(selectIsOffline);
  const error = useSelector(selectError);

  useEffect(() => {
    dispatch(fetchUsers({ initial: true }));
  }, [dispatch]);

  const handleLoadMore = useCallback(() => {
    if (status !== "loadingMore" && hasMore) {
      dispatch(fetchUsers({ initial: false }));
    }
  }, [dispatch, status, hasMore]);

  const handleRefresh = useCallback(() => {
    dispatch(fetchUsers({ initial: true }));
  }, [dispatch]);

  const handleSearchChange = useCallback(
    (text) => {
      dispatch(setSearchQuery(text));
    },
    [dispatch]
  );

  const renderItem = useCallback(
    ({ item }) => <UserCard name={item.name} email={item.email} address={item.address} />,
    []
  );

  const keyExtractor = useCallback((item) => String(item.id), []);


  const getItemLayout = useCallback(
    (_, index) => ({
      length: CARD_HEIGHT,
      offset: CARD_HEIGHT * index,
      index,
    }),
    []
  );

  const isInitialLoading = status === "loading" && users.length === 0;
  const isLoadingMore = status === "loadingMore";
  const isSearching = searchQuery.trim().length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Users</Text>
        {isOffline && (
          <View style={styles.offlineBanner}>
            <Text style={styles.offlineText}>Offline — showing cached data</Text>
          </View>
        )}
      </View>

      <SearchBar value={searchQuery} onChangeText={handleSearchChange} />

      {isInitialLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      ) : status === "failed" && users.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>Failed to load users.</Text>
          <Text style={styles.errorSubText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          getItemLayout={getItemLayout}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={7}
          updateCellsBatchingPeriod={50}
          removeClippedSubviews={true}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            <ListFooter
              hasMore={hasMore}
              isLoadingMore={isLoadingMore}
              isSearching={isSearching}
              onLoadMore={handleLoadMore}
            />
          }
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.emptyText}>No users found.</Text>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={handleRefresh} tintColor="#4F46E5" />
          }
          contentContainerStyle={users.length === 0 ? styles.emptyContainer : styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },
  offlineBanner: {
    marginTop: 6,
    backgroundColor: "#FEF3C7",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
  },
  offlineText: {
    color: "#92400E",
    fontSize: 12,
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#DC2626",
  },
  errorSubText: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
});
