import React, {Component, Fragment} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {  Button, Spinner, Table, Dropdown} from "react-bootstrap";
import axios from "axios";
import _ from "lodash";
const BACKEND_URL = "http://localhost:3000";
const GET_ALL_TASKS_ROUTE = `${BACKEND_URL}/get-all-tasks`;

class App extends Component{

    constructor(props) {

        super(props);

        const width = window.innerWidth;

        const height = window.innerHeight;

        const tasks = [];

        const fetching_tasks = false;

        this.state = {
            width,
            height,
            tasks,
            fetching_tasks
        };

    }

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
                    >
                        Create Task
                    </Button>

                    {this.renderTasks()}

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
