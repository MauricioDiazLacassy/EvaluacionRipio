import React, { useState } from 'react';
import {CardTransactionContainer, DivTransactionDetail,
     ContainerTransactionDetail, ContainerTransactionDate} from '../styles/CardTransaction'
import { urlConfig } from '../config/config'
import '../styles/Home.css'



function CardTransaction(props) {

        const [wallet, setWallet] = useState([])
        let element = props.element
        const [superUser, setSuperUser] = useState(false)
        const base = urlConfig

        React.useEffect(() => {
            fetch(`${base}/api/check-superuser/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({token : localStorage.getItem('token')}),
            })
            .then((response) => {
                if(response.status === 200){
                    console.log("SUCCESSS")
                    return response.json();     
                }else if(response.status === 401){
                    console.log("UNAUTHORIZED");
                }
            })  
            .then(
                data => {
                    setSuperUser(data);            
                }
            ).catch( error => console.error(error));
        }, [base])

        React.useEffect(() => {
            fetch(`${base}/api/obtener-wallet/`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({token : localStorage.getItem('token')}),
            }).then( data => data.json())     
            .then(
                data => {
                    setWallet(data);
                }
            ).catch( error => console.error(error));
        }, [base])

        return (
            <CardTransactionContainer>
                {(element.origin_wallet === wallet && !superUser) && <img src='arrow_red.png' alt="imagen no disponible"/>}
                {(element.destination_wallet === wallet && !superUser) && <img src='arrow_green.png' alt="imagen no disponible"/>}
                <ContainerTransactionDetail>
                    {(element.origin_wallet === wallet || superUser) && <DivTransactionDetail>Destino: {element.destination_wallet}</DivTransactionDetail>}
                    {(element.destination_wallet === wallet || superUser) && <DivTransactionDetail>Origen: {element.origin_wallet}</DivTransactionDetail>}
                    <DivTransactionDetail>Activo: {element.coin}</DivTransactionDetail>
                    <DivTransactionDetail>Monto: {element.amount}</DivTransactionDetail>                                    
                </ContainerTransactionDetail>               
                <ContainerTransactionDate>
                    <DivTransactionDetail>Fecha: {element.timestamp}</DivTransactionDetail> 
                    <DivTransactionDetail>Estado: {element.confirmed}</DivTransactionDetail>     
                </ContainerTransactionDate>       
            </CardTransactionContainer>
        );

}

export default CardTransaction;