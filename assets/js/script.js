var getEvents = function(latLong) {
    var startDateTime = ("2022-02-22T00:00:01Z");
    var endDateTime = ("2022-02-24T23:59:59Z");
    var classificationName = "Sports";
    var ticketMasterMayI = ("https://app.ticketmaster.com/discovery/v2/events.json?latlong=" + latLong + "&startDateTime=" + startDateTime + "&endDateTime=" + endDateTime + "&classificationName=" + classificationName + "&size=100&sort=date,name,desc&apikey=qMeZuZFNC7wTNBRfgRDNS9UVVganTX77");
    fetch(ticketMasterMayI)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        console.log(data._embedded.events[0].name);
        console.log(data._embedded.events[0]._embedded.venues[0].name);
        console.log(data._embedded.events[0].url);
        //first images tend to have 16:9 ratio
        console.log(data._embedded.events[0].images[0].url);
        console.log(data._embedded.events[0].priceRanges[0].min);
        console.log(data._embedded.events[0].priceRanges[0].max);
    });
};

//make event buttons
var eventTokens = function() {
    
}

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
                var lat = (data.results[0].geometry.location.lat);
                var lng = (data.results[0].geometry.location.lng);
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
