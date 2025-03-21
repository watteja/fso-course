import React, { useState } from "react";
import { FlatList, View, StyleSheet, Pressable } from "react-native";
import { useNavigate } from "react-router-native";
import { Picker } from "@react-native-picker/picker";
import { Searchbar } from "react-native-paper";
import { useDebounce } from "use-debounce";

import RepositoryItem from "./RepositoryItem";
import useRepositories from "../hooks/useRepositories";

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
});

// These should be enums, but alas I'm not using TypeScript
const OrderBy = {
  CREATED_AT: "CREATED_AT",
  RATING_AVERAGE: "RATING_AVERAGE",
};

const OrderDir = {
  ASC: "ASC",
  DESC: "DESC",
};

const OrderPrinciple = {
  latest: {
    orderBy: OrderBy.CREATED_AT,
    orderDirection: OrderDir.DESC,
  },
  highest: {
    orderBy: OrderBy.RATING_AVERAGE,
    orderDirection: OrderDir.DESC,
  },
  lowest: {
    orderBy: OrderBy.RATING_AVERAGE,
    orderDirection: OrderDir.ASC,
  },
};

const ItemSeparator = () => <View style={styles.separator} />;

const RepositoryListHeader = ({ onChangeParams }) => {
  const [pickerValue, setPickerValue] = useState("latest");
  const [searchKeyword, setSearchKeyword] = useState("");

  return (
    <>
      <Searchbar
        value={searchKeyword}
        placeholder="Search repositories"
        onChangeText={(text) => {
          setSearchKeyword(text);
          onChangeParams(OrderPrinciple[pickerValue], text);
        }}
        mode="view"
        style={{ margin: 10 }}
      />
      <Picker
        selectedValue={pickerValue}
        onValueChange={(itemValue) => {
          setPickerValue(itemValue);
          onChangeParams(OrderPrinciple[itemValue], searchKeyword);
        }}
      >
        <Picker.Item label="Latest repositories" value="latest" />
        <Picker.Item label="Highest rated repositories" value="highest" />
        <Picker.Item label="Lowest rated repositories" value="lowest" />
      </Picker>
    </>
  );
};

export class RepositoryListContainer extends React.Component {
  renderHeader = () => {
    return <RepositoryListHeader onChangeParams={this.props.onChangeParams} />;
  };

  render() {
    // Get the nodes from the edges array (has to happen inside the render method to refresh)
    const repositoryNodes = this.props.repositories
      ? this.props.repositories.edges.map((edge) => edge.node)
      : [];

    return (
      <FlatList
        data={repositoryNodes}
        ItemSeparatorComponent={ItemSeparator}
        renderItem={({ item }) => (
          <Pressable onPress={() => this.props.navigate(`/${item.id}`)}>
            <RepositoryItem repository={item} />
          </Pressable>
        )}
        ListHeaderComponent={this.renderHeader}
        keyExtractor={(item) => item.id}
        onEndReached={this.props.onEndReach}
        onEndReachedThreshold={0.5}
      />
    );
  }
}

const RepositoryList = () => {
  const [orderPrinciple, setOrderPrinciple] = useState(OrderPrinciple.latest);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedKeyword] = useDebounce(searchKeyword, 500);
  const { repositories, fetchMore } = useRepositories(
    orderPrinciple,
    debouncedKeyword,
    8 // default 'first' value
  );
  const navigate = useNavigate();

  const handleChangeParams = (newOrderPrinciple, newSearchKeyword) => {
    setOrderPrinciple(newOrderPrinciple);
    setSearchKeyword(newSearchKeyword);
  };

  const onEndReach = () => {
    fetchMore();
  };

  // extracted "pure" component for easier testing, as advised by the materials
  return (
    <RepositoryListContainer
      repositories={repositories}
      onEndReach={onEndReach}
      onChangeParams={handleChangeParams}
      navigate={navigate}
    />
  );
};

export default RepositoryList;
