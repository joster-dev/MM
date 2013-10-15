(function(){
	'use strict';

	var memoryGameApp = angular.module('memoryGameApp', []);

	memoryGameApp.controller('gameCtrl', function($scope, $timeout) {
		var gameConstuctor = function(){
			return {
				showMenu : true,
				showBoard : false,
				showRetry : false,
				grid : [
					[false, false],
					[false, false],
				],
				playerGuess : [],
				correct : [],
				clicks : 6,
				clicksAllowed : false,
				size : 2,
				message : ""
			};
		};
		$scope.game = gameConstuctor();

		var showPattern = function(){
			var counter = 0,
				iter = 0;
			for(var i = 0; i < $scope.game.clicks; i++) {
				$scope.game.correct.push(Math.floor(Math.random() * Math.pow($scope.game.size, 2)));
				counter += 400;
				$timeout(function(){
					var show = $scope.game.correct[iter];
					$scope.resetGrid();
					$scope.game.grid[Math.floor(show / $scope.game.size)][show % $scope.game.size] = true;
					iter++;
				}, counter);
			}
			$timeout(function(){
				$scope.resetGrid();
				$scope.game.clicksAllowed = true;
			}, counter+400);
		};

		$scope.changeViews = function(menu) {
			if(menu) {
				$scope.game = gameConstuctor();
				$scope.game.showMenu = true;
				$scope.game.showBoard = false;
				$scope.game.showRetry = false;
			}
			else {
				$scope.game.showMenu = false;
				$scope.game.showBoard = true;
				$scope.game.showRetry = false;
				$scope.game.message = "Get Ready";
				$timeout(function(){
					showPattern();
					$scope.game.message = "";
				}, 1000);
			}	
		};

		$scope.resetGrid = function() {
			for(var i = 0; i < $scope.game.size; i++) {
				for(var j = 0; j < $scope.game.size; j++) 
					$scope.game.grid[i][j] = false;
			}		
		};

		var didWin = function(){
			for(var i = 0; i < $scope.game.playerGuess.length; i++) {
				if($scope.game.playerGuess[i] !== $scope.game.correct[i]) {
					$scope.game.clicksAllowed = false;
					$scope.game.message = "Try Again";
					$timeout(function(){
						$scope.game.message = "";
						$scope.game.showRetry = true;
						$scope.game.showBoard = false;
					}, 1000);
					return;
				}
				if(i === $scope.game.clicks - 1) {
					$scope.game.clicksAllowed = false;
					var ranSeed = Math.floor(Math.random() * 3);
					if(ranSeed === 0) {
						$scope.game.message = "Great";
					}
					else if(ranSeed === 1) {
						$scope.game.message = "Congratulations";
					}
					else if(ranSeed == 2) {
						$scope.game.message = "Excellent";
					}
					$timeout(function(){
						$scope.game.message = "";
						$scope.changeViews(true);
					}, 1500);
					return;
				}
			}
		};

		$scope.randomColor = function() {
			return {'background-color' : '#' + Math.floor(Math.random()*16777215).toString(16)};
		};

		$scope.clickTile = function(i1, i2) {
			if($scope.game.clicksAllowed) {
				$scope.resetGrid();
				$scope.game.grid[i1][i2] = true;
				$scope.playerGuess.push((i1 * $scope.game.size) + i2);	
				didWin();
			}
			for(var i = 0; i < $scope.game.playerGuess.length; i++) {
				console.log($scope.game.playerGuess[i] + " ");
			}
			console.log("\n");
		};
	});
})();

