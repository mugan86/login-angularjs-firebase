'use strict';

/**
 * @ngdoc function
 * @name loginFirebaseApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the loginFirebaseApp
 */
angular.module('loginFirebaseApp')
  .controller('MainCtrl', function ($scope) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.userdisplay = "Guest";
	var provider = new firebase.auth.GoogleAuthProvider();
	provider.addScope('https://www.googleapis.com/auth/plus.login');

	$scope.showLoginButton = false;
	$scope.showLogOutButton = false;

	if (window.localStorage.getItem('user_data') !== null)
	{
		var user = JSON.parse(window.localStorage.getItem('user_data'));
		console.log('=======================Your data is (FROM LOCAL STORAGE)==========================');
		console.log('Display Name: ' + user.name);
		console.log('Photo URL: ' + user.photo);
		console.log('Email: ' + user.email);
		console.log('ID: ' + user.id);
		$scope.showLogOutButton = true;
		$scope.userdisplay = user.name;
	}
	else
	{
		$scope.showLoginButton = true;
	}

    $scope.startLogin = function()
    {
    	firebase.auth().signInWithPopup(provider).then(function(result) {
			// This gives you a Google Access Token. You can use it to access the Google API.
			var token = result.credential.accessToken;

			// The signed-in user info inside providerData.
			var user = result.user.providerData[0];

			console.log('=======================Your data is==========================');
			console.log('Display Name: ' + user.displayName);
			console.log('Photo URL: ' + user.photoURL);
			console.log('Email: ' + user.email);
			console.log('ID: ' + user.uid);

			var user_data = {name: user.displayName, photo: user.photoURL, email: user.email, id: user.uid};

			window.localStorage.setItem('user_data', angular.toJson(user_data));

			$scope.userdisplay = user.displayName;

			window.location.reload(true);
		  // ...
		}).catch(function(error) {
		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  // The email of the user's account used.
		  var email = error.email;
		  // The firebase.auth.AuthCredential type that was used.
		  var credential = error.credential;

		  console.log(errorCode +  "******");

		  $scope.errorMessage = errorCode + errorMessage;
		  // ...
		});
    };

    $scope.closeSession = function()
    {
    	firebase.auth().signOut().then(function() {
  		// Sign-out successful.
  			console.log('Close session correctly');
  			window.localStorage.removeItem('user_data');
  			$scope.showLoginButton = true;
  			$scope.showLogOutButton = false;
  			window.location.reload(true);
  			$scope.userdisplay = "Guest";
		}, function(error) {
		  // An error happened.
		  console.log('(ERROR) Close session correctly');
		});
    };

   
  });
