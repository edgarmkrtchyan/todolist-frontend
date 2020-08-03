import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { useHistory } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { tasksService } from "../_services/tasks.service";
import DatePicker from "react-datepicker";
import moment from "moment";
import { authenticationService } from '../_services/auth-service'

import "react-datepicker/dist/react-datepicker.css";

const ToDoList: React.FC<RouteComponentProps> = (props) => {
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [priority, setPriority] = useState("2");
  const [tasks, setTasks] = useState([{}]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [buttonText, setButtonText] = useState('Create');
  const history = useHistory();
  const prioritiesOptions = [
    {
      value: 1,
      label: 'High'
    },
    {
      value: 2,
      label: 'Normal'
    },
    {
      value: 3,
      label: 'Low'
    }
  ];

  useEffect(() => {
    const token = localStorage.access_token;
    if (token) {
      const decoded = jwt_decode(token);
      const now = new Date().getTime() / 1000;
      const expiry = decoded.exp;
      // Check if the token is not expired (token expiry is 30 minutes)
      if (expiry < Math.ceil(now)) {
        authenticationService.logout();
      }
      getAllItems();
    } else {
      history.push("/");
    }
  }, [history]);

  const onSubmit = (e) => {
    e.preventDefault();

    // New task creation case
    if (!editingItemId) {
      const objToSave = {
        text: text,
        due_date: moment(dueDate).format("YYYY-MM-DD HH:mm:ss"),
        priority: priority,
      };

      tasksService.addTask(objToSave).then(() => {
        getAllItems();
        // Removing the old text from the input field
        setText('');
      });
    } else { // Edit task state
      const objToSave = {
        id: editingItemId,
        input: {
          text: text,
          due_date: moment(dueDate).format("YYYY-MM-DD HH:mm:ss"),
          priority: priority
        }
      }
      tasksService.updateTask(objToSave).then(() => {
        getAllItems();
        // Removing the "Edit" state
        setEditingItemId(null);
        // Removing the old text from the input field
        setText('');
        // Setting the button text back to "Create"
        setButtonText('Create');
      });
    }
  };

  const isFormValid = () => {
    return text && dueDate && priority;
  };

  const setDate = (date: string) => {
    setDueDate(new Date(date));
  };

  const getAllItems = () => {
    tasksService.getTasksList().then((data) => {
      setTasks(data);
    });
  }

  const changeTaskPriority = (taskId: number, priority: string) => {
    const objToSave = {
      id: taskId,
      input: {
        priority: priority
      }
    }
    tasksService.updateTask(objToSave).then(() => {
      getAllItems();
    });
  }

  const changeDueDate = (taskId: number, due_date: string) => {
    const objToSave = {
      id: taskId,
      input: {
        due_date: moment(due_date).format("YYYY-MM-DD HH:mm:ss")
      }
    }
    tasksService.updateTask(objToSave).then(() => {
      getAllItems();
    });
  }

  const editTask = (item: object) => {
    setText(item['text']);
    setDueDate(new Date(Date.parse(item['due_date'])));
    setPriority(item['priority']);
    setEditingItemId(item['id']);
    setButtonText('Save');
  }

  const deleteTask = (taskId: number) => {
    tasksService.deleteTask(taskId).then(() => {
      getAllItems();
    });
  }

  const completeTask = (taskId: number) => {
    tasksService.completeTask(taskId).then(() => {
      getAllItems();
    });
  }

  return (
    <div className="col-md-12 margin-top-100">
      <div className="m-portlet">
        <div className="m-portlet__head">
          <div className="m-portlet__head-caption">
            <div className="m-portlet__head-title">
              <h3 className="m-portlet__head-text">Todo items</h3>
            </div>
          </div>
        </div>
        <div className="m-portlet__body">
          <div className="m-section">
            <div className="m-section__content">
              <form
                noValidate
                onSubmit={(e) => {
                  onSubmit(e);
                }}
              >
                <div className="row">
                  <div className="col-lg-4">
                    <div className="form-group">
                      <label>Text</label>
                      <input
                        type="text"
                        className="form-control"
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <label>Due Date</label>
                    <DatePicker
                      className="form-control"
                      selected={ dueDate }
                      minDate = { new Date() }
                      onChange={ (date) => setDate(date) }
                    />
                  </div>
                  <div className="col-lg-4">
                    <label>Priority</label>
                    <select
                      className="form-control"
                      value={priority}
                      onChange={(event) => setPriority(event.target.value)}>
                      {prioritiesOptions.map((item, index) => (
                        <option value={ item['value'] } key={index}>{ item['label'] }</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!isFormValid()}
                  className="btn btn-primary btn-block">
                  { buttonText }
                </button>
              </form>
              <table className="table table-striped m-table todolist-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Text</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Due Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((item, index) => (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>{ item['text'] }</td>
                      <td>
                        <select
                          className="form-control form-control-sm"
                          value={ item['priority'] }
                          onChange={(event) => changeTaskPriority(item['id'], event.target.value)}>
                          {prioritiesOptions.map((item, index) => (
                            <option value={ item['value'] } key={index}>{ item['label'] }</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <span>
                        {
                          item['completed'] === 1
                            ? 
                            <span className="m-badge  m-badge--success m-badge--wide">
                              Completed
                            </span>
                            : 
                            <span>
                              <span className="m-badge  m-badge--warning m-badge--wide">
                                Pending
                              </span>
                            </span>
                          }
                        </span>
                      </td>
                      <td>
                        <DatePicker
                          className="form-control form-control-sm"
                          selected={ Date.parse(item['due_date']) }
                          minDate = { new Date() }
                          onChange={(date) => changeDueDate(item['id'], date)}
                        />
                      </td>
                      <td className="actions-cell align-right">
                      {
                          item['completed'] !== 1
                            ?
                            <button
                              onClick={() => completeTask(item['id'])}
                              className="m-portlet__nav-link btn m-btn m-btn--hover-success m-btn--icon m-btn--icon-only m-btn--pill"
                              title="Mark as Completed">
                              <i className="la la-thumbs-up"></i>
                            </button>
                            : 
                            ''
                        }
                        <button
                          onClick={() => editTask(item) }
                          className="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill"
                          title="Edit details">
                          <i className="la la-edit"></i>
                        </button>
                        <button
                          onClick={() => deleteTask(item['id']) }
                          className="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill"
                          title="Delete">
                          <i className="la la-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToDoList;
