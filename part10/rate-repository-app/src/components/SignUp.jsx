import { TextInput, Pressable, View, StyleSheet } from "react-native";
import { useNavigate } from "react-router-native";
import { useMutation } from "@apollo/client";
import { useFormik } from "formik";
import * as yup from "yup";

import { CREATE_USER } from "../graphql/mutations";
import useSignIn from "../hooks/useSignIn";
import Text from "./Text";
import { formStyles } from "../theme";

const styles = StyleSheet.create(formStyles);

const validationSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Password confirmation is required"),
});

const initialValues = {
  username: "",
  password: "",
  passwordConfirm: "",
};

const SignUpForm = ({ onSubmit }) => {
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
      <View>
        <TextInput
          style={[
            styles.input,
            formik.touched.passwordConfirm &&
              formik.errors.passwordConfirm &&
              styles.inputError,
          ]}
          onChangeText={formik.handleChange("passwordConfirm")}
          value={formik.values.passwordConfirm}
          placeholder="Password confirmation"
          secureTextEntry
        />
        {formik.touched.passwordConfirm && formik.errors.passwordConfirm && (
          <Text color="textError" style={{ marginTop: 5, marginBottom: 5 }}>
            {formik.errors.passwordConfirm}
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
          Sign up
        </Text>
      </Pressable>
    </View>
  );
};

const SignUp = () => {
  const [createUser] = useMutation(CREATE_USER);
  const [signIn] = useSignIn();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    const { username, password } = values;

    try {
      await createUser({
        variables: {
          user: {
            username,
            password,
          },
        },
      });

      // Sign in registered user
      await signIn({ username, password });

      navigate("/");
    } catch (e) {
      console.error(e);
    }
  };

  return <SignUpForm onSubmit={onSubmit} />;
};

export default SignUp;
