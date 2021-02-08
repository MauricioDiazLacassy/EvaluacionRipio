import styled from 'styled-components';

export const Container = styled.div`
    width: 100%;
    height: 100%;
    flex-direction: column;
    align-items: center;
    display: flex;
`;

export const BoxContainer = styled.div`
    width: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
`;

export const FormContainer = styled.form`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

export const MutedText = styled.a`
    font-size: 12px;
    color: rgba(165, 165, 165, 0.8);
    font-weight: 500;
    text-decoration: none;

`;

export const BoldLink = styled.a`
    font-size: 12px;
    color: rgb(76,78,222);
    font-weight: 500;
    text-decoration: none;

`;

export const BoldLinkError = styled.a`
    font-size: 12px;
    color: #C32020;
    font-weight: 500;
    text-decoration: none;
    margin-bottom: 0.3em;

`;

export const Separator = styled.div`
    height: 2em;

`;

export const SeparatorMin = styled.div`
    height: 0.5em;

`;

export const Input = styled.input`
    width: 100%;
    height: 42px;
    outline: none;
    border: 1px solid rgba(165, 165, 165, 0.3);
    padding: 0px 10px;


    &:focus{
        outline: none;
        border-bottom: 2px solid rgb(76,78,222);
    }

    &::placeholder {
        color: rgba(165, 165, 165, 1);
    }

`;


export const ButtonLogin = styled.button`
    width: 100%;
    padding: 11px 20%;
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    border: none;
    outline:none;
    border-radius: 100px 100px 100px 100px;
    cursor: pointer;
    transition: all, 240ms ease-in-out;
    background: rgb(76,78,222);
    background: linear-gradient(126deg, rgba(76,78,222,1) 0%, rgba(76,78,222,1) 100%);


    
    &:hover {
        filter: brightness(1.03);
        outline:none;
    }

`;

export const Button = styled.button`
    width: 15em;
    padding: 14px;
    color: #fff;
    font-size: 15px;
    margin-top: 1em;
    font-weight: 600;
    outline:none;
    border: none;
    border-radius: 100px 100px 100px 100px;
    cursor: pointer;
    transition: all, 240ms ease-in-out;
    background: rgb(76,78,222);
    background: linear-gradient(126deg, rgba(76,78,222,1) 0%, rgba(76,78,222,1) 100%);

    
    &:hover {
        filter: brightness(1.03);
        outline:none;
    }

`;

export const InputGeneric = styled.input`
    width: 20em;
    height: 42px;
    outline: none;
    border-radius: 50px;
    border: 1px solid rgba(165, 165, 165, 0.3);
    padding: 0px 10px;
    margin-top: 0.5em;


    &:focus{
        outline: none;
        border-bottom: 2px solid rgb(76,78,222);
    }

    &::placeholder {
        color: rgba(165, 165, 165, 1);
    }

`;

export const SelectGeneric = styled.select`
    width: 21.5em;
    height: 42px;
    outline: none;
    border-radius: 50px;
    border: 1px solid rgba(165, 165, 165, 0.3);
    padding: 0px 10px;
    margin-top: 0.5em;


    &:focus{
        outline: none;
        border-bottom: 2px solid rgb(76,78,222);
    }

    &::placeholder {
        color: rgba(165, 165, 165, 1);
    }

`;

export const OptionGeneric = styled.option`
    width: 20em;
    height: 42px;
    outline: none;
    border-radius: 50px;
    border: 1px solid rgba(165, 165, 165, 0.3);
    padding: 0px 10px;
    margin-top: 0.5em;


    &:focus{
        outline: none;
        border-bottom: 2px solid rgb(76,78,222);
    }

    &::placeholder {
        color: rgba(165, 165, 165, 1);
    }

`;

export const Header = styled.div`
    align-items: center;
    display: flex;
    height: auto;
    padding-top: 1em;
    padding-bottom: 2em;
    flex-direction: column;

    img {
        margin: auto;
        width: 7em;
        margin-bottom: 1em;
    }
`;


export const HeaderCoins = styled.div`
    align-items: center;
    display: flex;
    height: auto;
    margin-bottom: 2em;
    flex-direction: column;

    img {
        margin: auto;
        width: 4em;
        cursor: pointer;
        margin-bottom: 0.5em;
    }

    div {
        margin-bottom: 1em;
    }
`;

export const Title = styled.div`
    @media screen and (max-width: 960px) { 
        h1 {
            overflow-wrap:break-word;
            text-align: center;
        }
    }
`;