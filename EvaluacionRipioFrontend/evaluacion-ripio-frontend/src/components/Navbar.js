import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { MenuItems } from './MenuItems'
import { Button } from './Button'
import { urlConfig } from '../config/config'
import Swal from 'sweetalert2'
import '../styles/NavBar.css'


function NavBar () {

    const [clicked, setClicked] = useState(false)
    const [superUser, setSuperUser] = useState(false)
    const [userData, setUserData] = useState({'username': '', 'email': '', 'admin': ''})
    const history = useHistory();
    const base = urlConfig

    React.useEffect(() => {
        fetch(`${base}/api/obtener-user/`, {
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
                if (data) {
                    setUserData(data);       
                }             
            }
        ).catch( error => console.error(error));
    }, [base])

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
                if (data === 'true') {
                    setSuperUser(true);   
                }
                else {
                    setSuperUser(false);      
                }             
            }
        ).catch( error => console.error(error));
    }, [base])

    function logout () {
        fetch(`${urlConfig}/api/logout/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({token : localStorage.getItem('token')})
        })
        .then((response) => {
            if(response.status === 200){
                console.log("SUCCESSS")
                localStorage.setItem('token', '');
                history.push('/login');
                return response.json();     
            }else if(response.status === 400){
                console.log("ERROR"); 
                history.push('/login');
                return false;     
            }
        })      
        .catch( error => console.error(error));
    }


    function handleClick() {
        setClicked(!clicked)
    }

    function userDetail () {
        Swal.fire({
            html: 
                `<h1 style="font-size: 30px;"> Datos de usuario </h1>` +
                `<img src="icon_user.png" alt="sin imagen" />` +
                `<div style="font-size: 15px;">Nombre: `+ userData.username +`</div>` +
                `<div style="font-size: 15px;">Email: `+ userData.email +`</div>` +
                `<div style="font-size: 15px;">Administrador: `+ userData.admin +`</div>`,                                   
            showCancelButton: true,
            cancelButtonText: 'Volver',
            confirmButtonText: 'Salir ',
            reverseButtons: true,
        }).then( (respuesta) => {
            if (respuesta.value) {
                logout()
            }
        })       
    }

    return (
            <nav className="NavbarItems">
                <h1 className="navbar-logo">EvaluaciónRipio</h1>
                <div className="menu-icon" onClick={handleClick}>
                    <i className={clicked ? 'fas fa-times' : 'fas fa-bars'}></i>
                </div>
                <ul className={clicked ? 'nav-menu active' : 'nav-menu'}>
                    {MenuItems.map( (item, index) => {
                        return (
                            <li key={index}>
                                <a className={item.cName} href={item.url}>{item.title}</a>    
                            </li>)
                        })}      
                    {superUser && <li key={'mine'}><a className="nav-links" href='/minar-blockchain'>Minar</a></li>} 
                    {superUser && <li key={'coin'}><a className="nav-links" href='/monedas'>Activos</a></li>}  
                    {clicked && <li key={'salir'}><div className="nav-links-mobile" href="" onClick={logout}>Salir</div></li>}           
                </ul>
                <Button onClick={userDetail}>{userData['username']}</Button>
            </nav>
    );
}

export default NavBar;
