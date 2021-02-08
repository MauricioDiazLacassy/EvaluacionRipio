import React, {useState} from 'react';
import {Button, Container, HeaderCoins, InputGeneric} from '../styles/General'
import CardCoin from '../components/CardCoin'
import NavBar from '../components/Navbar'
import {TitleCardContainer, FormCards, HeaderCardContainer} from '../styles/Card'
import { urlConfig } from '../config/config'
import { useHistory } from "react-router-dom";
import Swal from 'sweetalert2'

function Coins() {

    const [coins, setCoins] = useState([])
    const [createCoin, setCreateCoin] = useState(false)
    const [coinkey, setCoinKey] = useState("")
    const [coinName, setCoinName] = useState("")
    const [amountAdmin, setAmountAdmin] = useState("")
    const base = urlConfig
    const history = useHistory();

    React.useEffect(() => {
        fetch(`${base}/api/monedas/`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
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
                setCoins(data)
            }
        ).catch( error => console.error(error));

    }, [history, base])

    function createCoins() {
        fetch(`${base}/api/monedas/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'name': coinName, 
                                  'key': coinkey
                                })
        }).then((response) => {
            if(response.status === 201){
                console.log("CREATED")
                alertConfirmOk();
                return true;     
            }else if(response.status === 400){
                console.log("BAD REQUEST");
                alertConfirmError(); 
                return false;           
            }
        })
        .then((response) => {
            if (response === true) {
                createAmountCoins()
            }
        })      
        .catch( error => console.error(error));
    }

    function createAmountCoins (){
        fetch(`${base}/api/create-amount-admin/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'name': coinName, 
                                  'amount': amountAdmin
                                })
        }).then((response) => {
            if(response.status === 201){
                console.log("CREATED")
                return true;     
            }else if(response.status === 400){
                console.log("BAD REQUEST");
                return false;           
            }
        })     
        .catch( error => console.error(error));
    }


    function alertConfirmOk () {
        Swal.fire({
            title: "Éxito!",
            text: "El activo se ha creado correctamente.",
            icon: "success",
            confirmButtonText: 'Aceptar',
        }).then(respuesta => {
            window.location.reload(true);
        })
    }

    function alertConfirmError() {
        Swal.fire({
            title: "Datos incorrectos",
            text: "El activo no se ha podido crear.",
            icon: "warning",
            confirmButtonText: 'Aceptar',
        })
    }

    function onchangeCreateCoin() {
       setCreateCoin(!createCoin);
    }

    function inputChangedCoinName (event) {          
        setCoinName(event.target.value);
    };

    function inputChangedCoinKey (event) {          
        setCoinKey(event.target.value);
    };

    function inputChangedAmountAdmin (event) {          
        setAmountAdmin(event.target.value);
    };


    return (
        <Container>
            <NavBar></NavBar>
            <h1>Activos</h1>  
            <HeaderCoins>
                <img src='icon_add.png' alt="imagen no disponible" onClick={onchangeCreateCoin}></img>
                <div>Añadir moneda</div>
                {createCoin && <InputGeneric type="text" placeholder="Nombre" value={coinName} onChange={inputChangedCoinName} ></InputGeneric>}
                {createCoin && <InputGeneric type="text" placeholder="Clave" value={coinkey}  onChange={inputChangedCoinKey} ></InputGeneric>}
                {createCoin && <InputGeneric type="text" placeholder="Cantidad existente" value={amountAdmin}  onChange={inputChangedAmountAdmin} ></InputGeneric>}
                {createCoin && <Button onClick={createCoins}>Crear</Button> }
            </HeaderCoins>  
            <FormCards>             
                <HeaderCardContainer>
                    <div className="divHeaderTitle">Activos</div>
                </HeaderCardContainer>
                <TitleCardContainer>
                    <div className="divActiveTitle">Activo</div><div className="divAmountTitle">Clave</div>
                </TitleCardContainer>
                { coins.map( (x, index) => {
                    return  <CardCoin key={index} element={{'moneda' : x.name, 'clave':  x.key }}></CardCoin>
                    }
                )}
            </FormCards>                  
        </Container>
    );
}

export default Coins;