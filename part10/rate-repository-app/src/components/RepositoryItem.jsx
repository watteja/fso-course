import { View, Image, StyleSheet, Pressable } from "react-native";
import { openURL } from "expo-linking";
import Text from "./Text";
import theme from "../theme";

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.listItemBackground,
    padding: 10,
  },
});

const RepositoryItem = ({ repository, singleRepository = false }) => {
  return (
    <View testID="repositoryItem" style={styles.container}>
      <RepositoryHeader repository={repository} />
      <RepositoryStats repository={repository} />
      {singleRepository && <RepositoryButton repository={repository} />}
    </View>
  );
};

const headerStyles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  textContainer: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    flexShrink: 1,
    paddingLeft: 10,
    gap: 5,
  },
  language: {
    backgroundColor: theme.colors.primary,
    color: "white",
    padding: 5,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
});

const RepositoryHeader = ({ repository }) => {
  return (
    <View style={headerStyles.container}>
      <Image
        style={headerStyles.image}
        source={{ uri: repository.ownerAvatarUrl }}
      />
      <View style={headerStyles.textContainer}>
        <Text fontWeight="bold" fontSize="heading">
          {repository.fullName}
        </Text>
        <Text color="textSecondary" fontSize="subheading">
          {repository.description}
        </Text>
        <Text style={headerStyles.language}>{repository.language}</Text>
      </View>
    </View>
  );
};

const statsStyles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 10,
  },
});

const RepositoryStats = ({ repository }) => {
  // If number is over 1000, convert it to k notation
  const kNotation = (number) => {
    return number > 1000 ? `${(number / 1000).toFixed(1)}k` : number;
  };

  return (
    <View style={statsStyles.container}>
      <StatItem value={kNotation(repository.stargazersCount)} label="Stars" />
      <StatItem value={kNotation(repository.forksCount)} label="Forks" />
      <StatItem value={repository.reviewCount} label="Reviews" />
      <StatItem value={repository.ratingAverage} label="Rating" />
    </View>
  );
};

const statItemStyles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    gap: 5,
  },
});

const StatItem = ({ value, label }) => {
  return (
    <View style={statItemStyles.container}>
      <Text fontWeight="bold" fontSize="subheading">
        {value}
      </Text>
      <Text color="textSecondary">{label}</Text>
    </View>
  );
};

const buttonStyles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primary,
    padding: 10,
    borderRadius: 5,
    display: "flex",
    alignItems: "center",
    marginTop: 10,
  },
  text: {
    color: "white",
  },
});

const RepositoryButton = ({ repository }) => {
  return (
    <Pressable
      style={buttonStyles.container}
      onPress={() => openURL(repository.url)}
    >
      <Text style={buttonStyles.text}>Open in GitHub</Text>
    </Pressable>
  );
};

export default RepositoryItem;
