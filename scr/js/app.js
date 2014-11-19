var testText = "This is just a test. This is the text that the info window will show. Also, Cole is a pretty cool guy!";

var cityCircle = [];
var geocoder;
var map;
var infowindow;
var marker;
var MY_MAPTYPE_ID = 'custom_style';

var functionTest;

function initialize() {

	var featureOpts = [
    {
      stylers: [
        { hue: '#b96a04' },
        { visibility: 'simplified' },
        { gamma: 0.2 },
        { weight: 0.3},
        { saturation: 35},
        { lightness: 10},
        
      ]
    },
    {
      elementType: 'labels',
      stylers: [
        { visibility: 'on' }
      ]
    },
    {
      featureType: 'water',
      stylers: [
        { color: '#f2e0af' },
        { saturation: 50 },
        { lightness: 100},
        
      ]
    }
  ];

	geocoder = new google.maps.Geocoder();
		
	//var latLng = new google.maps.LatLng(-34.397, 150.644);
  	var mapOptions = {
      scrollwheel: false,
    	zoom: 2,
    	center: new google.maps.LatLng(36.7525000, 3.0419700),
    	mapTypeControlOptions: {
      		mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
    	},
    	mapTypeId: MY_MAPTYPE_ID
  	};
  	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  	var styledMapOptions = {
    	name: 'CP Style'
  	};

  	var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);

map.mapTypes.set(MY_MAPTYPE_ID, customMapType);
}

function getAddress(address) {
	geocoder.geocode( { 'address': address}, function(results, status) {
  	if (status == google.maps.GeocoderStatus.OK) {
  		map.setCenter(results[0].geometry.location);
  		marker = new google.maps.Marker({
      		map: map,
      		position: results[0].geometry.location,
          icon: 'images/location.png'
  		});	
  	} else {
		  alert('Geocode was not successful for the following reason: ' + status);
  	}



    // ******************* This is the information that will be displayed in the original marker *******************
    var displayText = "** Add the text format here. It should be text in html format. The following commented text it an example **";

    // '<div id="content">'+
    // '<div id="siteNotice">'+
    // '</div>'+
    // '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
    // '<div id="bodyContent">'+
    // '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
    // 'sandstone rock formation in the southern part of the '+
    // 'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
    // 'south west of the nearest large town, Alice Springs; 450&#160;km '+
    // '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
    // 'features of the Uluru - Kata Tjuta National Park. Uluru is '+
    // 'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
    // 'Aboriginal people of the area. It has many springs, waterholes, '+
    // 'rock caves and ancient paintings. Uluru is listed as a World '+
    // 'Heritage Site.</p>'+
    // '<p>Attribution: Uluru, <a href="http://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
    // 'http://en.wikipedia.org/w/index.php?title=Uluru</a> '+
    // '(last visited June 22, 2009).</p>'+
    // '</div>'+
    // '</div>'

    // ******************* This is the end of the information that will be displayed in the original marker *******************





  infowindow = new google.maps.InfoWindow({
    content: testText
  });

  // ****** Adds an event listener to the marker that -opens the info window ******
  google.maps.event.addListener(marker, 'mouseover', function() {
    var msg = '<p><b>Name: ' + address + '</b><p>' +
      '<p><b>Refugee. Population: ' + 163756 + '</b><p>' +
      "<a href='#who'>Click for more.</a>";

    infowindow.setContent(msg);
    infowindow.open(map, marker);
  });

  // ****** Adds an event listener to the marker that -closes the info window- ******
  google.maps.event.addListener(marker, 'click', function() {
    setAddressOnClick(address);
    console.log(testText);
  });

	google.maps.event.addListener(map, 'click', function() {
    infowindow.close(map, marker);
  });
  });
}

function codeAddress() {
	localStorage.setItem("UserCountry", document.getElementById("country").value);
	getAddress(document.getElementById('address').value);
}

