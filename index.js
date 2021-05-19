const express = require('express')
const app = express()
const port = 3000

class Player {
    constructor(name, cards) {
        this.name = name
        this.cards = cards
    }
}
// ---------------------------
// using console.log for returns
// ---------------------------

let player1 = new Player("Sam", [])
let player2 = new Player("Dealer", [])

app.listen(port, () => {
    console.log('app listening at http://localhost:3000')
})

const deckCards =
    [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6,
        6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10]

app.get('/initializeGame', (req, res) => {
    // initialize players with two random cards each
    player1.cards = [5, 8]
    player2.cards = [1, 5]
    console.log(player1.cards)
    console.log(player2.cards)
})

app.get('/showCards', (req, res) => {
    // endpoint to show both players cards (not required)
    console.log(player1.cards)
    console.log(player2.cards)
  //  res.send(`Sam's cards: ${player1.cards} | Dealer's cards: ${player2.cards}`)
})

app.get('/player1TakeCard', (req, res) => {
    // endpoint to be used to take a card from the deck (player1)
    var card = takeCard(player1,player2)
  //  res.send(card)

})

app.get('/dealerTakeCard', (req, res) => {
    // endpoint to be used to take a card from the deck (dealer)
    var card = takeCard(player2,player1)
   // res.send(card)

})

// functions of the game

// reset the game so that both players now have no cards
// will need to run the initializeGame endpoint after
function resetGame() {
    player1.cards = []
    player2.cards = []
}

// allow the player called sam (player 1) to take a card from the deck
function takeCard(player1,player2) {
    var card = 6
    if ( (calculateTotal(player1) >= 17) && (calculateTotal(player1) <= 21) ) {
        // do not let user take another card as rules state
        // check if other user is in same position
        
        if (((calculateTotal(player2) >= 17) && (calculateTotal(player2) <= 21)) || ((calculateTotal(player2) + card >= 17) && (calculateTotal(player2) + card <= 21))  ) {
            determineWinner()
            return
        }
    } else if (calculateTotal(player1) < 17) {
        console.log(card)
        player1.cards.push(card)
        if (determineLoss(player1) == false) {
            // checker for winner
            if ( (calculateTotal(player1) >= 17) && (calculateTotal(player1) <= 21) ) {
                // do not let user take another card as rules state
                // check if other user is in same position
                
                if (((calculateTotal(player2) >= 17) && (calculateTotal(player2) <= 21)) || ((calculateTotal(player2) + card >= 17) && (calculateTotal(player2) + card <= 21))  ) {
                    determineWinner()
                    return
                }
        }
        return card
    } else {
        // do nothing as user has gone over 21 - this would never be called if handled 
        // correctly in front-end side
        console.log("Cannot take another card - busted already")
    }

}

// functionality to determine if any player has won/lost the game
function determineLoss(player) {
    var total = calculateTotal(player)
    console.log(total)
    if (total > 21) {
        console.log("BUST!")
        resetGame()
        return true
    } else if (total <= 21) {
        return false
    }
}

function calculateTotal(player) {
    var total = 0
    for (element of player.cards) {
        total += element
    }
    return total
}

// check if both users have less than 21 and cannot pick up a card
function determineWinner () {
    var score_sam = calculateTotal(player1)
    var score_dealer = calculateTotal(player2)
    if (score_sam > score_dealer) {
        console.log("Sam is the winner!")
        resetGame()
        return "Sam is the winner!"
    } else if (score_sam == score_dealer) {
        console.log("Draw, both sam and the dealer have the same amount!")
        resetGame()
        return "Draw, both sam and the dealer have the same amount!"
    } else if (score_dealer > score_sam) {
        console.log("Dealer Wins")
        resetGame()
        return "Dealer Wins!"
    }
}
}
