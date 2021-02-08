import React, {useState} from 'react';
import { useHistory } from "react-router-dom";
import NavBar from '../components/Navbar'
import Card from '../components/Card'
import '../styles/Home.css'
import {TitleCardContainer, FormCards, HeaderCardContainer} from '../styles/Card'
import {Button, SeparatorMin, Header, Container} from '../styles/General'
import { urlConfig } from '../config/config'

function Home() {

    const [balance, setBalance] = useState([])
    const [wallet, setWallet] = useState([])
    const history = useHistory();
    const [verclave, setVerClave] = useState(false)
    const base = urlConfig

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

    React.useEffect(() => {
        fetch(`${base}/api/obtener-balance/`, {
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
                history.push('/login');
            }
        })  
        .then(
            data => {
                setBalance(data);              
            }
        ).catch( error => console.error(error));
    }, [base, history])

    function toggleWallet() {
        setVerClave(!verclave);
    } 

    function textToClipboard () {
        var dummy = document.createElement("textarea");
        document.body.appendChild(dummy);
        dummy.value = wallet;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
    }

    return (
        <Container>
            <NavBar></NavBar>
            <Header>
                <img src='logo_wallet.png' alt="imagen no disponible"></img>
                {verclave && <div>Clave de Billetera:</div>}
                {verclave && <SeparatorMin/>}
                {verclave && <div className="divKeyWallet">{wallet}</div>}
                {verclave && <img className="imgCopyWallet" onClick={textToClipboard} src="copy_icon2.png" alt="imagen no encontrada"/>}
                <Button onClick={toggleWallet}>Obtener Clave de Billetera</Button>
            </Header>
            <FormCards>
                <HeaderCardContainer>
                    <div className="divHeaderTitle">Balance</div>
                </HeaderCardContainer>
                <TitleCardContainer>
                    <div className="divActiveTitle">Activo</div><div className="divAmountTitle">Saldo</div>
                </TitleCardContainer>
                { balance.map( (x, index) => {
                    return  <Card key={index} element={{'moneda' : x.moneda, 'cantidad': x.cantidad, 'clave':  x.clave }}></Card>
                    }
                )}
            </FormCards>         
        </Container>
    );
    
    
}
  

export default Home;