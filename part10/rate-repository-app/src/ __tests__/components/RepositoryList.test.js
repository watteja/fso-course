import { render, screen, within } from "@testing-library/react-native";
import { RepositoryListContainer } from "../../components/RepositoryList";

describe("RepositoryList", () => {
  describe("RepositoryListContainer", () => {
    it("renders repository information correctly", () => {
      const repositories = {
        totalCount: 8,
        pageInfo: {
          hasNextPage: true,
          endCursor:
            "WyJhc3luYy1saWJyYXJ5LnJlYWN0LWFzeW5jIiwxNTg4NjU2NzUwMDc2XQ==",
          startCursor: "WyJqYXJlZHBhbG1lci5mb3JtaWsiLDE1ODg2NjAzNTAwNzZd",
        },
        edges: [
          {
            node: {
              id: "jaredpalmer.formik",
              fullName: "jaredpalmer/formik",
              description: "Build forms in React, without the tears",
              language: "TypeScript",
              forksCount: 1619,
              stargazersCount: 21856,
              ratingAverage: 88,
              reviewCount: 3,
              ownerAvatarUrl:
                "https://avatars2.githubusercontent.com/u/4060187?v=4",
            },
            cursor: "WyJqYXJlZHBhbG1lci5mb3JtaWsiLDE1ODg2NjAzNTAwNzZd",
          },
          {
            node: {
              id: "async-library.react-async",
              fullName: "async-library/react-async",
              description: "Flexible promise-based React data loader",
              language: "JavaScript",
              forksCount: 69,
              stargazersCount: 1760,
              ratingAverage: 72,
              reviewCount: 3,
              ownerAvatarUrl:
                "https://avatars1.githubusercontent.com/u/54310907?v=4",
            },
            cursor:
              "WyJhc3luYy1saWJyYXJ5LnJlYWN0LWFzeW5jIiwxNTg4NjU2NzUwMDc2XQ==",
          },
        ],
      };

      render(<RepositoryListContainer repositories={repositories} />);

      // screen.debug();

      const repositoryItems = screen.getAllByTestId("repositoryItem");
      const [firstRepositoryItem, secondRepositoryItem] = repositoryItems;

      const firstWithin = within(firstRepositoryItem);
      const secondWithin = within(secondRepositoryItem);

      expect(firstWithin.getByText("jaredpalmer/formik")).toBeDefined();
      expect(
        firstWithin.getByText("Build forms in React, without the tears")
      ).toBeDefined();
      expect(firstWithin.getByText("TypeScript")).toBeDefined();
      expect(firstWithin.getByText("1.6k")).toBeDefined();
      expect(firstWithin.getByText("21.9k")).toBeDefined();
      expect(firstWithin.getByText("88")).toBeDefined();
      expect(firstWithin.getByText("3")).toBeDefined();

      expect(secondWithin.getByText("async-library/react-async")).toBeDefined();
      expect(
        secondWithin.getByText("Flexible promise-based React data loader")
      ).toBeDefined();
      expect(secondWithin.getByText("JavaScript")).toBeDefined();
      expect(secondWithin.getByText("69")).toBeDefined();
      expect(secondWithin.getByText("1.8k")).toBeDefined();
      expect(secondWithin.getByText("72")).toBeDefined();
      expect(secondWithin.getByText("3")).toBeDefined();
    });
  });
});
