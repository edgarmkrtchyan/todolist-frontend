import axios from 'axios'
import { Tasks } from '../interfaces/task.interface';

// TODO - add interfaces

const API_URL = 'http://127.0.0.1:5000/api/';

const getTasksList = () => {
    return axios
        .get(API_URL + 'tasks', {
            headers: { "Content-type": "application/json" }
        })
        .then((res: Tasks) => {
            let data: Array<object> = [];
            res.data['data'].forEach((val) => {
                data.push({
                    id: val['id'],
                    text: val['text'],
                    due_date: val['due_date'],
                    priority: val['priority'],
                    completed: val['completed']
                });
            })
            return data
        })
}

const addTask = (obj) => {
    return axios
        .post(
            API_URL + 'task', {
            text: obj['text'],
            due_date: obj['due_date'],
            priority: obj['priority']
        }, {
            headers: { "Content-type": "application/json" }
        })
        .then((res) => {
            
        })
}

const deleteTask = id => {
    return axios
        .delete(
            API_URL + `task/${id}`, {
            headers: { "Content-type": "application/json" }
        })
        .then((res) => {
            
        })
        .catch((res) => {
            
        })
}

const updateTask = (obj) => {
    return axios
        .put(
            API_URL + `task/${obj['id']}`, {
            input: obj['input']
        }, {
            headers: { "Content-type": "application/json" }
        })
        .then((res) => {
            
        })
}

const completeTask = id => {
    return axios
        .put(
            API_URL + `task/complete/${id}`, {
            headers: { "Content-type": "application/json" }
        })
        .then((res) => {
            
        })
}

export const tasksService = {
    getTasksList,
    addTask,
    deleteTask,
    updateTask,
    completeTask
};