import React, { useState, useEffect } from "react";
import { authenticationService } from "../_services/auth-service";
import { User } from '../interfaces/user.interface'
import { RouteComponentProps } from "react-router";
import jwt_decode from "jwt-decode";
import { useHistory } from "react-router-dom";

const Login: React.FC<RouteComponentProps> = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.access_token;
    if (token) {
      const decoded = jwt_decode(token);
      const now = new Date().getTime() / 1000;
      const expiry = decoded.exp;
      // Check if the token is not expired (token expiry is 30 minutes)
      if (expiry > Math.ceil(now)) {
        history.push("/todolist");
      }
    }
  }, [history]);

   const onSubmit = (e) => {
    e.preventDefault()

    const user: User = {
      email: email,
      password: password
    }

    authenticationService.loginUser(user).then((res) => {
      if (res['status'] === 'ok') {
        props.history.push(`/todolist`)
      } else if (res['status'] === 'error') {
        setErrorMessage(res['message']);
      }
    })
  }

  const isFormValid = () => {
    return email && password
  }

  return (
    <div className="container margin-top-100">
      <div className="row">
        <div className="col-md-4 mt-6 mx-auto">
          <form
            noValidate
            onSubmit={(e) => {
              onSubmit(e);
            }}
          >
            <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="Enter email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            {
              errorMessage && 
              <div className="alert alert-danger">
                { errorMessage }
              </div>
            }
            <button type="submit" disabled={!isFormValid()} className="btn btn-primary btn-block">
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

