export default function Home({setScreen, setUsername, createGame}) {
    return(
        <>
            <input onChange={(e) => setUsername(e.target.value)}></input>
            <button onClick={createGame}>Créer une partie</button>
            <button onClick={() => setScreen("joinGame")}>Rejoindre une partie</button>
        </>
    )
} 