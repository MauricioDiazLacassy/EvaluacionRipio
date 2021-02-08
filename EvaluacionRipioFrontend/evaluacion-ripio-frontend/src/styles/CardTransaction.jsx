import styled from 'styled-components';

export const FormCardsTransaction = styled.div`
    width: 90%;
    height: auto;
    flex-direction: column;
    background-color: whitesmoke;
    margin-left: 2em;
    margin-right: 2em;
    margin-bottom: 2em;
    display: flex;
    align-items: center;
    vertical-align: center;
    border: 1px solid rgba(165, 165, 165, 0.3);
    -webkit-box-shadow: 0px 5px 7px -5px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 5px 7px -5px rgba(0,0,0,0.75);
    box-shadow: 0px 5px 7px -5px rgba(0,0,0,0.75);
`;


export const CardTransactionContainer = styled.div`
    width: 100%;
    height: auto;
    background-color: whitesmoke;
    margin-left: 2em;
    margin-right: 2em;
    display: flex;
    padding-top: 1em;
    padding-bottom: 1em;
    align-items: center;
    vertical-align: center;
    
    border-top: 1px solid rgba(165, 165, 165, 0.3);

    img {
        width: 3em;
        margin-left: 1em;
        margin-right: 1em;
    }
`;

export const DivTransactionDetail = styled.div`
    font-size: 12px;
    overflow: hidden;
    margin-left: 1em;
`;

export const ContainerTransactionDetail = styled.div`
    overflow: hidden;
    margin-right: 1em;
`;

export const ContainerTransactionDate = styled.div`
    margin-left: auto;
    height: 100%;
    margin-right: 2em;
    margin-bottom: auto;
`;