//TODO: replace startDateTime and endDateTime with input from User
//TODO: replace classificationName with input from User
//TODO: reformat eventDate and eventTime output 
//TODO: save button
//TODO: name button

//get event list from TicketMaster
var getEvents = function(latLong) {
    var startDateTime = ("2022-02-22T00:00:01Z");
    var endDateTime = ("2022-02-24T23:59:59Z");
    var classificationName = "Music";
    var ticketMasterMayI = ("https://app.ticketmaster.com/discovery/v2/events.json?latlong=" + latLong + "&radius=10&startDateTime=" + startDateTime + "&endDateTime=" + endDateTime + "&classificationName=" + classificationName + "&size=100&sort=date,name,desc&apikey=qMeZuZFNC7wTNBRfgRDNS9UVVganTX77");
    fetch(ticketMasterMayI)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        for (i=0; 1<data.page.totalElements; i++) {
            var eventName = (data._embedded.events[i].name);
            var eventLocation = (data._embedded.events[i]._embedded.venues[0].name);
            var eventLink = (data._embedded.events[i].url);
            var eventImage = (data._embedded.events[i].images[0].url);
            var eventDate = (data._embedded.events[i].dates.start.localDate);
            var eventTime = (data._embedded.events[i].dates.start.localTime);
            var eventDateTime = (eventDate + ", " + eventTime);
            if (!!data._embedded.events[i].sales) {
                eventPrice = "Tickets are not yet on sale";
            } else if (data._embedded.events[i].priceRanges[0].max < 0){
            var eventPriceMin = (data._embedded.events[i].priceRanges[0].min);
            var eventPriceMax = (data._embedded.events[i].priceRanges[0].max);
            var eventPrice = ("Prices from $" + eventPriceMin + " - $" +eventPriceMax);
            } else {
                eventPrice = "Free";
            };
            eventToken(eventDateTime, eventName, eventLocation, eventLink, eventImage, eventPrice);
        };
    });
};

//make button from results or (eventually) from local storage
var eventToken = function(eventDateTime, eventName, eventLocation, eventLink, eventImage, eventPrice) {
    var resultsField = document.getElementById("results-buttons");
    var token = document.createElement("button");
    var tokenImage = document.createElement("img");
    var tokenDiv = document.createElement("div");
    var tokenDateTime = document.createElement("p");
    var tokenTitle = document.createElement("a");
    var tokenLocation = document.createElement("p");
    var tokenPrice = document.createElement("p");
    tokenImage.setAttribute("src", eventImage);
    tokenImage.setAttribute("alt", "Event Image");
    //we can replace next line if we style everything; note - these images tend to have 16:9 ratio.
    tokenImage.setAttribute("style", "height:75px");
    tokenDateTime.textContent = eventDateTime;
    tokenTitle.textContent = eventName;
    tokenTitle.setAttribute("href", eventLink);
    tokenLocation.textContent = eventLocation;
    tokenPrice.textContent = eventPrice;
    token.appendChild(tokenImage);
    token.appendChild(tokenDiv);
    tokenDiv.appendChild(tokenDateTime);
    tokenDiv.appendChild(tokenTitle);
    tokenDiv.appendChild(tokenLocation);
    tokenDiv.appendChild(tokenPrice);
    resultsField.appendChild(token);
};

//When date is pcicked datepicker will come up mindate won't allow for past events
$("#modalEventDate").datepicker( {
    minDate: 1
});

//add eventlisteners to buttons to get citys
//add calendar drop down thing from week 4(?) to get date
//format calls to apis
//make calls to apis
// https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/
// https://platform.seatgeek.com/
// https://www.eventbrite.com/platform/docs/introduction
//reformat information
//make draggable buttons from infomation
//format fields for user to drag buttons hither and thither
//make a save to local storage button for user to save their options
//drink martinis as the $$$ pours in

//clear text function
var clearText = function() {
    document.getElementById('city-search-field').value = "";
};

//call google api and get lat/long or other geo identifier for city for ticketmaster to use
var getLocation = function(param) {
    var googleMayI = ("https://maps.googleapis.com/maps/api/geocode/json?address=" + param + "&key=AIzaSyDWtVKZCyc6X5L_eERu0Bk_WpclnefusjU");
    fetch(googleMayI)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            //error function 
            if (!data || data.status === 'ZERO_RESULTS') {
                alert("Something went wrong, please enter a search with only three words to describe the place you're looking for.");
            } else {
                var lat = (data.results[0].geometry.location.lat).toPrecision(6);
                var lng = (data.results[0].geometry.location.lng).toPrecision(6);
                console.log("getLocation:" + lat);
                console.log("getLocation:" + lng);
                var latLong = (lat + "," + lng);
                console.log("getLocation:" + latLong);
                getEvents(latLong);
            }
        });
};

//this button is to get user request and format it for google geocode service
document.getElementById("search-button").addEventListener("click", function () {
    var placeSearchName = document.getElementById("city-search-field").value;
    const words = placeSearchName.split(' ');
    if (words.length > 1) {
        const string = (words[0] + "_" + words[1]);
        getLocation(string);
    } else if (words.length > 2) {
        const string = (words[0] + "_" + words[1] + "_" + words[2]);
        getLocation(string);
    } else {
        getLocation(placeSearchName);
    };
    clearText();
});


//TicketMaster input values
    //latlong string 40.7138,-74.0060
    //radius string
    //startDateTime YYYY-MM-DD
    //endDateTime YYYY-MM-DD
    //city Array
    //stateCode String
    //classificationName Array
    //size (# of responses) String
    //genreId Array
    //typeId Array
    //geoPoint Geohash string
    //sort date,name,desc
    //classificationName string
    //category_id see notes
