import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';

import { history } from './helpers/history';
import { authenticationService } from './services/authentication.service';
import { PrivateRoute } from './helpers/PrivateRoute';
import HomePage from './components/HomePage/HomePage';
import LoginPage from './components/LoginPage/LoginPage';
import Container from "react-bootstrap/Container";
import { Col, Nav, Row } from "react-bootstrap";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: null
        };
    }

    componentDidMount() {
        authenticationService.currentUser.subscribe(x => this.setState({ currentUser: x }));
    }

    logout() {
        authenticationService.logout();
        history.push('/login');
    }

    render() {
        const { currentUser } = this.state;
        return (
            <Router history={history}>
                <div>
                    {currentUser &&
                    <Nav className='bg-dark'>
                        <Nav.Item>
                            <Nav.Link href="/" disabled>Home</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link onClick={this.logout}>Logout</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    }
                    <div className="jumbotron">
                        <Container>
                            <Row>
                                <Col md={{ span: 6, offset: 3 }}>
                                        <PrivateRoute exact path="/" component={HomePage} />
                                        <Route path="/login" component={LoginPage} />
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