import { HomeStyleWrapper, HomeStyle, AllHomeButtons } from "./HomeStyle";
import { LudoieInput, LudoieLogo, RedButton } from "../../styles/CommonStyleComponents";

export default function Home({setScreen, setUsername, createGame}) {
    return(
        <HomeStyleWrapper>
            <HomeStyle>
                <LudoieLogo src="Logo Final.png" alt="ludoie logo"/>
                <AllHomeButtons>
                    <LudoieInput  onChange={(e) => setUsername(e.target.value)} id="username" placeholder="Nom d'utilisateur"></LudoieInput>
                    <RedButton onClick={createGame} id="createGame">Créer une partie</RedButton>
                    <RedButton onClick={() => setScreen("joinGame")} id="joinGame">Rejoindre une partie</RedButton>
                    <RedButton>Règles du jeu</RedButton>
                </AllHomeButtons>
            </HomeStyle>
        </HomeStyleWrapper>
    )
} 