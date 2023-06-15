import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [deck, setDeck] = useState("");
  const [playerCards, setplayerCards] = useState([]);
  const [oponentCards, setoponentCards] = useState([]);
  const [playerScore, setplayerScore] = useState(0);
  const [oponentScore, setoponentScore] = useState(0);
  const [checkWiner, setcheckWiner] = useState(false);
  const [result, setResult] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [restartGame, setRestartGame] = useState(true);
  const [counter, setCounter] = useState({
    oponent: 0,
    player: 0,
  })


  useEffect(() => {
    fetch("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
      .then((elm) => elm.json())
      .then((data) => {
        setDeck(data.deck_id);
      });
  }, [restartGame]);

 
  useEffect(() => {
    console.log(updateCardVal(oponentCards));
    console.log(updateCardVal(playerCards));
    setoponentScore(updateCardVal(oponentCards));
    setplayerScore(updateCardVal(playerCards));
  }, [playerCards]);

  useEffect(() => {
    if (playerScore > 21) {
      setcheckWiner(true);
      setResult("You lose");
      changeCounter("You lose")
    }
  }, [playerScore]);

function addName(){
  if(playerName === ""){
    let name = prompt("Please enter your name:");
    console.log("promt " + name)
    if (name === "" || name === null) {
      setPlayerName("Player 1")
    } else {
      setPlayerName(name);
    }
  }
  startGame()
}


  function startGame() {
    fetch(`https://www.deckofcardsapi.com/api/deck/${deck}/draw/?count=4`)
      .then((elm) => elm.json())
      .then((data) => {
        console.log(data);
        setplayerCards(data.cards.slice(0, 2));
        setoponentCards(data.cards.slice(2));
        console.log(playerCards);
        console.log(oponentCards);
      });
  }

  function updateCardVal(cards) {
    let sum = 0;
    for (let i = 0; i < cards.length; i++) {
      if (cards[i].value === "ACE") {
        sum += 1;
      } else if (cards[i].value.length > 1) {
        sum += 10;
      } else {
        sum += Number(cards[i].value);
      }
    }
    return sum;
  }

  function getCard() {
    fetch(`https://www.deckofcardsapi.com/api/deck/${deck}/draw/?count=1`)
      .then((elm) => elm.json())
      .then((data) => {
        setplayerCards([...playerCards, data.cards[0]]);
      });
  }

  function definedWiner() {
    setcheckWiner(!checkWiner);
    if (playerScore > oponentScore) {
      setResult("You win");
      changeCounter("You win")
    } else  if (playerScore === oponentScore) {
      setResult("Draw");
      changeCounter("Draw");
    }
     else {
      setResult("You lose");
      changeCounter("You lose");
    }
  }

  function changeCounter(result){
    let newCounter = JSON.parse(JSON.stringify(counter));
    if (result === "You win") {
  newCounter.player = newCounter.player + 1;

    } else if (result === "Draw") {
      newCounter.player = newCounter.player + 1;
newCounter.oponent = newCounter.oponent +1;
    } else {
      newCounter.oponent = newCounter.oponent +1;
    }
   setCounter(newCounter);
  }

 




function restart(){
 setDeck("");
 setplayerCards ([]);
  setoponentCards([]);
  setplayerScore (0);
  setoponentScore(0);
  setcheckWiner(false);
  setResult("");
 setRestartGame(!restartGame);

}





  return (
    <div className="App">
      <h2>{result}</h2>
      {!checkWiner ? <></> : <div><h3>Player2</h3> <p>{counter.oponent} : {counter.player} </p> <h3>{playerName}</h3> </div> }
      {checkWiner === false ? 
      <div>
      { oponentCards.length > 0  ? <></> : <button onClick={() =>  addName()}>Start game</button>}
      {oponentCards.length > 0 ? (
        <button onClick={(nextCard) => getCard(nextCard)}>Get card</button>
      ) : (
        <></>
      )}
     {oponentScore === 0  ? <></>: <button onClick={() => definedWiner()}>Finish game</button>  } </div>:  <button onClick={()=> restart()} >Restart game</button>
    }
      <div className="box">
        <p>Player2</p>
        {checkWiner === false ? <></> : <p>{oponentScore}</p>}
        <div className="card_set_opnt">
          {checkWiner === true ? (
            oponentCards.map((card) => (
              <img key={card.code} src={card.image} alt={card.code} />
            ))
          ) : oponentCards.length > 0 ? (
            <p>2 карты</p>
          ) : (
            <></>
          )}
        </div>
        <p>{playerName}</p>
        { oponentScore === 0 ? <></> : <p>{playerScore}</p>}

        <div className="card_set_pl">
          {playerCards.map((card) => (
            <img key={card.code} src={card.image} alt={card.code} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
