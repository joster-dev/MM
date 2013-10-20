(function(){
	'use strict';

	var memoryGameApp = angular.module('memoryGameApp', []);

	memoryGameApp.controller('gameCtrl', function($scope, $timeout) {
		var highlightTile;	//Stupid "global" variable.

		var tile = function(selected, color) {
			this.selected = selected;
			this.color = color;
		};

		var randomColor = function() {
			return Math.floor(Math.random()*16777215).toString(16);
		};

		var createGrid = function() {
			var grid = [];
			for(var i = 0; i < $scope.game.size; i++) {
				grid[i] = [];
				for(var j = 0; j < $scope.game.size; j++) {
					grid[i][j] = new tile(false, randomColor());
				}
			}
			return grid;
		};

		var gameConstuctor = function(){
			return {
				showMenu      : true,
				showBoard     : false,
				showRetry     : false,
				playerGuess   : [],
				correct       : [],
				clicks        : 5,
				clicksAllowed : false,
				size : 2,
				//grid : [
				//	[false, false],
				//	[false, false],
				//]
				gird : []
			};
		};
		$scope.game = gameConstuctor();

		$scope.message = "";

		$scope.option1 = [
			{text : "Easy", tileClicks : 5, selected : true},
			{text : "Medium", tileClicks : 10, selected : false},
			{text : "Difficult", tileClicks : 15, selected : false}
		];
		$scope.option2 = [
			{text : "Small", gridLength : 2, selected : true},
			{text : "Normal", gridLength : 3, selected : false},
			{text : "Large", gridLength : 4, selected : false}
		];

		$scope.option1Choice = function(id) {
			$scope.game.clicks = $scope.option1[id].tileClicks;

			for(var a = 0; a < $scope.option1.length; a++) {
				a === id ? $scope.option1[a].selected = true : $scope.option1[a].selected = false;
			}
		};
		$scope.option2Choice = function(id) {
			$scope.game.size = $scope.option2[id].gridLength;

			for(var a = 0; a < $scope.option2.length; a++) {
				a === id ? $scope.option2[a].selected = true : $scope.option2[a].selected = false;
			}
		};

		var showPattern = function(){
			var counter = 0,
				iter = 0;
			for(var i = 0; i < $scope.game.clicks; i++) {
				$scope.game.correct.push(Math.floor(Math.random() * Math.pow($scope.game.size, 2)));
				counter += 800;
				$timeout(function(){
					var show = $scope.game.correct[iter];
					$scope.resetGrid();
					console.log(Math.floor(show / $scope.game.size) + " and " + show % $scope.game.size);
					$timeout(function() {
						$scope.game.grid[Math.floor(show / $scope.game.size)][show % $scope.game.size].selected = true;
					}, 50);
					iter++;
				}, counter);
			}
			$timeout(function(){
				$scope.resetGrid();
				$scope.game.clicksAllowed = true;
			}, counter+800);
		};

		$scope.changeViews = function(menu) {
			if(menu) {
				$scope.game = gameConstuctor();
				$scope.game.showMenu = true;
				$scope.game.showBoard = false;
				$scope.game.showRetry = false;
			}
			else {
				$scope.game.showRetry = false;
				$scope.game.showMenu = false;
				$scope.game.grid = createGrid();
				$scope.message = "Get Ready";
				$scope.game.playerGuess = [];
				$scope.game.correct = [];
				$timeout(function(){
					$scope.game.showBoard = true;
					$scope.game.showRetry = false;
					showPattern();
					$scope.message = "";
				}, 1000);
			}	
		};

		$scope.resetGrid = function() {
			for(var i = 0; i < $scope.game.size; i++) {
				for(var j = 0; j < $scope.game.size; j++) {
					$scope.game.grid[i][j].selected = false;
				}
			}		
		};

		var didWin = function(){
			for(var i = 0; i < $scope.game.playerGuess.length; i++) {
				if($scope.game.playerGuess[i] !== $scope.game.correct[i]) {
					$timeout.cancel(highlightTile);
					$scope.resetGrid();
					$scope.game.clicksAllowed = false;
					$scope.game.showBoard = false;
					$scope.message = "Try Again";
					$timeout(function(){
						$scope.message = "";
						$scope.game.showRetry = true;
						$scope.game.showBoard = false;
					}, 1000);
					return;
				}
				if(i === $scope.game.clicks - 1) {
					$scope.game.clicksAllowed = false;
					$scope.game.showBoard = false;
					var ranSeed = Math.floor(Math.random() * 7);
					if(ranSeed === 0) {
						$scope.message = "Great";
					}
					else if(ranSeed === 1) {
						$scope.message = "Congratulations";
					}
					else if(ranSeed === 2) {
						$scope.message = "Excellent";
					}
					else if(ranSeed === 3) {
						$scope.message = "Wonderful";
					}
					else if(ranSeed === 4) {
						$scope.message = "Astounding";
					}
					else if(ranSeed === 5) {
						$scope.message = "Spectacular";
					}
					else if(ranSeed === 6) {
						$scope.message = "Genius";
					}
					$timeout(function(){
						$scope.message = "";
						$scope.changeViews(true);
					}, 1500);
					return;
				}
			}
		};

		$scope.clickTile = function(i1, i2) {
			if($scope.game.clicksAllowed) {
				$scope.resetGrid();
				$scope.game.playerGuess.push((i1 * $scope.game.size) + i2);	
				highlightTile = $timeout(function() {
					$scope.game.grid[i1][i2].selected = true;
					didWin();
				}, 50);
			}
			for(var i = 0; i < $scope.game.playerGuess.length; i++) {
				console.log($scope.game.playerGuess[i] + " ");
			}
			console.log("\n");
		};
	});
})();

