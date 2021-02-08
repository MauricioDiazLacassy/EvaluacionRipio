import React, { useState } from 'react';
import NavBar from '../components/Navbar'
import {Container, Title} from '../styles/General'
import CardTransaction from '../components/CardTransaction'
import { FormCardsTransaction } from '../styles/CardTransaction';
import { useHistory } from "react-router-dom";
import { urlConfig } from '../config/config'


function HistoryLogin() {

    const [transaction, setTransaction] = useState([])
    const history = useHistory();
    const base = urlConfig

    React.useEffect(() => {
        fetch(`${base}/api/history-transactions/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({token : localStorage.getItem('token')}),                
        }).then((response) => {
            if(response.status === 200){
                console.log("SUCCESSS")
                return response.json();     
            }else {
                console.log("UNAUTHORIZED");
                history.push('/login');
            }
        })     
        .then(
            data => {
                setTransaction(data);
            }
        ).catch( error => console.error(error));
    }, [base, history])

    return (
        <Container>
            <NavBar></NavBar>
            <Title><h1>Historial de Transacciones</h1></Title>
            <FormCardsTransaction>
            { transaction.length === 0 && <div>No tienes ninguna transación</div>}
            { transaction.map( (x, index )=> {
                return  <CardTransaction key={index} element={{
                            'origin_wallet' : x.origin_wallet,
                            'destination_wallet' : x.destination_wallet,
                            'amount' : x.amount,
                            'coin' : x.coin,
                            'timestamp' : x.timestamp,
                            'confirmed' : x.confirmed,
                    }}></CardTransaction>                         
                }
            )}
            </FormCardsTransaction>
        </Container>     
    );
}

export default HistoryLogin;