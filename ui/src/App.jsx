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
import NavBar from './components/NavBar/NavBar';
import ProfilePage from './pages/Profile/ProfilePage';

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
        <div>
          {currentUser && <NavBar logout={() => this.logout()} />}
          <div className="jumbotron">
            <Container>
              <Row>
                <Col md={{ span: 6, offset: 3 }}>
                  <PrivateRoute exact path="/" component={HomePage} />
                  <PrivateRoute exact path="/profile" component={ProfilePage} />
                  <Route path="/login" component={LoginPage} />
                  <Route path="/register" component={RegisterPage} />
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
