/*
	Basic functionality of Help Me Decide application.
	Author: Tyler Roland
	Date Created: 1/10/17
	Last Modified: 1/21/17
*/

var foodArray = ["Afghan", "African", "American (New)", "American (Traditional)", "Arabian", "Argentine", "Armenian", "Asian Fusion", "Austrailian",
"Bangladeshi", "Barbeque", "Basque", "Belgian", "Brasseries", "Brazilian", "Breakfast & Brunch", "British", "Buffets", "Burgers", "Burmese", "Cafes",
"Cafeteria", "Cajun/Creole", "Cambodian", "Caribbean", "Catalan", "Cheesesteaks", "Chicken Shop", "Chicken Wings", "Chinese", "Comfort Food", "Creperies",
"Cuban", "Czech", "Delis", "Diners", "Dinner Theater", "Ethiopian", "Fast Food", "Filipino", "Fish & Chips", "Fondue", "Food Court", "Food Stands", "French",
"Gastropubs", "German", "Gluten-Free", "Greek", "Guamanian", "Halal", "Hawaiian", "Himalayan/Nepalese", "Honduran", "Hong Kong Style Cafe", "Hot Dogs", "Hungarian",
"Iberian", "Indian", "Indonesian", "Irish", "Italian", "Japanese", "Kebab", "Korean", "Kosher", "Laotian", "Latin American", "Live/Raw Food", "Malaysian", "Mediterranean",
"Mexican", "Middle Eastern", "Modern European", "Mongolian", "Moroccan", "New Mexican Cuisine", "Nicaraguan", "Noodles", "Pakistani", "Pan Asian", "Persian/Iranian",
"Peruvian", "Pizza", "Polish", "Pop-Up Restaurants", "Portuguese", "Poutineries", "Russian", "Salad", "Sandwiches", "Scottish", "Seafood", "Singaporean", "Slovakian", 
"Soul Food", "Soup", "Southern", "Spanish", "Sri Lankan", "Steakhouses", "Supper Clubs", "Sushi Bars", "Syrian", "Taiwanese", "Tapas Bars", "Tapas/Small Plates", "Tex-Mex",
"Thai", "Turkish", "Ukrainian", "Uzbek", "Vegan", "Vegetarian", "Vietnamese", "Waffles", "Wraps"];

//active life
var activeArray = ["ATV Rentals/Tours", "Airsoft", "Amateur Sports Teams", "Amusement Parks", "Aquariums", "Archery", "Badminton", "Baseball Fields", "Basketball Courts", 
"Batting Cages", "Beach Volleyball", "Beaches", "Bicycle Paths", "Boating", "Bobsledding", "Bocce Ball", "Bowling", "Bubble Soccer", "Bungee Jumping", "Challenge Courses", 
"Climbing", "Cycling Classes", "Disc Golf", "Diving", "Escape Games", "Fencing Clubs", "Fishing", "Aerial Fitness", "Barre Classes", "Boot Camps", "Boxing", "Cardio Classes", 
"Dance Studios", "Golf Lessons", "Gyms", "Martial Arts", "Meditation Centers", "Pilates", "Yoga", "Flyboarding", "Gliding", "Go Karts", "Golf", "Gun/Rifle Ranges", "Gymnastics", 
"Handball", "Hang Gliding", "Hiking", "Horse Racing", "Hot Air Balloons", "Jet Skis", "Kiteboarding", "Lakes", "Lazer Tag", "Lawn Bowling", "Leisure Centers", "Mini Golf", 
"Mountain Biking", "Paddleboarding", "Paintball", "Parasailing", "Parks", "Dog Parks", "Skate Parks", "Public Plazas", "Races & Competitions", "Racing Experience", "Rafting/Kayaking", 
"Recreation Centers", "Sailing", "Scavenger Hunts", "Skating Rinks", "Skiing", "Skydiving", "Sledding", "Snorkling", "Soccer", "Sports Clubs", "Squash", "Surfing", "Swimming Pools", 
"Tennis", "Trampoline Parks", "Tubing", "Volleyball", "Water Parks", "Wildlife Hunting Ranges", "Ziplining", "Zoos"];

