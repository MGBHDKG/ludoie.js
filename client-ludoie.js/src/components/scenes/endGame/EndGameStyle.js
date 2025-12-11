import styled from "styled-components";

export const EndGameStyle = styled.div`
    min-height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #267182;
`

export const Tabs = styled.div`
    display: flex;
    align-items: center;
    gap: 50px;
    height: 40px;
    background-color: #8eb997;
    font-size: 20px;
    color: white;
    font-weight: bold;
    border-top: 15px solid #c5a226;
    border-right: 15px solid #c5a226;
    border-bottom: 0;
    border-left: 15px solid #c5a226;
    border-radius: 20px 20px 0 0;
    margin-top: 50px;
    padding: 5px;

    p{
        cursor: pointer;
    }
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