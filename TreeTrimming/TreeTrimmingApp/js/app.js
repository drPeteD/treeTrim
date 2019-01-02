require([
  // ArcGIS
  "esri/Map",
  "esri/views/MapView",
  "esri/request",

  // Layers
  "esri/layers/MapImageLayer",
  "esri/layers/FeatureLayer",
  "esri/layers/GraphicsLayer",

  "esri/tasks/Locator",

  // Widgets
  "esri/widgets/Home",
  "esri/widgets/Zoom",
  "esri/widgets/Compass",
  "esri/widgets/Search",
  "esri/widgets/Legend",
  "esri/widgets/BasemapToggle",
  "esri/widgets/ScaleBar",
  "esri/widgets/Attribution",
  "esri/widgets/Popup",

  // Bootstrap
  "bootstrap/Collapse",
  "bootstrap/Dropdown",

  "esri/geometry/support/webMercatorUtils",
  "esri/geometry/Point",
  "esri/Graphic",

  // Calcite Maps
  "calcite-maps/calcitemaps-v0.8",
  // Calcite Maps ArcGIS Support
  "calcite-maps/calcitemaps-arcgis-support-v0.8",

  "dojo/dom",
  "dojo/on",
  "dojo/dom-attr",
  "dojo/domReady!"
], function (
  Map,
  MapView,
  esriRequest,
  MapImageLayer,
  FeatureLayer,
  GraphicsLayer,
  Locator,
  Home,
  Zoom,
  Compass,
  Search,
  Legend,
  BasemapToggle,
  ScaleBar,
  Attribution,
  Popup,
  Collapse,
  Dropdown,
  WebMercatorUtils,
  Point,
  Graphic,
  CalciteMaps,
  CalciteMapArcGISSupport,
  dom,
  on,
  domAttr
) {
    var waitingForClick = "";
    var startGraphic, endGraphic, measure;
    var startLocations = [];
    var endLocations = [];
    var selectedRouteID = "";
    $("#IntermittentLength").hide();

    $("#GetStartPoint").click(() => {
      console.log("getStartPoint clicked");
      waitingForClick = "StartCoords";
      $("#mapViewDiv").css("cursor", "crosshair");
      //$("#startCoords").html("X: " + event.mapPoint.x.toString() = ", Y: " + event.mapPoint.y.toString());
      graphicsLayer.removeAll();
      $("#StartCoords").val("");
      $("#EndCoords").val("");
    });

    $("#GetEndPoint").click(() => {
      console.log("getEndPoint clicked");
      waitingForClick = "EndCoords";
      $("#mapViewDiv").css("cursor", "crosshair");
      //$("#startCoords").html("X: " + event.mapPoint.x.toString() = ", Y: " + event.mapPoint.y.toString());
      graphicsLayer.removeMany(endGraphic);
    });

    $("#AddProjectToggle").click(() => {
      if ($("#iconAddProject").is(".glyphicon-resize-full")) {
        $("#iconAddProject")
          .removeClass("glyphicon-resize-full")
          .addClass("glyphicon-resize-small");
      } else {
        $("#iconAddProject")
          .removeClass("glyphicon-resize-small")
          .addClass("glyphicon-resize-full");
      }
    });

    //$("[type='radio']").change(() => {
    $("[name='radioProjectType']").change(() => {
      //if ($("[type='radio']:checked").val() == "Removal") {
      if ($("[name='radioProjectType']:checked").val() == "Removal") {
        $("#EndPoint").hide();
        $("#Intermittent").hide();
        $("#IntermittentLength").hide();
      } else {
        $("#EndPoint").show();
        $("#Intermittent").show();
        $("#IntermittentLength").show();
      }
    });



    $("[name='radioIntermittent']").change(() => {
      if ($("[name='radioIntermittent']:checked").val() == "Yes") {
        $("#IntermittentLength").show();
      } else {
        $("#IntermittentLength").hide();
      }
    });

    $("#btnReset").click(() => {
      $("#Feedback").hide();
      $("#txtRouteID").remove();

      // Add dropdown
      $("#divRouteID").append(
        '<input type="text" readonly id="txtRouteID" class="form-control" />'
      );
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
      // beginLat = $("#beginLat")
      //   .val()
      //   .trim();
      // beginLong = $("#beginLong")
      //   .val()
      //   .trim();
      // beginMilepoint = $("#beginMilepoint")
      //   .val()
      //   .trim();
      // endLat = $("#EndLat")
      //   .val()
      //   .trim();
      // endLong = $("#EndLong")
      //   .val()
      //   .trim();
      // endMilepoint = $("#EndMilepoint")
      //   .val()
      //   .trim();
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
      project.route = routeId.substring(2, 8);
      project.type = projectType;
      project.width = parseInt(width, 10);
      project.effectiveLength = parseInt(width, 10);
      project.effectiveAcres = parseFloat(effectiveAcres);
      project.notes = notes;
      //if (endMilepoint > beginMilepoint) {
      startCoords = $("#StartCoords")
        .val()
        .split(",");
      project.beginLat = startCoords[0].trim();
      project.beginLong = startCoords[1].trim();
      project.beginMilepoint = startCoords[2].trim();

      endCoords = $("#EndCoords")
        .val()
        .split(",");
      project.endLat = endCoords[0].trim();
      project.endLong = endCoords[1].trim();
      project.endMilepoint = endCoords[2].trim();
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
    // $("#btnSubmit").click(() => {
    //   var projectName,
    //     projectType,
    //     startCoords,
    //     startLat,
    //     startLong,
    //     startMilepoint,
    //     endCoords,
    //     endLat,
    //     endLong,
    //     endMilepoint,
    //     routeID,
    //     width;
    //   projectName = $("#txtProjectName").val();
    //   if ($("input[name='radioProjectType']").val() == "Trimming") {
    //     projectType = 0;
    //   } else {
    //     projectType = 1;
    //   }
    //   console.log("projectType", projectType);
    //   startCoords = $("#StartCoords")
    //     .val()
    //     .split(",");
    //   startLat = startCoords[0].trim();
    //   startLong = startCoords[1].trim();
    //   startMilepoint = startCoords[2].trim();
    //   if (projectType == 0) {
    //     endCoords = $("#EndCoords")
    //     .val()
    //     .split(",");
    //   endLat = endCoords[0].trim();
    //   endLong = endCoords[1].trim();
    //   endMilepoint = endCoords[2].trim();
    //   }

    //   console.log("startCoords", startCoords);
    //   routeID = $("#txtRouteID").val();
    //   width = $("#txtWidth").val();
    //   var project = {};
    //   project.projectType = projectType;
    //   project.projectName = projectName;
    //   project.routeID = routeID;
    //   project.width = parseInt(width, 10);
    //   if ($("#txtLength").val() != "") {
    //     project.length = $("#txtLength").val();
    //   } else {
    //     project.length = ""
    //   }
    //   console.log("length", project.length);
    //   //if (endMilepoint > startMilepoint) {
    //   project.startLat = parseFloat(startLat);
    //   project.startLong = parseFloat(startLong);
    //   project.startMilepoint = parseFloat(startMilepoint);
    //   project.endLat = parseFloat(endLat);
    //   project.endLong = parseFloat(endLong);
    //   project.endMilepoint = parseFloat(endMilepoint);
    //   // } else {
    //   //   project.startLat = endLat;
    //   //   project.startLong = endLong;
    //   //   project.startMilepoint = endMilepoint;
    //   //   project.endLat = startLat;
    //   //   project.endLong = startLong;
    //   //   project.endMilepoint = startMilepoint;
    //   // }

    //   console.log("project", project);
    //   $.ajax({
    //     type: "POST",
    //     data: project,
    //     url: "http://localhost:3001/insert",
    //     dataType: "json"
    //   }).done(data => {
    //     console.log("data", data);
    //     $("#Feedback")
    //       .removeClass()
    //       .addClass("alert alert-success")
    //       .html(
    //         "Project ID: " +
    //           data.insertProjectInfo[0].ProjectID +
    //           " (" +
    //           projectName +
    //           ") Added - " +
    //           data.insertProjectInfo[0].Area +
    //           " Acres"
    //       )
    //       .show();
    //   });
    // });
    /**************************************************************************************************
     *
     * LRS Functions
     *
     **************************************************************************************************/
    var getMeasure = (geometryLocation, element) => {
      var elmValue = document.getElementById(element).value;
      console.log("element.val", elmValue);
      var g2m =
        "https://gis.transportation.wv.gov/arcgis/rest/services/Roads_And_Highways/Publication_LRS/MapServer/exts/LRSServer/networkLayers/89/geometryToMeasure";
      var tVD = Date.now();

      var locations = [geometryLocation];

      var fivePixels = (mapView.extent.width / mapView.width) * 5;

      var options = {
        query: {
          locations: JSON.stringify(locations),
          tolerance: fivePixels,
          inSR: mapView.spatialReference.wkid,
          f: "json",
          temporarViewDate: tVD
        },
        responseType: "json"
      };
      esriRequest(g2m, options).then(function (response) {
        var resp = response.data;
        console.log("resp.data", resp);
        var locs = resp.locations;
        console.log("locs", locs);
        if (locs[0].status != "esriLocatingCannotFindLocation") {
          if (locs[0].status == "esriLocatingOK") {
            var routeId = locs[0].results[0].routeId;
            selectedRouteID = routeId;
            measure = locs[0].results[0].measure.toFixed(3);
            console.log("routeid, measure", routeId, measure, element);
            //return(measure);
            document.getElementById(element).value = elmValue + ", " + measure;
            $("#txtRouteId").val(routeId);
          } else if (locs[0].status == "esriLocatingMultipleLocation") {
            if (element == "StartCoords") {
              // Remove text input
              $("#txtRouteId").remove();

              // Add dropdown
              $("#divRouteID").append(
                '<select id="txtRouteId" name="RouteID" class="form-control"></select>'
              );
              selectedRouteID = locs[0].results[0].routeId;
              for (var i = 0; i < locs[0].results.length; i++) {
                $("#txtRouteId").append(
                  '<option value="' +
                  locs[0].results[i].routeId +
                  '">' +
                  locs[0].results[i].routeId +
                  "</option>"
                );

                var loc = {};
                loc.routeId = locs[0].results[i].routeId;
                loc.measure = locs[0].results[i].measure;
                startLocations.push(loc);
                console.log("startLocations", startLocations);
              }
              var routeId = locs[0].results[0].routeId;
              measure = locs[0].results[0].measure.toFixed(3);
              document.getElementById(element).value = elmValue + ", " + measure;
            } else if (element == "EndCoords") {
              console.log("looking for ", selectedRouteID);
              for (var i = 0; i < locs[0].results.length; i++) {

                if (locs[0].results[i].routeId == selectedRouteID) {
                  console.log("found ", selectedRouteID);
                  measure = locs[0].results[i].measure.toFixed(3);
                }
              }
              document.getElementById(element).value = elmValue + ", " + measure;
            }
          }

          console.log("routeid, measure", selectedRouteID, measure, element);
          //return(measure);

          //$("#txtRouteID").val(routeId);
        } else {
          document.getElementById(element).value = "Cannot Find Location";
        }
      });
    };

    $(document).on("change", "#txtRouteId", function () {
      selectedRouteID = $("select option:selected").text();
      const result = startLocations.filter(l => l.routeId == selectedRouteID);
      var start = $("#StartCoords")
        .val()
        .split(",");
      var lat, lng;
      lat = start[0].trim();
      lng = start[1].trim();
      console.log("result", result);
      start[2] = result[0].measure.toFixed(3);
      console.log("start2", start[2]);
      $("#StartCoords").val(lat + ", " + lng + ", " + start[2]);
      graphicsLayer.removeMany(endGraphic);
    });

    /******************************************************************
     *
     * Create the category renderer, map, view and widgets
     *
     ******************************************************************/

    var graphicsLayer = new GraphicsLayer();
    var countyCode,
      countyName,
      signSysCode,
      signSysName,
      route,
      subroute,
      surfTypeCode,
      surfTypeName,
      roadWidth,
      pavementWidth;
    getTitle = function (value, key, data) {
      countyName = getCounty(data.RouteID.substr(0, 2));
      signSysName = getSignSys(data.RouteID.substr(2, 1));
      route = parseInt(data.RouteID.substr(3, 4), 10);
      subroute = data.RouteID.substr(7, 2);
      if (subroute != "00") {
        subroute = "/" + subroute;
      } else {
        subroute = "";
      }
      console.log(countyName, signSysName, route, subroute);
      return (
        data.RouteID +
        ": " +
        countyName +
        " " +
        signSysName +
        " " +
        route +
        subroute
      );
    };

    getSurfaceType = function (value, key, data) {
      switch (parseInt(data.Surface_Type, 10)) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
          surfTypeName = "Dirt Road";
          break;
        case 5:
          surfTypeName = "Gravel Road";
          break;
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
        case 11:
          surfTypeName = "Asphalt Road";
          break;
        case 12:
          surfTypeName = "Concrete Road";
          break;
        case 13:
          surfTypeName = "Brick Road";
          break;
        default:
          surfTypeName = "Unknown";
      }
      console.log("surfTypeName", surfTypeName);
      return surfTypeName;
    };

    function getCounty(countyCode) {
      for (var i = 0; i < countiesJson.length; i++) {
        if (countiesJson[i].CountyCode == countyCode) {
          countyName = countiesJson[i].CountyName;
        }
      }
      return countyName;
    }

    function getSignSys(signSysCode) {
      var signSysName;
      console.log("signSys", signSysCode);
      for (var i = 0; i < signSystems.length; i++) {
        if (signSystems[i].Code == signSysCode) {
          signSysName = signSystems[i].Name;
          console.log("signSysName", signSysName);
        }
      }
      return signSysName;
    }

    getRouteInfo = function (value, key, data) {
      console.log("getRouteInfo", data);
      var county, sign, route, subroute;
      $.getJSON(
        "https://gis.transportation.wv.gov/api/counties/" +
        data.RouteID.substr(0, 2),
        function (json) {
          $.each(json, function (key, val) {
            county = val;
            console.log("county", county);
          });
        }
      );
      return county;
    };

    function popupContent(routeid) {
      console.log(routeid);
      if (routeid.charAt(2) == "1") {
        return "This is an interstate";
      }
    }
    // roadLayer.findSublayerById(0).visible = true;
    // Map
    var map = new Map({
      basemap: "streets-vector"
    });

    var countiesLayer = new MapImageLayer({
      url:
        "https://gis.transportation.wv.gov/arcgis/rest/services/Boundaries/MapServer",
      sublayers: [
        {
          id: 1,
          visible: true
        }
      ]
    });

    var footprintLayer = new MapImageLayer({
      url:
        "https://services.wvgis.wvu.edu/arcgis/rest/services/ManMadeStructures/BuildingFootprints/MapServer",
      sublayers: [
        {
          id: 0,
          visible: true
        }
      ]
    });

    var statesLayer = new MapImageLayer({
      url:
        "https://gis.transportation.wv.gov/arcgis/rest/services/Boundaries/MapServer",
      sublayers: [
        {
          id: 19,
          visible: true
        }
      ]
    });

    map.add(statesLayer);
    map.add(countiesLayer);
    map.add(footprintLayer);
    map.add(graphicsLayer);

    // View
    var mapView = new MapView({
      center: [-80, 39],
      zoom: 8,
      container: "mapViewDiv",
      map: map,
      padding: {
        top: 50,
        bottom: 0
      },
      ui: { components: [] }
    });

    // Popup and panel sync
    mapView.when(function () {
      CalciteMapArcGISSupport.setPopupPanelSync(mapView);
    });

    // Get Milepoint data at click
    mapView.on("click", function (event) {
      var lat = event.mapPoint.latitude.toFixed(6);
      var long = event.mapPoint.longitude.toFixed(6);
      var element;
      console.log("waitingForClick", waitingForClick);

      console.log("lat, long", lat + ", " + long);

      $("#mapViewDiv").css("cursor", "auto");
      if (waitingForClick == "StartCoords") {
        graphicsLayer.removeAll();
        console.log("event", event);
        $("#StartCoords").val(lat + ", " + long);
        var lngLat = [event.mapPoint.longitude, event.mapPoint.latitude];

        var point = new Point({
          longitude: lngLat[0],
          latitude: lngLat[1]
        });
        startGraphic = createSymbol(point, [0, 255, 0, 0.5]);
        graphicsLayer.addMany(startGraphic);
        mapView.goTo(lngLat, {
          duration: 1500
        });
        var geometryLocation = {
          geometry: {
            x: event.mapPoint.x,
            y: event.mapPoint.y
          }
        };
        element = "StartCoords";
        getMeasure(geometryLocation, element);
        console.log("measure", measure);
        //$("#StartCoords").append(measure);
      } else if (waitingForClick == "EndCoords") {
        console.log("event", event);
        $("#EndCoords").val(lat + ", " + long);
        var lngLat = [long, lat];

        var point = new Point({
          longitude: lngLat[0],
          latitude: lngLat[1]
        });
        endGraphic = createSymbol(point, [255, 0, 0, 0.5]);
        graphicsLayer.addMany(endGraphic);

        var geometryLocation = {
          geometry: {
            x: event.mapPoint.x,
            y: event.mapPoint.y
          }
        };
        element = "EndCoords";
        getMeasure(geometryLocation, element);
      }
    });

    // Search - add to navbar

    var searchWidget = new Search({
      container: "searchWidgetDiv",
      view: mapView,
      popEnabled: false,
      popupOpenOnSelect: false,
      resultGraphicEnabled: false,
      includeDefaultSources: false,
      sources: [
        {
          featureLayer: {
            url:
              "https://services.wvgis.wvu.edu/arcgis/rest/services/Boundaries/wv_political_bdry_wm/MapServer/20"
          },

          searchFields: ["NAME"],
          outFields: ["NAME"],
          name: "Incorporated Place",
          placeholder: "Incorporated Place Search",
          suggestionsEnabled: true,
          exactMatch: false
        },

        {
          featureLayer: {
            url:
              "https://gis.transportation.wv.gov/arcgis/rest/services/Boundaries/FeatureServer/1"
          },
          searchFields: ["NAME"],
          outFields: ["*"],
          name: "County",
          placeholder: "County Search",
          suggestionsEnabled: true,
          exactMatch: false
        }
      ]
    });

    CalciteMapArcGISSupport.setSearchExpandEvents(searchWidget);

    /**************************************************************************
     *
     *  Map widgets
     *
     * ***********************************************************************/
    var home = new Home({
      view: mapView
    });
    mapView.ui.add(home, "top-left");

    var zoom = new Zoom({
      view: mapView
    });
    mapView.ui.add(zoom, "top-left");

    var compass = new Compass({
      view: mapView
    });
    mapView.ui.add(compass, "top-left");

    var basemapToggle = new BasemapToggle({
      view: mapView,
      secondBasemap: "satellite"
    });
    mapView.ui.add(basemapToggle, "top-right");

    var scaleBar = new ScaleBar({
      view: mapView
    });
    mapView.ui.add(scaleBar, "bottom-left");

    var attribution = new Attribution({
      view: mapView
    });
    mapView.ui.add(attribution, "manual");

    /*******************************************************************
    
    Begin Drawing Functions
  
    *******************************************************************/

    var createSymbol = (point, color) => {
      // Create a crosshair graphic where mouse was clicked by adding 2 symbols: a circle and a cross
      var pointSymbol = {
        type: "simple-marker",
        style: "circle",
        outline: {
          cap: "round"
        },
        angle: 0,
        size: 24,
        color: color
      };
      var crossSymbol = {
        type: "simple-marker",
        style: "cross",
        outline: {
          cap: "round"
        },
        angle: 0,
        size: 24,
        color: [255, 255, 255, 0.8]
      };

      var crossGraphic = new Graphic({
        geometry: point,
        symbol: crossSymbol
      });
      pointGraphic = new Graphic({
        geometry: point,
        symbol: pointSymbol
      });

      return [pointGraphic, crossGraphic];
    };
    /*******************************************************************
    
    End Drawing Functions
  
    *******************************************************************/

    var signSystems = [
      {
        Code: "1",
        Name: "Interstate"
      },
      {
        Code: "2",
        Name: "US Route"
      },
      {
        Code: "3",
        Name: "State Route"
      },
      {
        Code: "4",
        Name: "County Route"
      },
      {
        Code: "5",
        Name: "N/A"
      },
      {
        Code: "6",
        Name: "State Park"
      },
      {
        Code: "7",
        Name: "FANS"
      },
      {
        Code: "8",
        Name: "HARP"
      },
      {
        Code: "9",
        Name: "Other"
      },
      {
        Code: "0",
        Name: "Municipal Non-State"
      }
    ];

    var countiesJson = [
      {
        CountyCode: "01",
        CountyName: "Barbour"
      },
      {
        CountyCode: "02",
        CountyName: "Berkeley"
      },
      {
        CountyCode: "03",
        CountyName: "Boone"
      },
      {
        CountyCode: "04",
        CountyName: "Braxton"
      },
      {
        CountyCode: "05",
        CountyName: "Brooke"
      },
      {
        CountyCode: "06",
        CountyName: "Cabell"
      },
      {
        CountyCode: "07",
        CountyName: "Calhoun"
      },
      {
        CountyCode: "08",
        CountyName: "Clay"
      },
      {
        CountyCode: "09",
        CountyName: "Doddridge"
      },
      {
        CountyCode: "10",
        CountyName: "Fayette"
      },
      {
        CountyCode: "11",
        CountyName: "Gilmer"
      },
      {
        CountyCode: "12",
        CountyName: "Grant"
      },
      {
        CountyCode: "13",
        CountyName: "Greenbrier"
      },
      {
        CountyCode: "14",
        CountyName: "Hampshire"
      },
      {
        CountyCode: "15",
        CountyName: "Hancock"
      },
      {
        CountyCode: "16",
        CountyName: "Hardy"
      },
      {
        CountyCode: "17",
        CountyName: "Harrison"
      },
      {
        CountyCode: "18",
        CountyName: "Jackson"
      },
      {
        CountyCode: "19",
        CountyName: "Jefferson"
      },
      {
        CountyCode: "20",
        CountyName: "Kanawha"
      },
      {
        CountyCode: "21",
        CountyName: "Lewis"
      },
      {
        CountyCode: "22",
        CountyName: "Lincoln"
      },
      {
        CountyCode: "23",
        CountyName: "Logan"
      },
      {
        CountyCode: "24",
        CountyName: "McDowell"
      },
      {
        CountyCode: "25",
        CountyName: "Marion"
      },
      {
        CountyCode: "26",
        CountyName: "Marshall"
      },
      {
        CountyCode: "27",
        CountyName: "Mason"
      },
      {
        CountyCode: "28",
        CountyName: "Mercer"
      },
      {
        CountyCode: "29",
        CountyName: "Mineral"
      },
      {
        CountyCode: "30",
        CountyName: "Mingo"
      },
      {
        CountyCode: "31",
        CountyName: "Monongalia"
      },
      {
        CountyCode: "32",
        CountyName: "Monroe"
      },
      {
        CountyCode: "33",
        CountyName: "Morgan"
      },
      {
        CountyCode: "34",
        CountyName: "Nicholas"
      },
      {
        CountyCode: "35",
        CountyName: "Ohio"
      },
      {
        CountyCode: "36",
        CountyName: "Pendleton"
      },
      {
        CountyCode: "37",
        CountyName: "Pleasants"
      },
      {
        CountyCode: "38",
        CountyName: "Pocahontas"
      },
      {
        CountyCode: "39",
        CountyName: "Preston"
      },
      {
        CountyCode: "40",
        CountyName: "Putnam"
      },
      {
        CountyCode: "41",
        CountyName: "Raleigh"
      },
      {
        CountyCode: "42",
        CountyName: "Randolph"
      },
      {
        CountyCode: "43",
        CountyName: "Ritchie"
      },
      {
        CountyCode: "44",
        CountyName: "Roane"
      },
      {
        CountyCode: "45",
        CountyName: "Summers"
      },
      {
        CountyCode: "46",
        CountyName: "Taylor"
      },
      {
        CountyCode: "47",
        CountyName: "Tucker"
      },
      {
        CountyCode: "48",
        CountyName: "Tyler"
      },
      {
        CountyCode: "49",
        CountyName: "Upshur"
      },
      {
        CountyCode: "50",
        CountyName: "Wayne"
      },
      {
        CountyCode: "51",
        CountyName: "Webster"
      },
      {
        CountyCode: "52",
        CountyName: "Wetzel"
      },
      {
        CountyCode: "53",
        CountyName: "Wirt"
      },
      {
        CountyCode: "54",
        CountyName: "Wood"
      },
      {
        CountyCode: "55",
        CountyName: "Wyoming"
      }
    ];
  });
