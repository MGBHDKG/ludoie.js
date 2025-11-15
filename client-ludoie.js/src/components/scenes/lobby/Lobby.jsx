export default function Lobby({roomNumber, players, launchGame}){
    return (
        <>
            <p>Lobby : room</p>
            <p id="code">{roomNumber}</p>
            {players.map((player, id) => (
                <p key={id}>{player}</p>
            ))}
            <button onClick={launchGame} id="launchGame">LANCER LA GAME</button>
        </>
    )
}