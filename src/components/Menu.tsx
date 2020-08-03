import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { authenticationService } from '../_services/auth-service';

declare let window: any;

class Home extends Component {
  logOut(e) {
    e.preventDefault();
    authenticationService.logout();
  }

  render() {
    const loginRegLink = (
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/login" className="nav-link">
            Login
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/register" className="nav-link">
            Register
          </Link>
        </li>
      </ul>
    )

    const userLink = (
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/todolist" className="nav-link">
            Todo list
          </Link>
        </li>
        <li className="nav-item">
          <a href=":;" onClick={this.logOut.bind(this)} className="nav-link">
            Logout
          </a>
        </li>
      </ul>
    )

    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarsExample10"
          aria-controls="navbarsExample10"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div
          className="collapse navbar-collapse justify-content-md-center"
          id="navbarsExample10"
        >
          {localStorage.access_token ? userLink : loginRegLink}
        </div>
      </nav>
    )
  }
}

export default withRouter(Home)