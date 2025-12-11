import styled from "styled-components"

export const TurnHandler = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    position: absolute;
    right: 0;
    bottom: 0;
    width: 20vw;
    min-width: 200px;
`

export const Player = styled.div`
    display: flex;
    align-items: flex-end;
    justify-content: center;
    width: 200px;
    font-size: calc(10px + 0.5vw);
`

export const Players = styled.div`
    position: absolute;
    top: 0;
    display: flex;
    justify-content: space-evenly;
    width: 100%;
`

export const Dice = styled.img`
    cursor: pointer;
    width: 10vw;
    max-width: 128px;
`

export const WhosTurn = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80%;
    height: 80%;
    border-radius: 20px;
    color: white;
    text-align: center;
    background-color: #8eb997;
    border: calc(10px + 0.5vw) solid #c5a226;
    border-radius: 20px;
    padding: calc(10px + 2vh) 0;
`

export const Arrow = styled.img`
    height: 8vh;
    max-height: 80px;
    width: auto;
`
export const EndGameModalWrapper = styled.div`
    position: absolute;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: #0000007b;
    display: flex;
    justify-content: center;
    align-items: center;
`

export const EndGameModal = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50vw;
    max-width: 500px;
    height: 20vw;
    max-height: 300px;
    background-color: #c5a226;
    border-radius: 20px;
`

export const InnerEndGameModal = styled.div`
    height: 85%;
    width: 85%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-direction: column;
    background-color: #8eb997;
    color: white;
`

export const ModalText = styled.p`
    text-align: center;
    font-size: 30px;
    font-weight: bold;
    margin: 0;
`