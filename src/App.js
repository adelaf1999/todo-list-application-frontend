import React, {Component, Fragment} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {  Button} from "react-bootstrap";
import axios from "axios";
import _ from "lodash";
const BACKEND_URL = "http://localhost:3000";
const GET_ALL_TASKS_ROUTE = `${BACKEND_URL}/get-all-tasks`;

class App extends Component{

    constructor(props) {

        super(props);

        const width = window.innerWidth;

        const height = window.innerHeight;

        this.state = {
            width,
            height
        };

    }

    getAllTasks(){

        const config = {
            headers: {
                "Accept": "application/json"
            }
        };

        axios.get(GET_ALL_TASKS_ROUTE, config)
            .then(response => {

                const data = response.data;

                const tasks = data.tasks;

                console.log(tasks);


            }).catch(error => {

                console.log(error);

        });

    }

    componentDidMount(){

        this.getAllTasks();


    }

    render(){

      return(

          <div>


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
                          borderRadius: '10px'
                      }}
                  >
                      Create Task
                  </Button>

              </div>




          </div>

      )

    }

}

export default App;
