import React, { Fragment } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { logout } from '../../actions/auth'
const Navbar = ({ auth: { isAuthenticated, loading}, logout }) => {
    const authLinks = (
        <ul>
            <li><Link to="/dashboard">Home</Link></li>
            <li><Link to="/profiles">Explore</Link></li>
            <li><Link to="/posts">Post</Link></li>            
            <li><a onClick={logout} href="#!">
                <i className="fas fa-sign-out-alt" />{' '}
            <span className="hide-sm">Logout</span></a></li>
        </ul>
    )

    const guestLinks = (
        <ul>
            <li><Link to="/profiles">Explore</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
        </ul>
    )
    return (
        <nav className="navbar bg-dark">
            <h1>
                <Link to="/"> Connect</Link>
            </h1>
    { !loading && (<Fragment>{ isAuthenticated ? authLinks : guestLinks }</Fragment>) }
            
        </nav>
    )
}
Navbar.prototype = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, { logout })(Navbar)
