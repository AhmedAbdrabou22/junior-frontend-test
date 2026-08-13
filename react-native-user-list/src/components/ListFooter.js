import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";

export function ListFooter({ hasMore, isLoadingMore, isSearching, onLoadMore }) {

  if (isSearching) return null;

  if (isLoadingMore) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color="#4F46E5" />
      </View>
    );
  }

  if (!hasMore) {
    return (
      <View style={styles.container}>
        <Text style={styles.endText}>You've reached the end of the list</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onLoadMore} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Load More</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#4F46E5",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 15,
  },
  endText: {
    color: "#9CA3AF",
    fontSize: 13,
  },
});
