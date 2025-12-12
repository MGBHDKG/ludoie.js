import { HomeStyle, AllHomeButtons } from "./HomeStyle";
import { LudoieInput, LudoieLogo, RedButton } from "../../styles/CommonStyleComponents";

export default function Home({setScreen, setUsername, createGame, username, errorMessage, displayError}) {
    return(
        <HomeStyle>
                {errorMessage ? 
                    <div id="errorMessage">
                        <img src="marque.png"/>
                        <p>{errorMessage}</p>
                    </div> 
                : null}
                <LudoieLogo src="Logo Final.png" alt="ludoie logo"/>
                <AllHomeButtons>
                    <LudoieInput  onChange={(e) => setUsername(e.target.value)} id="username" placeholder="Nom d'utilisateur"></LudoieInput>
                    <RedButton onClick={createGame} id="createGame">Créer une partie</RedButton>
                    <RedButton onClick={() => {
                        var error = "";
                        if(username === "") error = "Nom d'utilisateur vide";
                        if(username.length > 15) error = "Nom d'utilisateur trop long"
                        if(error === "") setScreen("joinGame"); 
                        else displayError(error);
                        }
                    } 
                    id="joinGame">Rejoindre une partie</RedButton>
                    <RedButton onClick={() => {alert("PAGE EN TRAVAUX")}}>Règles du jeu</RedButton>
                </AllHomeButtons>
        </HomeStyle>
    )
} 