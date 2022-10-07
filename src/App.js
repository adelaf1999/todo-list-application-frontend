import React, {Component, Fragment} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {  Button, Spinner, Table, Dropdown, Modal, Form} from "react-bootstrap";
import axios from "axios";
import _ from "lodash";
const BACKEND_URL = "http://localhost:3000";
const GET_ALL_TASKS_ROUTE = `${BACKEND_URL}/get-all-tasks`;
const CREATE_TASK_ROUTE = `${BACKEND_URL}/create-task`;
const DESTROY_TASK_ROUTE = `${BACKEND_URL}/destroy-task`;
const EDIT_TASK_ROUTE = `${BACKEND_URL}/edit-task`;

class App extends Component{

    constructor(props) {

        super(props);

        const width = window.innerWidth;

        const height = window.innerHeight;

        const tasks = [];

        const fetching_tasks = false;

        const task_modal_visible = false;

        const text = "";

        const modal_error = "";

        const modal_loading = false;

        const destroying_task = false;

        const task_modal_mode = null; // 0: create, 1: edit

        const selected_task_id = null;

        this.state = {
            width,
            height,
            tasks,
            fetching_tasks,
            task_modal_visible,
            text,
            modal_error,
            modal_loading,
            destroying_task,
            task_modal_mode,
            selected_task_id
        };

    }

    getFormData(data){

        const bodyFormData = new FormData();

        _.each(data, (value, key) => {

            bodyFormData.append(key, value);

        });

        return bodyFormData;

    };

    getAllTasks(){

        const config = {
            headers: {
                "Accept": "application/json"
            }
        };

        this.setState({fetching_tasks: true});


        axios.get(GET_ALL_TASKS_ROUTE, config)
            .then(response => {

                this.setState({fetching_tasks: false});

                const data = response.data;

                const tasks = data.tasks;

                console.log(tasks);

                this.setState({tasks: tasks});


            }).catch(error => {

            this.setState({fetching_tasks: false});

            console.log(error);

        });

    }

    componentDidMount(){

        this.getAllTasks();


    }


    deleteTask(id){


        const config = {
            headers: {
                "Accept": "application/json"
            }
        };

        let bodyFormData = this.getFormData({
            id: id
        });

        this.setState({destroying_task: true});

        axios.post(DESTROY_TASK_ROUTE, bodyFormData ,config)
            .then(response => {


                const data = response.data;

                const tasks = data.tasks;

                this.setState({tasks: tasks, destroying_task: false});


            }).catch(error => {

            this.setState({destroying_task: false});


            console.log(error);

        });

    }


    renderTasks(){

        const { tasks } = this.state;

        if(tasks.length > 0){

            return(


                <Table striped bordered hover style={{
                    width: this.state.width / 1.1
                }}>

                    <thead>
                    <tr>
                        <th>Task</th>
                        <th style={{width: '300px'}}></th>
                    </tr>
                    </thead>


                    <tbody>

                    {
                       _.map(tasks, (task, index) => {

                           return(

                               <tr key={index}>
                                   <td>{task.text}</td>
                                   <td style={{
                                       display: 'flex',
                                       justifyContent: 'center',
                                       width: '300px'
                                   }}>

                                       <Dropdown>

                                           <Dropdown.Toggle
                                               variant="success"
                                           >
                                               Options
                                           </Dropdown.Toggle>

                                           <Dropdown.Menu>

                                               <Dropdown.Item
                                                   onClick={() => {

                                                       this.setState({
                                                           task_modal_visible: true,
                                                           task_modal_mode: 1,
                                                           text: task.text,
                                                           selected_task_id: task.id
                                                       })

                                                   }}
                                               >
                                                   Edit Task
                                               </Dropdown.Item>


                                               <Dropdown.Item
                                                   onClick={() => {

                                                       this.deleteTask(task.id);

                                                   }}
                                               >
                                                   Delete Task
                                               </Dropdown.Item>


                                           </Dropdown.Menu>


                                       </Dropdown>


                                   </td>
                               </tr>

                           );

                       })
                    }


                    </tbody>

                </Table>

            );

        }

    }

    editTask(id, text){


        const config = {
            headers: {
                "Accept": "application/json"
            }
        };

        let bodyFormData = this.getFormData({
            text: text,
            id: id
        });

        this.setState({modal_loading: true});

        axios.post(EDIT_TASK_ROUTE, bodyFormData ,config)
            .then(response => {

                this.setState({modal_loading: false});

                const data = response.data;

                const success = data.success;

                if(success){

                    const tasks = data.tasks;

                    this.setState({tasks: tasks});

                    this.exitTaskModal();

                }else{

                    const message = data.message;

                    this.setState({modal_error: message});

                }




            }).catch(error => {

            this.setState({modal_loading: false});


            console.log(error);

        });


    }


