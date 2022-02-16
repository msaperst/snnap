import React from 'react';

import { Alert, Button, Col, Form, Row, Spinner } from 'react-bootstrap';
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
              {isSubmitting && (
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              )}
              Login
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
              <Alert
                variant="danger"
                dismissible
                onClose={() => this.setState({ status: null })}
              >
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
