import { useState } from "react";

export default function EndGame({rankingAndStatistics}){
    const [tab, setTab] = useState("ranking");
    console.log(rankingAndStatistics);

    return(
        <>
            <h1>ENDGAME</h1>
            {tab === "ranking" && (
                <p></p>
            )}
            {tab === "statistic"} && (
                
            )
        </>
    )
}