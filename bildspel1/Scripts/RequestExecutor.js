'use strict';

var hostweburl;
var appweburl;

// Load the required SharePoint libraries
$(document).ready(function () {
    //Get the URI decoded URLs.
    hostweburl = decodeURIComponent(getQueryStringParameter("SPHostUrl"));
    appweburl = decodeURIComponent(getQueryStringParameter("SPAppWebUrl"));

    // resources are in URLs in the form: web_url/_layouts/15/resource
    var scriptbase = hostweburl + "/_layouts/15/";

    // Load the js files and continue to the successHandler
    $.getScript(scriptbase + "SP.RequestExecutor.js", execCrossDomainRequest);

});

// Function to prepare and issue the request to get SharePoint data
function execCrossDomainRequest() {
    // executor: The RequestExecutor object Initialize the RequestExecutor with the app web URL.
    var executor = new SP.RequestExecutor(appweburl);

    // Deals with the issue the call against the app web.
    executor.executeAsync({
        url: appweburl + "/_api/SP.AppContextSite(@target)/web/lists/getbytitle('bildspel1')/items?@target='" + hostweburl + "'&$select=EncodedAbsWebImgUrl&$top=10",
                                                                                                                
                                                                                                                                
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: successHandler,
        error: errorHandler
    }
    );
}

// Function to handle the success event. Prints the data to the page.
function successHandler(data) {
    var jsonObject = JSON.parse(data.body);
    var items = [];
    var results = jsonObject.d.results;
    var container = $(".camera_wrap");    

    $(results).each(function () {

        container.append(
            '<div data-src=' +
            this.EncodedAbsWebImgUrl + '>' +
            '</div>');
    });

    
    $(".camera_wrap").camera({
        height: '41%',
        //pagination: false,
        //thumbnails: false,
        time: 2000
    });

}


// Function to handle the error event. Prints the error message to the page.
function errorHandler(data, errorCode, errorMessage) {
    document.getElementById("internal").innerText = "Could not complete cross-domain call: " + errorMessage;
}

// Function to retrieve a query string value.
function getQueryStringParameter(paramToRetrieve) {
    var params =
        document.URL.split("?")[1].split("&");
    var strParams = "";
    for (var i = 0; i < params.length; i = i + 1) {
        var singleParam = params[i].split("=");
        if (singleParam[0] == paramToRetrieve)
            return singleParam[1];
    }
}