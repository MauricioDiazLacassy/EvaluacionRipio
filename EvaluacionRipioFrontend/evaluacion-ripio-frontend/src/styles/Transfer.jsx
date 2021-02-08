import styled from "styled-components";

export const HeaderTransfer = styled.div`
    align-items: center;
    display: flex;
    height: auto;
    padding-top: 0.5em;
    padding-bottom: 1em;
    flex-direction: column;

    img {
        margin: auto;
        width: 7em;
        margin-bottom: 0.5em;
    }
`;

export const ButtonTransfer = styled.button`
    width: 15em;
    padding: 14px;
    color: #fff;
    font-size: 15px;
    margin-top: 1.5em;
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