    createTask(text){


        const config = {
            headers: {
                "Accept": "application/json"
            }
        };

        let bodyFormData = this.getFormData({
            text: text
        });

        this.setState({modal_loading: true});

        axios.post(CREATE_TASK_ROUTE, bodyFormData ,config)
            .then(response => {

                this.setState({modal_loading: false});


                const data = response.data;

                const success = data.success;

                if(success){

                    const tasks = data.tasks;

                    this.setState({tasks: tasks});

                    this.exitTaskModal();

                }else{

                    const message = data.message;

                    this.setState({modal_error: message});

                }




            }).catch(error => {

            this.setState({modal_loading: false});


            console.log(error);

        });


    }


    exitTaskModal(){

        this.setState({
            task_modal_visible: false,
            text: "",
            modal_error: "",
            modal_loading: false,
            task_modal_mode: null,
            selected_task_id: null
        });

    }

    taskModalBody(){

        const { modal_loading, modal_error, text } = this.state;

        if(modal_loading){

            return(

                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>

                    <Spinner animation="border" variant="primary" />

                </div>

            );

        }else{

            return(

                <Fragment>


                    <Form.Group
                        style={{
                            marginBottom: '1.5rem'
                        }}
                    >

                        <Form.Label
                            style={{
                                fontSize: '18px',
                                marginBottom: '15px'
                            }}
                        >
                            Text (*)
                        </Form.Label>



                        <Form.Control
                            value={text}
                            onChange={(e) => {
                                this.setState({text: e.target.value})
                            }}
                            isInvalid={!_.isEmpty(modal_error)}
                        />

                        <Form.Control.Feedback type="invalid">
                            {modal_error}
                        </Form.Control.Feedback>


                    </Form.Group>

                </Fragment>

            );

        }

    }

    taskModal(){

        const { task_modal_visible, text, task_modal_mode, selected_task_id } = this.state;

        if(task_modal_visible && task_modal_mode !== null){

            return(


                <Modal
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={task_modal_visible}
                    onHide={() => {
                        this.exitTaskModal();
                    }}
                >
                    <Modal.Header closeButton>

                        <Modal.Title id="contained-modal-title-vcenter">
                            {task_modal_mode === 0 ? "Create Task" : "Edit Task"}
                        </Modal.Title>

                    </Modal.Header>

                    <Modal.Body>

                        {this.taskModalBody()}

                    </Modal.Body>



                    <Modal.Footer>

                        <Button
                            variant="success"
                            style={{
                                marginRight: '10px'
                            }}
                            onClick={() => {

                                this.setState({modal_error: ''});

                                if(_.isEmpty(text)){

                                    this.setState({modal_error: 'Text cannot be empty'});

                                }else{

                                    if(task_modal_mode === 0){

                                        this.createTask(text)

                                    }else{

                                        this.editTask(selected_task_id, text);

                                    }



                                }

                            }}>
                            {task_modal_mode === 0 ? "Create" : "Update"}
                        </Button>

                        <Button
                            variant="secondary"
                            onClick={() => {
                                this.exitTaskModal();
                            }}>
                            Close
                        </Button>

                    </Modal.Footer>

                </Modal>

            );

        }

    }

    renderBody(){

        const { fetching_tasks, destroying_task} = this.state;

        if(fetching_tasks || destroying_task){

            return(

               <div style={{
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center'
               }}>

                   <Spinner animation="border" variant="primary" style={{
                       position: 'absolute',
                       left: '48%',
                       top: '48%'
                   }} />

               </div>


            );

        }else{

            return(

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    marginTop: '3rem',
                    marginBottom: '3rem'
                }}>
                    <p style={{
                        fontSize: '40px',
                        fontWeight: 'bold',
                        marginBottom: '1rem'
                    }}>
                        Tasks
                    </p>


                    <Button
                        variant="success"
                        style={{
                            borderRadius: '10px',
                            marginBottom: '3rem'
                        }}
                        onClick={() => {
                            this.setState({task_modal_visible: true, task_modal_mode: 0});
                        }}
                    >
                        Create Task
                    </Button>

                    {this.renderTasks()}

                    {this.taskModal()}

                </div>


            );

        }

    }

    render(){

      return(

          <div>


              {this.renderBody()}



          </div>

      )

    }

}

export default App;
