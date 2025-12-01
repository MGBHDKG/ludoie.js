import { RedButton, LudoieInput } from "../../styles/CommonStyleComponents"
import { JoinGameStyle } from "./JoinGameStyle"

export default function JoinGame({joinGame, setRoomNumber}) {
    return (
        <JoinGameStyle>
            <LudoieInput onChange={(e) => setRoomNumber(e.target.value)} id="codeRoom" placeholder="Veuillez entrer le code de la room"></LudoieInput>
            <RedButton onClick={joinGame} id="joinRoom">REJOINDRE LA ROOM</RedButton>
        </JoinGameStyle>
    )
}