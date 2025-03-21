import { useQuery } from "@apollo/client";

import { GET_CURRENT_USER } from "../graphql/queries";

const useCurrentUser = (includeReviews = false) => {
  const { data, refetch } = useQuery(GET_CURRENT_USER, {
    variables: { includeReviews },
    fetchPolicy: "cache-and-network",
  });

  return { currentUser: data?.me, refetch };
};

export default useCurrentUser;
