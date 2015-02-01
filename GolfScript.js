//The script for playing the GolfSolitaire game.

//Initializations
var waste = new WasteDeck();
var tableau = new Tableau(waste, 7);
var seldek = new SelectionDeck(waste, tableau);
try {
	seldek.deal();
	seldek.takeOne();
} catch (err) {
	alert("Error in loading the page: " + err.Message);
}

window.onload=function(){
	//Adding event handlers
	for (var i=0;i<7;i++){
		var table = document.getElementById("table"+i);
		table.index=i;
		table.addEventListener(
			'click',
			function(event){tableau.takeOne(this.index); printT();});
	} 
	document.getElementById("selplace").addEventListener(
						'click',
						function(event){seldek.takeOne(); printT();});
	//Printing the first state
	printT();
}

// This function prints the cards onto the page. And checks if you win.
function printT() {
	try {
		// Print waste deck.
		var cardface = document.getElementById(waste.printTopC()).cloneNode(true);
		cardface.attributes["id"] = "wcard";
		var node = document.getElementById("wastedeck");
		if (node.childElementCount < 1) node.appendChild(cardface);
		else node.replaceChild(cardface, node.firstChild);

		var noEmptyD = 0;
		// Print Tableau.
		for (var i = 0; i < tableau.decks.length; i++) {

			var pString = tableau.decks[i].printDeck();
			var gtable = document.getElementById("table" + i);

			while (gtable.firstChild) {
				gtable.removeChild(gtable.firstChild);
			}


			if (pString == "") {
				noEmptyD++;
			}
			else {
				var nameA = pString.split(" ");
				for (var j = 0; j < nameA.length; j++) {
					var s = nameA[j];
					if(j<nameA.length-1) s =s.substring(0,s.length-1); 
					cardface = document.getElementById(s).cloneNode(true);
					cardface.attributes["id"] = "";
					gtable.appendChild(cardface);
				}
			}

		}
		
		//Print selection deck.
		if (seldek.length() == 0) {
			var selplace = document.getElementById("selplace");
			cardface = document.getElementById("jok").cloneNode(true);
			selplace.replaceChild(cardface, selplace.childNodes[1]);
		}

		// Check if you win.
		if (noEmptyD == 7) {
			seldek.endGame();
		}

	} catch (err) {
		alert("Error in printing:" + err.Message);
	}

}

