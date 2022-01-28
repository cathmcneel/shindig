var getEvents = function() {
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

    // var latLong = ("40.7138" + "," + "-74.0060");
    // var startDateTime = ("2022-02-22T00:00:01Z");
    // var endDateTime = ("2022-02-24T23:59:59Z");
    // var classificationName = "Sports";

    // var ticketMasterMayI = ("https://app.ticketmaster.com/discovery/v2/events.json?latlong=" + latLong + "&startDateTime=" + startDateTime + "&endDateTime=" + endDateTime + "&classificationName=" classificationName "&size=100&apikey=qMeZuZFNC7wTNBRfgRDNS9UVVganTX77")



    // https://app.ticketmaster.eu/mfxapi/v2/categories


    fetch("https://app.ticketmaster.com/discovery/v2/events.json?latlong=40.7138,-74.0060&startDateTime=2022-02-22T00:00:01Z&endDateTime=2022-02-24T23:59:59Z&classificationName=Music&size=100&apikey=qMeZuZFNC7wTNBRfgRDNS9UVVganTX77")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
    });
};
getEvents();

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

//call google api and get lat/long or other geo identifier for city for ticketmaster to use
//ticketmaster api says it can use lan/long but recommends a geoPoint instead, which turn up, like, zilch in terms of search, but this will work
//seatgeek api looks bare bones - you need the venue locators, which, i don't know if it's worth it.
//i think eventbrite is prolly the best thing to start us out - a little complicated to start but solid api and better info returns?
//okay i'm done for tonight. 


//if you search for a city on the index page you can see the console.log result in the inspector.
//btw, you're welcome to use the google geocode api key and any of this code in other projects you may be working on:)

// call google api and get lat/long or other geo identifier for city for ticketmaster to use

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
            }
            //format the data, baby
            console.log(data);
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
});
