import React, { useEffect, useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";


export function SearchBar({ value, onChangeText, placeholder = "Search users by name..." }) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (localValue !== value) {
        onChangeText(localValue);
      }
    }, 250);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localValue]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={localValue}
        onChangeText={setLocalValue}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="while-editing"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#F9FAFB",
  },
  input: {
    height: 44,
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 15,
    color: "#111827",
  },
});
