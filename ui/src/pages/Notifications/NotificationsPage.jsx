import React from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import { authenticationService } from '../../services/authentication.service';
import { userService } from '../../services/user.service';
import Notification from '../../components/Notification/Notification';

class NotificationsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: authenticationService.currentUserValue,
      notifications: [],
    };
  }

  componentDidMount() {
    userService.getNotifications().then((notifications) => {
      this.setState({ notifications });
    });
  }

  render() {
    const { currentUser, notifications } = this.state;
    return (
      <Container className="skinny">
        <Row>
          <Col>
            <h1 className="h2">My Notifications</h1>
          </Col>
        </Row>
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            notification={notification}
            currentUser={currentUser}
          />
        ))}
      </Container>
    );
  }
}

export default NotificationsPage;
