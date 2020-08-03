import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import Menu from './components/Menu'
import Login from './components/Login'
import Register from './components/Register'
import TodoList from './components/TodoList'
import { PrivateRoute } from './components/PrivateRoute';


function App() {
  return (
    <Router>
      <div className="App">
        <Menu />
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
        <div className="container">
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <PrivateRoute exact path="/todolist" component={TodoList} />
        </div>
      </div>
    </Router>
  )
}

export default App;
