import React from 'react';
import { Accordion, Button, Form, Row, Modal } from 'react-bootstrap';
import { jobService } from '../../services/job.service';
import './CompareHireRequestApplications.css';
import Submit from '../Submit/Submit';
import RequestToHireDetail from '../RequestToHire/RequestToHireDetail';
import HireRequestApplication from '../HireRequestApplication/HireRequestApplication';
import { common } from '../UserProfile/Common';

class CompareHireRequestApplications extends React.Component {
  constructor(props) {
    super(props);

    const { hireRequest } = this.props;
    this.state = {
      hireRequest,
      hireRequestApplications: [],
      hireRequestApplication: null,
      show: false,
      status: null,
      update: null,
      validated: false,
      isSubmitting: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { hireRequest } = this.state;
    jobService.getHireRequest(hireRequest.id).then((hr) => {
      this.setState({ hireRequest: hr });
    });
    jobService.getHireRequestApplications(hireRequest.id).then((hra) => {
      this.setState({ hireRequestApplications: hra });
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const form = document.querySelector('#compareHireRequestApplicationsForm');
    if (form.checkValidity() === true) {
      const { hireRequest, hireRequestApplication } = this.state;
      this.setState({ isSubmitting: true });
      jobService
        .chooseHireRequestApplication(
          hireRequest.id, // hire request id
          hireRequestApplication
        )
        .then(
          () => {
            common.setRedrawSuccess(
              (state) => this.setState(state),
              'Hire Request Application Chosen'
            );
          },
          (error) => {
            this.setState({
              isSubmitting: false,
              status: error.toString(),
              update: null,
            });
          }
        );
    }
    this.setState({ validated: true });
  }

  render() {
    const {
      hireRequest,
      hireRequestApplications,
      show,
      status,
      update,
      validated,
      isSubmitting,
    } = this.state;
    return (
      <>
        <Button
          id={`openCompareHireRequestApplicationsModal-${hireRequest.id}`}
          hire-request={hireRequest.id}
          onClick={() => this.setState({ show: true })}
        >
          View Applications
        </Button>
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div // adding in this div due to issue https://github.com/react-bootstrap/react-bootstrap/issues/3105
          onKeyDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          onFocus={(e) => e.stopPropagation()}
          onMouseOver={(e) => e.stopPropagation()}
        >
          <Modal
            size="lg"
            show={show}
            onHide={() => this.setState({ show: false })}
            data-testid={`compareHireRequestApplicationsModal-${hireRequest.id}`}
          >
            <Modal.Header closeButton>
              <Modal.Title>
                Applications for the {hireRequest.type} Session
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="show-grid">
              <Form
                id="compareHireRequestApplicationsForm"
                noValidate
                validated={validated}
                onSubmit={this.handleSubmit}
              >
                <RequestToHireDetail hireRequest={hireRequest} />
                <Row className="mb-3">
                  <Accordion>
                    {hireRequestApplications.map((hireRequestApplication) => (
                      <HireRequestApplication
                        key={hireRequestApplication.id}
                        hireRequestApplication={hireRequestApplication}
                      />
                    ))}
                  </Accordion>
                </Row>
                <Submit
                  buttonText="Select Request To Hire Application"
                  isSubmitting={isSubmitting}
                  error={status}
                  updateError={() => this.setState({ status: null })}
                  success={update}
                  updateSuccess={() => this.setState({ update: null })}
                />
              </Form>
            </Modal.Body>
          </Modal>
        </div>
      </>
    );
  }
}

export default CompareHireRequestApplications;
