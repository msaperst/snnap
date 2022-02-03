import React from 'react';

import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import { authenticationService } from '../../services/authentication.service';
import SnnapFormInput from '../../components/SnnapForm/SnnapFormInput';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    // redirect to home if already logged in
    if (authenticationService.currentUserValue) {
      const { history } = this.props;
      history.push('/');
    }

    // otherwise, set up our variables
    this.state = {
      validated: false,
      isSubmitting: false,
      status: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    if (form.checkValidity() === true) {
      this.setState({ isSubmitting: true });
      const data = event.target;
      authenticationService.login(data[0].value, data[1].value).then(
        () => {
          const { location, history } = this.props;
          const { from } = location.state || {
            from: { pathname: '/' },
          };
          history.push(from);
        },
        (error) => {
          this.setState({ isSubmitting: false, status: error });
        }
      );
    }

    this.setState({ validated: true });
  }

  render() {
    const { isSubmitting, status } = this.state;
    const { validated } = this.state;
    return (
      <Form noValidate validated={validated} onSubmit={this.handleSubmit}>
        <h2>Login</h2>
        <Row className="mb-3">
          <SnnapFormInput size={6} name="Username" />
          <SnnapFormInput size={6} name="Password" type="password" />
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col}>
            <Button
              id="loginButton"
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              Login
              {isSubmitting && (
                <img
                  alt="loading"
                  src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="
                />
              )}
            </Button>
          </Form.Group>
          <Col>
            <Button
              id="forgotPasswordButton"
              type="button"
              variant="primary"
              href="/passwordReset"
            >
              Forgot Password
            </Button>
          </Col>
          <Col>
            <Button
              id="registerButton"
              type="button"
              variant="primary"
              href="/register"
            >
              Register
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            {status && (
              <Alert variant="danger" dismissible>
                {status}
              </Alert>
            )}
          </Col>
        </Row>
      </Form>
    );
  }
}

export default LoginPage;
