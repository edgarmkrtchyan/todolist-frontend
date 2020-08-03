import React, { useState } from "react";
import { authenticationService } from "../_services/auth-service";
import { User } from "../interfaces/user.interface";
import { RouteComponentProps } from "react-router";

const Register: React.FC<RouteComponentProps> = (props) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();

    const user: User = {
      name: name,
      surname: surname,
      email: email,
      password: password,
    };

    authenticationService.registerUser(user).then((res) => {
      props.history.push(`/login`);
    });
  };

  const isFormValid = () => {
    return name && surname && email && password
  }

  return (
    <div className="container margin-top-100">
      <div className="row">
        <div className="col-md-4 mt-6 mx-auto">
          <form noValidate onSubmit={(e) => {
              onSubmit(e);
            }}>
            <h1 className="h3 mb-3 font-weight-normal">Register</h1>
            <div className="form-group">
              <label htmlFor="name">First name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                placeholder="Enter your first name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="name">Last name</label>
              <input
                type="text"
                className="form-control"
                name="last_name"
                placeholder="Enter your surname"
                value={surname}
                onChange={(event) => setSurname(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="Enter email"
                value={ email }
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
                value={ password }
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <button type="submit" disabled={!isFormValid()} className="btn btn-primary btn-block">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
