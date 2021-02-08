import styled from 'styled-components';

export const BoxContainerLogin = styled.div`
    width: 320px;
    min-height: 555px;
    display: flex;
    flex-direction: column;
    border-radius: 19px;
    background-color: #fff;
    box-shadow: 0 0 2px rgba(15, 15, 0.28);
    position: relative;
    overflow: hidden;
    margin-top: 1em;

    @media screen and (max-width: 960px) { 
        margin-top: 3.5em;
    }

`;

export const TopContainerLogin = styled.div`
    width: auto;
    height: 250px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 1.8em;
    padding-bottom: 0em;

`;

export const BackDropLogin = styled.div`
    width: 160%;
    height: 550px;
    position: absolute;
    display: flex;
    flex-direction: column;
    border-radius: 50% ;
    transform: rotate(60deg);
    top: -290px;
    left: -70px;
    background: rgb(76,78,222);
    background: linear-gradient(126deg, rgba(76,78,222,1) 0%, rgba(76,78,222,1) 100%);

`;


export const HeaderContainerLogin = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;

`;

export const HeaderTextLogin = styled.h2`
    font-size: 30px;
    font-weight: 600;
    line-height: 1.24;
    color: #fff;
    z-index: 10;
    margin: 0;
`;


export const SubtitleTextLogin = styled.h5`
    font-size: 11px;
    font-weight: 500;
    color: #fff;
    z-index: 10;
    margin: 0;
    margin-top: 7px;

`;

export const InnerContainer = styled.div`
    width: auto;
    display: flex;
    flex-direction: column;
    padding: 0 1.8em;
`;