import React from 'react';
import { Accordion, Button, Form, Row, Modal } from 'react-bootstrap';
import { jobService } from '../../services/job.service';
import './CompareHireRequestApplications.css';
import Submit from '../Submit/Submit';
import RequestToHireDetail from '../RequestToHire/RequestToHireDetail';
import HireRequestApplication from '../HireRequestApplication/HireRequestApplication';
import { commonFormComponents } from '../CommonFormComponents';

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
    const { hireRequest, hireRequestApplication } = this.state;
    if (hireRequestApplication) {
      this.setState({ isSubmitting: true });
      jobService
        .chooseHireRequestApplication(
          hireRequest.id, // hire request id
          hireRequestApplication
        )
        .then(
          () => {
            commonFormComponents.setRedrawSuccess(
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
    } else {
      this.setState({ status: 'Please select an application' });
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
        <div>
          <Button
            id={`openCompareHireRequestApplicationsModal-${hireRequest.id}`}
            hire-request={hireRequest.id}
            onClick={() => this.setState({ show: true })}
          >
            View Applications
          </Button>
        </div>
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
                      radio={(id) =>
                        this.setState({ hireRequestApplication: id })
                      }
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
      </>
    );
  }
}

export default CompareHireRequestApplications;
