import React from "react";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { store } from "./src/store/store";
import UserListScreen from "./src/screens/UserListScreen";

export default function App() {
  return (
    <Provider store={store}>
      <StatusBar style="dark" />
      <UserListScreen />
    </Provider>
  );
}
