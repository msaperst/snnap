import React from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

import { Alert, Button } from 'react-bootstrap';
import { authenticationService } from '../../services/authentication.service';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    // redirect to Home if already logged in
    if (authenticationService.currentUserValue) {
      const { history } = this.props;
      history.push('/');
    }
  }

  render() {
    return (
      <div>
        <h2>Register</h2>
        <Formik
          initialValues={{
            name: '',
            username: '',
            email: '',
            password: '',
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required('Name is required'),
            username: Yup.string().required('Username is required'),
            email: Yup.string()
              .required('Email is required')
              .email('Email is not valid'),
            password: Yup.string().required('Password is required'),
          })}
          onSubmit={(
            { name, username, email, password },
            { setStatus, setSubmitting }
          ) => {
            setStatus();
            authenticationService
              .register(name, username, email, password)
              .then(
                () => {
                  const { location, history } = this.props;
                  const { from } = location.state || {
                    from: { pathname: '/' },
                  };
                  history.push(from);
                },
                (error) => {
                  setSubmitting(false);
                  setStatus(error);
                }
              );
          }}
        >
          {({ errors, status, touched, isSubmitting }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <Field
                  id="name"
                  name="name"
                  type="text"
                  className={`form-control${
                    errors.name && touched.name ? ' is-invalid' : ''
                  }`}
                />
                <ErrorMessage
                  id="name-error"
                  name="name"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <Field
                  id="username"
                  name="username"
                  type="text"
                  className={`form-control${
                    errors.username && touched.username ? ' is-invalid' : ''
                  }`}
                />
                <ErrorMessage
                  id="username-error"
                  name="username"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  className={`form-control${
                    errors.email && touched.email ? ' is-invalid' : ''
                  }`}
                />
                <ErrorMessage
                  id="email-error"
                  name="email"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  className={`form-control${
                    errors.password && touched.password ? ' is-invalid' : ''
                  }`}
                />
                <ErrorMessage
                  id="password-error"
                  name="password"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
              <div className="form-group">
                <Button
                  id="registerButton"
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                >
                  Register
                </Button>
                {isSubmitting && (
                  <img
                    alt="loading"
                    src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="
                  />
                )}
              </div>
              {status && (
                <Alert variant="danger" dismissible>
                  {status}
                </Alert>
              )}
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}

export default LoginPage;
