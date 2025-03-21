import { FlatList, View } from "react-native";
import { useParams } from "react-router-native";

import RepositoryItem from "./RepositoryItem";
import useRepository from "../hooks/useRepository";
import ReviewItem from "./ReviewItem";

const RepositoryInfo = ({ repository }) => {
  return (
    <View style={{ marginBottom: 10 }}>
      <RepositoryItem repository={repository} singleRepository />
    </View>
  );
};

const SingleRepository = () => {
  const { id } = useParams();
  const { repository, fetchMore } = useRepository(id, 4);

  const onEndReach = () => {
    fetchMore();
  };

  return repository ? (
    <FlatList
      data={repository.reviews.edges}
      renderItem={({ item }) => <ReviewItem review={item.node} />}
      keyExtractor={({ node }) => node.id}
      ListHeaderComponent={<RepositoryInfo repository={repository} />}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      onEndReached={onEndReach}
      onEndReachedThreshold={0.5}
    />
  ) : null;
};

export default SingleRepository;