//nightlife
var nightlifeArray = ["Adult Entertainment", "Bar Crawl", "Absinthe Bars", "Beach Bars", "Beer Bar", "Champagne Bars", "Cocktail Bars", "Dive Bars", "Drive-Thru Bars", 
"Gay Bars", "Hookah Bars", "Irish Pub", "Lounges", "Sake Bars", "Sports Bars", "Tiki Bars", "Wine Bars", "Beer Gardens", "Club Crawl", "Coffeeshops", "Comedy Clubs", 
"Country Dance Halls", "Dance Clubs", "Dance Restaurants", "Fasil Music", "Jazz & Blues", "Karaoke", "Music Venues", "Piano Bars", "Pool Halls"];

//arts and entertainment
var entertainmentArray = ["Arcades", "Art Galleries", "Betting Centers", "Bingo Halls", "Botanical Gardens", "Cabaret", "Casinos", "Castles", "Choirs", "Cinema", 
"Drive-In Theater", "Outdoor Movies", "Cultural Centers", "Attraction Farms", "Pick Your Own Farms", "Ranches", "Haunted Houses", "Jazz & Blues", "Museums", "Music Venues", 
"Observatories", "Opera & Ballet", "Paint & Sip", "Performing Arts", "Planetarium", "Race Tracks", "Rodeo", "Wineries"];

var datas = [];
var names = [];

var numSelected = 0;
var toUse = "";

var term = "";
var currentLocation = "";
var lat = 0;
var lon = 0;

function SearchYelp() {
	getLocation();
	$("#resultButtons").hide();
	$("#manualLocation").show();
}

//function to search with a user's latitude and longitude coordinates
function SearchWithLatLon(term, lat, lon) {
	$("#myModal").hide();

	$.ajax({
		url: 'search.php?term='+term+'&latitude='+lat+'&longitude='+lon,
		dataType: 'json',
		success: function(data) {
			if (data != "Error with URL!") GetResults(data);
			else alert(data);
		},
		error: function() {
			alert("Error!");
		}
	});
}

//function to search with a user's manually entered location (e.g. "Winter Park, FL")
function SearchWithLocation(term, currentLocation) {
	$("#myModal").hide();
	$.ajax({
		url: 'search.php?term='+term+'&location='+currentLocation,
		dataType: 'json',
		success: function(data) {
			if (data != "Error with URL!") GetResults(data);
			else alert(data);
		},
		error: function() {
			alert("Error!");
		}
	});
}

//function to set user's location when manually entered.
function SetLocation() {
	currentLocation = $("#currentLocation").val();
	if (currentLocation != '') {

		//trim whitespace, replace spaces with hyphens, and replace commas with URL code
		currentLocation = currentLocation.trim();
		currentLocation = currentLocation.replace(/ /g, "-");
		currentLocation = currentLocation.replace(/,/, "%2C");

		$("#manualLocation").hide();
		$("#resultButtons").show();
		SearchWithLocation(term, currentLocation); //Run search with manual location
	}
	else
		alert("Please enter a location to search near.");
}

//function to get the results from a Yelp search
function GetResults(data) {
	var str = "";

	for (var i = 0; i < data['businesses'].length; i++) {
		
		// business image, name, and URL
		var cardString = "<div class='card'><div class='image inline'><img src='"+data['businesses'][i]['image_url']+"'></div><div class='info inline'><div class='name'><a href='"+data['businesses'][i]['url']+"'>"+data['businesses'][i]['name']+"</a></div><div class='rating'>";

				var rating = data['businesses'][i]['rating']; //get that business's rating
				var strRating = String(rating); //convert rating to string
				if (strRating.length == 1) { //if rating is single digit (e.g. "4")
					for (var z = 0; z < rating; z++)
						cardString += "<img src='img/ratings/10x10_"+rating+".png'>";

					var extra = 5 - rating; //get the difference

					for (var z = 0; z < extra; z++) //must have 5 stars, even if not filled in.
						cardString += "<img src='img/ratings/10x10_0.png'>";
				}
				else if (strRating.length == 3) { //if rating is triple character (e.g. "2.5")
					var tempRating = strRating.charAt(0); //get first character and put that many filled stars
					for (z = 0; z < tempRating; z++)
						cardString += "<img src='img/ratings/10x10_"+tempRating+".png'>";
					cardString += "<img src='img/ratings/10x10_"+tempRating+"_5.png'>"; //then put the half star
					var extra = 5 - (Math.floor(rating) + 1); //get the difference from 5
					for (var z = 0; z < extra; z++) //must have 5 stars, even if not filled in
						cardString += "<img src='img/ratings/10x10_0.png'>";
				}

				//add dollar sign for price (e.g. "$", "$$")
				cardString += " "+data['businesses'][i]['review_count']+" reviews</div><div class='price'>"+data['businesses'][i]['price']+" &bull; ";

				//add all categories
				for (var k = 0; k < data['businesses'][i]['categories'].length; k++) {
					cardString += data['businesses'][i]['categories'][k]['title'];
					if (k < (data['businesses'][i]['categories'].length - 1))
						cardString += ", ";
				}

				//business address, phone, and yelp logo
				cardString += "</div></div><div class='address inline'>"+data['businesses'][i]['location']['address1']+"<br>"+data['businesses'][i]['location']['city']+", "+data['businesses'][i]['location']['state']+" "+data['businesses'][i]['location']['zip_code']+"<br>"+data['businesses'][i]['display_phone']+"<br><br><a href='http://www.yelp.com'><img src='img/yelp.png'></a></div></div>";


		str += cardString;
	}

	$("#main").hide();
	$("#yelpResults").html(str);
	$("#finalResults").show();
}

