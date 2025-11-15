export default function Home({setScreen, setUsername, createGame}) {
    return(
        <>
            <input  onChange={(e) => setUsername(e.target.value)} id="username"></input>
            <button onClick={createGame} id="createGame">Créer une partie</button>
            <button onClick={() => setScreen("joinGame")} id="joinGame">Rejoindre une partie</button>
        </>
    )
} 