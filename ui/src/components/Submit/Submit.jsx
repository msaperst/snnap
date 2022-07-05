import { Alert, Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import React from 'react';

function Submit(props) {
  const {
    buttonText,
    isSubmitting,
    error,
    updateError,
    success,
    updateSuccess,
  } = props;

  const buttonId = buttonText
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    )
    .replace(/\s+/g, '');

  return (
    <Row className="mb-3">
      <Form.Group as={Col}>
        <Button
          id={`${buttonId}Button`}
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
          {buttonText}
        </Button>
      </Form.Group>
      <Col>
        {error && (
          <Alert variant="danger" dismissible onClose={() => updateError(null)}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert
            variant="success"
            dismissible
            onClose={() => updateSuccess(null)}
          >
            {success}
          </Alert>
        )}
      </Col>
    </Row>
  );
}

export default Submit;
