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
    height: 50vh;
`

export const Player = styled.div`
    display: flex;
    align-items: flex-end;
    justify-content: center;
    height: 100px;
    width: 200px;
`

export const Players = styled.div`
    position: absolute;
    top: 0;
    display: flex;
    justify-content: space-evenly;
    width: 100%;
`

export const WhosTurnWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 300px;
    height: 180px;
    background-color: #c5a226;
    border-radius: 20px;
`

export const Dice = styled.img`
    cursor: pointer;
`

export const WhosTurn = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #8eb997;
    width: 80%;
    height: 80%;
    border-radius: 20px;
    color: white;
    font-size: 25px;
    font-weight: bold;
`

export const Arrow = styled.img`
    height: 80px;
    width: auto;
`