import styled from "styled-components";

export const LudoieLogo = styled.img`
    width: 50%;
    max-width: 800px;
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