import React, {
    useState,
    useEffect
} from 'react';
import './App.css';

import "antd/dist/antd.css";
import Table from "antd/lib/table";
import {
    Select,
    Form
} from 'antd'

const props = {
    bordered: true,
    loading: false,
    size: "default",
    showHeader: true,
    scroll: {
        y: 600
    }
};

const {
    Option
} = Select;

function App() {

    const [gender_option, setGender] = useState('All');
    const [known_option, setKnown] = useState('All');

    const [cols, setCols] = useState([{
        title: "loading",
        dataIndex: "hashtag",
        key: "hashtag",
        width: 150
    }]);
    const [dbs, setDbs] = useState([{
        hashtag: "loading"
    }]);

    useEffect(() => {
        async function fetchData() {
            await fetch('/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    gender: gender_option,
                    known: known_option
                })
            }).then(res => res.json()).then(data => {
                setCols(data.columns);
                setDbs(data.rows);
                //console.log(dbs);
            });
        }

        fetchData();

    }, [gender_option, known_option]);

    function genderChange(value) {
        //console.log({value});
        setGender(value);
    }

    function knownChange(value) {
        //console.log({value});
        setKnown(value);
    }

    return ( <
        div className = "App" >
        <
        header className = "App-header" >

        <
        h2 > The Movie Database API < /h2> <
        h3 > Amazon Prime Series: People < /h3>

        <
        div className = "App-float" >

        <
        div className = "float-child" >
        <
        Select onChange = {
            genderChange
        }
        placeholder = "Select Gender" >
        <
        Option value = "Male" > Male < /Option> <
        Option value = "Female" > Female < /Option> <
        Option value = "All" > All < /Option> <
        /Select> <
        /div>

        <
        div className = "float-child" >
        <
        Select onChange = {
            knownChange
        }
        placeholder = "Select Known For" >
        <
        Option value = "All" > All < /Option> <
        Option value = "Acting" > Acting < /Option> <
        Option value = "Crew" > Crew < /Option> <
        Option value = "Camera" > Camera < /Option> <
        Option value = "Sound" > Sound < /Option> <
        Option value = "Writing" > Writing < /Option> <
        Option value = "Directing" > Directing < /Option> <
        Option value = "Editing" > Editing < /Option> <
        Option value = "Production" > Production < /Option> <
        Option value = "Costume & Make-Up" > Costume & Make - Up < /Option> <
        Option value = "Visual Effects" > Visual Effects < /Option> <
        /Select> <
        /div>

        <
        /div>

        <
        Table {
            ...props
        }
        columns = {
            cols
        }
        dataSource = {
            dbs
        }
        pagination = {
            false
        }
        />

        <
        /header> <
        /div>
    );
}

export default App;