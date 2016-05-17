
var deck = shuffle(newDeck());

var dealerHand = [];
var playerHand = [];

function newDeck() {
  var deck = [];
  for (var i = 1; i <= 13; i++) {
    deck.push({ point: i, suit: 'spades' });
    deck.push({ point: i, suit: 'hearts' });
    deck.push({ point: i, suit: 'clubs' });
    deck.push({ point: i, suit: 'diamonds' });
  }
  return deck;
}

function shuffle(deck) {
  var newDeck = [];
  while (deck.length > 0) {
    var idx = Math.floor(Math.random() * deck.length);
    var card = deck[idx];
    newDeck.push(card);
    deck.splice(idx, 1);
  }
  return newDeck;
}

function resetGame() {
  deck = shuffle(newDeck());
  dealerHand = [];
  playerHand = [];
  $('#player-points').text('');
  $('#dealer-points').text('');
  $('#messages').text('');
  $('#player-hand').html('');
  $('#dealer-hand').html('');
}

function dealCard(hand, element) {
  var card = deck.pop();
  hand.push(card);

  var url = getCardImageUrl(card);
  var cardHTML = '<img class="card" src="' + url + '"/>';
  $(element).append(cardHTML);
}

function getCardImageUrl(card) {
  
  var cardName;
  if (card.point === 1) {
    cardName = 'ace';
  } else if (card.point === 11) {
    cardName = 'jack';
  } else if (card.point === 12) {
    cardName = 'queen';
  } else if (card.point === 13) {
    cardName = 'king';
  } else {
    cardName = card.point;
  }
  return 'images/' + cardName + '_of_' + card.suit + '.png';
}

function calculatePoints(hand) {

  hand = hand.slice(0);

  function compare(card1, card2) {
    return card2.point - card1.point;
  }
  hand.sort(compare);
  var sum = 0;
  for (var i = 0; i < hand.length; i++) {
    var card = hand[i];
    if (card.point > 10) {
      sum = sum + 10;
    } else if (card.point === 1) {
      if (sum + 11 <= 21) {
        sum = sum + 11;
      } else {
        sum = sum + 1;
      }
    } else {
      sum = sum + card.point;
    }
  }
  return sum;
}

function displayPoints() {
  var dealerPoints = calculatePoints(dealerHand);
  $('#dealer-points').text(dealerPoints);
  var playerPoints = calculatePoints(playerHand);
  $('#player-points').text(playerPoints);
}

function checkForBusts() {
  var playerPoints = calculatePoints(playerHand);
  if (playerPoints > 21) {
    $('#messages').text('You busted. Better luck next time!');
    return true;
  }
  var dealerPoints = calculatePoints(dealerHand);
  if (dealerPoints > 21) {
    $('#messages').text('Dealer busted. You win!');
    return true;
  }
  return false;
}

$(function () {

  $('#deal-button').click(function () {
    resetGame();
    dealCard(playerHand, '#player-hand');
    dealCard(dealerHand, '#dealer-hand');
    dealCard(playerHand, '#player-hand');
    dealCard(dealerHand, '#dealer-hand');
    displayPoints();
    checkForBusts();
  });

  $('#hit-button').click(function () {
    dealCard(playerHand, '#player-hand');
    displayPoints();
    checkForBusts();
  });

  $('#stand-button').click(function () {
    var dealerPoints = calculatePoints(dealerHand);
    while (dealerPoints < 17) {
      dealCard(dealerHand, '#dealer-hand');
      dealerPoints = calculatePoints(dealerHand);
    }
    displayPoints();
    if (!checkForBusts()) {

      var playerPoints = calculatePoints(playerHand);
      var dealerPoints = calculatePoints(dealerHand);
      if (playerPoints > dealerPoints) {
        $('#messages').text('You won!');
      } else if (playerPoints === dealerPoints) {
        $('#messages').text('Push');
      } else {
        $('#messages').text('You lose!');
      }
    }

  });

});
