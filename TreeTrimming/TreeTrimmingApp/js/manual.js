$(function() {
    $("#btnReset").click(() => {
      $("#Feedback").hide();
      $("input[type='text']").val("");
      $("input[type='radio']").prop("checked", false);
    });
  
    $("#btnSubmit").click(() => {
      var projectType,
        countyCode,
        countyName,
        beginCoords,
        beginLat,
        beginLong,
        beginMilepoint,
        endCoords,
        endLat,
        endLong,
        endMilepoint,
        routeId,
        notes,
        width,
        effectiveLength,
        effectiveAcres,
        dateReviewed;
      if ($("input[name='radioProjectType']").val() == "Trimming") {
        projectType = "Trimming";
      } else {
        projectType = "Removal";
      }
      beginLat = $("#beginLat")
        .val()
        .trim();
      beginLong = $("#beginLong")
        .val()
        .trim();
      beginMilepoint = $("#beginMilepoint")
        .val()
        .trim();
      endLat = $("#EndLat")
        .val()
        .trim();
      endLong = $("#EndLong")
        .val()
        .trim();
      endMilepoint = $("#EndMilepoint")
        .val()
        .trim();
      routeId = $("#txtRouteId")
        .val()
        .trim();
      notes = $("#txtNotes")
        .val()
        .trim();
      width = $("#txtWidth")
        .val()
        .trim();
      effectiveLength = $("#EffectiveLength")
        .val()
        .trim();
        effectiveAcres = $("#EffectiveAcres")
        .val()
        .trim();
      dateReviewed = new Date(
        $("#DateReviewed")
          .val()
          .trim()
      );
      var project = {};
      project.projectType = projectType;
      project.routeId = routeId;
      project.route = routeId.substring(2,8);
      project.type=projectType;
      project.width = parseInt(width, 10);
      project.effectiveLength = parseInt(width, 10);
      project.effectiveAcres = parseFloat(effectiveAcres);
      project.notes = notes;
      //if (endMilepoint > beginMilepoint) {
      project.beginLat = parseFloat(beginLat);
      project.beginLong = parseFloat(beginLong);
      project.beginMilepoint = parseFloat(beginMilepoint);
      project.endLat = parseFloat(endLat);
      project.endLong = parseFloat(endLong);
      project.endMilepoint = parseFloat(endMilepoint);
      project.dateReviewed = dateReviewed;
      // } else {
      //   project.beginLat = endLat;
      //   project.beginLong = endLong;
      //   project.beginMilepoint = endMilepoint;
      //   project.endLat = beginLat;
      //   project.endLong = beginLong;
      //   project.endMilepoint = beginMilepoint;
      // }
      countyCode = routeId.substring(0, 2);
      var url = "https://gis.transportation.wv.gov/api/counties/" + countyCode;
  
      $.getJSON(url).done(data => {
        console.log("url", url);
        console.log("data", data[0].CountyName);
        console.log(data[0].CountyName);
        countyName = data[0].CountyName;
  
        // $.ajax({
        //   type: "GET",
        //   url: url,
        //   dataType: "json"
        // }).done((data) => {
        //   console.log(data[0]);
        //   countyName = data[0].;
        // });
        project.county = data[0].CountyName;
  
        console.log("project", project);
        $.ajax({
          type: "POST",
          data: project,
          url: "http://localhost:3001/insert",
          dataType: "json"
        }).done(data => {
          console.log("data", data);
          $("#Feedback")
            .removeClass()
            .addClass("alert alert-success")
            .html(
              "Project ID: " +
                data[0].id +
                " (" +
                project.notes +
                ") Added - " +
                project.effectiveAcres +
                " Acres"
            )
            .show();
        });
      });
    });
  });
  