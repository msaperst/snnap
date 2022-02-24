import React from 'react';
import { Alert, Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import { authenticationService } from '../../services/authentication.service';
import SnnapFormInput from '../../components/SnnapForms/SnnapFormInput';

class RegisterPage extends React.Component {
  constructor(props) {
    super(props);

    // redirect to Home if already logged in
    if (authenticationService.currentUserValue) {
      const { history } = this.props;
      history.push('/');
    }

    // otherwise, set up our variables
    this.state = {
      validated: false,
      isSubmitting: false,
      status: null,
      formData: {},
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateForm = this.updateForm.bind(this);
  }

  handleSubmit(event) {
    const { formData } = this.state;
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    if (form.checkValidity() === true) {
      this.setState({ isSubmitting: true });
      authenticationService
        .register(
          formData['First name'],
          formData['Last name'],
          formData.Username,
          formData.Email,
          formData['Phone number'],
          formData.Password,
          formData.City,
          formData.State,
          formData.Zip
        )
        .then(
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

  updateForm(key, value) {
    const { formData } = this.state;
    formData[key] = value;
    this.setState({ formData });
  }

  render() {
    const { isSubmitting, status } = this.state;
    const { validated } = this.state;
    return (
      <Form noValidate validated={validated} onSubmit={this.handleSubmit}>
        <h2>Register</h2>
        <Row className="mb-3">
          <SnnapFormInput
            size={4}
            name="First name"
            onChange={this.updateForm}
          />
          <SnnapFormInput
            size={4}
            name="Last name"
            onChange={this.updateForm}
          />
          <SnnapFormInput
            size={4}
            name="Username"
            before="@"
            onChange={this.updateForm}
          />
        </Row>
        <Row className="mb-3">
          <SnnapFormInput
            size={4}
            name="Email"
            type="email"
            onChange={this.updateForm}
          />
          <SnnapFormInput
            size={4}
            name="Phone number"
            type="tel"
            onChange={this.updateForm}
          />
          <SnnapFormInput
            size={4}
            name="Password"
            type="password"
            onChange={this.updateForm}
          />
        </Row>
        <Row className="mb-3">
          <SnnapFormInput size={6} name="City" onChange={this.updateForm} />
          <SnnapFormInput size={3} name="State" onChange={this.updateForm} />
          <SnnapFormInput size={3} name="Zip" onChange={this.updateForm} />
        </Row>
        <Form.Group className="mb-3">
          <Form.Check
            required
            id="agreeToTerms"
            label="Agree to terms and conditions"
            feedback="You must agree before submitting."
            feedbackType="invalid"
          />
        </Form.Group>
        <Row className="mb-3">
          <Form.Group as={Col} md={1}>
            <Button
              id="registerButton"
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
              Register
            </Button>
          </Form.Group>
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

export default RegisterPage;
