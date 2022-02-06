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
    minDate: 0
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
    token.setAttribute("id", eventData.eventId);
    token.setAttribute("class", "token");
    tokenImage.setAttribute("class", "event-image");
    tokenButton.setAttribute("class", "token-button");
    tokenImage.setAttribute("src", eventData.eventImage);
    tokenImage.setAttribute("alt", "Event Image");
    tokenDateTime.textContent = eventData.eventDateTime;
    tokenTitle.innerHTML = "<a href = " + eventData.eventLink + " target = '_blank'>" + eventData.eventName + "</a>"
    //tokenTitle.setAttribute("href", eventData.eventLink);
    tokenLocation.textContent = eventData.eventLocation;
    tokenPrice.textContent = eventData.eventPrice;
    tokenButton.textContent = "Click to Remove"
    token.appendChild(tokenImage);
    token.appendChild(tokenDiv);
    tokenDiv.appendChild(tokenDateTime);
    tokenDiv.appendChild(tokenTitle);
    tokenDiv.appendChild(tokenLocation);
    tokenDiv.appendChild(tokenPrice);
    tokenButton.addEventListener("click", function () {
        var savedTokens = document.getElementById("planning-field");
        var thisToken = document.getElementById(eventData.eventId);
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
        var eventData = reShindig[i];

        let tokenObject = Object();
        tokenObject.eventDateTime = eventData.eventDateTime;
        tokenObject.eventName = eventData.eventName;
        tokenObject.eventLocation = eventData.eventLocation;
        tokenObject.eventLink = eventData.eventLink;
        tokenObject.eventImage = eventData.eventImage;
        tokenObject.eventPrice = eventData.eventPrice;
        tokenObject.eventId = eventData.eventId
        shindigArray.push(tokenObject);
        saveTheTokens();
        var fieldType = "planning-field";
        eventToken(tokenObject, fieldType);
    };
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
            //console.log(data);
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
                    var fieldType = "results-buttons"
                    eventToken(tokenObject, fieldType);
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
var createPrice = function (eventData) {
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
    if (eventData.eventDateTime) {
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
    tokenObject.eventName = eventData.name;
    //console.log(tokenObject.eventName);
    tokenObject.eventLocation = eventData._embedded.venues[0].name;
    tokenObject.eventLink = eventData.url;
    tokenObject.eventImage = eventData.images[0].url;
    tokenObject.eventId = eventData.id;
    //console.log(tokenObject.eventId);
    //console.log(tokenObject.eventLink);

    return tokenObject;
}

//check to see if already exists
var checkArray = function (tokenObject) {
    //start assuming doesn't already exist - if it does exist change value
    var exists = false;
    for (i in shindigArray) {
        if (shindigArray[i].eventId === tokenObject.eventId) {
            exists = true;

        }
    }
    //return value of exists
    return exists;

}


//make button from results or (eventually) from local storage
var eventToken = function (tokenObject, fieldType) {
    var info = tokenObject
    //eventDateTime
    //eventName
    //eventLocation
    //eventLink
    //eventImage
    //eventPrice
    //create buttons
    var resultsField = document.getElementById(fieldType);
    var token = document.createElement("button");
    var tokenImage = document.createElement("img");
    var tokenDiv = document.createElement("div");
    var tokenDateTime = document.createElement("p");
    var tokenTitle = document.createElement("a");
    var tokenLocation = document.createElement("p");
    var tokenPrice = document.createElement("p");
    var tokenButton = document.createElement("button");
    token.setAttribute("id", info.eventId);
    token.setAttribute("class", "token");
    tokenImage.setAttribute("class", "event-image");
    tokenButton.setAttribute("class", "token-button");
    tokenImage.setAttribute("src", info.eventImage);
    tokenImage.setAttribute("alt", "Event Image");
    tokenDateTime.textContent = info.eventDateTime;
    tokenTitle.innerHTML = "<a href = " + info.eventLink + " target = '_blank'>" + info.eventName + "</a>"
    //tokenTitle.setAttribute("href", info.eventLink);
    //console.log(info.eventName);
    tokenLocation.textContent = info.eventLocation;
    tokenPrice.textContent = info.eventPrice;
    tokenButton.textContent = "Click to Save"


    // if results is populating for first time
    if (fieldType === "results-buttons") {
        tokenButton.addEventListener("click", function () {
            var savedTokens = document.getElementById("planning-field");
            var thisToken = document.getElementById(info.eventId);
            savedTokens.appendChild(thisToken);

            tokenButton.textContent = "Click to Remove";
            tokenButton.addEventListener("click", function () {
                var savedTokens = document.getElementById("planning-field");
                var thisToken = document.getElementById(info.eventId);
                removeToken(tokenObject);
                saveTheTokens();
                savedTokens.removeChild(thisToken);
            }, { once: true });

            //don't push to array if it already exists in the array;
            var exists = checkArray(tokenObject)
            if (!exists) {
                shindigArray.push(tokenObject);
                console.log("does not exist!");
            } else {
                console.log("already saved!")
                token.remove();
            };

            saveTheTokens();
        }, { once: true });
    };

    //if results are populating from saved
    if (fieldType === "planning-field") {
        tokenButton.textContent = "Click to Remove"
        tokenButton.addEventListener("click", function () {
            var savedTokens = document.getElementById("planning-field");
            var thisToken = document.getElementById(info.eventId);
            removeToken(tokenObject);
            saveTheTokens();
            savedTokens.removeChild(thisToken);
        }, { once: true });
    }
    //append all to the container
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
    var headerBar = document.getElementById("header-bar");
    var headerArticle = document.getElementById("subtitle");
    var headerOrig = headerArticle.textContent;

    //only run if error message not already displayed
    if (shinDangIt.textContent ==="ShinDangIt!") {
        false
    }else {
            
        shinDangIt.textContent = "ShinDangIt!";
        shinDangIt.setAttribute("class", "error");
        headerBar.setAttribute("class", "error");
        headerArticle.textContent = errorMsg;
        
        //after timeout replace original text in headers
        setTimeout(function () {
            shinDangIt.textContent = "Shindig!";
            headerBar.removeAttribute("class", "error");
            shinDangIt.removeAttribute("class", "error");
            headerArticle.textContent = headerOrig;
            //shinDrat.remove()

            //container.append(headerArticle);
            //shinDrat.textContent = shinDescription;
    }, 10000);
}
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
                var errorMsg = ("The government has removed that location from public knowledge.");
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


var createClearbtn = function () {
    var clearBtn = document.getElementById("clearBtn")
    //console.log("clear is" + clearBtn);
    //check if button already created
    if (clearBtn) {

    } else {
        clearBtn = document.createElement("button");
        searchBtn = $("#search-button");
        divEl = searchBtn.closest("div");
        clearBtn.setAttribute("class", "clearBtn button title-is-6 is-medium is-info");
        clearBtn.setAttribute("id", "clearBtn");
        //make it so button reloads page on click
        clearBtn.setAttribute("onclick", "location.reload()");
        clearBtn.value = "Clear Form";
        clearBtn.textContent = "Clear Form";
        divEl.append(clearBtn);



    }
}

//this button is to get user request and format it for google geocode service
document.getElementById("search-button").addEventListener("click", function () {
    //get start date in YYY-MM-DD format
    var startDate = document.getElementById("modalStartDate").value;
    if (startDate) {
        startDate = convertDate(startDate);
    };
    //console.log(startDate);

    //get end date and convert
    var endDate = document.getElementById("modalEndDate").value;

    if (endDate) {
        endDate = convertDate(endDate);
    }


    //get eventtype
    var eventType = document.getElementById("modalEventType").value;

    //get location
    var placeSearchName = document.getElementById("city-search-field").value;
    const words = placeSearchName.split(' ');

    //check that start date is BEFORE end date - if it is then run get location
    if (startDate > endDate || !placeSearchName || !startDate || !endDate) {
        console.log("EEK check dates and location!");
        var errorMsg = ("You have violated the Space-Time Continuum");
        ohNo(errorMsg);
    } else {

        //console.log("else triggered?");
        if (words.length > 1) {
            const string = (words[0] + "_" + words[1]);
            getLocation(string, startDate, endDate, eventType);
        } else if (words.length > 2) {
            const string = (words[0] + "_" + words[1] + "_" + words[2]);
            getLocation(string, startDate, endDate, eventType);
        } else {
            getLocation(placeSearchName, startDate, endDate, eventType);
        };

        createClearbtn();
    };

    //clear forms after search executed

});


if (!!(localStorage.getItem("shindig")) === true) {
    rememberArray();
};

