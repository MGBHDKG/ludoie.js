export default function JoinGame({joinGame, setRoomNumber}) {
    return (
        <>
            <p>METTEZ LE CODE DE LA ROOM</p>
            <input onChange={(e) => setRoomNumber(e.target.value)} id="codeRoom"></input>
            <button onClick={joinGame} id="joinRoom">REJOINDRE LA ROOM</button>
        </>
    )
}