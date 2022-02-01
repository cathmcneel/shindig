const shindigArray = [];
const monthArray = [
    "flippydoo",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

//save all saved tokens to local storage using global 'shindigArray'
var saveTheTokens = function () {
    var shindigArrayJson = JSON.stringify(shindigArray);
    localStorage.setItem("shindig", shindigArrayJson);
};

var removeToken = function(tokenObject) {
    for (i=0; i<shindigArray.length; i++)
    if (shindigArray[i] === tokenObject) {
        shindigArray.splice(i, 1);
    };
    saveTheTokens();
};

//refresh from storage section
//refresh page with saved tokens
var repopulatePage = function (eventDateTime, eventName, eventLocation, eventLink, eventImage, eventPrice, tokenObject) {
    var planningField = document.getElementById("planning-field");
    var token = document.createElement("button");
    var tokenImage = document.createElement("img");
    var tokenDiv = document.createElement("div");
    var tokenDateTime = document.createElement("p");
    var tokenTitle = document.createElement("a");
    var tokenLocation = document.createElement("p");
    var tokenPrice = document.createElement("p");
    var tokenButton = document.createElement("button");
    token.setAttribute("id", eventName);
    tokenImage.setAttribute("src", eventImage);
    tokenImage.setAttribute("alt", "Event Image");
    tokenImage.setAttribute("style", "height:72px");
    tokenDateTime.textContent = eventDateTime;
    tokenTitle.textContent = eventName;
    tokenTitle.setAttribute("href", eventLink);
    tokenLocation.textContent = eventLocation;
    tokenPrice.textContent = eventPrice;
    tokenButton.setAttribute("style", "height:72px, width:128px")
    tokenButton.textContent = "Click to Remove"
    token.appendChild(tokenImage);
    token.appendChild(tokenDiv);
    tokenDiv.appendChild(tokenDateTime);
    tokenDiv.appendChild(tokenTitle);
    tokenDiv.appendChild(tokenLocation);
    tokenDiv.appendChild(tokenPrice);
    tokenButton.addEventListener("click", function() {
        var savedTokens = document.getElementById("planning-field");
        var thisToken = document.getElementById(eventName);
        removeToken(tokenObject);
        saveTheTokens();
        savedTokens.removeChild(thisToken);
    }, { once: true });
    token.appendChild(tokenButton);
    planningField.appendChild(token);
    shindigArray.push(tokenObject);
    saveTheTokens();
    console.log(shindigArray);
};

//get items from local storage, resave them to window array (shindigArray)
var rememberArray = function () {
    console.log(shindigArray);
    yeOldeShindig = localStorage.getItem("shindig");
    reShindig = JSON.parse(yeOldeShindig);
    for (i = 0; i < reShindig.length; i++) {
            let tokenObject = Object();
            tokenObject.eventDateTime = eventDateTime;
            tokenObject.eventName = eventName;
            tokenObject.eventLocation = eventLocation;
            tokenObject.eventLink = eventLink;
            tokenObject.eventImage = eventImage;
            tokenObject.eventPrice = eventPrice;
            var eventDateTime = reShindig[i].eventDateTime;
            var eventName = reShindig[i].eventName;
            var eventLocation = reShindig[i].eventLocation;
            var eventLink = reShindig[i].eventLink;
            var eventImage = reShindig[i].eventImage;
            var eventPrice = reShindig[i].eventPrice;
            repopulatePage(eventDateTime, eventName, eventLocation, eventLink, eventImage, eventPrice, tokenObject);
    };
};
if (!!(localStorage.getItem("shindig")) === true) {
    rememberArray();
};

//Results to the page functions
//get event list from TicketMaster
var getEvents = function (latLong) {
    var startDateTime = ("2022-02-22T00:00:01Z");
    var endDateTime = ("2022-02-24T23:59:59Z");
    var classificationName = "Music";
    var ticketMasterMayI = ("https://app.ticketmaster.com/discovery/v2/events.json?latlong=" + latLong + "&radius=10&startDateTime=" + startDateTime + "&endDateTime=" + endDateTime + "&classificationName=" + classificationName + "&size=100&sort=date,name,asc&apikey=qMeZuZFNC7wTNBRfgRDNS9UVVganTX77");
    fetch(ticketMasterMayI)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            for (i = 0; 1 < data.page.totalElements; i++) {
                var eventName = (data._embedded.events[i].name);
                var eventLocation = (data._embedded.events[i]._embedded.venues[0].name);
                var eventLink = (data._embedded.events[i].url);
                var eventImage = (data._embedded.events[i].images[0].url);
                var eventDate = (data._embedded.events[i].dates.start.localDate);
                var eventTime = (data._embedded.events[i].dates.start.localTime);
                var eventDateTimeFish = (eventDate + ", " + eventTime);
                var oneSplit = eventDateTimeFish.split(",");
                var twoSplit = oneSplit[0].split("-");
                var redSplit = oneSplit[1].split(":");
                var waitForIt = parseInt(twoSplit[1]);
                var blueSplint  = (monthArray[waitForIt] + " " + twoSplit[2] + ", " + twoSplit[0]);
                if (redSplit[0] < 13) {
                    mericanTime = (redSplit[0] + ":" + redSplit[1] + " am");
                } else {
                    mericanTime = ((redSplit[0] - 12) + ":" + redSplit[1] + " pm");
                };
                var eventDateTime = (blueSplint + ", at " + mericanTime);
                if (!!data._embedded.events[i].priceRanges === false) {
                    eventPrice = "Tickets are not yet on sale";
                } else if (data._embedded.events[i].priceRanges[0].max >= 0) {
                    var eventPriceMin = (data._embedded.events[i].priceRanges[0].min);
                    var eventPriceMax = (data._embedded.events[i].priceRanges[0].max);
                    var eventPrice = ("Prices from $" + eventPriceMin + " - $" + eventPriceMax);
                } else {
                    eventPrice = "Free";
                };
                eventToken(eventDateTime, eventName, eventLocation, eventLink, eventImage, eventPrice);
            };
        });
};

