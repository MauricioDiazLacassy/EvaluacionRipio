import React, {Component} from 'react';
import {BoxContainerLogin, TopContainerLogin,
       BackDropLogin, HeaderContainerLogin, HeaderTextLogin,
       SubtitleTextLogin, InnerContainer} from '../styles/Login';
import { BoxContainer, Input, ButtonLogin, Separator,
       BoldLink, MutedText, SeparatorMin} from '../styles/General';
import { urlConfig } from '../config/config'
import Swal from 'sweetalert2'

class Register extends Component {

    state = {
        creadentials: {username: '', password: '', email: ''},
    }

    register = event => {
        fetch(`${urlConfig}/api/register/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(this.state.creadentials)
        }).then((response) => {
            if(response.status === 200){
                console.log("SUCCESSS");
                this.alertConfirmOk();     
                return (data => data.json());              
            }else if(response.status === 400){
                console.log("ERROR");  
                this.alertConfirmError();                       
            }
        })     
        .catch( error => console.error(error));
    }

    inputChanged = event => {
        const cred = this.state.creadentials;
        cred[event.target.name] = event.target.value;
        this.setState({creadentials: cred});
    }

    alertConfirmOk = event => {
        Swal.fire({
            title: "Éxito!",
            text: "Usuario creado correctamete.",
            icon: "success",
            confirmButtonText: 'Aceptar',
        }).then(respuesta => {
            this.props.history.push("/login");  
        })
    }

    alertConfirmError = event => {
        Swal.fire({
            title: "Datos Incorrectos!",
            text: "Los datos que ha ingresado son incorrectos.",
            icon: "warning",
            confirmButtonText: 'Aceptar',
        })
    }
    
    render() {
        return (
            <BoxContainerLogin>
                <TopContainerLogin>           
                    <BackDropLogin></BackDropLogin>
                    <HeaderContainerLogin>
                        <HeaderTextLogin>Registro</HeaderTextLogin>
                        <SubtitleTextLogin>Ingrese sus datos</SubtitleTextLogin>              
                    </HeaderContainerLogin>
                </TopContainerLogin>
                <InnerContainer>
                    <BoxContainer>
                        <Input type="text" placeholder="Usuario" name="username" 
                            value={this.state.creadentials.username}
                            onChange={this.inputChanged}
                        />
                        <Input type="email" placeholder="Email" name="email"
                            value={this.state.creadentials.email}
                            onChange={this.inputChanged}
                        />
                        <Input type="password" placeholder="Contraseña" name="password"
                            value={this.state.creadentials.password}
                            onChange={this.inputChanged}
                        />
                        <Separator/>
                        <ButtonLogin onClick={this.register}>Registrame</ButtonLogin>                
                        <SeparatorMin/>
                        <MutedText href="/login"><BoldLink>Volver</BoldLink></MutedText>
                    </BoxContainer>
                </InnerContainer>
            </BoxContainerLogin>      
        );
    } 
}

export default Register;