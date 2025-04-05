import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextField, Button, Box } from "@mui/material";
import { Oval } from "react-loader-spinner";
import { ClipLoader } from "react-spinners";

// Define Yup validation schema
const validationSchema = Yup.object({
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
});

export function MyForm() {
  // Formik initial values and submit handler
  const initialValues = { email: "", password: "" };

  const handleSubmit = (values) => {
    console.log("Form data:", values);
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ handleChange, handleBlur, values, touched, errors, isValid }) => (
        <Form>
          <Box mb={2}>
            <TextField
              fullWidth
              name="email"
              label="Email"
              variant="outlined"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              name="password"
              label="Password"
              type="password"
              variant="outlined"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
            />
          </Box>
          <Button type="submit" variant="contained" color="primary" disabled={isValid !== true}>
            Submit
            <Oval visible={true} height="24" width="24" color="#4fa94d" ariaLabel="oval-loading" wrapperStyle={{}} wrapperClass="" />
            <ClipLoader color="#36d7b7" loading={true} size={50} />
          </Button>
        </Form>
      )}
    </Formik>
  );
}