function addRefugeesLocations (address, population, index) {
    geocoder.geocode( { 'address': address}, function(results, status) {


      // var radius = Math.ceil(Math.log(population)/Math.log(2))+400000;
      var radius;
      if (population === 0) {
        radius = 0;
      } else if (population > 0 && population <= 1000) {
        radius = 300000;
      } else if (population > 1000 && population <= 10000) {
        radius = 300005;
      } else if (population > 10000 && population <= 100000) {
        radius = 300010;
      } else if (population > 100000 && population <= 1000000) {
        radius = 300100;
      } else {
        radius = 300200;
      }

        if (status == google.maps.GeocoderStatus.OK) {
            var populationOptions = {
              strokeColor: '#3F2807',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#FFFFFF',
              fillOpacity: 0.35,
              map: map,
              center: results[0].geometry.location,
              radius: radius
            };
          // Add the circle for this city to the map.
          cityCircle[index] = new google.maps.Circle(populationOptions);
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }

        // ****** Adds the event listener to each 'cityCircle' placed ******
        google.maps.event.addListener(cityCircle[index], 'mouseover', function(e) {

          var msg = '<p><b>Name: ' + address + '</b><p>' +
            '<p><b>Refugee. Population: ' + population + '</b><p>' +
            "<a href='#who'>Click for more.</a>";;

          infowindow.setContent(msg);

          var blankMarker = new google.maps.Marker({
            map: map,
            position: cityCircle[index].getCenter(),
          });
          blankMarker.setVisible(false);
          infowindow.open(map, blankMarker);
        });

        google.maps.event.addListener(cityCircle[index], 'click', function() {
          setAddressOnClick(address);
          console.log(testText);
        });

      });
}

google.maps.event.addDomListener(window, 'load', initialize);

function storeCountry() {
	document.getElementById('searchCountry').style.display='block';
	if (document.getElementById("name").value != "" && document.getElementById("name").value != "Undefined") {
		localStorage.setItem("Username", document.getElementById("name").value);
		document.getElementById("tabTitle").innerHTML = document.getElementById("name").value + " is HELPING";
	}
	
	localStorage.setItem("UserCountry", document.getElementById("country").value);
	getAddress(localStorage.getItem("UserCountry"));
}

angular.module("mainpageApp", ["firebase"])
.factory("ProgramFunds", ["$firebase", function($firebase) {
  var ref = new Firebase("https://radiant-fire-1436.firebaseio.com/ProgramsFunds");
  return $firebase(ref);
}])
.factory("RefugeesLocation", ["$firebase", function($firebase) {
  var ref = new Firebase("https://radiant-fire-1436.firebaseio.com/Refugees");
  return $firebase(ref);
}])
.factory("CounrtiesLocation", ["$firebase", function($firebase) {
  var ref = new Firebase("https://radiant-fire-1436.firebaseio.com/General");
  return $firebase(ref);
}])
.controller("mainpageController", ["$scope", "ProgramFunds", "RefugeesLocation", "CounrtiesLocation",
  function($scope, programFunds, refugeesLocation, counrtiesLocation) {

      //addRefugeesLocations('mozambique', 200);

	$scope.funds = programFunds;
    $scope.locations = refugeesLocation;

       //****** Adds the functionality to see all populations ******
	   var index = 0;
       setInterval(function(){
         if (index < 153) {
           addRefugeesLocations($scope.locations.$child(index).country, $scope.locations.$child(index).population, index);
           index = index + 1;
         }
       }, 1000); 

    $scope.selectedCountry = localStorage.getItem("UserCountry");
    $scope.counrtiesLocation = counrtiesLocation;
    
    $scope.setAddress = function () {
      $scope.selectedCountry = $scope.searchCountry;
      getAddress($scope.selectedCountry);   
    }

    $scope._setAddressOnClick = function(address) {
      $scope.selectedCountry = address;
      console.log($scope.selectedCountry);
    }

    $scope.$on('clickCountry', function(e, address){
      console.log('asdf');
      console.log(address);
      $scope.selectedCountry = address;
    });
setAddressOnClick = function (address) {

      // $compile(angular.element('.info')(scope));
console.log('kjh');
      var scope = angular.element(document).scope(); scope.$apply(scope.$broadcast('clickCountry', address));

      // $scope._setAddressOnClick(address);
    }


      /*setInterval(function(){
        var donation = Math.floor(Math.random() * 901) + 100;
        var donateToProgram = Math.floor(Math.random() * 14) + 0;
        var currentFund = $scope.funds.$child(donateToProgram).funds + donation;
        var data = {
          funds: currentFund 
        }
        $scope.funds.$child(donateToProgram).$update(data);       
      }, Math.floor(Math.random() * (20000 - 1000 + 1)) + 1000);*/
    }
]);