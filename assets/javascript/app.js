// Initial array of wizards
      var wizards = ["Harry Potter", "Ron Weasley", "Hermione Granger"];

      // displaywizardInfo function re-renders the HTML to display the appropriate content
      function displaywizardInfo() {

        var wizard = $(this).attr("data-name");
        var queryURL = "http://api.giphy.com/v1/gifs/search?q=" +
        wizard + "&api_key=dc6zaTOxFJmzC&limit=10";

        // Creating an AJAX call for the specific wizard button being clicked
        $.ajax({
          url: queryURL,
          method: "GET"
        }).done(function(response) {

          var results = response.data;

          //console.log(response);

          // Looping over every result item
          for (var i = 0; i < 10; i++) {

            // Only taking action if the photo has an appropriate rating
            if (results[i].rating !== "r" && results[i].rating !== "pg-13") {
              // Creating a div with the class "item"
              var gifDiv = $("<div class='item'>");

              // Storing the result item's rating
              var rating = results[i].rating;

              // Creating a paragraph tag with the result item's rating
              var p = $("<p>").text("Rating: " + rating);

              // Creating an image tag
              var personImage = $("<img>");

              // Giving the image tag an src attribute of a proprty pulled off the
              // result item
              personImage.attr("src", results[i].images.fixed_height.url);

              // personImage.attr("data-animate", results[i].images.fixed_height_still.url);

              // personImage.attr("data-still", results[i].images.fixed_height_still.url);

              // personImage.attr("data-state", "still");

              // personImage.addClass("gif");

              // console.log(personImage);

              // Appending the paragraph and personImage we created to the "gifDiv" div we created
              gifDiv.append(personImage);
              gifDiv.append(p);

              // Prepending the gifDiv to the "#gifs-appear-here" div in the HTML
              $("#wizards-view").prepend(gifDiv);
            }
          }
        });

      }



      $(".gif").on("click", function() {
        console.log("click");
        // The attr jQuery method allows us to get or set the value of any attribute on our HTML element
        var state = $(this).attr("data-state");
        console.log("state it is assinged: " + state);
        // If the clicked image's state is still, update its src attribute to what its data-animate value is.
        // Then, set the image's data-state to animate
        // Else set src to the data-still value
        if (state === "animate") {
          console.log("state was animate");
          $(this).attr("src", $(this).attr("data-still"));
          console.log("url :" + $(this).attr("src"));
          $(this).attr("data-state", "still");
          
        } else {
          console.log("state was still");
          $(this).attr("src", $(this).attr("data-animate"));
          $(this).attr("data-state", "animate");
        }
      });

      
      // Function for displaying movie data
      function renderButtons() {

        // Deleting the wizards prior to adding new wizards
        // (this is necessary otherwise you will have repeat buttons)
        $("#wizardButtons").empty();

        // Looping through the array of wizards
        for (var i = 0; i < wizards.length; i++) {

          // Then dynamicaly generating buttons for each wizard in the array
          // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
          var a = $("<button>");
          // Adding a class of wizard to our button
          a.addClass("wizard");
          // Adding a data-attribute
          a.attr("data-name", wizards[i]);
          // Providing the initial button text
          a.text(wizards[i]);
          // Adding the button to the wizardButtons div
          $("#wizardButtons").append(a);
        }
      }

      // This function handles events where a wizard button is clicked
      $("#add-wizard").on("click", function(event) {
        event.preventDefault();
        // This line grabs the input from the textbox
        var wizard = $("#wizard-input").val().trim();

        // Adding wizard from the textbox to our array
        wizards.push(wizard);

        // Calling renderButtons which handles the processing of our wizard array
        renderButtons();
      });

      // Adding a click event listener to all elements with a class of "wizard"
      $(document).on("click", ".wizard", displaywizardInfo);

      // Calling the renderButtons function to display the intial buttons
      renderButtons();


    