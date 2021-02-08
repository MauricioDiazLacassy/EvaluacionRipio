import React, {Component} from 'react';
import {BoxContainerLogin, TopContainerLogin,
        BackDropLogin, HeaderContainerLogin, HeaderTextLogin,
        SubtitleTextLogin, InnerContainer} from '../styles/Login';
import { BoxContainer, Input, ButtonLogin, Separator,
        BoldLink, MutedText, SeparatorMin, BoldLinkError} from '../styles/General';
import { urlConfig } from '../config/config'
import Swal from 'sweetalert2'

class Login extends Component {

    state = {
        creadentials: {username: '', password: ''},
        error : ""
    }

    login = event => {
        fetch(`${urlConfig}/api/login/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(this.state.creadentials)
        })
        .then((response) => {
            if(response.status === 200){
                console.log("SUCCESSS")
                return response.json();     
            }else if(response.status === 400){
                console.log("ERROR");        
                this.alertConfirmError();   
                return false;     
            }
        })      
        .then(
            data => {
                if (data !== false){
                    localStorage.setItem('token', data.token);
                    this.props.history.push("/"); 
                }                
            }
        ).catch( error => console.error(error));
    }

    inputChanged = event => {
        const cred = this.state.creadentials;
        cred[event.target.name] = event.target.value;
        this.setState({creadentials: cred});
    }

    alertConfirmError = event => {
        Swal.fire({
            title: "Datos Incorrectos!",
            text: "Usuario y/o contraseña inválidos.",
            icon: "warning",
            confirmButtonText: 'Aceptar',
        })
    }

    render() {
        const state = this.state
        return (        
            <BoxContainerLogin>
                <TopContainerLogin>           
                    <BackDropLogin></BackDropLogin>
                    <HeaderContainerLogin>
                        <HeaderTextLogin>Bienvenido!</HeaderTextLogin>
                        <SubtitleTextLogin>Ingresar usuario</SubtitleTextLogin>           
                    </HeaderContainerLogin>
                </TopContainerLogin>
                <InnerContainer>
                    <BoxContainer>
                        <Input type="text" placeholder="Usuario" name="username" 
                            value={this.state.creadentials.username}
                            onChange={this.inputChanged}
                        />
                        <Input type="password" placeholder="Contraseña" name="password"
                            value={this.state.creadentials.password}
                            onChange={this.inputChanged}
                        />
                        <Separator/>
                        {state.error && <BoldLinkError>{state.error}</BoldLinkError>}
                        <ButtonLogin onClick={this.login}>Ingresar</ButtonLogin>                
                        <SeparatorMin/>
                        <div><MutedText>No tienes una cuenta?</MutedText><BoldLink href="/registro"> Registrarme</BoldLink></div>
                    </BoxContainer>
                </InnerContainer>
            </BoxContainerLogin>
        );
    }
  
}

export default Login;