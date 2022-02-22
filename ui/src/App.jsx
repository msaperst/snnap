import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import { Col, Row } from 'react-bootstrap';
import { history } from './helpers/history';
import { authenticationService } from './services/authentication.service';
import { PrivateRoute } from './helpers/PrivateRoute';
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import Menu from './components/Menu/Menu';
import ProfilePage from './pages/Profile/ProfilePage';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null,
    };
  }

  componentDidMount() {
    authenticationService.currentUser.subscribe((x) =>
      this.setState({ currentUser: x })
    );
  }

  // eslint-disable-next-line class-methods-use-this
  logout() {
    authenticationService.logout();
    history.push('/login');
  }

  render() {
    const { currentUser } = this.state;
    return (
      <Router history={history}>
        <div className="vertical-center">
          <Container>
            <Row>
              <Col>
                <Menu currentUser={currentUser} logout={() => this.logout()} />
              </Col>
            </Row>
            <PrivateRoute exact path="/" component={HomePage} />
            <PrivateRoute exact path="/profile" component={ProfilePage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/register" component={RegisterPage} />
          </Container>
        </div>
      </Router>
    );
  }
}

export default App;
