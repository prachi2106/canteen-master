import axios from "axios";
import { Formik } from "formik";
import { useNavigate } from "react-router";
import * as Yup from "yup";

import "./Signup.css";

const schema = Yup.object().shape({
  email: Yup.string()
    .required("Email is a required field")
    .email("Invalid email format"),
  password: Yup.string()
    .required("Password is a required field")
    .min(8, "Password must be at least 8 characters"),
    firstName: Yup.string()
    .required("This is a required field"),
    lastName: Yup.string()
    .required("This is a required field")
});

const Signup = () => {
  const navigate = useNavigate();
  return (
    <div className="SignupBody">
      <Formik
        validationSchema={schema}
        initialValues={{ email: "", password: "", firstName : "", lastName : "", role :"user", balance : "500" }}
        onSubmit={(values) => {
          axios
            .post("http://localhost:3333/Employees" , values)
            .then((response) => {
              if(response.data){
                sessionStorage.setItem("User" , JSON.stringify(response.data))
                navigate("/home");
              }
            }).catch(error =>{
              
            })
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <div className="Signup">
            <div className="form">
              {/* Passing handleSubmit parameter tohtml form onSubmit property */}
              <form noValidate onSubmit={handleSubmit}>
                <span>Signup</span>
                {/* Our input html with passing formik parameters like handleChange, values, handleBlur to input properties */}
                {/* <input
                  type="text"
                  name="user"
                  value={values.role}
                  onBlur={handleBlur}
                  className="form-control inp_text"
                  id="user"
                  readOnly
                /> */}
                <input
                  type="text"
                  name="firstName"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.firstName}
                  placeholder="Enter first name"
                  className="form-control inp_text"
                  id="firstName"
                />
                <p className="error">
                  {errors.firstName && touched.firstName && errors.firstName}
                </p>
                <input
                  type="text"
                  name="lastName"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.lastName}
                  placeholder="Enter last name"
                  className="form-control inp_text"
                  id="lastName"
                />
                <p className="error">
                  {errors.lastName && touched.lastName && errors.lastName}
                </p>
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  placeholder="Enter email id / username"
                  className="form-control inp_text"
                  id="email"
                />
                {/* If validation is not passed show errors */}
                <p className="error">
                  {errors.email && touched.email && errors.email}
                </p>
                {/* Our input html with passing formik parameters like handleChange, values, handleBlur to input properties */}
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  placeholder="Enter password"
                  className="form-control"
                />
                {/* If validation is not passed show errors */}
                <p className="error">
                  {errors.password && touched.password && errors.password}
                </p>
                {/* Click on submit button to submit the form */}
                <button type="submit">Signup</button>
              </form>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
};

export default Signup;
