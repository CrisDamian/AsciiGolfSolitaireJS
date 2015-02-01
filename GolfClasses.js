//Pseudoclases for the objects in the GolfSolitaire game

 function Card(rank, suite){

     // Check if rank and suite are good values
     if ( (rank % 1 === 0) && rank >=1 && rank <=13 
     && (suite % 1 === 0) && suite >=1 && suite <=4 ) {
         this.rank = rank;
         this.suite = suite;
     }else{
         //If thery're not in rules it's a joker.
         this.suite = 5;
         this.rank = 14;
     }
     
     // Returns a simple caracter code. 
     this.toString = function () {
        suiteSym = ["S", "H", "C", "D","k"];
        rankSym = ["A","2","3","4","5","6","7","8","9","10","J","Q","K","jo"];
        return rankSym[this.rank-1].concat(suiteSym[ this.suite-1]);
    }
}

// A deck of cards object.
function CardDeck() {

    this.cardStack = [];

    this.printDeck = function () {
        var string = "";

        for (var i = 0; i < this.cardStack.length - 1; i++) {
            string = string.concat(this.cardStack[i].toString() + " ");
        }
        if(this.cardStack.length > 0)
            string = string.concat(this.cardStack[i].toString());
        return string;
    }

    this.printTopC = function () {
        var card = this.cardStack.pop();
        this.cardStack.push(card);
        return card.toString();
    }

    this.popC = function () {
        return this.cardStack.pop(); 
    }

    this.pushC = function (card){
        if(card instanceof Card )
            this.cardStack.push(card);
        else
            throw "Can only push Card on CardDeck"
    }

    this.length = function () { return this.cardStack.length };
}


//WasteDeck object.
function WasteDeck (){}
WasteDeck.prototype = new CardDeck();
WasteDeck.prototype.trashNreplace = function (card) {
     if (card instanceof Card) {
         this.popC();
         this.pushC(card);
     }
 }


 //TableauDeck object.
function Tableau(waste,numberOfDecks){
     if(waste instanceof WasteDeck)
        this.waste = waste;
     else
        throw "Constructor Tableau needs a WasteDeck."
     this.decks = [];
     for (i = 0; i < numberOfDecks; i++)
        this.decks.push(new CardDeck());
 }

 // Takes one card and puts it on the waste deck.
 Tableau.prototype.takeOne = function (index) {
     var wasteCard;
     var checkCard;
     
     if (index >= 0 && index < this.decks.length) {

         wasteCard = this.waste.popC();
         checkCard = this.decks[index].popC();
        
         if (Math.abs(checkCard.rank - wasteCard.rank) == 1) {
             this.waste.pushC(checkCard);
         } else {
             this.waste.pushC(wasteCard);
             this.decks[index].pushC(checkCard);
             alert("You can put cards from the bottom of the tableau on top of the waste deck if they are consecutive in rank!");
         }

     } else { throw ("Index of tableau is wrong. index="+index)}

 }

// SelectionDeck object
function SelectionDeck(waste,tableau){
     this.tableau = tableau;
     this.waste = waste;
}
SelectionDeck.prototype = new CardDeck();
SelectionDeck.prototype.deal = function () {
     // Make cards
     for (var j = 1; j <= 4; j++) {
         for (var i = 1; i <= 13; i++) {
             var card = new Card(i, j);
             this.pushC(card);
         }
     }
	 
	 // Shuffle cards
	 for (var i = this.cardStack.length-1; i > 1; i--) {
         var k = Math.floor(i*Math.random());
         var aux = this.cardStack[i];
         this.cardStack[i] = this.cardStack[k];
         this.cardStack[k] = aux;
     }
	 
     //Deal cards
     var card;
     for (var j = 0; j < 5; j++)
     for (var i in this.tableau.decks) {
         card = this.popC();
         this.tableau.decks[i].pushC(card);
     }

}

 SelectionDeck.prototype.takeOne = function () {
     if (this.length() > 0) {
         this.waste.trashNreplace(this.popC());
     } else {
         this.endGame();
     }
 }

 SelectionDeck.prototype.endGame = function () {
     var sum = 0;
     for (var i in this.tableau.decks) {
         sum += this.tableau.decks[i].length();
     }

     if (sum > 0) {
		if(this.length()<=0){
			alert("You finished the game with "+sum+" over par!");
		}
     }
     else{
         if(this.length()<=0){
             alert("Good job!! You finished the game on par!");
         }
         else{
             alert("Great job!! You finished the game with "+this.length()+" under par!");
         }
     }
 }
 
SelectionDeck.prototype.checkWin= function () {
	var sum = 0;
     for (var i in this.tableau.decks) {
         sum += this.tableau.decks[i].length();
     }
	 if(sum == 0) { this.endGame()} 
}