function SearchAgain() {
	$("#finalResults").hide();
	$("#main").show();
}

//function to select all or select none of the choices
function Select(which) {
	for (var i = 0; i < toUse.length; i++)
		$("#"+i).prop('checked', which);

	BuildPieChart();		
}

//function to actually rotate the choice circle
function RotateCircle() {
	$("#myModal").hide();
	var end = Math.floor((Math.random()*10000)+760); //get random angle to spin chart to
	$("#chartContainer").rotate({ //JQueryRotate method!!
		angle: 0,
		animateTo: end,
		duration: 3000,
		callback: function() {
			var angle = ($(this).getRotateAngle() % 360); //get the final angle or rotate angle
			DisplayResult(angle);
		}
	});
}

//function to build the list of choices (food or entertainment)
function SetupCategories(category) {
	$("#yelpResults").html("");
	$("#finalResults").hide();
	$("#main").show();
	$("#choices").html("");
	$("#choicesContainer").css('display', 'inline-block');

	if (category == 'food') toUse = foodArray;
	else if (category == 'active') toUse = activeArray;
	else if (category == 'nightlife') toUse = nightlifeArray;
	else if (category == 'entertainment') toUse = entertainmentArray;

	for (var i = 0; i < toUse.length; i++)
		$("#choices").html($("#choices").html() + "<input type='checkbox' onchange='BuildPieChart()' id='"+i+"' name='"+i+"' value='"+toUse[i]+"'><label for='"+i+"'>"+toUse[i]+"</label><br>");
}

//function to build or rebuild the choices circle after a choice is selected or deselected
function BuildPieChart() {
	$("#circleContainer").css('display', 'inline-block');
	numSelected = 0;
	$("#chartContainer").html("");
	
	datas = [];
	names = [];

	for (var i = 0; i < toUse.length; i++) {
		if ($("#"+i).is(":checked")) {
			numSelected++;
			names.push($("#"+i).val());
		}
	}

	//only show the circle if one or more choices are selected
	if (numSelected > 0) $("#circleContainer").css('display', 'inline-block');
	else $("#circleContainer").css('display', 'none');

	for (var i = 0; i < numSelected; i++)
		datas.push({y: 1, indexLabel: names[i]});

	//create a new CanvasJS chart!
	var chart = new CanvasJS.Chart("chartContainer",
	{
		interactivityEnabled: false,
		backgroundColor: null,
		data: [{type: "pie", startAngle: -90, indexLabelPlacement: "inside", indexLabelWrap: false, indexLabelFontColor: "white", dataPoints: datas}]
	});
	chart.render();
}

//function for displaying the result of the circle spin
function DisplayResult(angle) {
	//get a base point for what to look at
	var sliceDegrees = 360 / numSelected;

	//find how many degrees you have left until 0 or 360, 
	//then divide by number of slices to find out how many slices you have to go
	var degreesLeft = 360-angle;
	var slicesToGo = Math.floor(degreesLeft / sliceDegrees);

	term = names[slicesToGo];
	$("#results").html(term); //offer button to search or spin again!
	term = term.replace(/ /g, "-"); //format term for spaces
	$("#myModal").css('display', 'block');
}

//check browser's ability to get user's location
function getLocation() {
    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(showPosition);
	else alert("Geolocation is not supported by this browser.");
}

//if user chooses to share location, use run search with latlon location
function showPosition(position) {
	lat = position.coords.latitude;
	lon = position.coords.longitude;
	SearchWithLatLon(term, lat, lon);
}
