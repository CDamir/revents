import React, { Component } from 'react'
import { Menu, Container, Button } from 'semantic-ui-react';
import { NavLink, Link, withRouter } from 'react-router-dom';
import SignedOutMenu from '../Menus/SignedOutMenu';
import SignedInMenu from '../Menus/SignedInMenu';

class NavBar extends Component {
    state = {
        authenticated: false
    }
    
    handleSignIn = () => this.setState({ authenticated: true });

    handleSignOut = () => {
        this.setState({ authenticated: false });
        this.props.history.push('/');
    };
    
    render() {
        const { authenticated } = this.state;
        return (
            <Menu inverted fixed="top">
                <Container>
                    {/* use exact because of active styling */}
                    <Menu.Item as={NavLink} exact to='/' header>
                        <img src="/assets/logo.png" alt="logo" />
                        Re-vents
                      </Menu.Item>
                    <Menu.Item exact name="Events" as={NavLink} to='/events'/>
                    <Menu.Item name="People" as={NavLink} to='/people'/>
                    <Menu.Item name="Test" as={NavLink} to='/test'/>
                    <Menu.Item>
                        <Button floated="right" positive inverted content="Create Event" as={Link} to='/createEvent' />
                    </Menu.Item>
                    { authenticated ? <SignedInMenu signOut={this.handleSignOut} /> : <SignedOutMenu signIn={this.handleSignIn}/> }
                </Container>
            </Menu>
        )
    }
}
export default withRouter(NavBar);