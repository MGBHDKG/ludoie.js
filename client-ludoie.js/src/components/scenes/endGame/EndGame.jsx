import { useEffect, useState } from "react";

import Player from "../../commonComponents/Player";
import { EndGameStyle, Tabs, RankingAndStats } from "./EndGameStyle";
import {TextLudoieStyle} from "../../styles/CommonStyleComponents";

export default function EndGame({rankingAndStatistics}){
    const [tab, setTab] = useState("ranking");
    const [ranking, setRanking] = useState([]);

    useEffect(() => {
        for (let i = 0; i < rankingAndStatistics.length; i++) {
            setTimeout(() => {
            const element = rankingAndStatistics[rankingAndStatistics.length - i - 1];
            setRanking(prev => [element, ...prev]);
            }, (i + 1) * 1500);
        }
    }, []);

    return(
        <EndGameStyle>
            <Tabs>
                <TextLudoieStyle 
                    onClick={() => setTab("ranking")} 
                    style={{cursor: "pointer", backgroundColor: tab === "ranking" ? "#6fa57a80" : ""}} 
                >Classement</TextLudoieStyle>
                { ranking.length === rankingAndStatistics.length ? 
                    <TextLudoieStyle 
                    onClick={() => setTab("statistics")}
                    style={{cursor: "pointer", backgroundColor: tab === "statistics" ? "#6fa57a50" : ""}} 
                >Statistiques</TextLudoieStyle> : null}
            </Tabs>
            <RankingAndStats>
                {tab === "ranking" && ( 
                    ranking.map((player, index) => (
                        <Player key={index} player={player.username} color={player.color} index={player.score}/>
                    )
                ))}
                {tab === "statistics" && (
                    <TextLudoieStyle>EN CONSTRUCTION 🧱🔧</TextLudoieStyle>
                )}
            </RankingAndStats>
        </EndGameStyle>
    )
}