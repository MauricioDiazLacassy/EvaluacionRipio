import React, {useState} from 'react';
import {Button, Header, Container} from '../styles/General'
import NavBar from '../components/Navbar'
import { urlConfig } from '../config/config'
import { useHistory } from "react-router-dom";
import Swal from 'sweetalert2'

function Mine() {

    const [unauthTransactions, setUnauthTransactions] = useState('0')
    const base = urlConfig
    const history = useHistory();

    React.useEffect(() => {
        fetch(`${base}/api/unauthorized-transactions/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({token : localStorage.getItem('token')}),
        }).then((response) => {
            if(response.status === 200){
                console.log("SUCCESSS")
                return response.json();     
            }else if(response.status === 401){
                console.log("UNAUTHORIZED");
                history.push('/login');
            }
        })     
        .then(
            data => {
                setUnauthTransactions(data)
            }
        ).catch( error => console.error(error));
    }, [base, history])

    function mine () {
        fetch(`${urlConfig}/api/minar-blockchain/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({token : localStorage.getItem('token')})
        })
        .then((response) => {
            if(response.status === 200){
                console.log("SUCCESSS");
                alertConfirmOk();    
                return response.json();     
            }else if(response.status === 400){
                console.log("ERROR"); 
                alertConfirmError(); 
                return response.json();     
            }else if(response.status === 401){
                console.log("UNAUTHORIZED"); 
                history.push('/login'); 
                return response.json();     
            }
        })      
        .catch( error => console.error(error));
    }

    function alertConfirmOk () {
        Swal.fire({
            title: "Éxito!",
            text: "La blockchain ha sido minada correctamente.",
            icon: "success",
            confirmButtonText: 'Aceptar',
        }).then(respuesta => {
            window.location.reload(true);
        })
    }

    function alertConfirmError() {
        Swal.fire({
            title: "Error!",
            text: "Ha ocurrido un error al intentar minar la blockchain.",
            icon: "warning",
            confirmButtonText: 'Aceptar',
        })
    }

    return (
        <Container>
            <NavBar></NavBar>
            <h1>Minar Blockchain</h1>  
            <Header>
                <img src='icon_mine.png' alt="imagen no disponible"></img>
                <div>{unauthTransactions} transacciones sin confirmar</div>
                <Button onClick={mine}>Minar</Button>
            </Header>        
        </Container>
    );
}

export default Mine;