import { TextInput, Pressable, View, StyleSheet } from "react-native";
import { useNavigate } from "react-router-native";
import { useFormik } from "formik";
import * as yup from "yup";

import useSignIn from "../hooks/useSignIn";
import Text from "./Text";
import { formStyles } from "../theme";

const styles = StyleSheet.create(formStyles);

const validationSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

const initialValues = {
  username: "",
  password: "",
};

export const SignInForm = ({ onSubmit }) => {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <View style={styles.container}>
      <View>
        <TextInput
          style={[
            styles.input,
            formik.touched.username &&
              formik.errors.username &&
              styles.inputError,
          ]}
          onChangeText={formik.handleChange("username")}
          value={formik.values.username}
          placeholder="Username"
        />
        {formik.touched.username && formik.errors.username && (
          <Text color="textError" style={{ marginTop: 5, marginBottom: 5 }}>
            {formik.errors.username}
          </Text>
        )}
      </View>
      <View>
        <TextInput
          style={[
            styles.input,
            formik.touched.password &&
              formik.errors.password &&
              styles.inputError,
          ]}
          onChangeText={formik.handleChange("password")}
          value={formik.values.password}
          placeholder="Password"
          secureTextEntry
        />
        {formik.touched.password && formik.errors.password && (
          <Text color="textError" style={{ marginTop: 5, marginBottom: 5 }}>
            {formik.errors.password}
          </Text>
        )}
      </View>
      <Pressable onPress={formik.handleSubmit}>
        <Text
          color="appBarHeading"
          fontWeight="bold"
          fontSize="subheading"
          style={styles.button}
        >
          Sign in
        </Text>
      </Pressable>
    </View>
  );
};

const SignIn = () => {
  const [signIn] = useSignIn();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    const { username, password } = values;

    try {
      await signIn({ username, password });
      navigate("/");
    } catch (e) {
      console.error(e);
    }
  };

  return <SignInForm onSubmit={onSubmit} />;
};

export default SignIn;
