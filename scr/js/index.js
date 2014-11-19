angular.module("signinForm", ["firebase"])
	.factory("RefugeesCountries", ["$firebase", function($firebase) {
		var ref = new Firebase("https://radiant-fire-1436.firebaseio.com/Countries");
		return $firebase(ref);
	}])
	.controller("signinFormController", ["$scope", "RefugeesCountries",
		function($scope, refugeesCountries) {
			$scope.countries = refugeesCountries;
			console.log($scope.countries);
			$scope.enterSite = function() {
				if ($scope.usercountry != null) {
					localStorage.setItem("Username", $scope.username);
					localStorage.setItem("UserCountry", $scope.usercountry);
					location.replace("mappage.html");
				} else {
					alert ("You're missing some information");
				}
			};
		}
]);