export default function Lobby({roomNumber, players, launchGame}){
    return (
        <>
            <p>Lobby : room {roomNumber}</p>
            {players.map((player, id) => (
                <p key={id}>{player}</p>
            ))}
            <button onClick={launchGame}>LANCER LA GAME</button>
        </>
    )
}