$(document).ready(function() {
  $(".button-collapse").on("click", function() {
    $.ajax({
      method: "GET",
      url: "/articles"
    }).done(function(data) {
      window.location = "/articles";
      $("#collapseExample").modal("show");
    });
  });

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append(
        "<button data-id='" + data._id + "' id='savenote'>Save Note</button>"
      );

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

//   // Click Listener for FORM SUBMISSION to ADD a comment
//   $(".add-comment-button").on("click", function() {
//     // http://stackoverflow.com/questions/1960240/jquery-ajax-submit-form
//     // http://stackoverflow.com/questions/17097947/jquery-using-a-variable-as-a-selector

//     // Get _id of comment to be deleted
//     var articleId = $(this).data("id");

//     // URL root (so it works in eith Local Host for Heroku)
//     var baseURL = window.location.origin;

//     // Get Form Data by Id
//     var frmName = "form-add-" + articleId;
//     var frm = $("#" + frmName);

//     // AJAX Call to delete Comment
//     $.ajax({
//       url: baseURL + "/add/comment/" + articleId,
//       type: "POST",
//       data: frm.serialize()
//     }).done(function() {
//       // Refresh the Window after the call is done
//       location.reload();
//     });

//     // Prevent Default
//     return false;
//   });

//   // Click Listener for FORM SUBMISSION to DELETE a comment
//   $(".delete-comment-button").on("click", function() {
//     // Get _id of comment to be deleted
//     var commentId = $(this).data("id");

//     // URL root (so it works in eith Local Host for Heroku)
//     var baseURL = window.location.origin;

//     // AJAX Call to delete Comment
//     $.ajax({
//       url: baseURL + "/remove/comment/" + commentId,
//       type: "POST"
//     }).done(function() {
//       // Refresh the Window after the call is done
//       location.reload();
//     });

//     // Prevent Default
//     return false;
//   });
// });
