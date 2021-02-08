import React from 'react';
import {CardContainer} from '../styles/Card'
import '../styles/Home.css'

class CardCoin extends React.Component{
    render() {
        let element = this.props.element
        return (
            <CardContainer>
                <div className="divActive">{element.moneda}</div>
                <div className="divAmount">{element.clave}</div>
            </CardContainer>
        );
    }
}

export default CardCoin;