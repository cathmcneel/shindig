var shindigArray = [];
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

//When date is picked datepicker will come up mindate won't allow for past events
$("#modalStartDate").datepicker({
    minDate: 0
});

$("#modalEndDate").datepicker({
    minDate: 1
});

//save all saved tokens to local storage using global 'shindigArray'
var saveTheTokens = function () {
    var shindigArrayJson = JSON.stringify(shindigArray);
    localStorage.setItem("shindig", shindigArrayJson);
};

//remove from array
var removeToken = function (tokenObject) {
    for (i = 0; i < shindigArray.length; i++)
        if (shindigArray[i] === tokenObject) {
            shindigArray.splice(i, 1);
        };
    saveTheTokens();
};

//refresh from storage section
//refresh page with saved tokens
var repopulatePage = function (tokenObject) {
    var eventData = tokenObject;
    var planningField = document.getElementById("planning-field");
    var token = document.createElement("button");
    var tokenImage = document.createElement("img");
    var tokenDiv = document.createElement("div");
    var tokenDateTime = document.createElement("p");
    var tokenTitle = document.createElement("a");
    var tokenLocation = document.createElement("p");
    var tokenPrice = document.createElement("p");
    var tokenButton = document.createElement("button");
    token.setAttribute("id", eventData.eventName);
    tokenImage.setAttribute("src", eventData.eventImage);
    tokenImage.setAttribute("alt", "Event Image");
    tokenImage.setAttribute("style", "height:72px");
    tokenDateTime.textContent = eventData.eventDateTime;
    tokenTitle.textContent = eventData.eventName;
    tokenTitle.setAttribute("href", eventData.eventLink);
    tokenLocation.textContent = eventData.eventLocation;
    tokenPrice.textContent = eventData.eventPrice;
    tokenButton.setAttribute("style", "height:72px, width:128px")
    tokenButton.textContent = "Click to Remove"
    token.appendChild(tokenImage);
    token.appendChild(tokenDiv);
    tokenDiv.appendChild(tokenDateTime);
    tokenDiv.appendChild(tokenTitle);
    tokenDiv.appendChild(tokenLocation);
    tokenDiv.appendChild(tokenPrice);
    tokenButton.addEventListener("click", function () {
        var savedTokens = document.getElementById("planning-field");
        var thisToken = document.getElementById(event.eventName);
        removeToken(tokenObject);
        saveTheTokens();
        savedTokens.removeChild(thisToken);
    }, { once: true });
    token.appendChild(tokenButton);
    planningField.appendChild(token);
    // console.log(shindigArray);
};

//get items from local storage, resave them to window array (shindigArray)
var rememberArray = function () {
    //console.log(shindigArray);
    yeOldeShindig = localStorage.getItem("shindig");
    reShindig = JSON.parse(yeOldeShindig);
    //console.log(reShindig);
    //console.log("ping");
    for (i = 0; i < reShindig.length; i++) {
        var event=reShindig[i];        
        let tokenObject = Object();
        tokenObject.eventDateTime = event.eventDateTime;
        tokenObject.eventName = event.eventName;
        tokenObject.eventLocation = event.eventLocation;
        tokenObject.eventLink = event.eventLink;
        tokenObject.eventImage = event.eventImage;
        tokenObject.eventPrice = event.eventPrice;
        shindigArray.push(tokenObject);
        saveTheTokens();
        repopulatePage(tokenObject);
    };
};
if (!!(localStorage.getItem("shindig")) === true) {
    rememberArray();
};

