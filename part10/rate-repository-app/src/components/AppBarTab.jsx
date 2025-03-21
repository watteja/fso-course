import { StyleSheet, Pressable } from "react-native";
import { useNavigate } from "react-router-native";
import { useApolloClient } from "@apollo/client";

import useAuthStorage from "../hooks/useAuthStorage";
import Text from "./Text";

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 12.5,
  },
});

const AppBarTab = ({ text }) => {
  const authStorage = useAuthStorage();
  const apolloClient = useApolloClient();
  const navigate = useNavigate();

  const handleOnPress = async () => {
    switch (text) {
      case "Sign out":
        await authStorage.removeAccessToken();
        apolloClient.resetStore();
        navigate("/");
        break;
      case "Sign in":
        navigate("/signin");
        break;
      case "Sign up":
        navigate("/signup");
        break;
      case "Create a review":
        navigate("/createreview");
        break;
      case "My reviews":
        navigate("/myreviews");
        break;
      default:
        navigate("/");
    }
  };

  return (
    <Pressable style={styles.container} onPress={handleOnPress}>
      <Text color="appBarHeading" fontWeight="bold" fontSize="subheading">
        {text}
      </Text>
    </Pressable>
  );
};

export default AppBarTab;
