export default function JoinGame({joinGame, setRoomNumber}) {
    return (
        <>
            <p>METTEZ LE CODE DE LA ROOM</p>
            <input onChange={(e) => setRoomNumber(e.target.value)}></input>
            <button onClick={joinGame}>REJOINDRE LA ROOM</button>
        </>
    )
}