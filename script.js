let urlProd = 'https://advancement.umd.edu/gps/api/application';
let searchKW = 'lifewall/search';

let sectionMap = new Object();

$(document).ready(function() {
  $('.wall-search-input').keydown(function(event) {
    // Allows to submit form by pressing enter on any field
    if (event.which == 13) {
        $("#wall-search-submit").click();
        event.preventDefault();
     }
  });

  let sectionUrl = urlProd + '/' + api.key + '/' + 'lifewall/section';
  let panelUrl = urlProd + '/' + api.key + '/' + 'lifewall/panel/';

  // Creates mapping of panel and section id to a string name
  $.ajax({
    url: sectionUrl,
    type: 'GET',

    success: (sectionRes) => {
      // Should only run three times
      for (var i = 0; i < sectionRes.length; i++){
        var section = sectionRes[i];
        sectionMap[section.SectionID] = new Object();

        $.ajax({
          url: panelUrl + section.SectionID,
          type: 'GET',

          success: (panelRes) => {
            for (var panelNum = 0; panelNum < panelRes.length; panelNum++){
              var panel = panelRes[panelNum];
              sectionMap[panel.SectionID][panel.PanelID] = panel.PanelName;
            }
          }, failure: (err) => {
            console.log("No response from API. Check internet connection or try again.");
          }

        })
      }

    }, failure: (err) => {
      console.log("No response from API. Check internet connection or try again.");
    }
  });

});

$("#wall-search-submit").click(function() {

  $("#err").hide();

  if ($("#wall-search-input-fn").val() || $("#wall-search-input-ln").val() || $("#wall-search-input-yr").val()) {
    return search();
  } else {
    $("#cards").html('');
    $("#err").show();
  }

})

search = () => {
  let fn = $("#wall-search-input-fn").val();
  let ln = $("#wall-search-input-ln").val();
  let yr = $("#wall-search-input-yr").val();

  let searchUrl = urlProd + '/' + api.key + '/' + searchKW;

  if (fn !== '') {
    searchUrl += '&Firstname=' + fn;
  }

  if (ln !== '') {
    searchUrl += '&Lastname=' + ln;
  }

  if (yr !== '') {
    searchUrl += '&ClassYear=' + yr;
  }

  $.ajax({
    url: searchUrl,
    type: 'GET',
    success: (res) => {
      $("#cards").html('');
      $("#err").css('display','none');

      if (res.length == 0) {
        $("#err").show();
      } else {
        $("#cards").append(
          "<div class='col-md-12 text-center' style='font-size:16'>"+
              "Showing "+ res.length + " results"+
          "</div><br><br>"
        )
      }
      for (let i = 0; i < res.length; i++) {
        $("#cards").append(
          "<div class = 'col-md-4'><div class='feature-card-container'><div class='feature-card person-card'><h4 class='source-sans'>"+
          res[i].Lifewall_Name+
          "</h4><hr><p>"+
          sectionMap[res[i].SectionID][res[i].PanelID]+"<br>"+
          "Column: "+res[i].ColumnID+"<br>"+
          "Row: "+res[i].RowID+
          "</div></div></div>"
        );
      }

    }, failure: (err) => {
      $("#err").show();
    }
  });

}
