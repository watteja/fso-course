import { Platform } from "react-native";

const theme = {
  colors: {
    textPrimary: "#24292e",
    textSecondary: "#586069",
    primary: "#0366d6",
    appBarBackground: "#24292e",
    appBarHeading: "white",
    mainBackground: "#e1e4e8",
    listItemBackground: "white",
    error: "#d73a4a",
  },
  fontSizes: {
    body: 14,
    subheading: 16,
    heading: 18,
  },
  fonts: {
    main: Platform.select({
      android: "Roboto",
      ios: "Arial",
      default: "System",
    }),
  },
  fontWeights: {
    normal: "400",
    bold: "700",
  },
};

export const formStyles = {
  container: {
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    justifyContent: "space-between",
    backgroundColor: theme.colors.listItemBackground,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.textSecondary,
    borderRadius: 5,
    padding: 10,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 5,
    textAlign: "center",
    alignItems: "center",
  },
};

export default theme;