//make button from results or (eventually) from local storage
var eventToken = function (eventDateTime, eventName, eventLocation, eventLink, eventImage, eventPrice) {
    let tokenObject = Object();
    tokenObject.eventDateTime = eventDateTime;
    tokenObject.eventName = eventName;
    tokenObject.eventLocation = eventLocation;
    tokenObject.eventLink = eventLink;
    tokenObject.eventImage = eventImage;
    tokenObject.eventPrice = eventPrice;
    var resultsField = document.getElementById("results-buttons");
    var token = document.createElement("button");
    var tokenImage = document.createElement("img");
    var tokenDiv = document.createElement("div");
    var tokenDateTime = document.createElement("p");
    var tokenTitle = document.createElement("a");
    var tokenLocation = document.createElement("p");
    var tokenPrice = document.createElement("p");
    var tokenButton = document.createElement("button");
    token.setAttribute("id", eventName);
    tokenImage.setAttribute("src", eventImage);
    tokenImage.setAttribute("alt", "Event Image");
    tokenImage.setAttribute("style", "height:72px");
    tokenDateTime.textContent = eventDateTime;
    tokenTitle.textContent = eventName;
    tokenTitle.setAttribute("href", eventLink);
    tokenLocation.textContent = eventLocation;
    tokenPrice.textContent = eventPrice;
    tokenButton.setAttribute("style", "height:72px, width:128px")
    tokenButton.textContent = "Click to Save"
    tokenButton.addEventListener("click", function() {
        var savedTokens = document.getElementById("planning-field");
        var thisToken = document.getElementById(eventName);
        savedTokens.appendChild(thisToken);
        tokenButton.textContent = "Click to Remove";
        tokenButton.addEventListener("click", function() {
            var savedTokens = document.getElementById("planning-field");
            var thisToken = document.getElementById(eventName);
            removeToken(tokenObject);
            saveTheTokens();
            savedTokens.removeChild(thisToken);
        }, { once: true });
        shindigArray.push(tokenObject);
        saveTheTokens();
    }, { once: true });
    token.appendChild(tokenImage);
    token.appendChild(tokenDiv);
    tokenDiv.appendChild(tokenDateTime);
    tokenDiv.appendChild(tokenTitle);
    tokenDiv.appendChild(tokenLocation);
    tokenDiv.appendChild(tokenPrice);
    token.appendChild(tokenButton);
    resultsField.appendChild(token);
};

//clear text function
var clearText = function () {
    document.getElementById('city-search-field').value = "";
};

//call google api and get lat/long or other geo identifier for city for ticketmaster to use
var getLocation = function (param) {
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
                var latLong = (lat + "," + lng);
                getEvents(latLong);
            }
        });
};

//When date is picked datepicker will come up mindate won't allow for past events
$("#modalStartDate").datepicker({
    minDate: 1
});

$("#modalEndDate").datepicker({
    minDate: 1
});

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

//TODO: //TODO: replace startDateTime and endDateTime with input from User -- see input format below
//TODO: replace classificationName with scroll-button input from User -- see notes at bottom for classification names
//TODO: reformat eventDate and eventTime output in buttons to USA norm
//TODO: repopulate page from local storage (remember to repopulate the shindigArray global value at the top of this page as well as divs displayed).
//TODO: change button when moved to saved category to have a delete eventhandler

//TicketMaster categories for scroll-down list
//classical 
//comedy
//concerts
//dance
//fine art
//music
//opera
//sports
//theatre


//TicketMaster input values
    //latlong string 40.7138,-74.0060
    //radius string
    //startDateTime YYYY-MM-DD{'T' for time}HH:MM:SS{'A' for am or 'Z' for pm}
    //endDateTime YYYY-MM-DD{'T' for time}HH:MM:SS{'A' for am or 'Z' for pm}
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