//Results to the page functions
//get event list from TicketMaster
var getEvents = function (latLong, startDateTime, endDateTime, eventType) {
    //if start date was too early it showed events from the day before
    startDateTime = startDateTime + "T07:00:01Z";
    endDateTime = endDateTime + "T23:59:59Z";

    //console.log(startDateTime);
    var classificationName = eventType;
    //we have the size set to 100 - so it is returning 100 results do we want this to be user input choice?
    var ticketMasterMayI = ("https://app.ticketmaster.com/discovery/v2/events.json?latlong=" + latLong + "&radius=10&startDateTime=" + startDateTime + "&endDateTime=" + endDateTime + "&classificationName=" + classificationName + "&size=100&sort=date,name,asc&apikey=qMeZuZFNC7wTNBRfgRDNS9UVVganTX77");
    fetch(ticketMasterMayI)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            if (!data || data.page.totalElements === 0) {
                var errorMsg = ("Curses! We can't find any events with your parameters. Try looking for all events, or in a large city nearby.");
                ohNo(errorMsg);
            } else {
                //changed from < total elements to less than events array length to remove error.  total elements was longer than number of events
                for (i = 0; i < data._embedded.events.length; i++) {
                    //set eventData to one event - makes code easer to see later
                    var eventData = data._embedded.events[i];
                   //create a token object to store all information
                    var tokenObject = createTokenObject(eventData);
                    eventToken(tokenObject);
                };
            };
        });
};

//create a date and time from seperate date and time information
var createDateTime = function (eventData) {
    var eventDate = (eventData.dates.start.localDate);
                    var eventTime = (eventData.dates.start.localTime);
                    var eventDateTimeFish = (eventDate + ", " + eventTime);
                    var oneSplit = eventDateTimeFish.split(",");
                    var twoSplit = oneSplit[0].split("-");
                    var redSplit = oneSplit[1].split(":");
                    var waitForIt = parseInt(twoSplit[1]);
                    var blueSplint = (monthArray[waitForIt] + " " + twoSplit[2] + ", " + twoSplit[0]);
                    if (redSplit[0] < 13) {
                        mericanTime = (redSplit[0] + ":" + redSplit[1] + " am");
                    } else {
                        mericanTime = ((redSplit[0] - 12) + ":" + redSplit[1] + " pm");
                    };
                    var eventDateTime = (blueSplint + ", at " + mericanTime);
                    return eventDateTime;
}

//function creates a price based on the price range
var createPrice = function(eventData) {
    if (!!eventData.priceRanges === false) {
        eventPrice = "Tickets are not yet on sale";
    } else if (eventData.priceRanges[0].max >= 0) {
        var eventPriceMin = (eventData.priceRanges[0].min);
        var eventPriceMax = (eventData.priceRanges[0].max);
        var eventPrice = ("Prices from $" + eventPriceMin + " - $" + eventPriceMax);
    } else {
        eventPrice = "Free";
    };
    return eventPrice;
}

var createTokenObject = function (eventData) {
    //create object to store all the data
    let tokenObject = Object();
    //if no eventData.eventDateTime then create one
    if(eventData.eventDateTime) {
        tokenObject.eventDateTime = eventData.eventDateTime;
    } else { 
        tokenObject.eventDateTime = createDateTime(eventData);;
    };
    

    //if no event price then create one
    if (tokenObject.eventPrice) {
        tokenObject.eventPrice = eventData.eventPrice;
    } else {
        tokenObject.eventPrice = createPrice(eventData);
    }
    //create name, location, link, and image
    tokenObject.eventName = eventData.eventName;
    tokenObject.eventLocation = eventData._embedded.venues[0].name;
    tokenObject.eventLink = eventData.eventLink;
    tokenObject.eventImage = eventData.images[0].url;

    return tokenObject;
}

