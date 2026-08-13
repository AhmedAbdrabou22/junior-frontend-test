import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const CARD_HEIGHT = 92; // fixed height -> enables FlatList getItemLayout optimization

function UserCardComponent({ name, email, address }) {
  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.email} numberOfLines={1}>
          {email}
        </Text>
        <Text style={styles.address} numberOfLines={1}>
          {address}
        </Text>
      </View>
    </View>
  );
}

function areEqual(prevProps, nextProps) {
  return (
    prevProps.name === nextProps.name &&
    prevProps.email === nextProps.email &&
    prevProps.address === nextProps.address
  );
}

export const UserCard = React.memo(UserCardComponent, areEqual);

const styles = StyleSheet.create({
  card: {
    height: CARD_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  email: {
    fontSize: 13,
    color: "#4F46E5",
    marginTop: 2,
  },
  address: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
});
