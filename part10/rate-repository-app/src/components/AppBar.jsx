import { View, StyleSheet, ScrollView } from "react-native";
import Constants from "expo-constants";

import AppBarTab from "./AppBarTab";
import useCurrentUser from "../hooks/useCurrentUser";
import theme from "../theme";

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: theme.colors.appBarBackground,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});

const AppBar = () => {
  const { currentUser } = useCurrentUser(); // query is re-executed when resetStore in AppBarTab is called

  return (
    <View style={styles.container}>
      <ScrollView key={currentUser ? "signedIn" : "signedOut"} horizontal>
        <AppBarTab text="Repositories" />
        {currentUser ? (
          <>
            <AppBarTab text="Create a review" />
            <AppBarTab text="My reviews" />
            <AppBarTab text="Sign out" />
          </>
        ) : (
          <>
            <AppBarTab text="Sign in" />
            <AppBarTab text="Sign up" />
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default AppBar;
