import { useEffect, useState } from "react";

import Player from "../../commonComponents/Player";
import { EndGameStyle, Tabs, RankingAndStats } from "./EndGameStyle";

export default function EndGame({rankingAndStatistics}){
    const [tab, setTab] = useState("ranking");

    return(
        <EndGameStyle>
            <Tabs>
                <p onClick={() => setTab("ranking")}>Classement</p>
                <p onClick={() => setTab("statistics")}>Statistiques</p>
            </Tabs>
            <RankingAndStats>
                {tab === "ranking" && ( 
                    rankingAndStatistics.map((player, index) => (
                        <Player key={index} player={player.username} color={player.color} index={player.score}/>
                    )
                ))}
                {tab === "statistics    " && (
                    <p>EN CONSTRUCTION 🧱🔧</p>
                )}
            </RankingAndStats>
        </EndGameStyle>
    )
}