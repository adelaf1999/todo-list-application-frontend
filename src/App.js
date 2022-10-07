import React, {Component, Fragment} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {  Button, Spinner, Table, Dropdown, Modal, Form} from "react-bootstrap";
import axios from "axios";
import _ from "lodash";
const BACKEND_URL = "http://localhost:3000";
const GET_ALL_TASKS_ROUTE = `${BACKEND_URL}/get-all-tasks`;
const CREATE_TASK_ROUTE = `${BACKEND_URL}/create-task`;

class App extends Component{

    constructor(props) {

        super(props);

        const width = window.innerWidth;

        const height = window.innerHeight;

        const tasks = [];

        const fetching_tasks = false;

        const create_task_modal_visible = false;

        const text = "";

        const modal_error = "";

        const modal_loading = false;

        this.state = {
            width,
            height,
            tasks,
            fetching_tasks,
            create_task_modal_visible,
            text,
            modal_error,
            modal_loading
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

                                                   }}
                                               >
                                                   Edit Task
                                               </Dropdown.Item>


                                               <Dropdown.Item
                                                   onClick={() => {

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

                    this.exitCreateTaskModal();

                }else{

                    const message = data.message;

                    this.setState({modal_error: message});

                }




            }).catch(error => {

            this.setState({modal_loading: false});


            console.log(error);

        });


    }


    exitCreateTaskModal(){

        this.setState({
            create_task_modal_visible: false,
            text: "",
            modal_error: "",
            modal_loading: false
        });

    }

    createTaskModalBody(){

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

    createTaskModal(){

        const { create_task_modal_visible, text } = this.state;

        if(create_task_modal_visible){

            return(


                <Modal
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={create_task_modal_visible}
                    onHide={() => {
                        this.exitCreateTaskModal();
                    }}
                >
                    <Modal.Header closeButton>

                        <Modal.Title id="contained-modal-title-vcenter">
                            Create Task
                        </Modal.Title>

                    </Modal.Header>

                    <Modal.Body>

                        {this.createTaskModalBody()}

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

                                    this.createTask(text)

                                }

                            }}>
                            Create
                        </Button>

                        <Button
                            variant="secondary"
                            onClick={() => {
                                this.exitCreateTaskModal();
                            }}>
                            Close
                        </Button>

                    </Modal.Footer>

                </Modal>

            );

        }

    }

    renderBody(){

        const { fetching_tasks } = this.state;

        if(fetching_tasks){

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
                            this.setState({create_task_modal_visible: true});
                        }}
                    >
                        Create Task
                    </Button>

                    {this.renderTasks()}

                    {this.createTaskModal()}

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
