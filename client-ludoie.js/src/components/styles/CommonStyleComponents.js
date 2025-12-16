import styled from "styled-components";

export const LudoieLogo = styled.img`
    width: 50%;
    max-width: 600px;
    height: auto;
`

export const RedButton = styled.button`
    width: 60%;
    max-width: 300px;
    height: 60px;
    color: white;
    font-size: 20px;
    background-color: #d63232;
    border-radius: 40px;
    border: none;
    cursor: pointer;

    &:hover {
        background-color: #a43434;
    }

    &:disabled {
        background-color: grey;
    }
`

export const LudoieInput = styled.input`
    width: 60%;
    max-width: 300px;
    height: 40px;
    border-radius: 10px;
    border: none;
`

export const TextLudoieStyle = styled.p`
    font-size: calc(20px + 0.5vw);
    font-weight: bold;
    margin: 0;
`

export const PlayerStyle = styled.div`
    width: 90%;
    height: 6%;
    max-height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
`