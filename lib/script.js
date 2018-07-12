//
// Blackjack 
// originally created by Mark Zamoyta
// 

let suits  = [  ' Kier',  'Trefl',  'Karo',  'Pik'];
    values = [  'As',  'Król',  'Dama',  'Walet', '10', 
             '9',  '8',  '7',  '6', '5', '4', '3', '2'];

let textArea =      document.getElementById('text-area'),
    newGameButton = document.getElementById('new-game-button'),
    hitButton =     document.getElementById('hit-button'),
    stayButton =    document.getElementById('stay-button');

let gameStarted = false,
    gameOver = false,
    playerWon = false,
    draw = false,
    dealerCards = [],
    playerCards = [],
    dealerScore = 0,
    playerScore = 0,
    deck = [];

hitButton.style.display = 'none';
stayButton.style.display = 'none';
showStatus();

newGameButton.addEventListener('click', function(){

  gameStarted = true;
  gameOver = false;
  playerWon = false;
  draw = false,

  deck = createDeck();
  shuffleDeck(deck);
  dealerCards = [getNextCard(), getNextCard()];
  playerCards = [getNextCard(), getNextCard()];

  textArea.innerText = 'Started...';
  newGameButton.style.display = 'none';
  hitButton.style.display = 'inline';
  stayButton.style.display = 'inline';
  showStatus();
  checkForEndOfGame();
});

hitButton.addEventListener('click', function(){
  playerCards.push(getNextCard());
  checkForEndOfGame();
  showStatus();  
});


stayButton.addEventListener('click', function(){
  gameOver = true;
  checkForEndOfGame();
  showStatus();
});



function createDeck(){
  let deck = [];
  for(let suitIdx=0; suitIdx < suits.length; suitIdx++){
    for(valueIdx=0; valueIdx < values.length; valueIdx++){
      let card = {
        suit: suits[suitIdx],
        value: values[valueIdx]
      }
      deck.push(card);
    }
  }
  return deck;
}

function shuffleDeck(deck){
  for (let i=0; i < deck.length; i++){
    let swapIdx = Math.trunc(Math.random()*deck.length);
    let tmp = deck[swapIdx];
    deck[swapIdx] = deck[i];
    deck[i] = tmp;
  }
}

function getNextCard(){
  return deck.shift();
}

function getCardString(card){
  return card.value + " " + card.suit;
}

function getCardNumberValue(card){
  switch(card.value){
    case 'As':
      return 1;
    case 'Król':
    case 'Dama':
    case 'Walet':
      return 10;
    default:
      return parseInt(card.value);
  }
}

function getScore(cardArray){
  let score = 0;
  let hasAce = false;
  for (let i = 0; i < cardArray.length; i++){
    let card = cardArray[i];
    score += getCardNumberValue(card);
    if(card.value === 'As'){
      hasAce = true;
    }
  }
  if(hasAce && score + 10 <= 21){
    return score + 10;
  }
  return score;
}

function updateScores(){
  dealerScore = getScore(dealerCards);
  playerScore = getScore(playerCards);
}

function checkForEndOfGame(){

  updateScores();

  if(playerScore === 21 && dealerScore ===21){
    draw = true;
    gameOver = true;
    showStatus();
  }

  else if(dealerScore === 21){
    playerWon = false;
    gameOver = true;
    showStatus();
  }
  else if(playerScore === 21){
    playerWon = true;
    gameOver=true;
    showStatus();
  }

  if(gameOver){

    while((dealerScore<playerScore && playerScore < 21 && dealerScore < 21) || (dealerScore === playerScore && dealerScore <= 17) ){
      dealerCards.push(getNextCard());
      updateScores();
    }
  }

  if(playerScore > 21){
    playerWon = false;
    gameOver = true;
  }
  else if(dealerScore > 21){
    playerWon = true;
    gameOver=true;
  }
  else if(gameOver){

    if(playerScore > dealerScore){
      playerWon = true;
    }
    else if(playerScore > dealerScore){
      playerWon = false;
    }
    else if(playerScore === dealerScore) {
      draw = true;
    }
  }
}

function showStatus(){
  if(!gameStarted){
    textArea.innerText = "Witaj w grze Blackjack!";
    return;
  }

  let dealerCardString = '';
  for(let i=0; i<dealerCards.length; i++){
    dealerCardString += "\t" + getCardString(dealerCards[i]) + '\n';
  }

  let playerCardString = '';
  for(let i=0; i<playerCards.length; i++){
    playerCardString += "\t" + getCardString(playerCards[i]) + '\n';
  }

  updateScores();

  textArea.innerText = 
    'Krupier ma:\n' + dealerCardString + '(punkty: ' + dealerScore + ')\n\n' +
    'Gracz ma:\n'   + playerCardString + '(punkty: ' + playerScore + ')\n\n';

  if(gameOver){
    if(draw){
      textArea.innerText += "REMIS!";
    }
    else if(playerWon){
      textArea.innerText += "ZWYCIĘSTWO!";
    }
    else{
      textArea.innerText += "PORAŻKA!";
    }
    newGameButton.style.display = 'inline';
    hitButton.style.display = 'none';
    stayButton.style.display = 'none';
  }

}
