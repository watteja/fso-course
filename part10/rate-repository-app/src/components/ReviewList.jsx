import { FlatList, View } from "react-native";

import useCurrentUser from "../hooks/useCurrentUser";
import ReviewItem from "./ReviewItem";

const MyReviews = () => {
  const { currentUser } = useCurrentUser(true);

  return currentUser ? (
    <FlatList
      data={currentUser.reviews.edges}
      renderItem={({ item }) => <ReviewItem review={item.node} myReviews />}
      keyExtractor={({ node }) => node.id}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
    />
  ) : null;
};

export default MyReviews;
