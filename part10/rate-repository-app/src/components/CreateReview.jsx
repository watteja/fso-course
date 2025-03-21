import { TextInput, Pressable, View } from "react-native";
import { useNavigate } from "react-router-native";
import { useMutation } from "@apollo/client";
import { useFormik } from "formik";
import * as yup from "yup";

import { CREATE_REVIEW } from "../graphql/mutations";
import Text from "./Text";
import { formStyles } from "../theme";

const validationSchema = yup.object().shape({
  ownerName: yup.string().required("Repository owner name is required"),
  repositoryName: yup.string().required("Repository name is required"),
  rating: yup
    .number()
    .required("Rating is required")
    .min(0, "Rating must be between 0 and 100")
    .max(100, "Rating must be between 0 and 100"),
  review: yup.string(),
});

const initialValues = {
  ownerName: "",
  repositoryName: "",
  rating: "",
  review: "",
};

const ReviewForm = ({ onSubmit }) => {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <View style={formStyles.container}>
      <View>
        <TextInput
          style={[
            formStyles.input,
            formik.touched.ownerName &&
              formik.errors.ownerName &&
              formStyles.inputError,
          ]}
          onChangeText={formik.handleChange("ownerName")}
          value={formik.values.ownerName}
          placeholder="Repository owner name"
        />
        {formik.touched.ownerName && formik.errors.ownerName && (
          <Text color="textError" style={{ marginTop: 5, marginBottom: 5 }}>
            {formik.errors.ownerName}
          </Text>
        )}
      </View>
      <View>
        <TextInput
          style={[
            formStyles.input,
            formik.touched.repositoryName &&
              formik.errors.repositoryName &&
              formStyles.inputError,
          ]}
          onChangeText={formik.handleChange("repositoryName")}
          value={formik.values.repositoryName}
          placeholder="Repository name"
        />
        {formik.touched.repositoryName && formik.errors.repositoryName && (
          <Text color="textError" style={{ marginTop: 5, marginBottom: 5 }}>
            {formik.errors.repositoryName}
          </Text>
        )}
      </View>
      <View>
        <TextInput
          style={[
            formStyles.input,
            formik.touched.rating &&
              formik.errors.rating &&
              formStyles.inputError,
          ]}
          onChangeText={formik.handleChange("rating")}
          value={formik.values.rating}
          placeholder="Rating between 0 and 100"
        />
        {formik.touched.rating && formik.errors.rating && (
          <Text color="textError" style={{ marginTop: 5, marginBottom: 5 }}>
            {formik.errors.rating}
          </Text>
        )}
      </View>
      <View>
        <TextInput
          style={formStyles.input}
          onChangeText={formik.handleChange("review")}
          value={formik.values.review}
          placeholder="Review"
          multiline
        />
      </View>
      <Pressable onPress={formik.handleSubmit}>
        <Text
          color="appBarHeading"
          fontWeight="bold"
          fontSize="subheading"
          style={formStyles.button}
        >
          Create a review
        </Text>
      </Pressable>
    </View>
  );
};

const CreateReview = () => {
  const [createReview] = useMutation(CREATE_REVIEW);
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    const { ownerName, repositoryName, rating, review } = values;
    try {
      const { data } = await createReview({
        variables: {
          review: {
            ownerName,
            repositoryName,
            rating: parseInt(rating),
            text: review,
          },
        },
      });
      navigate(`/${data.createReview.repositoryId}`);
    } catch (e) {
      console.error(e);
    }
  };

  return <ReviewForm onSubmit={onSubmit} />;
};

export default CreateReview;
