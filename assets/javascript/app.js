// add buttons using a form input, remove buttons with a drag even,
// click the buttons to get images that turn into gifs when the user clicks them
// uses HTML5, Bootstrap, JavaScript, JQuery, SweetAlert CDN, GiphyAPI

"use strict";

$(document).ready(function(){

  // Initial array of wizards
  var wizards = ["Harry Potter", "Ron Weasley", "Hermione Granger", "Ginny Weasley",
    "Luna Lovegood", "Neville Longbottom"];
  
  // display buttons
  function renderButtons() {
    // delete the current buttons else buttons will repeat
    $("#wizardButtons").empty();
    // loop through the array of wizards
    for (var i = 0; i < wizards.length; i++) {
      // generate buttons for each wizard in the array
      // this code $("<button>") is all jQuery needs to create the beginning and
      // end tag. (<button></button>)
      var button = $("<button>");
      // add class of wizard to button, btn btn-seconary is for bootstrap
      button.addClass("wizard btn btn-secondary");
      // add a data-attr
      button.attr("data-name", wizards[i]);
      // provide initial button text
      button.text(wizards[i]);
      // add the button to the wizardButtons div
      $("#wizardButtons").append(button);
    }
  }

  // displayGifs re-renders the HTML to display the images
  function displayGifs() {
    //get name of button pushed
    var wizard = $(this).attr("data-name");
    // create the url for giphy api
    var queryURL = "http://api.giphy.com/v1/gifs/search?q=" +
      wizard + "&api_key=dc6zaTOxFJmzC&limit=10";
    // create AJAX call for wizard button clicked
    $.ajax({
      url: queryURL,
      method: "GET"
    }).done(function(response) {
      var results = response.data;
      // console.log(response);
      if (results.length > 0) {
      //  $("#wizards-view").empty();
        // Looping over every result item
        for (var i = 0; i < results.length; i++) {
          // Only taking action if the photo has an appropriate rating
          if (results[i].rating !== "r" && results[i].rating !== "pg-13") {
            // Creating a div with the class "item"
            var gifDiv = $("<div class='item float-left'>");
            // storing results item's rating
            var rating = results[i].rating;
            // creating a p tag with the results rating
            var p = $("<p>").text("Rating: " + rating);
            p.addClass("text-center")
            // creating an image tag
            var image = $("<img>");
            // add src attribute of a proprty pulled off the results item
            image.attr("src", results[i].images.fixed_height_still.url);
            image.attr("data-animate", results[i].images.fixed_height.url);
            image.attr("data-still", results[i].images.fixed_height_still.url);
            image.attr("data-state", "still");
            image.addClass("gif rounded");
            // append p and image created to gifDiv
            gifDiv.append(image);
            gifDiv.append(p);
            // prepend gifDiv to the "#gifs-appear-here" div in the HTML
            $("#wizards-view").prepend(gifDiv);
          }
        }
      } else {
        // use the sweetAlert CDN (see bottom of html)
        swal({
          title: "No results.",
          text: "Let's remove this button.",
          icon: "error",
          button: "Ok",
        }).then(function(){
          wizards.splice(wizards.indexOf(wizard),1);
          renderButtons();
        });
      }
    });
  }

  $(document).on("click", ".gif", function() {
    console.log("click");
    // The attr jQuery method allows us to get or set the value of any attribute on our HTML element
    var state = $(this).attr("data-state");
    // if clicked image state is still, update src attr to what its data-animate value is
    // then set image data-state to animate
    // else set src to the data-still value
    if (state === "animate") {
      // console.log("state was animate");
      $(this).attr("src", $(this).attr("data-still"));
      $(this).attr("data-state", "still");
    } else {
      // console.log("state was still");
      $(this).attr("src", $(this).attr("data-animate"));
      $(this).attr("data-state", "animate");
    }
  });

  // when Aparecium button is clicked i.e. add new button
  $("#add-wizard").on("click", function(event) {
    event.preventDefault();
    // This line grabs the input from the textbox
    var wizard = $("#wizard-input").val().trim();
    // remove input from input box in html
    $("#wizard-input").val("");
    if (wizard && !wizards.includes(wizard)) {
      // Adding wizard from the textbox to our array
      wizards.push(wizard);
      // Calling renderButtons which handles the processing of our wizard array
      renderButtons();
      $("wizard-form").trigger("reset");
    }
  });

  // pressing enter while in input box triggers "Aparecium" button click
  $("#wizard-input").keyup(function(event) {
    if (event.keyCode == 13) {
      $("#add-wizard").click()
    }
  });

  // when Obsoletum button is clicked
  $("#remove-wizard").on("click", function(even){
    event.preventDefault();
    // This line grabs the input from the textbox
    var wizard = $("#wizard-removal").val().trim();
    // remove input from input box in html
    $("#wizard-removal").val("");
    if (wizard && wizards.includes(wizard)) {
      swal({
        title: "Spell Found!",
        text: "Let's remove this button.",
        icon: "success",
        button: "Ok",
      }).then(function(){
        wizards.splice(wizards.indexOf(wizard),1);
        renderButtons();
      });
    } else {
      swal({
        title: "No results.",
        text: "This button does not exist.",
        icon: "error",
        button: "Ok",
      });
    }
  });

  $("#wizard-removal").keyup(function(event) {
    if (event.keyCode == 13) {
      $("#remove-wizard").click()
    }
  });

  $("#remove-images").on("click", function(even){
    // event.preventDefault();
    $("#wizards-view").empty();
  });

  // Adding a click event listener to all elements with a class of "wizard"
  $(document).on("click", ".wizard", displayGifs);
  // call on initial page load to show default buttons
  renderButtons();
});