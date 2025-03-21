import { View, Pressable, StyleSheet, Alert } from "react-native";
import { format } from "date-fns";
import { useNavigate } from "react-router-native";
import { useMutation } from "@apollo/client";

import useCurrentUser from "../hooks/useCurrentUser";
import Text from "./Text";
import { DELETE_REVIEW } from "../graphql/mutations";
import theme, { formStyles } from "../theme";

const styles = StyleSheet.create({
  reviewContainer: {
    display: "flex",
    flexDirection: "row",
    padding: 15,
  },
  reviewRating: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  reviewTextContainer: {
    display: "flex",
    flexDirection: "column",
    paddingLeft: 15,
    flexShrink: 1,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingBottom: 15,
  },
  repoButton: {
    ...formStyles.button,
    width: "45%",
  },
  deleteButton: {
    ...formStyles.button,
    backgroundColor: theme.colors.error,
    width: "45%",
  },
});

const ReviewItem = ({ review, myReviews }) => {
  const navigate = useNavigate();
  const [deleteReview] = useMutation(DELETE_REVIEW);
  const { refetch } = useCurrentUser(true);

  const confirmDelete = () => {
    Alert.alert(
      "Delete review",
      "Are you sure you want to delete this review?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            await deleteReview({
              variables: { reviewId: review.id },
            });
            refetch();
          },
        },
      ]
    );
  };

  return (
    <View style={{ backgroundColor: theme.colors.listItemBackground }}>
      <View style={styles.reviewContainer}>
        <View style={styles.reviewRating}>
          <Text color="primary" fontWeight="bold" fontSize="subheading">
            {review.rating}
          </Text>
        </View>
        <View style={styles.reviewTextContainer}>
          <Text fontWeight="bold" fontSize={"subheading"}>
            {review.user.username}
          </Text>
          <Text color="textSecondary">
            {format(new Date(review.createdAt), "dd.MM.yyyy")}
          </Text>
          <Text>{review.text}</Text>
        </View>
      </View>

      {myReviews && (
        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.repoButton}
            onPress={() => navigate(`/${review.repositoryId}`)}
          >
            <Text color="appBarHeading" fontWeight="bold" fontSize="subheading">
              View repository
            </Text>
          </Pressable>
          <Pressable style={styles.deleteButton} onPress={confirmDelete}>
            <Text color="appBarHeading" fontWeight="bold" fontSize="subheading">
              Delete review
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default ReviewItem;
