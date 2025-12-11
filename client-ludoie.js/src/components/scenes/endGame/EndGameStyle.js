import styled from "styled-components";

export const EndGameStyle = styled.div`
    min-height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #267182;
    color: white;
`

export const Tabs = styled.div`
    display: flex;
    align-items: center;
    gap: 50px;
    height: 40px;
    background-color: #8eb997;
    border-top: 15px solid #c5a226;
    border-right: 15px solid #c5a226;
    border-bottom: 0;
    border-left: 15px solid #c5a226;
    border-radius: 20px 20px 0 0;
    padding: 5px;
`

export const RankingAndStats = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 70vw;
    max-width: 700px;
    background-color: #8eb997;
    color: white;
    border: 20px solid #c5a226;
    border-radius: 20px;
    gap: 20px;
    padding: 50px 0;
`