//make button from results or (eventually) from local storage
var eventToken = function (tokenObject) {
    var info = tokenObject
    //eventDateTime
    //eventName
    //eventLocation
    //eventLink
    //eventImage
    //eventPrice



    //create buttons
    var resultsField = document.getElementById("results-buttons");
    var token = document.createElement("button");
    var tokenImage = document.createElement("img");
    var tokenDiv = document.createElement("div");
    var tokenDateTime = document.createElement("p");
    var tokenTitle = document.createElement("a");
    var tokenLocation = document.createElement("p");
    var tokenPrice = document.createElement("p");
    var tokenButton = document.createElement("button");
    token.setAttribute("id", info.eventName);
    tokenImage.setAttribute("src", info.eventImage);
    tokenImage.setAttribute("alt", "Event Image");
    tokenImage.setAttribute("style", "height:72px");
    tokenDateTime.textContent = info.eventDateTime;
    tokenTitle.textContent = info.eventName;
    tokenTitle.setAttribute("href", info.eventLink);
    tokenLocation.textContent = info.eventLocation;
    tokenPrice.textContent = info.eventPrice;
    tokenButton.setAttribute("style", "height:72px, width:128px")
    tokenButton.textContent = "Click to Save"


    //save and remove token buttons
    tokenButton.addEventListener("click", function () {
        var savedTokens = document.getElementById("planning-field");
        var thisToken = document.getElementById(info.eventName);
        savedTokens.appendChild(thisToken);
        tokenButton.textContent = "Click to Remove";
        tokenButton.addEventListener("click", function () {
            var savedTokens = document.getElementById("planning-field");
            var thisToken = document.getElementById(info.eventName);
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

//error message function unsure whenthis runs
var ohNo = function (errorMsg) {
    var shinDangIt = document.getElementById("header-title");
    var shinDrat = document.getElementById("header-article");
    var shinDescription = document.getElementById("header-article").textContent;
    shinDangIt.textContent = "ShinDangIt!";
    shinDrat.textContent = errorMsg;
    setTimeout(function () {
        shinDangIt.textContent = "Shindig!";
        shinDrat.textContent = shinDescription;
    }, 10000);
}

//call google api and get lat/long or other geo identifier for city for ticketmaster to use IF good send to Get events
var getLocation = function (param, startDate, endDate, eventType) {
    var googleMayI = ("https://maps.googleapis.com/maps/api/geocode/json?address=" + param + "&key=AIzaSyDWtVKZCyc6X5L_eERu0Bk_WpclnefusjU");
    fetch(googleMayI)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (!data || data.status === 'ZERO_RESULTS') {
                var errorMsg = ("We can only deal with linear time.");
                ohNo(errorMsg);

                //else is data is good and we can send to get Events function
            } else {
                var lat = (data.results[0].geometry.location.lat).toPrecision(6);
                var lng = (data.results[0].geometry.location.lng).toPrecision(6);
                var latLong = (lat + "," + lng);
                getEvents(latLong, startDate, endDate, eventType);
            }
        });
};





//function to conver dates to ISO
convertDate = function (shortDate) {
    longDate = new Date(shortDate).toISOString().substr(0, 10);
    return longDate;
}


//this button is to get user request and format it for google geocode service
document.getElementById("search-button").addEventListener("click", function () {
    //get start date in YYY-MM-DD format
    var startDate = document.getElementById("modalStartDate").value;
    startDate = convertDate(startDate);
    //console.log(startDate);

    //get end date and convert
    var endDate = document.getElementById("modalEndDate").value;
    endDate = convertDate(endDate);

    //get eventtype
    var eventType = document.getElementById("modalEventType").value;
   
    //get location
    var placeSearchName = document.getElementById("city-search-field").value;
    const words = placeSearchName.split(' ');

    //check that start date is BEFORE end date - if it is then run get location
    if (startDate > endDate) {
        console.log ("EEK end date is before start date!");
        var errorMsg = ("Curses! We can't find any events with your parameters. Try looking for all events, or in a large city nearby.");
        ohNo(errorMsg);
    } else {

        if (words.length > 1) {
        const string = (words[0] + "_" + words[1]);
        getLocation(string, startDate, endDate, eventType);
        } else if (words.length > 2) {
        const string = (words[0] + "_" + words[1] + "_" + words[2]);
        getLocation(string, startDate, endDate, eventType);
        } else {
        getLocation(placeSearchName, startDate, endDate, eventType);
        };
    };

    //clear forms after search executed
    clearText();
});

//header <h1 id="header-title">Shindig!</h1>
//header <article id="header-article">Short text introducing website</article>
//+css rule to make header article visible
