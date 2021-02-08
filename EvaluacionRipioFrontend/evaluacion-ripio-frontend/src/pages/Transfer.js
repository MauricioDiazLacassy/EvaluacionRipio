import React, {useState} from 'react';
import { useHistory } from "react-router-dom";
import NavBar from '../components/Navbar';
import {Container, InputGeneric, SelectGeneric, OptionGeneric, Title} from '../styles/General';
import {HeaderTransfer, ButtonTransfer} from '../styles/Transfer';
import { urlConfig } from '../config/config';
import Swal from 'sweetalert2';


function Transfer() {

    const [coins, setCoins] = useState([])
    const [originwallet, setOriginWallet] = useState('')
    const [destinationwallet, setDestinationWallet] = useState('')
    const [coin, setCoin] = useState('')
    const [coinName, setCoinName] = useState('')
    const [amount, setAmount] = useState('') 
    const history = useHistory();
    const base = urlConfig

    React.useEffect(() => {
        fetch(`${base}/api/monedas`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        }).then( data => data.json())     
        .then(
            data => {
                setCoins(data);
            }
        ).catch( error => console.error(error));
    }, [base])

    React.useEffect(() => {
        fetch(`${base}/api/obtener-wallet/`, {
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
                setOriginWallet(data);
            }
        ).catch( error => console.error(error));
    }, [base, history])
    

    function transfer() {
        fetch(`${base}/api/transacciones/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'origin_wallet': originwallet, 
                                    'destination_wallet': destinationwallet, 
                                    'amount': amount, 
                                    'coin': coin
                                })
        }).then((response) => {
            if(response.status === 201){
                console.log("CREATED")
                return true;   
            }else if(response.status === 400){
                console.log("ERROR");
                return "Saldo insuficiente";                        
            }else if(response.status === 401){
                console.log("ERROR");
                return "Datos incorrectos";                        
            }
            
        })     
        .then(
            data => {
                if (data === true) {
                    alertConfirm(data);
                }
                else if (data === "Saldo insuficiente") {
                    alertConfirm(data);
                }
                else {
                    alertConfirm(data);
                }
            }
        ).catch( error => console.error(error));
    }
    
    function inputChangedAmount (event) {          
        setAmount(event.target.value);
    };

    function inputChangedCoin (event) {    
        setCoin(event.target.value);
        let coins = document.getElementById("coins")
        setCoinName(coins.options[coins.selectedIndex].text)
    };

    function inputChangedDestinationWallet (event) {    
        setDestinationWallet(event.target.value)
    };

    function alertConfirm (data) {
        if (data === true) {
            Swal.fire({
                title: "Transacción Enviada",
                text: "La transacción se ha enviado con éxito.",
                icon: "success",
                confirmButtonText: 'Aceptar',
            }).then(respuesta => {
                window.location.reload(true);
            })
        }
        else {
            Swal.fire({
                title: data,
                text: "La transacción no se ha podido realizar.",
                icon: "warning",
                confirmButtonText: 'Aceptar'
            });
        }
    }

    function confirmTransfer () {
        Swal.fire({
            title: "Confirmación de Datos",
            html: 
                `<div style="font-size: 15px;">Billetera de destino: </div>` +
                `<div style="font-size: 11px;">` + destinationwallet + `</div>` +
                `<div style="font-size: 15px;">Activo: </div>` +
                `<div style="font-size: 11px;">` + coinName + `</div>` +
                `<div style="font-size: 15px;">Cantidad: </div>` +
                `<div style="font-size: 11px;">` + amount + `</div>`,                   
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Transferir',
            reverseButtons: true,
            icon: "info",
        }).then( (respuesta) => {
            if (respuesta.value) {
                transfer()
            }
        })
    }

    return (
        <Container> 
            <NavBar></NavBar>             
            <Title><h1>Realizar Transferencia</h1>  </Title>
            <HeaderTransfer>
                <img src='logo_transaccion.png' alt="imagen no encontrada"></img>
            </HeaderTransfer>   
            <SelectGeneric id="coins" onChange={inputChangedCoin}>
                <OptionGeneric></OptionGeneric>
                { coins.map( (x, index) => {
                    return <OptionGeneric key={index} value={x.id} text={x.name}>{x.name}</OptionGeneric >
                    }
                )}                             
            </SelectGeneric>
            <InputGeneric type="text" placeholder="Monto" value={amount}  onChange={inputChangedAmount}></InputGeneric>
            <InputGeneric type="text" placeholder="Billetera de Destino" value={destinationwallet}  onChange={inputChangedDestinationWallet}></InputGeneric>
            <ButtonTransfer onClick={confirmTransfer}>Transferir</ButtonTransfer> 
        </Container>
    );     
}
    
export default Transfer;