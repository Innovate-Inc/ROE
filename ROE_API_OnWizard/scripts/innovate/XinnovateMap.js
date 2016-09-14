innovate.Map = function(mapID){
    var currentObject = this;
        
    this.map = null;
    this.config = innovate.getUserConfigForMap(mapID);
    var rMap;
    //var fullScreenON = false;
    //this.innovateLayerObj = new innovate.Layers(this);
    //this.innovateControlsObj = new innovate.Controls();
    //this.clickControls = {};
    //this.mapClickControlIds = {};

    //build map object 
  
    /*
     * Thus function builds map based on map id set to the current innovate.Map function
     */
    this.buildMap = function () {
        //this.ROE_RadonMap();
        //this.ROE_FishFaunaPercentLoss();
        //this.setMap();
        
        //Build current map
        var mapToBuild = currentObject.config.layers[0];
        
        this[mapToBuild]();
        
        //if (mapID === 8) {
        //    this[mapToBuild]();
        //}
        //else if (mapID == 1) {
        //    this.ROE_FishFaunaPercentLoss();
        //}
    }

    //Percent reduction in native fish species diversity in the contiguous U.S.
    //Innovate Map # 1
    this.ROE_FishFaunaPercentLoss = function () {
        
        var compare, compare2;
        //alert(mapID);
        require([
          "esri/map",
          "esri/layers/ArcGISDynamicMapServiceLayer",
          "esri/layers/ImageParameters",
          "esri/InfoTemplate",
          "esri/layers/FeatureLayer",
          "esri/dijit/Legend",
          "esri/tasks/query",
          "esri/renderers/SimpleRenderer",
          "esri/symbols/SimpleFillSymbol",
          "esri/symbols/SimpleLineSymbol",
          "esri/dijit/BasemapToggle",
          "esri/dijit/Scalebar",
          "dojo/dom",
          "dojo/number",
          "dojo/on",
          "dojo/parser",
          "dojo/_base/array",
          "esri/Color",
          "dojo/string",
          "esri/request",
          "dojo/dom-style",
          "dijit/form/HorizontalSlider",
          "dijit/popup",
          "dijit/layout/BorderContainer",
          "dijit/layout/ContentPane",
          "dojox/layout/ExpandoPane",
          "dojo/domReady!"
        ],
          function (
            Map, ArcGISDynamicMapServiceLayer, ImageParameters, InfoTemplate, FeatureLayer, Legend, Query, SimpleRenderer, SimpleFillSymbol,
            SimpleLineSymbol, BasemapToggle, Scalebar, dom, number, on, parser, arrayUtils, Color, string, esriRequest, domStyle, HorizontalSlider, popup
        ) {

              //parser.parse(dom.byId("mframe" + mapID));
              parser.parse();

              //var restEnd = "http://geodata.epa.gov/arcgis/rest/services/ORD/"; //EPA Production Rest Endpoint
              //var restEnd = "http://gisstg.rtpnc.epa.gov/arcgis/rest/services/ord/"; //EPA Staging Rest Endpoint
              var restEnd = "http://it.innovateteam.com/arcgis/rest/services/ROE/";

              var layer, visibleLayerIds = []; //list of visible layers

              //Add map and set map properties
              roeMapFPL = new Map("mapDiv" + mapID, {
                  basemap: currentObject.config.baseMap[0],
                  maxZoom: currentObject.config.endResolution,
                  minZoom: currentObject.config.startResolution,
                  center: currentObject.config.center,
                  zoom: currentObject.config.defaultZoomLevel, //Defaultzoomlevel from the config file
                  logo: false,
                  sliderStyle: "large"
              });

              //Add Scalebar and set scalebar properties
              var scalebar = new Scalebar({
                  map: roeMapFPL,
                  attachTo: "bottom-left",
                  scalebarUnit: "dual"
              });
              
              //Add Layers from map_Config
              var imageParameters = new ImageParameters();
              imageParameters.format = "jpeg"; //set the image type to PNG24, note default is PNG8.

              //Dynamically add layers specified in the Config file//
              //First layer in the list will be in the legend      //
              var dynamicMapSerives = [];

              //Find element that checkbox controls for visibility of layers will be appended into
              var layersContainer = document.getElementById("layer_list" + mapID);

              //Loop through layer list in the config file.
              for (var i = 0; i < currentObject.config.layers.length; i++) {
                  dynamicMapSerives[i] = new ArcGISDynamicMapServiceLayer(restEnd + currentObject.config.layers[i] + "/MapServer", {
                      "opacity": 1,
                      "imageParameters": imageParameters,
                  });
              }
              //Add the layers to the map
              roeMapFPL.addLayers(dynamicMapSerives);

              //alert(currentObject.config.layers.length);
              //For each layer in the config file add a check box for the layers visibility. The element id includes the index for the layer
              for (var c = 0; c < currentObject.config.layers.length; c++) {
                  $(layersContainer).append("<input type=\"checkbox\" checked=\"True\" class=\"list_item\" id=\"layer_" + c + "_" + mapID + "\" value=0 />" + currentObject.config.layerDisplayName[c] + "<br />");
                  lyr = currentObject.config.layers[c];
                  on(dom.byId("layer_" + c + "_" + mapID), "change", updateRadonVisibility);
              }

              ////Radio button for Map layers visibility
              function updateRadonVisibility(evt) {
                  evt = evt || window.event;
                  //get the layer index from the element id
                  var lName = evt.target.id.split("_");
                  //If radio button is checked show Map layer
                  if (dom.byId(evt.target.id).checked) {
                      dynamicMapSerives[lName[1]].show();
                  } else {
                      dynamicMapSerives[lName[1]].hide();
                  }
              }


              //Create Horizontal Legend
              var url = restEnd + currentObject.config.legend.url + "?f=pjson";
              //alert(currentObject.config.legend.url);
              var requestHandle = esriRequest({
                  "url": url,
                  "content": {
                      "f": "json"
                  },
                  "callbackParamName": "callback"
              });
              requestHandle.then(requestSucceeded, requestFailed);
              function requestSucceeded(response, io) {
                  //alert("Succeeded: " + response.layers[0]["legend"][0]["label"]);
                  var content = "<div class=\"innvateLegend\"><div><b>" + currentObject.config.legend.layers["0"] + "</b></div><table><tbody>";
                  var mLegend = response.layers[0]["legend"];
                  var imgURL = "";
                  //alert(mLegend.length);
                  for (var i = 0; i < mLegend.length; i++) {
                      imgURL = restEnd + currentObject.config.layers[0] + "/MapServer/0/images/" + mLegend[i]["url"];
                      //alert(mLegend[i]["label"]);
                      content = content + "<td valign=\"middle\" align=\"center\"><div><img alt=\"\" src=\"" + imgURL + "\"></div></td>" +
                          "<td valign=\"middle\" align=\"left\" style=\"padding: 3px 20px 0px 5px\">" + mLegend[i]["label"] + "</td>";
                  }
                  content = content + "</tbody></table></div>";
                  //alert(content);
                  var legendContainer = document.getElementById("legendDiv" + mapID);
                  $(legendContainer).append(content);

              }
              function requestFailed(error, io) {
                  alert("Failed");
              }
              //End Legend

              var slider = new HorizontalSlider({
                  name: "slider" + mapID,
                  value: 1,
                  minimum: 0,
                  maximum: 1,
                  intermediateChanges: true,
                  style: "width:200px;",
                  onChange: function (value) {
                      //dom.byId("sliderValue").value = value;
                      //map.getLayer(map.layerIds[1]).setOpacity(value);
                      dynamicMapSerives[0].setOpacity(value);
                  }
              }, "oslider" + mapID).startup();

              //Code for basemap radio buttons
              on(dom.byId("blayerS" + mapID), "change", updateBaseMap0);
              on(dom.byId("blayerG" + mapID), "change", updateBaseMap0);
              //switch base map based on checked radio button
              function updateBaseMap0() {
                  //alert(mapID);
                  if (dom.byId("blayerS" + mapID).checked) {
                      roeMapFPL.setBasemap(currentObject.config.baseMap[0]);//hybrid
                  } else {
                      roeMapFPL.setBasemap(currentObject.config.baseMap[1]);
                  }
              }

              //on mouse over 
              dojo.connect(roeMapFPL, "onMouseOver", refreshMapPosition);
              //makes sur that the map is refreshed and positioned correctly
              function refreshMapPosition() {
                  //alert("on Map");
                  roeMapFPL.resize();
                  roeMapFPL.reposition();
              }

              //May need this at some point
              roeMapFPL.resize();
              roeMapFPL.reposition();

              //POPUPS
              //Query and infoWindow setup
              dojo.connect(roeMapFPL, "onClick", fishExecuteQueryTask);
              dojo.connect(roeMapFPL.infoWindow, "onHide", function () { roeMapFPL.graphics.clear(); });
              fishQueryTask = new esri.tasks.QueryTask(restEnd + currentObject.config.layers[0] + "/MapServer/0");

              //Set query task
              fishQuery = new esri.tasks.Query();
              fishQuery.outSpatialReference = { "wkid": 3857 };
              fishQuery.returnGeometry = true;
              fishQuery.outFields = ["*"];

              //Execute query
              function fishExecuteQueryTask(evt) {

                  roeMapFPL.infoWindow.hide();    //Hide Popup
                  roeMapFPL.graphics.clear();     //Clear Graphics
                  fishFeatureSet = null;        //Reset the Featureset

                  //Find clicked location and execute query
                  fishQuery.geometry = evt.mapPoint;
                  fishQueryTask.execute(fishQuery, function (fset) {
                      //alert("click radon");
                      if (fset.features.length === 1) {
                          fishShowFeature(fset.features[0], evt);
                      } else if (fset.features.length !== 0) {
                          //showFeatureSet(fset, evt);
                      }
                  });
              }

              //Show feature that was clicked
              function fishShowFeature(feature, evt) {

                  roeMapFPL.graphics.clear();     //Clear graphics on the map

                  //set graphic symbol
                  var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 2), new dojo.Color([255, 255, 255, 0]));
                  feature.setSymbol(symbol);

                  // Build text and layout for the popup
                  var attr = feature.attributes;
                  var title =  attr.NAME + " watershed";
                  var content = "<div>" +"HUC code: " + attr.HUC6 + "</div>";
                  //parseInt(attr.HISTDIVERS, 10) == 0 && parseInt(attr.ABSLOSSman, 10) == 0
                  if ( parseInt(attr.ABSLOSSman, 10) == -1) {
                      //fishless
                      content += "<div>Fishless</div>";
                  } else {
                      content += "<div>" + (parseFloat(attr.PCTLOSS_1)).toFixed(2) + "% reduction in fish species</div>";
                  }
                  //Add graphics
                  roeMapFPL.graphics.add(feature);
                  //Set title and content for the popup window
                  roeMapFPL.infoWindow.setTitle(title);
                  roeMapFPL.infoWindow.setContent(content);

                  (evt) ? roeMapFPL.infoWindow.show(evt.screenPoint, roeMapFPL.getInfoWindowAnchor(evt.screenPoint)) : null;
                  roeMapFPL.infoWindow.resize(300, 120);
              }
          
              
              //find FullScreen and layer Visisbility button elements on right side of Map
              var layerbutton = dojo.byId("expandIcon" + mapID),
                  wipeTarget = dojo.byId("layersNode" + mapID);

              //assign the Eventerhandlers for FullScreen and layer Visisbility button  
              on(layerbutton, "click", function (evt) {
                  if (domStyle.get(wipeTarget, "display") === "none") {
                      dojo.fx.wipeIn({ node: wipeTarget }).play();
                      dojo.attr("exIcon" + mapID, "src", "./scripts/innovate/images/minus2.png"); //note: these paths will need to change when move servers
                  } else {
                      dojo.fx.wipeOut({ node: wipeTarget }).play();
                      dojo.attr("exIcon" + mapID, "src", "./scripts/innovate/images/greenPlus2.gif"); //note: these paths will need to change when move servers
                  }

              });

              //Find Full Screen button on right side of Map and connect EventHandler
              on(dom.byId("fullScreen" + mapID), "click", fullscreenMode);

              //FullScreen button EventHandler
              function fullscreenMode() {

                  //add from innovat.js
                  var maxWidth = 1360, maxHeight = 1360
                , screenHeight = parseInt($(window).height())
                , screenWidth = parseInt($(window).width())
                , width = screenWidth, height = screenHeight
                , top = 0
                , left = 0
                , userConfig = innovate.getUserConfigForMap(mapID);
                  if (screenHeight > maxHeight || screenWidth > maxWidth) {
                      if (screenWidth > maxWidth) {
                          width = maxWidth;
                      } else {
                          width = screenWidth;
                      }
                      if (screenHeight > maxHeight) {
                          height = maxHeight;
                      } else {
                          height = screenHeight;
                      }
                      top = parseInt((screenHeight - height) / 2);
                      left = parseInt((screenWidth - width) / 2);
                  }
                  width = width - 6;
                  height = height - 6;

                  $.blockUI({
                      message: "<div id=\"mapPopupHeader\" style=\"cursor:pointer;height:24px;background-color:#9DB6DB;\">" +
                              "<div style=\"float:left; padding-left:10px;\">" + userConfig["header"] + "</div>" +
                              "<div style=\"float:right; padding-right:5px;\"><a href=\"javaScript:innovate.closeModal();\">Close</a></div>" +
                              "</div>" +
                              "<div>" +
                              "<div id=\"mapPopupLoading\" style=\"position:relative; top:0px; left:0px; width:" + width + "px; height:" + height + "px; z-index:1003; margin:auto auto;  \"><div style=\"margin-top:" + Math.floor(height / 2) + "px;\"><div style=\"text-align:center; \">Loading...</div><div><img src=\"images/ajax-loader.gif\" /></div></div></div>" +
                              "<iframe name=\"innovateFullScreenFrame\" id=\"innovateFullScreenFrame\" src=\"getMap.html?width=" + (width) + "&height=" + (height - 24) + "&mapId=" + mapID + "&exHeight=70px" + "\" frameborder=\"0\" scrolling=\"no\" width=\"" + width + "\" height=\"" + (height - 24) + "\"></iframe>" +
                              "</div>", //note: this path will need to change when move servers
                      css: {
                          "position": "fixed",
                          "width": width,
                          "height": height,
                          "top": top,
                          "left": left
                      },
                      bindEvents: false
                  });
              }
          });
    }

    //Reduction in native fish species diversity in the contiguous U.S. from historical levels to 2006
    //Innovate Map # 2
    this.ROE_FishFaunaAbsoluteLoss = function () {

        var compare, compare2;
        //alert(mapID);
        require([
          "esri/map",
          "esri/layers/ArcGISDynamicMapServiceLayer",
          "esri/layers/ImageParameters",
          "esri/InfoTemplate",
          "esri/layers/FeatureLayer",
          "esri/dijit/Legend",
          "esri/tasks/query",
          "esri/renderers/SimpleRenderer",
          "esri/symbols/SimpleFillSymbol",
          "esri/symbols/SimpleLineSymbol",
          "esri/dijit/BasemapToggle",
          "esri/dijit/Scalebar",
          "dojo/dom",
          "dojo/number",
          "dojo/on",
          "dojo/parser",
          "dojo/_base/array",
          "esri/Color",
          "dojo/string",
          "esri/request",
          "dojo/dom-style",
          "dijit/form/HorizontalSlider",
          "dijit/popup",
          "dijit/layout/BorderContainer",
          "dijit/layout/ContentPane",
          "dojox/layout/ExpandoPane",
          "dojo/domReady!"
        ],
          function (
            Map, ArcGISDynamicMapServiceLayer, ImageParameters, InfoTemplate, FeatureLayer, Legend, Query, SimpleRenderer, SimpleFillSymbol,
            SimpleLineSymbol, BasemapToggle, Scalebar, dom, number, on, parser, arrayUtils, Color, string, esriRequest, domStyle, HorizontalSlider, popup
        ) {

              //parser.parse(dom.byId("mframe" + mapID));
              parser.parse();

              //var restEnd = "http://geodata.epa.gov/arcgis/rest/services/ORD/"; //EPA Production Rest Endpoint
              //var restEnd = "http://gisstg.rtpnc.epa.gov/arcgis/rest/services/ord/"; //EPA Staging Rest Endpoint
              var restEnd = "http://it.innovateteam.com/arcgis/rest/services/ROE/";

              var layer, visibleLayerIds = []; //list of visible layers

              //Add map and set map properties
              roeMapFAL = new Map("mapDiv" + mapID, {
                  basemap: currentObject.config.baseMap[0],
                  maxZoom: currentObject.config.endResolution,
                  minZoom: currentObject.config.startResolution,
                  center: currentObject.config.center,
                  zoom: currentObject.config.defaultZoomLevel, //Defaultzoomlevel from the config file
                  logo: false,
                  sliderStyle: "large"
              });

              //Add Scalebar and set scalebar properties
              var scalebar = new Scalebar({
                  map: roeMapFAL,
                  attachTo: "bottom-left",
                  scalebarUnit: "dual"
              });

              //Add Layers from map_Config
              var imageParameters = new ImageParameters();
              imageParameters.format = "jpeg"; //set the image type to PNG24, note default is PNG8.

              //Dynamically add layers specified in the Config file//
              //First layer in the list will be in the legend      //
              var dynamicMapSerives = [];

              //Find element that checkbox controls for visibility of layers will be appended into
              var layersContainer = document.getElementById("layer_list" + mapID);

              //Loop through layer list in the config file.
              for (var i = 0; i < currentObject.config.layers.length; i++) {
                  dynamicMapSerives[i] = new ArcGISDynamicMapServiceLayer(restEnd + currentObject.config.layers[i] + "/MapServer", {
                      "opacity": 1,
                      "imageParameters": imageParameters,
                  });
              }
              //Add the layers to the map
              roeMapFAL.addLayers(dynamicMapSerives);

              //alert(currentObject.config.layers.length);
              //For each layer in the config file add a check box for the layers visibility. The element id includes the index for the layer
              for (var c = 0; c < currentObject.config.layers.length; c++) {
                  $(layersContainer).append("<input type=\"checkbox\" checked=\"True\" class=\"list_item\" id=\"layer_" + c + "_" + mapID + "\" value=0 />" + currentObject.config.layerDisplayName[c] + "<br />");
                  lyr = currentObject.config.layers[c];
                  on(dom.byId("layer_" + c + "_" + mapID), "change", updateRadonVisibility);
              }

              ////Radio button for Map layers visibility
              function updateRadonVisibility(evt) {
                  evt = evt || window.event;
                  //get the layer index from the element id
                  var lName = evt.target.id.split("_");
                  //If radio button is checked show Map layer
                  if (dom.byId(evt.target.id).checked) {
                      dynamicMapSerives[lName[1]].show();
                  } else {
                      dynamicMapSerives[lName[1]].hide();
                  }
              }


              //Create Horizontal Legend
              var url = restEnd + currentObject.config.legend.url + "?f=pjson";
              //alert(currentObject.config.legend.url);
              var requestHandle = esriRequest({
                  "url": url,
                  "content": {
                      "f": "json"
                  },
                  "callbackParamName": "callback"
              });
              requestHandle.then(requestSucceeded, requestFailed);
              function requestSucceeded(response, io) {
                  //alert("Succeeded: " + response.layers[0]["legend"][0]["label"]);
                  var content = "<div class=\"innvateLegend\"><div><b>" + currentObject.config.legend.layers["0"] + "</b></div><table><tbody>";
                  var mLegend = response.layers[0]["legend"];
                  var imgURL = "";
                  //alert(mLegend.length);
                  for (var i = 0; i < mLegend.length; i++) {
                      imgURL = restEnd + currentObject.config.layers[0] + "/MapServer/0/images/" + mLegend[i]["url"];
                      //alert(mLegend[i]["label"]);
                      content = content + "<td valign=\"middle\" align=\"center\"><div><img alt=\"\" src=\"" + imgURL + "\"></div></td>" +
                          "<td valign=\"middle\" align=\"left\" style=\"padding: 3px 30px 0px 5px\">" + mLegend[i]["label"] + "</td>";
                  }
                  content = content + "</tbody></table></div>";
                  //alert(content);
                  var legendContainer = document.getElementById("legendDiv" + mapID);
                  $(legendContainer).append(content);

              }
              function requestFailed(error, io) {
                  alert("Failed");
              }
              //End Legend

              var slider = new HorizontalSlider({
                  name: "slider" + mapID,
                  value: 1,
                  minimum: 0,
                  maximum: 1,
                  intermediateChanges: true,
                  style: "width:200px;",
                  onChange: function (value) {
                      //dom.byId("sliderValue").value = value;
                      //map.getLayer(map.layerIds[1]).setOpacity(value);
                      dynamicMapSerives[0].setOpacity(value);
                  }
              }, "oslider" + mapID).startup();

              //Code for basemap radio buttons
              on(dom.byId("blayerS" + mapID), "change", updateBaseMap0);
              on(dom.byId("blayerG" + mapID), "change", updateBaseMap0);
              //switch base map based on checked radio button
              function updateBaseMap0() {
                  //alert(mapID);
                  if (dom.byId("blayerS" + mapID).checked) {
                      roeMapFAL.setBasemap(currentObject.config.baseMap[0]);//hybrid
                  } else {
                      roeMapFAL.setBasemap(currentObject.config.baseMap[1]);
                  }
              }

              //on mouse over 
              dojo.connect(roeMapFAL, "onMouseOver", refreshMapPosition);
              //makes sur that the map is refreshed and positioned correctly
              function refreshMapPosition() {
                  //alert("on Map");
                  roeMapFAL.resize();
                  roeMapFAL.reposition();
              }

              //May need this at some point
              roeMapFAL.resize();
              roeMapFAL.reposition();

              //POPUPS
              //Query and infoWindow setup
              dojo.connect(roeMapFAL, "onClick", fishExecuteQueryTask);
              dojo.connect(roeMapFAL.infoWindow, "onHide", function () { roeMapFAL.graphics.clear(); });
              fishQueryTask = new esri.tasks.QueryTask(restEnd + currentObject.config.layers[0] + "/MapServer/0");

              //Set query task
              fishQuery = new esri.tasks.Query();
              fishQuery.outSpatialReference = { "wkid": 3857 };
              fishQuery.returnGeometry = true;
              fishQuery.outFields = ["*"];

              //Execute query
              function fishExecuteQueryTask(evt) {

                  roeMapFAL.infoWindow.hide();    //Hide Popup
                  roeMapFAL.graphics.clear();     //Clear Graphics
                  fishFeatureSet = null;        //Reset the Featureset

                  //Find clicked location and execute query
                  fishQuery.geometry = evt.mapPoint;
                  fishQueryTask.execute(fishQuery, function (fset) {
                      //alert("click radon");
                      if (fset.features.length === 1) {
                          fishShowFeature(fset.features[0], evt);
                      } else if (fset.features.length !== 0) {
                          //showFeatureSet(fset, evt);
                      }
                  });
              }

              //Show feature that was clicked
              function fishShowFeature(feature, evt) {

                  roeMapFAL.graphics.clear();     //Clear graphics on the map

                  //set graphic symbol
                  var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 2), new dojo.Color([255, 255, 255, 0]));
                  feature.setSymbol(symbol);

                  // Build text and layout for the popup
                  var attr = feature.attributes;
                  var title = attr.NAME + " watershed"; //", " + toTitleCase(attr.StateName);
                  var content = "<div>HUC code: " + attr.HUC6 + "</div>";
                  //parseInt(attr.HISTDIVERS, 10) == 0 && 
                  if (parseInt(attr.ABSLOSSman, 10) == -1) {
                      //fishless
                      content += "<div>Fishless</div>";
                  } else {
                      content += "<div>Historical species: " + (parseFloat(attr.HISTDIVE_1)) + "</div>";
                      content += "<div>Species lost: " + (parseFloat(attr.ABSLOSSman)) + "</div>";
                  }
                  //Add graphics
                  roeMapFAL.graphics.add(feature);
                  //Set title and content for the popup window
                  roeMapFAL.infoWindow.setTitle(title);
                  roeMapFAL.infoWindow.setContent(content);

                  (evt) ? roeMapFAL.infoWindow.show(evt.screenPoint, roeMapFAL.getInfoWindowAnchor(evt.screenPoint)) : null;
                  roeMapFAL.infoWindow.resize(250, 120);
              }


              //find FullScreen and layer Visisbility button elements on right side of Map
              var layerbutton = dojo.byId("expandIcon" + mapID),
                  wipeTarget = dojo.byId("layersNode" + mapID);

              //assign the Eventerhandlers for FullScreen and layer Visisbility button  
              on(layerbutton, "click", function (evt) {
                  if (domStyle.get(wipeTarget, "display") === "none") {
                      dojo.fx.wipeIn({ node: wipeTarget }).play();
                      dojo.attr("exIcon" + mapID, "src", "./scripts/innovate/images/minus2.png"); //note: these paths will need to change when move servers
                  } else {
                      dojo.fx.wipeOut({ node: wipeTarget }).play();
                      dojo.attr("exIcon" + mapID, "src", "./scripts/innovate/images/greenPlus2.gif"); //note: these paths will need to change when move servers
                  }

              });

              //Find Full Screen button on right side of Map and connect EventHandler
              on(dom.byId("fullScreen" + mapID), "click", fullscreenMode);

              //FullScreen button EventHandler
              function fullscreenMode() {

                  //add from innovat.js
                  var maxWidth = 1360, maxHeight = 1360
                , screenHeight = parseInt($(window).height())
                , screenWidth = parseInt($(window).width())
                , width = screenWidth, height = screenHeight
                , top = 0
                , left = 0
                , userConfig = innovate.getUserConfigForMap(mapID);
                  if (screenHeight > maxHeight || screenWidth > maxWidth) {
                      if (screenWidth > maxWidth) {
                          width = maxWidth;
                      } else {
                          width = screenWidth;
                      }
                      if (screenHeight > maxHeight) {
                          height = maxHeight;
                      } else {
                          height = screenHeight;
                      }
                      top = parseInt((screenHeight - height) / 2);
                      left = parseInt((screenWidth - width) / 2);
                  }
                  width = width - 6;
                  height = height - 6;

                  $.blockUI({
                      message: "<div id=\"mapPopupHeader\" style=\"cursor:pointer;height:24px;background-color:#9DB6DB;\">" +
                              "<div style=\"float:left; padding-left:10px;\">" + userConfig["header"] + "</div>" +
                              "<div style=\"float:right; padding-right:5px;\"><a href=\"javaScript:innovate.closeModal();\">Close</a></div>" +
                              "</div>" +
                              "<div>" +
                              "<div id=\"mapPopupLoading\" style=\"position:relative; top:0px; left:0px; width:" + width + "px; height:" + height + "px; z-index:1003; margin:auto auto;  \"><div style=\"margin-top:" + Math.floor(height / 2) + "px;\"><div style=\"text-align:center; \">Loading...</div><div><img src=\"images/ajax-loader.gif\" /></div></div></div>" +
                              "<iframe name=\"innovateFullScreenFrame\" id=\"innovateFullScreenFrame\" src=\"getMap.html?width=" + (width) + "&height=" + (height - 24) + "&mapId=" + mapID + "&exHeight=70px" + "\" frameborder=\"0\" scrolling=\"no\" width=\"" + width + "\" height=\"" + (height - 24) + "\"></iframe>" +
                              "</div>", //note: this path will need to change when move servers
                      css: {
                          "position": "fixed",
                          "width": width,
                          "height": height,
                          "top": top,
                          "left": left
                      },
                      bindEvents: false
                  });
              }
          });
    }

    //Changes in absolute sea level
    //Innovate Map # 3
    this.ROE_SeaLevelAbsolute2015 = function () {
        var compare, compare2;

        require([
          "esri/map",
          "esri/layers/ArcGISDynamicMapServiceLayer",
          "esri/layers/ImageParameters",
          "esri/InfoTemplate",
          "esri/dijit/Popup",
          "esri/dijit/PopupTemplate",
          "esri/layers/FeatureLayer",
          "esri/dijit/Legend",
          "esri/tasks/query",
          "esri/geometry/Extent",
          "esri/renderers/SimpleRenderer",
          "esri/symbols/SimpleMarkerSymbol",
          //"esri/symbols/SimpleFillSymbol",
          //"esri/symbols/SimpleLineSymbol",
          "esri/tasks/GeometryService",
          "dojo/dom-construct",
          "esri/dijit/BasemapToggle",
          "esri/dijit/Scalebar",
          "dojo/dom",
          "dojo/number",
          "dojo/on",
          "dojo/parser",
          "dojo/_base/array",
          "esri/Color",
          "dojo/string",
          "esri/request",
          "dojo/dom-style",
          "dijit/form/HorizontalSlider",
          "dijit/popup",
          "dijit/layout/BorderContainer",
          "dijit/layout/ContentPane",
          "dojox/layout/ExpandoPane",
          "dojo/domReady!"
        ],
          function (
            Map, ArcGISDynamicMapServiceLayer, ImageParameters, InfoTemplate, Popup, PopupTemplate, FeatureLayer, Legend, Query, Extent, SimpleRenderer, SimpleMarkerSymbol, GeometryService,
            domConstruct, BasemapToggle, Scalebar, dom, number, on, parser, arrayUtils, Color, string, esriRequest, domStyle, HorizontalSlider, popup
        ) {

              parser.parse();

              //var restEnd = "http://geodata.epa.gov/arcgis/rest/services/ORD/"; //EPA Production Rest Endpoint
              //var restEnd = "http://gisstg.rtpnc.epa.gov/arcgis/rest/services/ord/"; //EPA Staging Rest Endpoint
              var restEnd = "http://it.innovateteam.com/arcgis/rest/services/ROE/";

              //Add map and set map properties
              roeMapAbsSea = new Map("mapDiv" + mapID, {
                  basemap: currentObject.config.baseMap[0], //"hybrid",  //satellite hybrid
                  center: currentObject.config.center,
                  //extent: new Extent({
                  //    xmin: currentObject.config.zoomToExtent[0],
                  //    ymin: currentObject.config.zoomToExtent[1],
                  //    xmax: currentObject.config.zoomToExtent[2],
                  //    ymax: currentObject.config.zoomToExtent[3],
                  //    spatialReference: { "wkid": 3857 }
                  //}),
                  maxZoom: currentObject.config.endResolution,
                  minZoom: currentObject.config.startResolution,
                  zoom: currentObject.config.defaultZoomLevel, //currentObject.config.defaultZoomLevel, //Defaultzoomlevel from the config file
                  logo: false,
                  sliderStyle: "large"
              });

              //Add Scalebar and set scalebar properties
              var scalebar = new Scalebar({
                  map: roeMapAbsSea,
                  attachTo: "bottom-right",
                  scalebarUnit: "dual"
              });

              //Add Layers from map_Config
              var imageParameters = new ImageParameters();
              imageParameters.format = "jpeg"; //set the image type to PNG24, note default is PNG8.

              //Dynamically add layers specified in the Config file//
              //First layer in the list will be in the legend      //
              var dynamicMapSerives = [];

              //Find element that checkbox controls for visibility of layers will be appended into
              var layersContainer = document.getElementById("layer_list" + mapID);
              var layersYears = document.getElementById("layersNode" + mapID);

              //Add layers specified in the Config
              for (var i = 0; i < currentObject.config.layers.length; i++) {
                  dynamicMapSerives[i] = new ArcGISDynamicMapServiceLayer(restEnd + currentObject.config.layers[i] + "/MapServer", {
                      //"opacity": 1,
                      "imageParameters": imageParameters,
                  });
              }

              //Add the layers to the map
              roeMapAbsSea.addLayers(dynamicMapSerives);

              //alert(currentObject.config.layers.length);
              //For each layer in the config file add a check box for the layers visibility. The element id includes the index for the layer
              for (var c = 0; c < currentObject.config.layers.length; c++) {
                  $(layersContainer).append("<input type=\"checkbox\" checked=\"True\" class=\"list_item\" id=\"layer_" + c + "_" + mapID + "\" value=0 />" + currentObject.config.layerDisplayName[c] + "<br />");
                  lyr = currentObject.config.layers[c];
                  on(dom.byId("layer_" + c + "_" + mapID), "change", updateNLCDVisibility);
              }

              ////Radio button for Map layers visibility
              function updateNLCDVisibility(evt) {
                  evt = evt || window.event;
                  //get the layer index from the element id
                  var lName = evt.target.id.split("_");
                  //If radio button is checked show Map layer
                  if (dom.byId(evt.target.id).checked) {
                      dynamicMapSerives[lName[1]].show();
                  } else {
                      dynamicMapSerives[lName[1]].hide();
                  }
              }

              //Legend json request
              var content = "<div align=\"middle\"><img alt=\"\" height=\"90px\" align=\"middle\" src=\"" + currentObject.config.legend.url + "\"></div>"; //"<div class=\"innvateLegend\"><div></div>";
              //content = content + "<div><img alt=\"\" src=\"" + currentObject.config.legend.url + "\"></div>";
              var legendContainer = document.getElementById("legendDiv" + mapID);
              $(legendContainer).append(content);
              //End Legend

              //Add Opacity slider
              var slider = new HorizontalSlider({
                  name: "slider" + mapID,
                  value: 1,
                  minimum: 0,
                  maximum: 1,
                  intermediateChanges: true,
                  style: "width:200px;",
                  onChange: function (value) {
                      //dom.byId("sliderValue").value = value;
                      //map.getLayer(map.layerIds[1]).setOpacity(value);
                      dynamicMapSerives[0].setOpacity(value);

                      if (dynamicMapSerives[0].visible) {
                          dynamicMapSerives[0].setOpacity(value);
                      } else {
                          dynamicMapSerives[1].setOpacity(value);
                      }
                  }
              }, "oslider" + mapID).startup();

              //Code for basemap radio buttons
              on(dom.byId("blayerS" + mapID), "change", updateBaseMap0);
              on(dom.byId("blayerG" + mapID), "change", updateBaseMap0);
              //switch base map based on checked radio button
              function updateBaseMap0() {
                  //alert(mapID);
                  if (dom.byId("blayerS" + mapID).checked) {
                      roeMapAbsSea.setBasemap(currentObject.config.baseMap[0]);
                  } else {
                      roeMapAbsSea.setBasemap(currentObject.config.baseMap[1]);
                  }
              }

              //on mouse over 
              dojo.connect(roeMapAbsSea, "onMouseOver", refreshMapPosition);
              //makes sur that the map is refreshed and positioned correctly
              function refreshMapPosition() {
                  //alert("on Map");
                  roeMapAbsSea.resize();
                  roeMapAbsSea.reposition();
              }
              //May need this at some point
              roeMapAbsSea.resize();
              roeMapAbsSea.reposition();

              //No Popups

              //find FullScreen and layer Visisbility button elements on right side of Map
              var layerbutton = dojo.byId("expandIcon" + mapID),
                  wipeTarget = dojo.byId("layersNode" + mapID);

              //assign the Eventerhandlers for FullScreen and layer Visisbility button  
              on(layerbutton, "click", function (evt) {
                  if (domStyle.get(wipeTarget, "display") === "none") {
                      dojo.fx.wipeIn({ node: wipeTarget }).play();
                      dojo.attr("exIcon" + mapID, "src", "./scripts/innovate/images/minus2.png"); //note: these paths will need to change when move servers
                  } else {
                      dojo.fx.wipeOut({ node: wipeTarget }).play();
                      dojo.attr("exIcon" + mapID, "src", "./scripts/innovate/images/greenPlus2.gif"); //note: these paths will need to change when move servers
                  }

              });

              //Find Full Screen button on right side of Map and connect EventHandler
              on(dom.byId("fullScreen" + mapID), "click", fullscreenMode);

              //FullScreen button EventHandler
              function fullscreenMode() {

                  //add from innovat.js
                  var maxWidth = 1360, maxHeight = 1360
                , screenHeight = parseInt($(window).height())
                , screenWidth = parseInt($(window).width())
                , width = screenWidth, height = screenHeight
                , top = 0
                , left = 0
                , userConfig = innovate.getUserConfigForMap(mapID);
                  if (screenHeight > maxHeight || screenWidth > maxWidth) {
                      if (screenWidth > maxWidth) {
                          width = maxWidth;
                      } else {
                          width = screenWidth;
                      }
                      if (screenHeight > maxHeight) {
                          height = maxHeight;
                      } else {
                          height = screenHeight;
                      }
                      top = parseInt((screenHeight - height) / 2);
                      left = parseInt((screenWidth - width) / 2);
                  }
                  width = width - 6;
                  height = height - 6;

                  $.blockUI({
                      message: "<div id=\"mapPopupHeader\" style=\"cursor:pointer;height:24px;background-color:#9DB6DB;\">" +
                              "<div style=\"float:left; padding-left:10px;\">" + userConfig["header"] + "</div>" +
                              "<div style=\"float:right; padding-right:5px;\"><a href=\"javaScript:innovate.closeModal();\">Close</a></div>" +
                              "</div>" +
                              "<div>" +
                              "<div id=\"mapPopupLoading\" style=\"position:relative; top:0px; left:0px; width:" + width + "px; height:" + height + "px; z-index:1003; margin:auto auto;  \"><div style=\"margin-top:" + Math.floor(height / 2) + "px;\"><div style=\"text-align:center; \">Loading...</div><div><img src=\"images/ajax-loader.gif\" /></div></div></div>" +
                              "<iframe name=\"innovateFullScreenFrame\" id=\"innovateFullScreenFrame\" src=\"getMap.html?width=" + (width) + "&height=" + (height - 24) + "&mapId=" + mapID + "&exHeight=115px" + "\" frameborder=\"0\" scrolling=\"no\" width=\"" + width + "\" height=\"" + (height - 24) + "\"></iframe>" +
                              "</div>", //note: this path will need to change when move servers
                      css: {
                          "position": "fixed",
                          "width": width,
                          "height": height,
                          "top": top,
                          "left": left
                      },
                      bindEvents: false
                  });
              }

          });
    }

    //Annual precipitation anomalies
    //Innovate Map # 4
    this.ROE_Precipitation = function () {
        var compare, compare2;

        require([
          "esri/map",
          "esri/layers/ArcGISDynamicMapServiceLayer",
          "esri/layers/ImageParameters",
          "esri/InfoTemplate",
          "esri/dijit/Popup",
          "esri/dijit/PopupTemplate",
          "esri/layers/FeatureLayer",
          "esri/dijit/Legend",
          "esri/tasks/query",
          "esri/geometry/Extent",
          "esri/renderers/SimpleRenderer",
          "esri/symbols/SimpleMarkerSymbol",
          //"esri/symbols/SimpleFillSymbol",
          //"esri/symbols/SimpleLineSymbol",
          "esri/tasks/GeometryService",
          "dojo/dom-construct",
          "esri/dijit/BasemapToggle",
          "esri/dijit/Scalebar",
          "dojo/dom",
          "dojo/number",
          "dojo/on",
          "dojo/parser",
          "dojo/_base/array",
          "esri/Color",
          "dojo/string",
          "esri/request",
          "dojo/dom-style",
          "dijit/form/HorizontalSlider",
          "dijit/popup",
          "dijit/layout/BorderContainer",
          "dijit/layout/ContentPane",
          "dojox/layout/ExpandoPane",
          "dojo/domReady!"
        ],
          function (
            Map, ArcGISDynamicMapServiceLayer, ImageParameters, InfoTemplate, Popup, PopupTemplate, FeatureLayer, Legend, Query, Extent, SimpleRenderer, SimpleMarkerSymbol, GeometryService,
            domConstruct, BasemapToggle, Scalebar, dom, number, on, parser, arrayUtils, Color, string, esriRequest, domStyle, HorizontalSlider, popup
        ) {

              parser.parse();

              //var restEnd = "http://geodata.epa.gov/arcgis/rest/services/ORD/"; //EPA Rest Endpoint
              //var restEnd = "http://gisstg.rtpnc.epa.gov/arcgis/rest/services/ord/"; //EPA Staging Rest Endpoint
              var restEnd = "http://it.innovateteam.com/arcgis/rest/services/ROE/"; 

              //Add map and set map properties
              roeMapPrecip = new Map("mapDiv" + mapID, {
                  basemap: currentObject.config.baseMap[0], //"hybrid",  //satellite hybrid
                  center: currentObject.config.center,
                  //extent: new Extent({
                  //    xmin: currentObject.config.zoomToExtent[0],
                  //    ymin: currentObject.config.zoomToExtent[1],
                  //    xmax: currentObject.config.zoomToExtent[2],
                  //    ymax: currentObject.config.zoomToExtent[3],
                  //    spatialReference: { "wkid": 3857 }
                  //}),
                  maxZoom: currentObject.config.endResolution,
                  minZoom: currentObject.config.startResolution,
                  zoom: currentObject.config.startResolution, //currentObject.config.defaultZoomLevel, //Defaultzoomlevel from the config file
                  logo: false,
                  sliderStyle: "large"
              });

              //Add Scalebar and set scalebar properties
              var scalebar = new Scalebar({
                  map: roeMapPrecip,
                  attachTo: "bottom-left",
                  scalebarUnit: "dual"
              });

              //Add Layers from map_Config
              var imageParameters = new ImageParameters();
              imageParameters.format = "jpeg"; //set the image type to PNG24, note default is PNG8.

              //Dynamically add layers specified in the Config file//
              //First layer in the list will be in the legend      //
              var dynamicMapSerives = [];

              //Find element that checkbox controls for visibility of layers will be appended into
              var layersContainer = document.getElementById("layer_list" + mapID);
              var layersYears = document.getElementById("layersNode" + mapID);

              //Add layers specified in the Config
              for (var i = 0; i < currentObject.config.layers.length; i++) {
                  dynamicMapSerives[i] = new ArcGISDynamicMapServiceLayer(restEnd + currentObject.config.layers[i] + "/MapServer", {
                      //"opacity": 1,
                      "imageParameters": imageParameters,
                  });
              }

              //Add the layers to the map
              roeMapPrecip.addLayers(dynamicMapSerives);

              //alert(currentObject.config.layers.length);
              //For each layer in the config file add a check box for the layers visibility. The element id includes the index for the layer
              for (var c = 0; c < currentObject.config.layers.length; c++) {
                  $(layersContainer).append("<input type=\"checkbox\" checked=\"True\" class=\"list_item\" id=\"layer_" + c + "_" + mapID + "\" value=0 />" + currentObject.config.layerDisplayName[c] + "<br />");
                  lyr = currentObject.config.layers[c];
                  on(dom.byId("layer_" + c + "_" + mapID), "change", updatePrecipVisibility);
              }

              ////Radio button for Map layers visibility
              function updatePrecipVisibility(evt) {
                  evt = evt || window.event;
                  //get the layer index from the element id
                  var lName = evt.target.id.split("_");
                  //If radio button is checked show Map layer
                  if (dom.byId(evt.target.id).checked) {
                      dynamicMapSerives[lName[1]].show();
                  } else {
                      dynamicMapSerives[lName[1]].hide();
                  }
              }

              //Legend json request
              var content = "<div align=\"middle\"><img alt=\"\" align=\"middle\" src=\"" + currentObject.config.legend.url + "\"></div>"; //"<div class=\"innvateLegend\"><div></div>";
              //content = content + "<div><img alt=\"\" src=\"" + currentObject.config.legend.url + "\"></div>";
              var legendContainer = document.getElementById("legendDiv" + mapID);
              $(legendContainer).append(content);
              //End Legend

              //Add Opacity slider
              var slider = new HorizontalSlider({
                  name: "slider" + mapID,
                  value: 1,
                  minimum: 0,
                  maximum: 1,
                  intermediateChanges: true,
                  style: "width:200px;",
                  onChange: function (value) {
                      //dom.byId("sliderValue").value = value;
                      //map.getLayer(map.layerIds[1]).setOpacity(value);
                      dynamicMapSerives[0].setOpacity(value);

                      if (dynamicMapSerives[0].visible) {
                          dynamicMapSerives[0].setOpacity(value);
                      } else {
                          dynamicMapSerives[1].setOpacity(value);
                      }
                  }
              }, "oslider" + mapID).startup();

              //Code for basemap radio buttons
              on(dom.byId("blayerS" + mapID), "change", updateBaseMap0);
              on(dom.byId("blayerG" + mapID), "change", updateBaseMap0);
              //switch base map based on checked radio button
              function updateBaseMap0() {
                  //alert(mapID);
                  if (dom.byId("blayerS" + mapID).checked) {
                      roeMapPrecip.setBasemap(currentObject.config.baseMap[0]);
                  } else {
                      roeMapPrecip.setBasemap(currentObject.config.baseMap[1]);
                  }
              }

              //on mouse over 
              dojo.connect(roeMapPrecip, "onMouseOver", refreshMapPosition);
              //makes sur that the map is refreshed and positioned correctly
              function refreshMapPosition() {
                  //alert("on Map");
                  roeMapPrecip.resize();
                  roeMapPrecip.reposition();
              }
              //May need this at some point
              roeMapPrecip.resize();
              roeMapPrecip.reposition();
   
              //POPUPS
              //Query and infoWindow setup
              dojo.connect(roeMapPrecip, "onClick", precipExecuteQueryTask);
              dojo.connect(roeMapPrecip.infoWindow, "onHide", function () { roeMapPrecip.graphics.clear(); });
              precipQueryTask = new esri.tasks.QueryTask(restEnd + currentObject.config.layers[0] + "/MapServer/0");

              //Set query task
              precipQuery = new esri.tasks.Query();
              precipQuery.outSpatialReference = { "wkid": 3857 };
              precipQuery.returnGeometry = true;
              precipQuery.outFields = ["*"];

              //Execute query
              function precipExecuteQueryTask(evt) {

                  roeMapPrecip.infoWindow.hide();    //Hide Popup
                  roeMapPrecip.graphics.clear();     //Clear Graphics
                  fishFeatureSet = null;        //Reset the Featureset

                  //Find clicked location and execute query
                  precipQuery.geometry = evt.mapPoint;
                  precipQueryTask.execute(precipQuery, function (fset) {
                      //alert("click radon");
                      if (fset.features.length === 1) {
                          precipShowFeature(fset.features[0], evt);
                      } else if (fset.features.length !== 0) {
                          //showFeatureSet(fset, evt);
                      }
                  });
              }

              //Show feature that was clicked
              function precipShowFeature(feature, evt) {

                  roeMapPrecip.graphics.clear();     //Clear graphics on the map

                  //set graphic symbol
                  var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 2), new dojo.Color([255, 255, 255, 0]));
                  feature.setSymbol(symbol);

                  // Build text and layout for the popup
                  var attr = feature.attributes;
                  var title = ""; //attr.NAME + " watershed"; //", " + toTitleCase(attr.StateName);
                  var content = "";
                  var pct = attr.PctChange * 100;
                  if (parseFloat(attr.PctChange) > 0) {
                      content = "+" + pct.toFixed(1) + "&#37";
                  } else {
                      content = pct.toFixed(1) + "&#37";
                  }
                  
                  //Add graphics
                  roeMapPrecip.graphics.add(feature);
                  //Set title and content for the popup window
                  roeMapPrecip.infoWindow.setTitle(title);
                  roeMapPrecip.infoWindow.setContent(content);

                  (evt) ? roeMapPrecip.infoWindow.show(evt.screenPoint, roeMapPrecip.getInfoWindowAnchor(evt.screenPoint)) : null;
                  roeMapPrecip.infoWindow.resize(170, 120);
              }

              //find FullScreen and layer Visisbility button elements on right side of Map
              var layerbutton = dojo.byId("expandIcon" + mapID),
                  wipeTarget = dojo.byId("layersNode" + mapID);

              //assign the Eventerhandlers for FullScreen and layer Visisbility button  
              on(layerbutton, "click", function (evt) {
                  if (domStyle.get(wipeTarget, "display") === "none") {
                      dojo.fx.wipeIn({ node: wipeTarget }).play();
                      dojo.attr("exIcon" + mapID, "src", "./scripts/innovate/images/minus2.png"); //note: these paths will need to change when move servers
                  } else {
                      dojo.fx.wipeOut({ node: wipeTarget }).play();
                      dojo.attr("exIcon" + mapID, "src", "./scripts/innovate/images/greenPlus2.gif"); //note: these paths will need to change when move servers
                  }

              });

              //Find Full Screen button on right side of Map and connect EventHandler
              on(dom.byId("fullScreen" + mapID), "click", fullscreenMode);

              //FullScreen button EventHandler
              function fullscreenMode() {

                  //add from innovat.js
                  var maxWidth = 1360, maxHeight = 1360
                , screenHeight = parseInt($(window).height())
                , screenWidth = parseInt($(window).width())
                , width = screenWidth, height = screenHeight
                , top = 0
                , left = 0
                , userConfig = innovate.getUserConfigForMap(mapID);
                  if (screenHeight > maxHeight || screenWidth > maxWidth) {
                      if (screenWidth > maxWidth) {
                          width = maxWidth;
                      } else {
                          width = screenWidth;
                      }
                      if (screenHeight > maxHeight) {
                          height = maxHeight;
                      } else {
                          height = screenHeight;
                      }
                      top = parseInt((screenHeight - height) / 2);
                      left = parseInt((screenWidth - width) / 2);
                  }
                  width = width - 6;
                  height = height - 6;

                  $.blockUI({
                      message: "<div id=\"mapPopupHeader\" style=\"cursor:pointer;height:24px;background-color:#9DB6DB;\">" +
                              "<div style=\"float:left; padding-left:10px;\">" + userConfig["header"] + "</div>" +
                              "<div style=\"float:right; padding-right:5px;\"><a href=\"javaScript:innovate.closeModal();\">Close</a></div>" +
                              "</div>" +
                              "<div>" +
                              "<div id=\"mapPopupLoading\" style=\"position:relative; top:0px; left:0px; width:" + width + "px; height:" + height + "px; z-index:1003; margin:auto auto;  \"><div style=\"margin-top:" + Math.floor(height / 2) + "px;\"><div style=\"text-align:center; \">Loading...</div><div><img src=\"images/ajax-loader.gif\" /></div></div></div>" +
                              "<iframe name=\"innovateFullScreenFrame\" id=\"innovateFullScreenFrame\" src=\"getMap.html?width=" + (width) + "&height=" + (height - 24) + "&mapId=" + mapID + "&exHeight=130px" + "\" frameborder=\"0\" scrolling=\"no\" width=\"" + width + "\" height=\"" + (height - 24) + "\"></iframe>" +
                              "</div>", //note: this path will need to change when move servers
                      css: {
                          "position": "fixed",
                          "width": width,
                          "height": height,
                          "top": top,
                          "left": left
                      },
                      bindEvents: false
                  });
              }

          });
    }

    //Annual temperature anomalies
    //Innovate Map # 5
    this.ROE_Temperature = function () {
        var compare, compare2;

        require([
          "esri/map",
          "esri/layers/ArcGISDynamicMapServiceLayer",
          "esri/layers/ImageParameters",
          "esri/InfoTemplate",
          "esri/dijit/Popup",
          "esri/dijit/PopupTemplate",
          "esri/layers/FeatureLayer",
          "esri/dijit/Legend",
          "esri/tasks/query",
          "esri/geometry/Extent",
          "esri/renderers/SimpleRenderer",
          "esri/symbols/SimpleMarkerSymbol",
          //"esri/symbols/SimpleFillSymbol",
          //"esri/symbols/SimpleLineSymbol",
          "esri/tasks/GeometryService",
          "dojo/dom-construct",
          "esri/dijit/BasemapToggle",
          "esri/dijit/Scalebar",
          "dojo/dom",
          "dojo/number",
          "dojo/on",
          "dojo/parser",
          "dojo/_base/array",
          "esri/Color",
          "dojo/string",
          "esri/request",
          "dojo/dom-style",
          "dijit/form/HorizontalSlider",
          "dijit/popup",
          "dijit/layout/BorderContainer",
          "dijit/layout/ContentPane",
          "dojox/layout/ExpandoPane",
          "dojo/domReady!"
        ],
          function (
            Map, ArcGISDynamicMapServiceLayer, ImageParameters, InfoTemplate, Popup, PopupTemplate, FeatureLayer, Legend, Query, Extent, SimpleRenderer, SimpleMarkerSymbol, GeometryService,
            domConstruct, BasemapToggle, Scalebar, dom, number, on, parser, arrayUtils, Color, string, esriRequest, domStyle, HorizontalSlider, popup
        ) {

              parser.parse();

              //var restEnd = "http://geodata.epa.gov/arcgis/rest/services/ORD/"; //EPA Rest Endpoint
              //var restEnd = "http://gisstg.rtpnc.epa.gov/arcgis/rest/services/ord/"; //EPA Staging Rest Endpoint
              var restEnd = "http://it.innovateteam.com/arcgis/rest/services/ROE/";

              //Add map and set map properties
              roeMapTemp = new Map("mapDiv" + mapID, {
                  basemap: currentObject.config.baseMap[0], //"hybrid",  //satellite hybrid
                  center: currentObject.config.center,
                  //extent: new Extent({
                  //    xmin: currentObject.config.zoomToExtent[0],
                  //    ymin: currentObject.config.zoomToExtent[1],
                  //    xmax: currentObject.config.zoomToExtent[2],
                  //    ymax: currentObject.config.zoomToExtent[3],
                  //    spatialReference: { "wkid": 3857 }
                  //}),
                  maxZoom: currentObject.config.endResolution,
                  minZoom: currentObject.config.startResolution,
                  zoom: currentObject.config.startResolution, //currentObject.config.defaultZoomLevel, //Defaultzoomlevel from the config file
                  logo: false,
                  sliderStyle: "large"
              });

              //Add Scalebar and set scalebar properties
              var scalebar = new Scalebar({
                  map: roeMapTemp,
                  attachTo: "bottom-left",
                  scalebarUnit: "dual"
              });

              //Add Layers from map_Config
              var imageParameters = new ImageParameters();
              imageParameters.format = "jpeg"; //set the image type to PNG24, note default is PNG8.

              //Dynamically add layers specified in the Config file//
              //First layer in the list will be in the legend      //
              var dynamicMapSerives = [];

              //Find element that checkbox controls for visibility of layers will be appended into
              var layersContainer = document.getElementById("layer_list" + mapID);
              var layersYears = document.getElementById("layersNode" + mapID);

              //Add layers specified in the Config
              for (var i = 0; i < currentObject.config.layers.length; i++) {
                  dynamicMapSerives[i] = new ArcGISDynamicMapServiceLayer(restEnd + currentObject.config.layers[i] + "/MapServer", {
                      //"opacity": 1,
                      "imageParameters": imageParameters,
                  });
              }

              //Add the layers to the map
              roeMapTemp.addLayers(dynamicMapSerives);

              //alert(currentObject.config.layers.length);
              //For each layer in the config file add a check box for the layers visibility. The element id includes the index for the layer
              for (var c = 0; c < currentObject.config.layers.length; c++) {
                  $(layersContainer).append("<input type=\"checkbox\" checked=\"True\" class=\"list_item\" id=\"layer_" + c + "_" + mapID + "\" value=0 />" + currentObject.config.layerDisplayName[c] + "<br />");
                  lyr = currentObject.config.layers[c];
                  on(dom.byId("layer_" + c + "_" + mapID), "change", updateNLCDVisibility);
              }

              ////Radio button for Map layers visibility
              function updateNLCDVisibility(evt) {
                  evt = evt || window.event;
                  //get the layer index from the element id
                  var lName = evt.target.id.split("_");
                  //If radio button is checked show Map layer
                  if (dom.byId(evt.target.id).checked) {
                      dynamicMapSerives[lName[1]].show();
                  } else {
                      dynamicMapSerives[lName[1]].hide();
                  }
              }

              //Legend json request
              var content = "<div align=\"middle\"><img alt=\"\" align=\"middle\" src=\"" + currentObject.config.legend.url + "\"></div>"; //"<div class=\"innvateLegend\"><div></div>";
              //content = content + "<div><img alt=\"\" src=\"" + currentObject.config.legend.url + "\"></div>";
              var legendContainer = document.getElementById("legendDiv" + mapID);
              $(legendContainer).append(content);
              //End Legend

              //Add Opacity slider
              var slider = new HorizontalSlider({
                  name: "slider" + mapID,
                  value: 1,
                  minimum: 0,
                  maximum: 1,
                  intermediateChanges: true,
                  style: "width:200px;",
                  onChange: function (value) {
                      //dom.byId("sliderValue").value = value;
                      //map.getLayer(map.layerIds[1]).setOpacity(value);
                      dynamicMapSerives[0].setOpacity(value);

                      if (dynamicMapSerives[0].visible) {
                          dynamicMapSerives[0].setOpacity(value);
                      } else {
                          dynamicMapSerives[1].setOpacity(value);
                      }
                  }
              }, "oslider" + mapID).startup();

              //Code for basemap radio buttons
              on(dom.byId("blayerS" + mapID), "change", updateBaseMap0);
              on(dom.byId("blayerG" + mapID), "change", updateBaseMap0);
              //switch base map based on checked radio button
              function updateBaseMap0() {
                  //alert(mapID);
                  if (dom.byId("blayerS" + mapID).checked) {
                      roeMapTemp.setBasemap(currentObject.config.baseMap[0]);
                  } else {
                      roeMapTemp.setBasemap(currentObject.config.baseMap[1]);
                  }
              }

              //on mouse over 
              dojo.connect(roeMapTemp, "onMouseOver", refreshMapPosition);
              //makes sur that the map is refreshed and positioned correctly
              function refreshMapPosition() {
                  //alert("on Map");
                  roeMapTemp.resize();
                  roeMapTemp.reposition();
              }
              //May need this at some point
              roeMapTemp.resize();
              roeMapTemp.reposition();


              //POPUPS
              //Query and infoWindow setup
              dojo.connect(roeMapTemp, "onClick", tempExecuteQueryTask);
              dojo.connect(roeMapTemp.infoWindow, "onHide", function () { roeMapTemp.graphics.clear(); });
              tempQueryTask = new esri.tasks.QueryTask(restEnd + currentObject.config.layers[0] + "/MapServer/0");

              //Set query task
              tempQuery = new esri.tasks.Query();
              tempQuery.outSpatialReference = { "wkid": 3857 };
              tempQuery.returnGeometry = true;
              tempQuery.outFields = ["*"];

              //Execute query
              function tempExecuteQueryTask(evt) {

                  roeMapTemp.infoWindow.hide();    //Hide Popup
                  roeMapTemp.graphics.clear();     //Clear Graphics
                  tempFeatureSet = null;        //Reset the Featureset

                  //Find clicked location and execute query
                  tempQuery.geometry = evt.mapPoint;
                  tempQueryTask.execute(tempQuery, function (fset) {
                      //alert("click radon");
                      if (fset.features.length === 1) {
                          tempShowFeature(fset.features[0], evt);
                      } else if (fset.features.length !== 0) {
                          //showFeatureSet(fset, evt);
                      }
                  });
              }

              //Show feature that was clicked
              function tempShowFeature(feature, evt) {

                  roeMapTemp.graphics.clear();     //Clear graphics on the map

                  //set graphic symbol
                  var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 2), new dojo.Color([255, 255, 255, 0]));
                  feature.setSymbol(symbol);

                  // Build text and layout for the popup
                  var attr = feature.attributes;
                  var title = ""; //attr.NAME + " watershed"; //", " + toTitleCase(attr.StateName);
                  var content = attr.DegFperCen;

                  if (parseFloat(attr.DegFperCen) > 0) {
                      content = "+" + attr.DegFperCen.toFixed(2) + "&degF per century";
                  } else {
                      content = attr.DegFperCen.toFixed(2) + "&degF per century";
                  }

                  //Add graphics
                  roeMapTemp.graphics.add(feature);
                  //Set title and content for the popup window
                  roeMapTemp.infoWindow.setTitle(title);
                  roeMapTemp.infoWindow.setContent(content);

                  (evt) ? roeMapTemp.infoWindow.show(evt.screenPoint, roeMapTemp.getInfoWindowAnchor(evt.screenPoint)) : null;
                  roeMapTemp.infoWindow.resize(170, 120);
              }


              //find FullScreen and layer Visisbility button elements on right side of Map
              var layerbutton = dojo.byId("expandIcon" + mapID),
                  wipeTarget = dojo.byId("layersNode" + mapID);

              //assign the Eventerhandlers for FullScreen and layer Visisbility button  
              on(layerbutton, "click", function (evt) {
                  if (domStyle.get(wipeTarget, "display") === "none") {
                      dojo.fx.wipeIn({ node: wipeTarget }).play();
                      dojo.attr("exIcon" + mapID, "src", "./scripts/innovate/images/minus2.png"); //note: these paths will need to change when move servers
                  } else {
                      dojo.fx.wipeOut({ node: wipeTarget }).play();
                      dojo.attr("exIcon" + mapID, "src", "./scripts/innovate/images/greenPlus2.gif"); //note: these paths will need to change when move servers
                  }

              });

              //Find Full Screen button on right side of Map and connect EventHandler
              on(dom.byId("fullScreen" + mapID), "click", fullscreenMode);

              //FullScreen button EventHandler
              function fullscreenMode() {

                  //add from innovat.js
                  var maxWidth = 1360, maxHeight = 1360
                , screenHeight = parseInt($(window).height())
                , screenWidth = parseInt($(window).width())
                , width = screenWidth, height = screenHeight
                , top = 0
                , left = 0
                , userConfig = innovate.getUserConfigForMap(mapID);
                  if (screenHeight > maxHeight || screenWidth > maxWidth) {
                      if (screenWidth > maxWidth) {
                          width = maxWidth;
                      } else {
                          width = screenWidth;
                      }
                      if (screenHeight > maxHeight) {
                          height = maxHeight;
                      } else {
                          height = screenHeight;
                      }
                      top = parseInt((screenHeight - height) / 2);
                      left = parseInt((screenWidth - width) / 2);
                  }
                  width = width - 6;
                  height = height - 6;

                  $.blockUI({
                      message: "<div id=\"mapPopupHeader\" style=\"cursor:pointer;height:24px;background-color:#9DB6DB;\">" +
                              "<div style=\"float:left; padding-left:10px;\">" + userConfig["header"] + "</div>" +
                              "<div style=\"float:right; padding-right:5px;\"><a href=\"javaScript:innovate.closeModal();\">Close</a></div>" +
                              "</div>" +
                              "<div>" +
                              "<div id=\"mapPopupLoading\" style=\"position:relative; top:0px; left:0px; width:" + width + "px; height:" + height + "px; z-index:1003; margin:auto auto;  \"><div style=\"margin-top:" + Math.floor(height / 2) + "px;\"><div style=\"text-align:center; \">Loading...</div><div><img src=\"images/ajax-loader.gif\" /></div></div></div>" +
                              "<iframe name=\"innovateFullScreenFrame\" id=\"innovateFullScreenFrame\" src=\"getMap.html?width=" + (width) + "&height=" + (height - 24) + "&mapId=" + mapID + "&exHeight=130px" + "\" frameborder=\"0\" scrolling=\"no\" width=\"" + width + "\" height=\"" + (height - 24) + "\"></iframe>" +
                              "</div>", //note: this path will need to change when move servers
                      css: {
                          "position": "fixed",
                          "width": width,
                          "height": height,
                          "top": top,
                          "left": left
                      },
                      bindEvents: false
                  });
              }

          });
    }

    //Sea Level Relative
    //Innovate Map # 6
    this.ROE_SeaLevelRelative2015 = function () {
        //var map, compare, compare2;
        var roeMapRel;
        require([
          "esri/map",
          "esri/layers/ArcGISDynamicMapServiceLayer",
          "esri/layers/ImageParameters",
          "esri/InfoTemplate",
          "esri/dijit/Popup",
          "esri/dijit/PopupTemplate",
          "esri/layers/FeatureLayer",
          "esri/dijit/Legend",
          "esri/tasks/query",
          "esri/geometry/Extent",
          "esri/renderers/SimpleRenderer",
          "esri/symbols/SimpleMarkerSymbol",
          //"esri/symbols/SimpleFillSymbol",
          //"esri/symbols/SimpleLineSymbol",
          "esri/tasks/GeometryService",
          "dojo/dom-construct",
          "esri/dijit/BasemapToggle",
          "esri/dijit/Scalebar",
          "dojo/dom",
          "dojo/number",
          "dojo/on",
          "dojo/parser",
          "dojo/_base/array",
          "esri/Color",
          "dojo/string",
          "dojo/dom-style",
          "dijit/form/HorizontalSlider",
          "dijit/popup",
          "dijit/layout/BorderContainer",
          "dijit/layout/ContentPane",
          "dojox/layout/ExpandoPane",
          "dojo/domReady!"
        ],
          function (
            Map, ArcGISDynamicMapServiceLayer, ImageParameters, InfoTemplate, Popup, PopupTemplate, FeatureLayer, Legend, Query, Extent, SimpleRenderer, SimpleMarkerSymbol, GeometryService,
            domConstruct, BasemapToggle, Scalebar, dom, number, on, parser, arrayUtils, Color, string, domStyle, HorizontalSlider, popup
        ) {

              parser.parse();

              //var restEnd = "http://geodata.epa.gov/arcgis/rest/services/ORD/"; //EPA Production Rest Endpoint
              //var restEnd = "http://gisstg.rtpnc.epa.gov/arcgis/rest/services/ord/"; //EPA Staging Rest Endpoint
              var restEnd = "http://it.innovateteam.com/arcgis/rest/services/ROE/";

              esriConfig.defaults.geometryService = new GeometryService("http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
              var layer, visibleLayerIds = []; //list of visible layers

              //Add map and set map properties
              roeMapRel = new Map("mapDiv" + mapID, {
                  basemap: currentObject.config.baseMap[0],  //satellite hybrid
                  center: currentObject.config.center,
                  maxZoom: currentObject.config.endResolution,
                  minZoom: currentObject.config.startResolution,
                  zoom: currentObject.config.defaultZoomLevel, //currentObject.config.defaultZoomLevel, //Defaultzoomlevel from the config file
                  logo: false,
                  sliderStyle: "large"
              });

              //Add Scalebar and set scalebar properties
              var scalebar = new Scalebar({
                  map: roeMapRel,
                  attachTo: "bottom-left",
                  scalebarUnit: "dual"
              });

              //Add Layers from map_Config
              var imageParameters = new ImageParameters();
              imageParameters.format = "jpeg"; //set the image type to PNG24, note default is PNG8.

              //Dynamically add layers specified in the Config file//
              //First layer in the list will be in the legend      //
              var dynamicMapSerives = [];

              //Find element that checkbox controls for visibility of layers will be appended into
              var layersContainer = document.getElementById("layer_list" + mapID);
              var layersYears = document.getElementById("layersNode" + mapID);

              //Loop through layer list in the config file.
              for (var i = 0; i < currentObject.config.layers.length; i++) {
                  dynamicMapSerives[i] = new ArcGISDynamicMapServiceLayer(restEnd + currentObject.config.layers[i] + "/MapServer", {
                      //"opacity": 1,
                      "imageParameters": imageParameters,
                  });
              }
              roeMapRel.addLayers(dynamicMapSerives);

              //alert(currentObject.config.layers.length);
              //For each layer in the config file add a check box for the layers visibility. The element id includes the index for the layer
              for (var c = 0; c < currentObject.config.layers.length; c++) {
                  $(layersContainer).append("<input type=\"checkbox\" checked=\"True\" class=\"list_item\" id=\"layer_" + c + "_" + mapID + "\" value=0 />" + currentObject.config.layerDisplayName[c] + "<br />");
                  lyr = currentObject.config.layers[c];
                  on(dom.byId("layer_" + c + "_" + mapID), "change", updateRelVisibility);
              }

              ////checkboxc button for Map layers visibility
              function updateRelVisibility(evt) {
                  evt = evt || window.event;
                  //get the layer index from the element id
                  var lName = evt.target.id.split("_");
                  //If radio button is checked show Map layer
                  if (dom.byId(evt.target.id).checked) {
                      dynamicMapSerives[lName[1]].show();
                  } else {
                      dynamicMapSerives[lName[1]].hide();
                  }
              }

              //Legend goes here
              var content = "<div align=\"middle\"><img alt=\"\" align=\"middle\" src=\"" + currentObject.config.legend.url + "\"></div>"; //"<div class=\"innvateLegend\"><div></div>";
              //content = content + "<div><img alt=\"\" src=\"" + currentObject.config.legend.url + "\"></div>";
              var legendContainer = document.getElementById("legendDiv" + mapID);
              $(legendContainer).append(content);

              var slider = new HorizontalSlider({
                  name: "slider" + mapID,
                  value: 1,
                  minimum: 0,
                  maximum: 1,
                  intermediateChanges: true,
                  style: "width:200px;",
                  onChange: function (value) {
                      //dom.byId("sliderValue").value = value;
                      //map.getLayer(map.layerIds[1]).setOpacity(value);
                      dynamicMapSerives[0].setOpacity(value);

                      if (dynamicMapSerives[0].visible) {
                          dynamicMapSerives[0].setOpacity(value);
                      } else {
                          dynamicMapSerives[1].setOpacity(value);
                      }
                  }
              }, "oslider" + mapID).startup();

              //Code for basemap radio buttons
              on(dom.byId("blayerS" + mapID), "change", updateBaseMap0);
              on(dom.byId("blayerG" + mapID), "change", updateBaseMap0);
              //switch base map based on checked radio button
              function updateBaseMap0() {
                  //alert(mapID);
                  if (dom.byId("blayerS" + mapID).checked) {
                      roeMapRel.setBasemap(currentObject.config.baseMap[0]);
                  } else {
                      roeMapRel.setBasemap(currentObject.config.baseMap[1]);
                  }
              }

              //on mouse over 
              dojo.connect(roeMapRel, "onMouseOver", refreshMapPosition);
              //makes sur that the map is refreshed and positioned correctly
              function refreshMapPosition() {
                  //alert("on Map");
                  roeMapRel.resize();
                  roeMapRel.reposition();
              }

              //May need this at some point
              roeMapRel.resize();
              roeMapRel.reposition();

              //Popup go here
              dojo.connect(roeMapRel, "onClick", executeQueryTask);
              dojo.connect(roeMapRel.infoWindow, "onHide", function () { roeMapRel.graphics.clear(); });
              queryTaskRel = new esri.tasks.QueryTask(restEnd + currentObject.config.layers[0] + "/MapServer/1");

              queryRel = new esri.tasks.Query();
              queryRel.outSpatialReference = { "wkid": 102100 };
              queryRel.returnGeometry = true;
              queryRel.outFields = ["*"];

              function executeQueryTask(evt) {
                  //Hide existing popups and clear existing graphics
                  roeMapRel.infoWindow.hide();
                  roeMapRel.graphics.clear();
                  featuresetNit = null;
                  //Create point user clicked and create an extent
                  var pt = new esri.geometry.Point(evt.mapPoint.x, evt.mapPoint.y, evt.mapPoint.spatialReference);
                  var mapWidth = roeMapRel.extent.getWidth();
                  var pixelWidth = mapWidth / roeMapRel.width;
                  var tolerance = 20 * pixelWidth;

                  var queryExtent = new esri.geometry.Extent(1, 1, tolerance, tolerance, evt.mapPoint.spatialReference);


                  queryRel.geometry = queryExtent.centerAt(pt);//evt.mapPoint;//extent;
                  //alert(evt.mapPoint.x);
                  //Execute query
                  queryTaskRel.execute(queryRel, function (fsetN) {
                      //alert(fsetN.features.length);
                      if (fsetN.features.length === 1) {

                          showFeature(fsetN.features[0], evt);
                      } else if (fsetN.features.length != 0) {
                          showFeature(fsetN.features[0], evt);
                          //alert(fset.features.length);
                          //alert(fset.feature[0].attributes["SITE_ID"] + " " + fset.feature[1].attributes["SITE_ID"]);
                      }
                      //alert(fset.features.length);
                  });

              }

              function showFeature(feature, evt) {
                  roeMapRel.graphics.clear();

                  //var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 2), new dojo.Color([255, 255, 255, 0]));
                  var symbol = new SimpleMarkerSymbol("circle", 32, null, new Color([0, 0, 0, 0.25]))
                  feature.setSymbol(symbol);

                  //function toTitleCase(str) {
                  //            return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
                  //        }

                  var attr = feature.attributes;
                  var state = attr.State ? attr.State : "";
                  var stationName = $.trim(attr.Station_Name + ", " + state);
                  var title = stationName;
                  var imgURL = "";
                  var sign = "";

                  if (attr.inches_1960_2014 <= -8) { imgURL = restEnd + currentObject.config.layers[0] + "/MapServer/1/images/b4fb9a29d5209dbe27b4e967d2e07641" }
                  else if (attr.inches_1960_2014 > -7.99 && attr.inches_1960_2014 < -6) { imgURL = restEnd + currentObject.config.layers[0] + "/MapServer/1/images/8325d213cae8a18cd43da5e817ad95e9" }
                  else if (attr.inches_1960_2014 > -5.99 && attr.inches_1960_2014 < -4) { imgURL = restEnd + currentObject.config.layers[0] + "/MapServer/1/images/f41ee282ee57dea31091b426ad1155b1" }
                  else if (attr.inches_1960_2014 > -3.99 && attr.inches_1960_2014 < -2) { imgURL = restEnd + currentObject.config.layers[0] + "/MapServer/1/images/7f0fdd9351cdff1188e704cda7121fdf" }
                  else if (attr.inches_1960_2014 > -1.99 && attr.inches_1960_2014 < 0) { imgURL = restEnd + currentObject.config.layers[0] + "/MapServer/1/images/29293bba9b6f62948783766ebc7ad9f8" }
                  else if (attr.inches_1960_2014 > .01 && attr.inches_1960_2014 < 2) { imgURL = restEnd + currentObject.config.layers[0] + "/MapServer/1/images/fa77ac635689bd669dfe97089bf7bac5" }
                  else if (attr.inches_1960_2014 > 2.01 && attr.inches_1960_2014 < 4) { imgURL = restEnd + currentObject.config.layers[0] + "/MapServer/1/images/4fb60081c07915703e76c105daea8919" }
                  else if (attr.inches_1960_2014 > 4.01 && attr.inches_1960_2014 < 6) { imgURL = restEnd + currentObject.config.layers[0] + "/MapServer/1/images/f3c769b91afc800850b3e3af3df58747" }
                  else if (attr.inches_1960_2014 > 6.01 && attr.inches_1960_2014 < 8) { imgURL = restEnd + currentObject.config.layers[0] + "/MapServer/1/images/b35709dd02ad7d2f9ca733b8600e5469" }
                  else if (attr.inches_1960_2014 >= 8) { imgURL = restEnd + currentObject.config.layers[0] + "/MapServer/1/images/53164f59b57f625dcd00a0b4e66de25b" }

                  var content = "";
                  
                  var increase = "";
                  if (parseFloat(attr.inches_1960_2014) > 0) {
                      increase = "Rising";
                  } else {
                      increase = "Falling";
                  }
                  content = "<div>Relative sea level change, 1960-2014:</div>";
                  if (increase === "Rising") {
                      sign = "+";
                  }
                  content += "<div>" + sign + attr.inches_1960_2014.toFixed(2) + " inches</div>";
                  var css = (increase === "Rising") ? "bottom" : "top";
                  content += '<table border="0"><tr><td><img src="' + imgURL + '" ></td><td style="vertical-align:' + css + '; padding-bottom:5px;">' + increase + '</td></tr></table>';

                  roeMapRel.graphics.add(feature);

                  roeMapRel.infoWindow.setTitle(title);
                  roeMapRel.infoWindow.setContent(content);
                  //evt.screenPoint
                  (evt) ? roeMapRel.infoWindow.show(evt.mapPoint, roeMapRel.getInfoWindowAnchor(evt.mapPoint)) : null;
                  roeMapRel.infoWindow.resize(250, 130);
              }
              //End popups

              //find FullScreen and layer Visisbility button elements on right side of Map
              var layerbutton = dojo.byId("expandIcon" + mapID),
                  wipeTarget = dojo.byId("layersNode" + mapID);

              //assign the Eventerhandlers for FullScreen and layer Visisbility button  
              on(layerbutton, "click", function (evt) {
                  if (domStyle.get(wipeTarget, "display") === "none") {
                      dojo.fx.wipeIn({ node: wipeTarget }).play();
                      dojo.attr("exIcon" + mapID, "src", "./scripts/innovate/images/minus2.png"); //note: these paths will need to change when move servers
                  } else {
                      dojo.fx.wipeOut({ node: wipeTarget }).play();
                      dojo.attr("exIcon" + mapID, "src", "./scripts/innovate/images/greenPlus2.gif"); //note: these paths will need to change when move servers
                  }

              });

              //Find Full Screen button on right side of Map and connect EventHandler
              on(dom.byId("fullScreen" + mapID), "click", fullscreenMode);

              //FullScreen button EventHandler
              function fullscreenMode() {

                  //add from innovat.js
                  var maxWidth = 1360, maxHeight = 1360
                , screenHeight = parseInt($(window).height())
                , screenWidth = parseInt($(window).width())
                , width = screenWidth, height = screenHeight
                , top = 0
                , left = 0
                , userConfig = innovate.getUserConfigForMap(mapID);
                  if (screenHeight > maxHeight || screenWidth > maxWidth) {
                      if (screenWidth > maxWidth) {
                          width = maxWidth;
                      } else {
                          width = screenWidth;
                      }
                      if (screenHeight > maxHeight) {
                          height = maxHeight;
                      } else {
                          height = screenHeight;
                      }
                      top = parseInt((screenHeight - height) / 2);
                      left = parseInt((screenWidth - width) / 2);
                  }
                  width = width - 6;
                  height = height - 6;

                  $.blockUI({
                      message: "<div id=\"mapPopupHeader\" style=\"cursor:pointer;height:24px;background-color:#9DB6DB;\">" +
                              "<div style=\"float:left; padding-left:10px;\">" + userConfig["header"] + "</div>" +
                              "<div style=\"float:right; padding-right:5px;\"><a href=\"javaScript:innovate.closeModal();\">Close</a></div>" +
                              "</div>" +
                              "<div>" +
                              "<div id=\"mapPopupLoading\" style=\"position:relative; top:0px; left:0px; width:" + width + "px; height:" + height + "px; z-index:1003; margin:auto auto;  \"><div style=\"margin-top:" + Math.floor(height / 2) + "px;\"><div style=\"text-align:center; \">Loading...</div><div><img src=\"images/ajax-loader.gif\" /></div></div></div>" +
                              "<iframe name=\"innovateFullScreenFrame\" id=\"innovateFullScreenFrame\" src=\"getMap.html?width=" + (width) + "&height=" + (height - 24) + "&mapId=" + mapID + "&exHeight=120px" + "\" frameborder=\"0\" scrolling=\"no\" width=\"" + width + "\" height=\"" + (height - 24) + "\"></iframe>" +
                              "</div>", //note: this path will need to change when move servers
                      css: {
                          "position": "fixed",
                          "width": width,
                          "height": height,
                          "top": top,
                          "left": left
                      },
                      bindEvents: false
                  });
              }

          });
    }

    //NLCD Land Cover
    //Innovate Map # 7
    this.ROE_NLCD = function () {
        var compare, compare2;

        require([
          "esri/map",
          "esri/layers/ArcGISDynamicMapServiceLayer",
          "esri/layers/ImageParameters",
          "esri/InfoTemplate",
          "esri/dijit/Popup",
          "esri/dijit/PopupTemplate",
          "esri/layers/FeatureLayer",
          "esri/dijit/Legend",
          "esri/tasks/query",
          "esri/geometry/Extent",
          "esri/renderers/SimpleRenderer",
          "esri/symbols/SimpleMarkerSymbol",
          //"esri/symbols/SimpleFillSymbol",
          //"esri/symbols/SimpleLineSymbol",
          "esri/tasks/GeometryService",
          "dojo/dom-construct",
          "esri/dijit/BasemapToggle",
          "esri/dijit/Scalebar",
          "dojo/dom",
          "dojo/number",
          "dojo/on",
          "dojo/parser",
          "dojo/_base/array",
          "esri/Color",
          "dojo/string",
          "esri/request",
          "dojo/dom-style",
          "dijit/form/HorizontalSlider",
          "dijit/popup",
          "dijit/layout/BorderContainer",
          "dijit/layout/ContentPane",
          "dojox/layout/ExpandoPane",
          "dojo/domReady!"
        ],
          function (
            Map, ArcGISDynamicMapServiceLayer, ImageParameters, InfoTemplate, Popup, PopupTemplate, FeatureLayer, Legend, Query, Extent, SimpleRenderer, SimpleMarkerSymbol, GeometryService,
            domConstruct, BasemapToggle, Scalebar, dom, number, on, parser, arrayUtils, Color, string, esriRequest, domStyle, HorizontalSlider, popup
        ) {

              parser.parse();

              //var restEnd = "http://geodata.epa.gov/arcgis/rest/services/ORD/"; //EPA Production Rest Endpoint
              //var restEnd = "http://gisstg.rtpnc.epa.gov/arcgis/rest/services/ord/"; //EPA Staging Rest Endpoint
              var restEnd = "http://it.innovateteam.com/arcgis/rest/services/ROE/";

              //esriConfig.defaults.geometryService = new GeometryService("http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
              //var layer, visibleLayerIds = []; //list of visible layers
              
              //Add map and set map properties
              roeMapNLCD = new Map("mapDiv" + mapID, {
                  basemap: currentObject.config.baseMap[0], //"hybrid",  //satellite hybrid
                  center: currentObject.config.center,
                  //extent: new Extent({
                  //    xmin: currentObject.config.zoomToExtent[0],
                  //    ymin: currentObject.config.zoomToExtent[1],
                  //    xmax: currentObject.config.zoomToExtent[2],
                  //    ymax: currentObject.config.zoomToExtent[3],
                  //    spatialReference: { "wkid": 3857 }
                  //}),
                  maxZoom: currentObject.config.endResolution,
                  minZoom: currentObject.config.startResolution,
                  zoom: currentObject.config.startResolution, //currentObject.config.defaultZoomLevel, //Defaultzoomlevel from the config file
                  logo: false,
                  sliderStyle: "large"
              });

              //Add Scalebar and set scalebar properties
              var scalebar = new Scalebar({
                  map: roeMapNLCD,
                  attachTo: "bottom-left",
                  scalebarUnit: "dual"
              });

              //Add Layers from map_Config
              var imageParameters = new ImageParameters();
              imageParameters.format = "jpeg"; //set the image type to PNG24, note default is PNG8.

              //Dynamically add layers specified in the Config file//
              //First layer in the list will be in the legend      //
              var dynamicMapSerives = [];

              //Find element that checkbox controls for visibility of layers will be appended into
              var layersContainer = document.getElementById("layer_list" + mapID);
              var layersYears = document.getElementById("layersNode" + mapID);

              //Add layers specified in the Config
              for (var i = 0; i < currentObject.config.layers.length; i++) {
                  dynamicMapSerives[i] = new ArcGISDynamicMapServiceLayer(restEnd + currentObject.config.layers[i] + "/MapServer", {
                      //"opacity": 1,
                      "imageParameters": imageParameters,
                  });
              }

              //Add the layers to the map
              roeMapNLCD.addLayers(dynamicMapSerives);
              
              //alert(currentObject.config.layers.length);
              //For each layer in the config file add a check box for the layers visibility. The element id includes the index for the layer
              for (var c = 0; c < currentObject.config.layers.length; c++) {
                  $(layersContainer).append("<input type=\"checkbox\" checked=\"True\" class=\"list_item\" id=\"layer_" + c + "_" + mapID + "\" value=0 />" + currentObject.config.layerDisplayName[c] + "<br />");
                  lyr = currentObject.config.layers[c];
                  on(dom.byId("layer_" + c + "_" + mapID), "change", updateNLCDVisibility);
              }

              ////Radio button for Map layers visibility
              function updateNLCDVisibility(evt) {
                  evt = evt || window.event;
                  //get the layer index from the element id
                  var lName = evt.target.id.split("_");
                  //If radio button is checked show Map layer
                  if (dom.byId(evt.target.id).checked) {
                      dynamicMapSerives[lName[1]].show();
                  } else {
                      dynamicMapSerives[lName[1]].hide();
                  }
              }

              //Legend json request
              var content = "<div align=\"middle\"><img alt=\"\" align=\"middle\" src=\"" + currentObject.config.legend.url + "\"></div>"; //"<div class=\"innvateLegend\"><div></div>";
              //content = content + "<div><img alt=\"\" src=\"" + currentObject.config.legend.url + "\"></div>";
              var legendContainer = document.getElementById("legendDiv" + mapID);
              $(legendContainer).append(content);
              //End Legend

              //Add Opacity slider
              var slider = new HorizontalSlider({
                  name: "slider" + mapID,
                  value: 1,
                  minimum: 0,
                  maximum: 1,
                  intermediateChanges: true,
                  style: "width:200px;",
                  onChange: function (value) {
                      //dom.byId("sliderValue").value = value;
                      //map.getLayer(map.layerIds[1]).setOpacity(value);
                      dynamicMapSerives[0].setOpacity(value);

                      if (dynamicMapSerives[0].visible) {
                          dynamicMapSerives[0].setOpacity(value);
                      } else {
                          dynamicMapSerives[1].setOpacity(value);
                      }
                  }
              }, "oslider" + mapID).startup();

              //Code for basemap radio buttons
              on(dom.byId("blayerS" + mapID), "change", updateBaseMap0);
              on(dom.byId("blayerG" + mapID), "change", updateBaseMap0);
              //switch base map based on checked radio button
              function updateBaseMap0() {
                  //alert(mapID);
                  if (dom.byId("blayerS" + mapID).checked) {
                      roeMapNLCD.setBasemap(currentObject.config.baseMap[0]);
                  } else {
                      roeMapNLCD.setBasemap(currentObject.config.baseMap[1]);
                  }
              }

              //on mouse over 
              dojo.connect(roeMapNLCD, "onMouseOver", refreshMapPosition);
              //makes sur that the map is refreshed and positioned correctly
              function refreshMapPosition() {
                  //alert("on Map");
                  roeMapNLCD.resize();
                  roeMapNLCD.reposition();
              }
              //May need this at some point
              roeMapNLCD.resize();
              roeMapNLCD.reposition();

              //No Popups

              //find FullScreen and layer Visisbility button elements on right side of Map
              var layerbutton = dojo.byId("expandIcon" + mapID),
                  wipeTarget = dojo.byId("layersNode" + mapID);

              //assign the Eventerhandlers for FullScreen and layer Visisbility button  
              on(layerbutton, "click", function (evt) {
                  if (domStyle.get(wipeTarget, "display") === "none") {
                      dojo.fx.wipeIn({ node: wipeTarget }).play();
                      dojo.attr("exIcon" + mapID, "src", "./scripts/innovate/images/minus2.png"); //note: these paths will need to change when move servers
                  } else {
                      dojo.fx.wipeOut({ node: wipeTarget }).play();
                      dojo.attr("exIcon" + mapID, "src", "./scripts/innovate/images/greenPlus2.gif"); //note: these paths will need to change when move servers
                  }

              });

              //Find Full Screen button on right side of Map and connect EventHandler
              on(dom.byId("fullScreen" + mapID), "click", fullscreenMode);

              //FullScreen button EventHandler
              function fullscreenMode() {

                  //add from innovat.js
                  var maxWidth = 1360, maxHeight = 1360
                , screenHeight = parseInt($(window).height())
                , screenWidth = parseInt($(window).width())
                , width = screenWidth, height = screenHeight
                , top = 0
                , left = 0
                , userConfig = innovate.getUserConfigForMap(mapID);
                  if (screenHeight > maxHeight || screenWidth > maxWidth) {
                      if (screenWidth > maxWidth) {
                          width = maxWidth;
                      } else {
                          width = screenWidth;
                      }
                      if (screenHeight > maxHeight) {
                          height = maxHeight;
                      } else {
                          height = screenHeight;
                      }
                      top = parseInt((screenHeight - height) / 2);
                      left = parseInt((screenWidth - width) / 2);
                  }
                  width = width - 6;
                  height = height - 6;

                  $.blockUI({
                      message: "<div id=\"mapPopupHeader\" style=\"cursor:pointer;height:24px;background-color:#9DB6DB;\">" +
                              "<div style=\"float:left; padding-left:10px;\">" + userConfig["header"] + "</div>" +
                              "<div style=\"float:right; padding-right:5px;\"><a href=\"javaScript:innovate.closeModal();\">Close</a></div>" +
                              "</div>" +
                              "<div>" +
                              "<div id=\"mapPopupLoading\" style=\"position:relative; top:0px; left:0px; width:" + width + "px; height:" + height + "px; z-index:1003; margin:auto auto;  \"><div style=\"margin-top:" + Math.floor(height / 2) + "px;\"><div style=\"text-align:center; \">Loading...</div><div><img src=\"images/ajax-loader.gif\" /></div></div></div>" +
                              "<iframe name=\"innovateFullScreenFrame\" id=\"innovateFullScreenFrame\" src=\"getMap.html?width=" + (width) + "&height=" + (height - 24) + "&mapId=" + mapID + "&exHeight=135px" + "\" frameborder=\"0\" scrolling=\"no\" width=\"" + width + "\" height=\"" + (height - 24) + "\"></iframe>" +
                              "</div>", //note: this path will need to change when move servers
                      css: {
                          "position": "fixed",
                          "width": width,
                          "height": height,
                          "top": top,
                          "left": left
                      },
                      bindEvents: false
                  });
              }

          });
    }

    //Radon Map
    //Innovate Map Number 8
    this.ROE_Radon = function () {
        
        var roeMapRadon;
     
        require([
          "esri/map",
          "esri/layers/ArcGISDynamicMapServiceLayer",
          "esri/layers/ImageParameters",
          "esri/InfoTemplate",
          "esri/layers/FeatureLayer",
          "esri/dijit/Legend",
          "esri/tasks/query",
          "esri/geometry/Extent",
          "esri/renderers/SimpleRenderer",
          "esri/symbols/SimpleFillSymbol",
          "esri/symbols/SimpleLineSymbol",
          "esri/dijit/BasemapToggle",
          "esri/dijit/Scalebar",
          "dojo/dom",
          "dojo/number",
          "dojo/on",
          "dojo/parser",
          "dojo/_base/array",
          "esri/Color",
          "dojo/string",
          "esri/request",
          "dojo/dom-style",
          "dijit/form/HorizontalSlider",
          "dijit/popup",
          "dijit/layout/BorderContainer",
          "dijit/layout/ContentPane",
          "dojox/layout/ExpandoPane",
          "dojo/domReady!"
        ],
          function (
            Map, ArcGISDynamicMapServiceLayer, ImageParameters, InfoTemplate, FeatureLayer, Legend, Query, Extent, SimpleRenderer, SimpleFillSymbol,
            SimpleLineSymbol, BasemapToggle, Scalebar, dom, number, on, parser, arrayUtils, Color, string, esriRequest, domStyle, HorizontalSlider, popup
        ) {
              
              //parser.parse(dom.byId("mframe" + mapID));
              parser.parse();

              var restEnd = "http://geodata.epa.gov/arcgis/rest/services/ORD/"; //EPA Production Rest Endpoint
              //var restEnd = "http://gisstg.rtpnc.epa.gov/arcgis/rest/services/ord/"; //EPA Staging Rest Endpoint
              //var restEnd = "http://it.innovateteam.com/arcgis/rest/services/ROE/";

              var layer, visibleLayerIds = []; //list of visible layers

              //Add map and set map properties
              roeMapRadon = new Map("mapDiv" + mapID, {
                  basemap: "hybrid",
                  center: currentObject.config.center,
                  //extent: new Extent({
                  //    xmin: currentObject.config.zoomToExtent[0],
                  //    ymin: currentObject.config.zoomToExtent[1],
                  //    xmax: currentObject.config.zoomToExtent[2],
                  //    ymax: currentObject.config.zoomToExtent[3],
                  //    spatialReference: { "wkid": 3857 }
                  //}),
                  maxZoom: currentObject.config.endResolution,
                  minZoom: currentObject.config.startResolution,
                  zoom: currentObject.config.defaultZoomLevel, //Defaultzoomlevel from the config file
                  logo: false,
                  sliderStyle: "large"
              });

              //Add Scalebar and set scalebar properties
              var scalebar = new Scalebar({
                  map: roeMapRadon,
                  attachTo: "bottom-left",
                  scalebarUnit: "dual"
              });
              
              //Add Layers from map_Config
              var imageParameters = new ImageParameters();
              imageParameters.format = "jpeg"; //set the image type to PNG24, note default is PNG8.

              //Dynamically add layers specified in the Config file//
              //First layer in the list will be in the legend      //
              var dynamicMapSerives = [];
              
              //Find element that checkbox controls for visibility of layers will be appended into
              var layersContainer = document.getElementById("layer_list" + mapID);

              //Loop through layer list in the config file.
              for (var i = 0; i < currentObject.config.layers.length; i++) {
                  dynamicMapSerives[i] = new ArcGISDynamicMapServiceLayer(restEnd + currentObject.config.layers[i] + "/MapServer", {
                      //"opacity": 1,
                      "imageParameters": imageParameters,
                  });
              }
              //Add the layers to the map
              roeMapRadon.addLayers(dynamicMapSerives);

              //alert(currentObject.config.layers.length);
              //For each layer in the config file add a check box for the layers visibility. The element id includes the index for the layer
              for (var c = 0; c < currentObject.config.layers.length; c++) {
                  $(layersContainer).append("<input type=\"checkbox\" checked=\"True\" class=\"list_item\" id=\"layer_" + c + "_" + mapID + "\" value=0 />" + currentObject.config.layerDisplayName[c] + "<br />");
                  lyr = currentObject.config.layers[c];
                  on(dom.byId("layer_" + c + "_" + mapID), "change", updateRadonVisibility);
              }

              ////Radio button for Map layers visibility
              function updateRadonVisibility(evt) {
                  evt = evt || window.event;
                  //get the layer index from the element id
                  var lName = evt.target.id.split("_");
                  //If radio button is checked show Map layer
                  if (dom.byId(evt.target.id).checked) {
                      dynamicMapSerives[lName[1]].show();
                  } else {
                      dynamicMapSerives[lName[1]].hide();
                  }
              }
             
              //Legend json request
              var url = restEnd + currentObject.config.legend.url + "?f=pjson";
              //alert(currentObject.config.legend.url);
              var requestHandle = esriRequest({
                  "url": url,
                  "content": {
                      "f": "json"
                  },
                  "callbackParamName": "callback"
              });
              requestHandle.then(requestSucceeded, requestFailed);
              function requestSucceeded(response, io) {

                  var content = "";
                  //Loop through layers for the table of contents
                  content = content + "<div class=\"innvateLegend\"><div></div><table><tbody>";
                   
                  //add legend componets for this layaer
                  var mLegend = response.layers[0]["legend"];
                  var imgURL = "";
                  //alert(mLegend.length);
                  for (var i = 0; i < mLegend.length; i++) {
                      imgURL = restEnd + currentObject.config.layers[0] + "/MapServer/0/images/" + mLegend[i]["url"];
                       //alert(mLegend[i]["label"]);
                      content = content + "<tr><td valign=\"middle\" align=\"center\"><div><img alt=\"\" src=\"" + imgURL + "\"></div></td>" +
                            "<td valign=\"middle\" align=\"left\" style=\"padding: 3px 5px 0px 5px\">" + mLegend[i]["label"] + "</td></tr>";
                  }
                 content = content + "</tbody></table></div>";
                  
                  //Add to the legend div
                  var legendContainer = document.getElementById("legendDiv" + mapID);
                  $(legendContainer).append(content);

              }
              function requestFailed(error, io) {
                  alert("Failed");
              }
              //End Legend

              //roeMapRadon.on("layers-add-result", function (evt) {
              //    var legendDijit = new Legend({
              //        map: roeMapRadon,
              //        layerInfos: [{ "defaultSymbol": false, "layer": dynamicMapSerives[0], "title": currentObject.config.layerDisplayName[0] }],

              //    }, "legendDiv" + mapID);

              //    legendDijit.startup();
              //});
              var oSlider = document.getElementById(".dojoxExpandTitle");
              var slider = new HorizontalSlider({
                  name: "slider" + mapID,
                  title: "Opacity",
                  value: 1,
                  minimum: 0,
                  maximum: 1,
                  intermediateChanges: true,
                  style: "width:200px;",
                  onChange: function (value) {
                      //dom.byId("sliderValue").value = value;
                      //map.getLayer(map.layerIds[1]).setOpacity(value);
                      dynamicMapSerives[0].setOpacity(value);
                  }
              }, "oslider" + mapID).startup(); //"slider" + mapID

              //Code for basemap radio buttons
              on(dom.byId("blayerS" + mapID), "change", updateBaseMap0);
              on(dom.byId("blayerG" + mapID), "change", updateBaseMap0);
              //switch base map based on checked radio button
              function updateBaseMap0() {
                  //alert(mapID);
                  if (dom.byId("blayerS" + mapID).checked) {
                      roeMapRadon.setBasemap("hybrid");
                  } else {
                      roeMapRadon.setBasemap("gray");
                  }
              }

              //on mouse over 
              dojo.connect(roeMapRadon, "onMouseOver", refreshMapPosition);
              //makes sur that the map is refreshed and positioned correctly
              function refreshMapPosition() {
                  //alert("on Map");
                  roeMapRadon.resize();
                  roeMapRadon.reposition();
              }

              //this.map = roeMap;
              //rMap = roeMap

              //May need this at some point
              roeMapRadon.resize();
              roeMapRadon.reposition();

              //this.map = roeMap;
              //rMap = roeMap

              //adding code 6/20/14
              //Query and infoWindow setup
              dojo.connect(roeMapRadon, "onClick", executeQueryTask);
              dojo.connect(roeMapRadon.infoWindow, "onHide", function () { roeMapRadon.graphics.clear(); });
              queryTaskRadon = new esri.tasks.QueryTask(restEnd + currentObject.config.layers[0] + "/MapServer/0");

              //Set query task
              queryRadon = new esri.tasks.Query();
              queryRadon.outSpatialReference = { "wkid": 3857 };
              queryRadon.returnGeometry = true;
              queryRadon.outFields = ["*"];

              //Execute query
              function executeQueryTask(evt) {

                  roeMapRadon.infoWindow.hide();    //Hide Popup
                  roeMapRadon.graphics.clear();     //Clear Graphics
                  featureSet = null;        //Reset the Featureset

                  //Find clicked location and execute query
                  queryRadon.geometry = evt.mapPoint;
                  queryTaskRadon.execute(queryRadon, function (fset) {
                      if (fset.features.length === 1) {
                          //this[controlName]();
                          showFeature(fset.features[0], evt);
                      } else if (fset.features.length !== 0) {
                          showFeatureSet(fset, evt);
                      }
                  });
              }

              //Show feature that was clicked
              function showFeature(feature, evt) {
                  roeMapRadon.graphics.clear();     //Clear graphics on the map

                  //set graphic symbol
                  var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 2), new dojo.Color([255, 255, 255, 0]));
                  feature.setSymbol(symbol);

                  function toTitleCase(str) {
                      return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
                  }
                  // Build text and layout for the popup
                  var attr = feature.attributes;
                  var title = attr.NAMELSAD; // + ", " + toTitleCase(attr.StateName);
                  var content = ""; 

                  var rVal = attr.RadonZone;
                  var content = "";
                  var desc = "";
                  var priority = "";
                  if (rVal == "1") {
                      //alert(rState);
                      desc = "<b>Zone 1 </b>counties have a predicted average indoor radon screening level greater than 4 pCi/L (picocuries per liter) <b>(red zones)</b>";
                      priority = "<b>Highest Potential</b>";
                      //imgURL = "http://it.innovateteam.com/arcgis/rest/services/ROE/ROE_Radon/MapServer/0/images/3b6a386668a6d07b8d8e029744820282"
                      imgURL = restEnd + "ROE_Radon/MapServer/0/images/7222a20623b288194ba3a4929f4a9610";
                  } else if (rVal == "2") {
                      //alert(rVal + "should be 2");
                      desc = "<b>Zone 2 </b>counties have a predicted average indoor radon screening level between 2 and 4 pCi/L <b>(orange zones)</b>";
                      priority = "<b>Moderate Potential</b>";
                      //imgURL = "http://it.innovateteam.com/arcgis/rest/services/ROE/ROE_Radon/MapServer/0/images/52edb92fef3b3447d910ea3f4e3bad06"
                      imgURL = restEnd + "ROE_Radon/MapServer/0/images/0af36609991455aceba15b73b91ce066";
                  } else if (rVal == "3") {
                      //alert(rVal + "should be 3");
                      desc = "<b>Zone 3 </b>counties have a predicted average indoor radon screening level less than 2 pCi/L <b>(yellow zones)</b>";
                      priority = "<b>Low Potential</b>";
                      //imgURL = "http://it.innovateteam.com/arcgis/rest/services/ROE/ROE_Radon/MapServer/0/images/d1573b09a0505bef245b2a380a18e380"
                      imgURL = restEnd + "ROE_Radon/MapServer/0/images/77ea99fb7956be59e6314b0eb1ddefe3";
                  }

                  content = "<div style=\"font-size: 11px\">Radon risk zone: " + rVal + "</div>" +
                          "<table style=\"width:420px\height:120px\"><tbody><tr style=\"background-color: #EEEEEE; border-color:#DDDDDD;border-style: solid; border-width: 1px 0 1px 0px;padding: 1px;\">" +
                          "<td valign=\"top\" align=\"center\"><div><img alt=\"\" src=\"" + imgURL + "\"></div></td>" +
                          "<td valign=\"top\" style=\"font-size: 11px\" padding=\"2px\" align=\"left\">" + desc + "</td>" +
                          "<td valign=\"top\" style=\"font-size: 11px\" padding=\"2px\" align=\"left\">" + priority + "</td></tr></tbody></table>";
                  //Add graphics
                  roeMapRadon.graphics.add(feature);
                  //Set title and content for the popup window
                  roeMapRadon.infoWindow.setTitle(title);
                  roeMapRadon.infoWindow.setContent(content);

                  (evt) ? roeMapRadon.infoWindow.show(evt.screenPoint, roeMapRadon.getInfoWindowAnchor(evt.screenPoint)) : null;
                  roeMapRadon.infoWindow.resize(300, 120);
              }

              //find FullScreen and layer Visisbility button elements on right side of Map
              var layerbutton = dojo.byId("expandIcon" + mapID),
                  wipeTarget = dojo.byId("layersNode" + mapID);

              //assign the Eventerhandlers for FullScreen and layer Visisbility button  
              on(layerbutton, "click", function (evt) {
                  if (domStyle.get(wipeTarget, "display") === "none") {
                      dojo.fx.wipeIn({ node: wipeTarget }).play();
                      dojo.attr("exIcon" + mapID, "src", "./scripts/innovate/images/minus2.png"); //note: these paths will need to change when move servers
                  } else {
                      dojo.fx.wipeOut({ node: wipeTarget }).play();
                      dojo.attr("exIcon" + mapID, "src", "./scripts/innovate/images/greenPlus2.gif"); //note: these paths will need to change when move servers
                  }

              });

              //Find Full Screen button on right side of Map and connect EventHandler
              on(dom.byId("fullScreen" + mapID), "click", fullscreenMode);

              //FullScreen button EventHandler
              function fullscreenMode() {

                  //add from innovat.js
                  var maxWidth = 1360, maxHeight = 1360
                , screenHeight = parseInt($(window).height())
                , screenWidth = parseInt($(window).width())
                , width = screenWidth, height = screenHeight
                , top = 0
                , left = 0
                , userConfig = innovate.getUserConfigForMap(mapID);
                  if (screenHeight > maxHeight || screenWidth > maxWidth) {
                      if (screenWidth > maxWidth) {
                          width = maxWidth;
                      } else {
                          width = screenWidth;
                      }
                      if (screenHeight > maxHeight) {
                          height = maxHeight;
                      } else {
                          height = screenHeight;
                      }
                      top = parseInt((screenHeight - height) / 2);
                      left = parseInt((screenWidth - width) / 2);
                  }
                  width = width - 6;
                  height = height - 6;

                  $.blockUI({
                      message: "<div id=\"mapPopupHeader\" style=\"cursor:pointer;height:24px;background-color:#9DB6DB;\">" +
                              "<div style=\"float:left; padding-left:10px;\">" + userConfig["header"] + "</div>" +
                              "<div style=\"float:right; padding-right:5px;\"><a href=\"javaScript:innovate.closeModal();\">Close</a></div>" +
                              "</div>" +
                              "<div>" +
                              "<div id=\"mapPopupLoading\" style=\"position:relative; top:0px; left:0px; width:" + width + "px; height:" + height + "px; z-index:1003; margin:auto auto;  \"><div style=\"margin-top:" + Math.floor(height / 2) + "px;\"><div style=\"text-align:center; \">Loading...</div><div><img src=\"images/ajax-loader.gif\" /></div></div></div>" +
                              "<iframe name=\"innovateFullScreenFrame\" id=\"innovateFullScreenFrame\" src=\"getMap.html?width=" + (width) + "&height=" + (height - 24) + "&mapId=" + mapID + "&exHeight=105px" + "\" frameborder=\"0\" scrolling=\"no\" width=\"" + width + "\" height=\"" + (height - 24) + "\"></iframe>" +
                              "</div>", //note: this path will need to change when move servers
                      css: {
                          "position": "fixed",
                          "width": width,
                          "height": height,
                          "top": top,
                          "left": left
                      },
                      bindEvents: false
                  });
              }
          });
    }

    //Long Island Hypoxia 
    //Innovate Map #9
    this.ROE_LongIslandHypoxia2015 = function () {
        //var baseLayerType = this.innovateLayerObj.getBaseLayerType();
        //Add ESRI Map
        var roeMapLong;
        var compare, compare2;
        //alert(mapID);
        require([
          "esri/map",
          "esri/layers/ArcGISDynamicMapServiceLayer",
          "esri/layers/ImageParameters",
          "esri/InfoTemplate",
          "esri/layers/FeatureLayer",
          "esri/dijit/Legend",
          "esri/tasks/query",
          "esri/renderers/SimpleRenderer",
          "esri/symbols/SimpleFillSymbol",
          "esri/symbols/SimpleLineSymbol",
          "esri/dijit/BasemapToggle",
          "esri/dijit/Scalebar",
          "dojo/dom",
          "dojo/number",
          "dojo/on",
          "dojo/parser",
          "dojo/_base/array",
          "esri/Color",
          "dojo/string",
          "esri/request",
          "dojo/dom-style",
          "dijit/form/HorizontalSlider",
          "dijit/popup",
          "dijit/layout/BorderContainer",
          "dijit/layout/ContentPane",
          "dojox/layout/ExpandoPane",
          "dojo/domReady!"
        ],
          function (
            Map, ArcGISDynamicMapServiceLayer, ImageParameters, InfoTemplate, FeatureLayer, Legend, Query, SimpleRenderer, SimpleFillSymbol,
            SimpleLineSymbol, BasemapToggle, Scalebar, dom, number, on, parser, arrayUtils, Color, string, esriRequest, domStyle, HorizontalSlider, popup
        ) {

              //parser.parse(dom.byId("mframe" + mapID));
              parser.parse();

              //var restEnd = "http://geodata.epa.gov/arcgis/rest/services/ORD/"; //EPA Production Rest Endpoint
              //var restEnd = "http://gisstg.rtpnc.epa.gov/arcgis/rest/services/ord/"; //EPA Staging Rest Endpoint
              var restEnd = "http://it.innovateteam.com/arcgis/rest/services/ROE/"; //Innovate Rest Endpoint

              var layer, visibleLayerIds = []; //list of visible layers

              //Add map and set map properties
              roeMapLong = new Map("mapDiv" + mapID, {
                  basemap: "hybrid",  //hybrid, satellite
                  center: currentObject.config.center,
                  maxZoom: currentObject.config.endResolution,
                  minZoom: currentObject.config.startResolution,
                  zoom: currentObject.config.defaultZoomLevel,
                  logo: false,
                  sliderStyle: "large"
              });
              
              //Add Scalebar and set scalebar properties
              var scalebar = new Scalebar({
                  map: roeMapLong,
                  attachTo: "bottom-right",
                  scalebarUnit: "dual"
              });

              //Add Layers from map_Config
              var imageParameters = new ImageParameters();
              imageParameters.format = "jpeg"; //set the image type to PNG24, note default is PNG8.

              //Dynamically add layers specified in the Config file//
              //First layer in the list will be in the legend      //
              var dynamicMapSerives = [];

              //Find element that checkbox controls for visibility of layers will be appended into
              var layersContainer = document.getElementById("layer_list" + mapID);
              
              //Loop through layer list in the config file.
              for (var i = 0; i < currentObject.config.layers.length; i++) {
                  dynamicMapSerives[i] = new ArcGISDynamicMapServiceLayer(restEnd + currentObject.config.layers[i] + "/MapServer", {
                      "opacity": 1,
                      "imageParameters": imageParameters,
                  });  
              }
              //Add the layers to the map
              roeMapLong.addLayers(dynamicMapSerives);

              //test
              //for(var j = 0; j < roeMap.layerIds.length; j++) {
              //    var layer = roeMap.getLayer(roeMap.layerIds[j]);
              //    alert(layer.name + ' ' + layer.id + ' ' + layer.opacity + ' ' + layer.visible);
              //}
              //domStyle.set("dojox_layout_ExpandoPane_1", "height", "150px");
             

              //alert(currentObject.config.layers.length);
              //For each layer in the config file add a check box for the layers visibility. The element id includes the index for the layer
              for (var c = 0; c < currentObject.config.layers.length; c++) {
                  $(layersContainer).append("<input type=\"checkbox\" checked=\"True\" class=\"list_item\" id=\"layer_" + c + "_" + mapID + "\" value=0 />" + currentObject.config.layerDisplayName[c] + "<br />");
                  lyr = currentObject.config.layers[c];
                  on(dom.byId("layer_" + c + "_" + mapID), "change", updateRadonVisibility);
              }

              ////Radio button for Map layers visibility
              function updateRadonVisibility(evt) {
                  evt = evt || window.event;
                  //get the layer index from the element id
                  var lName = evt.target.id.split("_");
                  //If radio button is checked show Map layer
                  if (dom.byId(evt.target.id).checked) {
                      dynamicMapSerives[lName[1]].show();
                  } else {
                      dynamicMapSerives[lName[1]].hide();
                  }
              }

              //Create Horizontal Legend
              var url = restEnd + currentObject.config.legend.url + "?f=pjson";
              //alert(currentObject.config.legend.url);
              var requestHandle = esriRequest({
                  "url": url,
                  "content": {
                      "f": "json"
                  },
                  "callbackParamName": "callback"
              });
              requestHandle.then(requestSucceeded, requestFailed);
              function requestSucceeded(response, io) {
                  
                  var content = "";
                  //Loop through layers for the table of contents
                  for (var lIndex = 0; lIndex < 2; lIndex++) {
                      //Add title if specified in the config
                      if (typeof(currentObject.config.legend.layers[lIndex]) != "undefined") {
                          content = content + "<div class=\"innvateLegend\"><div><b>" + currentObject.config.legend.layers["1"] + "</b></div><table><tbody><tr>";
                      } else {
                          content = content + "<div class=\"innvateLegend\"><div><b></b></div><table><tbody><tr>";
                      }
                      //add legend componets for this layaer
                      var mLegend = response.layers[lIndex]["legend"];
                      var imgURL = "";
                      //alert(mLegend.length);
                      for (var i = 0; i < mLegend.length; i++) {
                          imgURL = restEnd + currentObject.config.layers[0] + "/MapServer/" + lIndex + "/images/" + mLegend[i]["url"];
                          //alert(mLegend[i]["label"]);
                          content = content + "<td valign=\"middle\" align=\"center\"><div><img alt=\"\" src=\"" + imgURL + "\"></div></td>" +
                              "<td valign=\"middle\" align=\"left\" style=\"padding: 3px 5px 0px 5px\">" + mLegend[i]["label"] + "</td>";
                      }
                      content = content + "</tr></tbody></table></div>";
                  }
                  //Add to the legend div
                  var legendContainer = document.getElementById("legendDiv" + mapID);
                  $(legendContainer).append(content);
                  
              }
              function requestFailed(error, io) {
                  alert("Failed");
              }
              //End Legend
              

              var slider = new HorizontalSlider({
                  name: "slider" + mapID,
                  value: 1,
                  minimum: 0,
                  maximum: 1,
                  intermediateChanges: true,
                  style: "width:200px;",
                  onChange: function (value) {
                      //dom.byId("sliderValue").value = value;
                      //map.getLayer(map.layerIds[1]).setOpacity(value);
                      dynamicMapSerives[0].setOpacity(value);
                  }
              }, "oslider" + mapID).startup();

              //Code for basemap radio buttons
              on(dom.byId("blayerS" + mapID), "change", updateBaseMap0);
              on(dom.byId("blayerG" + mapID), "change", updateBaseMap0);
              //switch base map based on checked radio button
              function updateBaseMap0() {
                  //alert(mapID);
                  if (dom.byId("blayerS" + mapID).checked) {
                      roeMapLong.setBasemap("hybrid");//hybrid
                  } else {
                      roeMapLong.setBasemap("gray");
                  }
              }

              //on mouse over 
              dojo.connect(roeMapLong, "onMouseOver", refreshMapPosition);
              //makes sur that the map is refreshed and positioned correctly
              function refreshMapPosition() {
                  //alert("on Map");
                  roeMapLong.resize();
                  roeMapLong.reposition();
              }

              //May need this at some point
              roeMapLong.resize();
              roeMapLong.reposition();

              //POPUPS
              //Query and infoWindow setup
              dojo.connect(roeMapLong, "onClick", lihExecuteQueryTask);
              dojo.connect(roeMapLong.infoWindow, "onHide", function () { roeMapLong.graphics.clear(); });
              lihQueryTask = new esri.tasks.QueryTask(restEnd + currentObject.config.layers[0] + "/MapServer/0");

              //Set query task
              lihQuery = new esri.tasks.Query();
              lihQuery.outSpatialReference = { "wkid": 102100 }; //3857
              lihQuery.returnGeometry = true;
              lihQuery.outFields = ["*"];

              //Execute query
              function lihExecuteQueryTask(evt) {
                roeMapLong.infoWindow.hide();    //Hide Popup
                roeMapLong.graphics.clear();     //Clear Graphics
                lihFeatureSet = null;        //Reset the Featureset
                //Gets the extent for where the user clicked on the map
                var extentGeom = pointToExtent(roeMapLong, evt.mapPoint, 5);

                //clicked location and execute query
                lihQuery.geometry = extentGeom;
                //builds the extent -where user clicked 
                function pointToExtent(hMap, point, toleranceInPixel) {
                    //calculate map coords represented per pixel
                    var pixelWidth = hMap.extent.getWidth() / hMap.width;
                    //calculate map coords for tolerance in pixel
                    var toleraceInMapCoords = toleranceInPixel * pixelWidth;
                    //calculate & return computed extent
                    return new esri.geometry.Extent(point.x - toleraceInMapCoords,
                                    point.y - toleraceInMapCoords,
                                    point.x + toleraceInMapCoords,
                                    point.y + toleraceInMapCoords,
                                    hMap.spatialReference);
                }
                //execute the query - if there are results call lihShowFeature
                lihQueryTask.execute(lihQuery, function (fset) {
                    //alert(fset.features.length);
                    if (fset.features.length === 1) {
                        lihShowFeature(fset.features[0], evt);
                    } else if (fset.features.length !== 0) {
                        alert("Multiple selected");
                        lihShowFeature(fset.features[0], evt);
                        //showFeatureSet(fset, evt);
                    }
                });
            }

            //Show feature that was clicked
            function lihShowFeature(feature, evt) {
                //alert("clicked on long Island");
                roeMapLong.graphics.clear();     //Clear graphics on the map

                //set graphic symbol
                var symbol = new esri.symbol.SimpleMarkerSymbol().setColor(new dojo.Color([0, 0, 0, 0.25])); //[255, 0, 0]
                feature.setSymbol(symbol);
                //Use to convert text to for Title to Title cas if need
                function toTitleCase(str) {
                    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
                }
                // Build text and layout for the popup
                var attr = feature.attributes;

                var title = "Dissolved oxygen concentration"; //+ ", " + toTitleCase(attr.StateName);
                var content = attr.Min_winkle + " mg/L";

                //Add graphics
                roeMapLong.graphics.add(feature);
                //Set title and content for the popup window
                roeMapLong.infoWindow.setTitle(title);
                roeMapLong.infoWindow.setContent(content);

                (evt) ? roeMapLong.infoWindow.show(evt.screenPoint, roeMapLong.getInfoWindowAnchor(evt.screenPoint)) : null;
                roeMapLong.infoWindow.resize(250, 120);
            }
              //END POPUPS

              //find FullScreen and layer Visisbility button elements on right side of Map
              var layerbutton = dojo.byId("expandIcon" + mapID),
                  wipeTarget = dojo.byId("layersNode" + mapID);

              //assign the Eventerhandlers for FullScreen and layer Visisbility button  
              on(layerbutton, "click", function (evt) {
                  if (domStyle.get(wipeTarget, "display") === "none") {
                      dojo.fx.wipeIn({ node: wipeTarget }).play();
                      dojo.attr("exIcon" + mapID, "src", "./scripts/innovate/images/minus2.png"); //note: these paths will need to change when move servers
                  } else {
                      dojo.fx.wipeOut({ node: wipeTarget }).play();
                      dojo.attr("exIcon" + mapID, "src", "./scripts/innovate/images/greenPlus2.gif"); //note: these paths will need to change when move servers
                  }

              });
             
                  
               //Find Full Screen button on right side of Map and connect EventHandler
               on(dom.byId("fullScreen" + mapID), "click", fullscreenMode);
              
              
              //FullScreen button EventHandler
              function fullscreenMode() {
                 
                  //add from innovat.js
                  var maxWidth = 1360, maxHeight = 1360
                , screenHeight = parseInt($(window).height())
                , screenWidth = parseInt($(window).width())
                , width = screenWidth, height = screenHeight
                , top = 0
                , left = 0
                , userConfig = innovate.getUserConfigForMap(mapID);
                  if (screenHeight > maxHeight || screenWidth > maxWidth) {
                      if (screenWidth > maxWidth) {
                          width = maxWidth;
                      } else {
                          width = screenWidth;
                      }
                      if (screenHeight > maxHeight) {
                          height = maxHeight;
                      } else {
                          height = screenHeight;
                      }
                      top = parseInt((screenHeight - height) / 2);
                      left = parseInt((screenWidth - width) / 2);
                  }
                  width = width - 6;
                  height = height - 6;

                  $.blockUI({
                      message: "<div id=\"mapPopupHeader\" style=\"cursor:pointer;height:24px;background-color:#9DB6DB;\">" +
                              "<div style=\"float:left; padding-left:10px;\">" + userConfig["header"] + "</div>" +
                              "<div style=\"float:right; padding-right:5px;\"><a href=\"javaScript:innovate.closeModal();\">Close</a></div>" +
                              "</div>" +
                              "<div>" +
                              "<div id=\"mapPopupLoading\" style=\"position:relative; top:0px; left:0px; width:" + width + "px; height:" + height + "px; z-index:1003; margin:auto auto;  \"><div style=\"margin-top:" + Math.floor(height / 2) + "px;\"><div style=\"text-align:center; \">Loading...</div><div><img src=\"images/ajax-loader.gif\" /></div></div></div>" +
                              "<iframe name=\"innovateFullScreenFrame\" id=\"innovateFullScreenFrame\" src=\"getMap.html?width=" + (width) + "&height=" + (height - 24) + "&mapId=" + mapID + "&exHeight=100px" + "\" frameborder=\"0\" scrolling=\"no\" width=\"" + width + "\" height=\"" + (height - 24) + "\"></iframe>" +
                              "</div>", //note: this path will need to change when move servers
                      css: {
                          "position": "fixed",
                          "width": width,
                          "height": height,
                          "top": top,
                          "left": left
                      },
                      bindEvents: false
                  });
              }
          });
    }

    //Areas with Acid-Sensitive waters
    //Innovate map #10
    this.ROE_AcidSensitiveWaters = function () {
        //var baseLayerType = this.innovateLayerObj.getBaseLayerType();
        //Add ESRI Map
        var roeMapAcid;
        var compare, compare2;
        //alert(mapID);
        require([
          "esri/map",
          "esri/layers/ArcGISDynamicMapServiceLayer",
          "esri/layers/ImageParameters",
          "esri/InfoTemplate",
          "esri/layers/FeatureLayer",
          "esri/dijit/Legend",
          "esri/tasks/query",
          "esri/renderers/SimpleRenderer",
          "esri/symbols/SimpleFillSymbol",
          "esri/symbols/SimpleLineSymbol",
          "esri/dijit/BasemapToggle",
          "esri/dijit/Scalebar",
          "dojo/dom",
          "dojo/number",
          "dojo/on",
          "dojo/parser",
          "dojo/_base/array",
          "esri/Color",
          "dojo/string",
          "esri/request",
          "dojo/dom-style",
          "dijit/form/HorizontalSlider",
          "dijit/popup",
          "dijit/layout/BorderContainer",
          "dijit/layout/ContentPane",
          "dojox/layout/ExpandoPane",
          "dojo/domReady!"
        ],
          function (
            Map, ArcGISDynamicMapServiceLayer, ImageParameters, InfoTemplate, FeatureLayer, Legend, Query, SimpleRenderer, SimpleFillSymbol,
            SimpleLineSymbol, BasemapToggle, Scalebar, dom, number, on, parser, arrayUtils, Color, string, esriRequest, domStyle, HorizontalSlider, popup
        ) {

              //parser.parse(dom.byId("mframe" + mapID));
              parser.parse();

              //var restEnd = "http://geodata.epa.gov/arcgis/rest/services/ORD/"; //EPA Production Rest Endpoint
              //var restEnd = "http://gisstg.rtpnc.epa.gov/arcgis/rest/services/ord/"; //EPA Staging Rest Endpoint
              var restEnd = "http://it.innovateteam.com/arcgis/rest/services/ROE/"; //Innovate Rest Endpoint

              var layer, visibleLayerIds = []; //list of visible layers

              //Add map and set map properties
              roeMapAcid = new Map("mapDiv" + mapID, {
                  basemap: "hybrid",
                  center: currentObject.config.center,
                  maxZoom: currentObject.config.endResolution,
                  minZoom: currentObject.config.startResolution,
                  zoom: currentObject.config.defaultZoomLevel, //Defaultzoomlevel from the config file
                  //showAttribution: false,
                  logo: false,
                  sliderStyle: "large"
              });

              //Add Scalebar and set scalebar properties
              var scalebar = new Scalebar({
                  map: roeMapAcid,
                  attachTo: "bottom-left",
                  scalebarUnit: "dual"
              });

              //Add Layers from map_Config
              var imageParameters = new ImageParameters();
              imageParameters.format = "jpeg"; //set the image type to PNG24, note default is PNG8.

              //Dynamically add layers specified in the Config file//
              //First layer in the list will be in the legend      //
              var dynamicMapSerives = [];

              //Find element that checkbox controls for visibility of layers will be appended into
              var layersContainer = document.getElementById("layer_list" + mapID);

              //Loop through layer list in the config file.
              for (var i = 0; i < currentObject.config.layers.length; i++) {
                  dynamicMapSerives[i] = new ArcGISDynamicMapServiceLayer(restEnd + currentObject.config.layers[i] + "/MapServer", {
                      //"opacity": 1,
                      "imageParameters": imageParameters,
                  });
              }
              //Add the layers to the map
              roeMapAcid.addLayers(dynamicMapSerives);

              //alert(currentObject.config.layers.length);
              //For each layer in the config file add a check box for the layers visibility. The element id includes the index for the layer
              for (var c = 0; c < currentObject.config.layers.length; c++) {
                  $(layersContainer).append("<input type=\"checkbox\" checked=\"True\" class=\"list_item\" id=\"layer_" + c + "_" + mapID + "\" value=0 />" + currentObject.config.layerDisplayName[c] + "<br />");
                  lyr = currentObject.config.layers[c];
                  on(dom.byId("layer_" + c + "_" + mapID), "change", updateRadonVisibility);
              }

              ////Radio button for Map layers visibility
              function updateRadonVisibility(evt) {
                  evt = evt || window.event;
                  //get the layer index from the element id
                  var lName = evt.target.id.split("_");
                  //If radio button is checked show Map layer
                  if (dom.byId(evt.target.id).checked) {
                      dynamicMapSerives[lName[1]].show();
                  } else {
                      dynamicMapSerives[lName[1]].hide();
                  }
              }

              //Create Horizontal Legend
              var url = restEnd + currentObject.config.legend.url + "?f=pjson";
              //alert(currentObject.config.legend.url);
              var requestHandle = esriRequest({
                  "url": url,
                  "content": {
                      "f": "json"
                  },
                  "callbackParamName": "callback"
              });
              requestHandle.then(requestSucceeded, requestFailed);
              function requestSucceeded(response, io) {

                  var content = "";
                  //Loop through layers for the table of contents
                  for (var lIndex = 0; lIndex < 2; lIndex++) {
                      //Add title if specified in the config
                      if (typeof (currentObject.config.legend.layers[lIndex]) != "undefined") {
                          content = content + "<div class=\"innvateLegend\"><div><b>" + currentObject.config.legend.layers[lIndex] + "</b></div><table><tbody><tr>";
                      } else {
                          content = content + "<div class=\"innvateLegend\"><div><b></b></div><table><tbody><tr>";
                      }
                      //add legend componets for this layaer
                      var mLegend = response.layers[lIndex]["legend"];
                      var imgURL = "";
                      //alert(mLegend.length);
                      for (var i = 0; i < mLegend.length; i++) {
                          imgURL = restEnd + currentObject.config.layers[0] + "/MapServer/" + lIndex + "/images/" + mLegend[i]["url"];
                          //alert(mLegend[i]["label"]);
                          content = content + "<td valign=\"middle\" align=\"center\"><div><img alt=\"\" src=\"" + imgURL + "\"></div></td>" +
                              "<td valign=\"middle\" align=\"left\" style=\"padding: 3px 50px 0px 5px\">" + mLegend[i]["label"] + "</td>";
                      }
                      content = content + "</tr></tbody></table></div>";
                  }
                  //Add to the legend div
                  var legendContainer = document.getElementById("legendDiv" + mapID);
                  $(legendContainer).append(content);

              }
              function requestFailed(error, io) {
                  alert("Failed");
              }
              //End Legend

              var slider = new HorizontalSlider({
                  name: "slider" + mapID,
                  value: 1,
                  minimum: 0,
                  maximum: 1,
                  intermediateChanges: true,
                  style: "width:200px;",
                  onChange: function (value) {
                      //dom.byId("sliderValue").value = value;
                      //map.getLayer(map.layerIds[1]).setOpacity(value);
                      dynamicMapSerives[0].setOpacity(value);
                  }
              }, "oslider" + mapID).startup();

              //Code for basemap radio buttons
              on(dom.byId("blayerS" + mapID), "change", updateBaseMap0);
              on(dom.byId("blayerG" + mapID), "change", updateBaseMap0);
              //switch base map based on checked radio button
              function updateBaseMap0() {
                  //alert(mapID);
                  if (dom.byId("blayerS" + mapID).checked) {
                      roeMapAcid.setBasemap("hybrid");
                  } else {
                      roeMapAcid.setBasemap("gray");
                  }
              }

              //on mouse over 
              dojo.connect(roeMapAcid, "onMouseOver", refreshMapPosition);
              //makes sur that the map is refreshed and positioned correctly
              function refreshMapPosition() {
                  //alert("on Map");
                  roeMapAcid.resize();
                  roeMapAcid.reposition();
              }

              this.map = roeMapAcid;
              rMap = roeMapAcid

              //May need this at some point
              roeMapAcid.resize();
              roeMapAcid.reposition();

              //Popups would go here

              //find FullScreen and layer Visisbility button elements on right side of Map
              var layerbutton = dojo.byId("expandIcon" + mapID),
                  wipeTarget = dojo.byId("layersNode" + mapID);

              //assign the Eventerhandlers for FullScreen and layer Visisbility button  
              on(layerbutton, "click", function (evt) {
                  if (domStyle.get(wipeTarget, "display") === "none") {
                      dojo.fx.wipeIn({ node: wipeTarget }).play();
                      dojo.attr("exIcon" + mapID, "src", "./scripts/innovate/images/minus2.png"); //note: these paths will need to change when move servers
                  } else {
                      dojo.fx.wipeOut({ node: wipeTarget }).play();
                      dojo.attr("exIcon" + mapID, "src", "./scripts/innovate/images/greenPlus2.gif"); //note: these paths will need to change when move servers
                  }

              });

              //Find Full Screen button on right side of Map and connect EventHandler
              on(dom.byId("fullScreen" + mapID), "click", fullscreenMode);

              //FullScreen button EventHandler
              function fullscreenMode() {

                  //add from innovat.js
                  var maxWidth = 1360, maxHeight = 1360
                , screenHeight = parseInt($(window).height())
                , screenWidth = parseInt($(window).width())
                , width = screenWidth, height = screenHeight
                , top = 0
                , left = 0
                , userConfig = innovate.getUserConfigForMap(mapID);
                  if (screenHeight > maxHeight || screenWidth > maxWidth) {
                      if (screenWidth > maxWidth) {
                          width = maxWidth;
                      } else {
                          width = screenWidth;
                      }
                      if (screenHeight > maxHeight) {
                          height = maxHeight;
                      } else {
                          height = screenHeight;
                      }
                      top = parseInt((screenHeight - height) / 2);
                      left = parseInt((screenWidth - width) / 2);
                  }
                  width = width - 6;
                  height = height - 6;

                  $.blockUI({
                      message: "<div id=\"mapPopupHeader\" style=\"cursor:pointer;height:24px;background-color:#9DB6DB;\">" +
                              "<div style=\"float:left; padding-left:10px;\">" + userConfig["header"] + "</div>" +
                              "<div style=\"float:right; padding-right:5px;\"><a href=\"javaScript:innovate.closeModal();\">Close</a></div>" +
                              "</div>" +
                              "<div>" +
                              "<div id=\"mapPopupLoading\" style=\"position:relative; top:0px; left:0px; width:" + width + "px; height:" + height + "px; z-index:1003; margin:auto auto;  \"><div style=\"margin-top:" + Math.floor(height / 2) + "px;\"><div style=\"text-align:center; \">Loading...</div><div><img src=\"images/ajax-loader.gif\" /></div></div></div>" +
                              "<iframe name=\"innovateFullScreenFrame\" id=\"innovateFullScreenFrame\" src=\"getMap.html?width=" + (width) + "&height=" + (height - 24) + "&mapId=" + mapID + "&exHeight=120px" + "\" frameborder=\"0\" scrolling=\"no\" width=\"" + width + "\" height=\"" + (height - 24) + "\"></iframe>" +
                              "</div>", //note: this path will need to change when move servers
                      css: {
                          "position": "fixed",
                          "width": width,
                          "height": height,
                          "top": top,
                          "left": left
                      },
                      bindEvents: false
                  });
              }
          });
    }

    //Wet Nitrate
    //Innovate Map # 11
    this.ROE_WetNitrateDeposition1989_1991 = function () {
        var compare, compare2;

        require([
          "esri/map",
          "esri/layers/ArcGISDynamicMapServiceLayer",
          "esri/layers/ImageParameters",
          "esri/InfoTemplate",
          "esri/dijit/Popup",
          "esri/dijit/PopupTemplate",
          "esri/layers/FeatureLayer",
          "esri/dijit/Legend",
          "esri/tasks/query",
          "esri/geometry/Extent",
          "esri/renderers/SimpleRenderer",
          "esri/symbols/SimpleMarkerSymbol",
          //"esri/symbols/SimpleFillSymbol",
          //"esri/symbols/SimpleLineSymbol",
          "esri/tasks/GeometryService",
          "dojo/dom-construct",
          "esri/dijit/BasemapToggle",
          "esri/dijit/Scalebar",
          "dojo/dom",
          "dojo/number",
          "dojo/on",
          "dojo/parser",
          "dojo/_base/array",
          "esri/Color",
          "dojo/string",
          "esri/request",
          "dojo/dom-style",
          "dijit/form/HorizontalSlider",
          "dijit/popup",
          "dijit/layout/BorderContainer",
          "dijit/layout/ContentPane",
          "dojox/layout/ExpandoPane",
          "dojo/domReady!"
        ],
          function (
            Map, ArcGISDynamicMapServiceLayer, ImageParameters, InfoTemplate, Popup, PopupTemplate, FeatureLayer, Legend, Query, Extent, SimpleRenderer, SimpleMarkerSymbol, GeometryService,
            domConstruct, BasemapToggle, Scalebar, dom, number, on, parser, arrayUtils, Color, string, esriRequest, domStyle, HorizontalSlider, popup
        ) {

              parser.parse();

              //var restEnd = "http://geodata.epa.gov/arcgis/rest/services/ORD/"; //EPA Production Rest Endpoint
              //var restEnd = "http://gisstg.rtpnc.epa.gov/arcgis/rest/services/ord/"; //EPA Staging Rest Endpoint
              var restEnd = "http://it.innovateteam.com/arcgis/rest/services/ROE/"; //Innovate Rest Endpoint

              esriConfig.defaults.geometryService = new GeometryService("http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
              var layer, visibleLayerIds = []; //list of visible layers

              //Add map and set map properties
              roeMapWetN = new Map("mapDiv" + mapID, {
                  basemap: "hybrid",  //satellite hybrid
                  center: currentObject.config.center,
                  extent: new Extent({
                      xmin: currentObject.config.zoomToExtent[0],
                      ymin: currentObject.config.zoomToExtent[1],
                      xmax: currentObject.config.zoomToExtent[2],
                      ymax: currentObject.config.zoomToExtent[3],
                      spatialReference: { "wkid": 3857 }
                  }),
                  maxZoom: currentObject.config.endResolution,
                  minZoom: currentObject.config.startResolution,
                  zoom: currentObject.config.startResolution, //currentObject.config.defaultZoomLevel, //Defaultzoomlevel from the config file
                  logo: false,
                  sliderStyle: "large"
              });

              //Add Scalebar and set scalebar properties
              var scalebar = new Scalebar({
                  map: roeMapWetN,
                  attachTo: "bottom-right",
                  scalebarUnit: "dual"
              });

              //Add Layers from map_Config
              var imageParameters = new ImageParameters();
              imageParameters.format = "jpeg"; //set the image type to PNG24, note default is PNG8.

              //Dynamically add layers specified in the Config file//
              //First layer in the list will be in the legend      //
              var dynamicMapSerives = [];

              //Find element that checkbox controls for visibility of layers will be appended into
              var layersContainer = document.getElementById("layer_list" + mapID);
              var layersYears = document.getElementById("layersNode" + mapID);

              //Hard code layers for now

              dynamicMapSerives[0] = new ArcGISDynamicMapServiceLayer("http://geodata.epa.gov/arcgis/rest/services/ORD/" + currentObject.config.layers[0] + "/MapServer", {
                  //"opacity": 1,
                  "imageParameters": imageParameters,
                  
              });
              dynamicMapSerives[1] = new ArcGISDynamicMapServiceLayer(restEnd + currentObject.config.layers[1] + "/MapServer", {
                  //"opacity": 1,
                  "imageParameters": imageParameters,
              });

              //Add the layers to the map
              roeMapWetN.addLayers(dynamicMapSerives);
              dynamicMapSerives[0].visible = false;

              //Add checkboxs for layer visibility
              $(layersContainer).append("<input type=\"checkbox\" class=\"list_item\" id=\"layer_" + 0 + "_" + mapID + "\" value=0 />" + currentObject.config.layerDisplayName[0] + "<br />");
              on(dom.byId("layer_" + 0 + "_" + mapID), "change", updateVisibility);
              $(layersContainer).append("<input type=\"checkbox\" checked=\"True\" class=\"list_item\" id=\"layer_" + 1 + "_" + mapID + "\" value=0 />" + currentObject.config.layerDisplayName[1] + "<br />");
              on(dom.byId("layer_" + 1 + "_" + mapID), "change", updateVisibility);

              ////checkboxc button for Map layers visibility
              function updateVisibility(evt) {
                  evt = evt || window.event;
                  //get the layer index from the element id
                  var lName = evt.target.id.split("_");
                  //If radio button is checked show Map layer
                  if (dom.byId(evt.target.id).checked) {
                      dynamicMapSerives[lName[1]].show();
                      domStyle.set("btn_" + lName[1] + "_" + mapID, {
                          background: "white",
                          color: "#64acf7"
                      });
                  } else {
                      dynamicMapSerives[lName[1]].hide();
                      domStyle.set("btn_" + lName[1] + "_" + mapID, {
                          background: "#64acf7",
                          color: "black"
                      });
                  }
              }

              //Add buttons onto the map for the years
              $(layersYears).after("<div id=\"dsetFrm\">" +
            "<input class=\"button1\" type=\"button\" name=\"old\" id=\"btn_0_" + mapID + "\" value=\"1989-1991\" style=\"background: white; color: #64acf7\" />" +
            "<input class=\"button1\" type=\"button\" name=\"new\" id=\"btn_1_" + mapID + "\" value=\"2011-2013\" checked=\"True\" style=\"background: #64acf7; color: black\" />" +
            "</div>");

              on(dom.byId("btn_0_" + mapID), "click", updateNitLayer);
              on(dom.byId("btn_1_" + mapID), "click", updateNitLayer);

              function updateNitLayer(evt) {
                  evt = evt || window.event;
                  var lName = evt.target.id.split("_");

                  if (lName[1] === "0") {
                      //alert(lName[1]);
                      dom.byId("layer_0_" + mapID).checked = true;
                      dom.byId("layer_1_" + mapID).checked = false;
                      dynamicMapSerives[0].show();
                      dynamicMapSerives[1].hide();
                      domStyle.set("btn_1_" + mapID, {
                          background: "white",
                          color: "#64acf7"
                      });
                      
                  } else {
                      //alert(lName[1]);
                      dom.byId("layer_0_" + mapID).checked = false;
                      dom.byId("layer_1_" + mapID).checked = true;
                      dynamicMapSerives[0].hide();
                      dynamicMapSerives[1].show();
                      domStyle.set("btn_0_" + mapID, {
                          background: "white",
                          color: "#64acf7"
                      });
                      
                  }
                  domStyle.set(evt.target, {
                      background: "#64acf7",
                      color: "black"
                  });

              }

              //Legend json request
              var content = "<div align=\"middle\"><img alt=\"\" align=\"middle\" src=\"" + currentObject.config.legend.url + "\"></div>"; //"<div class=\"innvateLegend\"><div></div>";
              //content = content + "<div><img alt=\"\" src=\"" + currentObject.config.legend.url + "\"></div>";
              var legendContainer = document.getElementById("legendDiv" + mapID);
              $(legendContainer).append(content);
              //End Legend

              //Add Opacity slider
              var slider = new HorizontalSlider({
                  name: "slider" + mapID,
                  value: 1,
                  minimum: 0,
                  maximum: 1,
                  intermediateChanges: true,
                  style: "width:200px;",
                  onChange: function (value) {
                      //dom.byId("sliderValue").value = value;
                      //map.getLayer(map.layerIds[1]).setOpacity(value);
                      dynamicMapSerives[0].setOpacity(value);

                      if (dynamicMapSerives[0].visible) {
                          dynamicMapSerives[0].setOpacity(value);
                      } else {
                          dynamicMapSerives[1].setOpacity(value);
                      }
                  }
              }, "oslider" + mapID).startup();

              //Code for basemap radio buttons
              on(dom.byId("blayerS" + mapID), "change", updateBaseMap0);
              on(dom.byId("blayerG" + mapID), "change", updateBaseMap0);
              //switch base map based on checked radio button
              function updateBaseMap0() {
                  //alert(mapID);
                  if (dom.byId("blayerS" + mapID).checked) {
                      roeMapWetN.setBasemap("hybrid");
                  } else {
                      roeMapWetN.setBasemap("gray");
                  }
              }

              //on mouse over 
              dojo.connect(roeMapWetN, "onMouseOver", refreshMapPosition);
              //makes sur that the map is refreshed and positioned correctly
              function refreshMapPosition() {
                  //alert("on Map");
                  roeMapWetN.resize();
                  roeMapWetN.reposition();
              }
              //May need this at some point
              roeMapWetN.resize();
              roeMapWetN.reposition();

              //No Popups

              //find FullScreen and layer Visisbility button elements on right side of Map
              var layerbutton = dojo.byId("expandIcon" + mapID),
                  wipeTarget = dojo.byId("layersNode" + mapID);

              //assign the Eventerhandlers for FullScreen and layer Visisbility button  
              on(layerbutton, "click", function (evt) {
                  if (domStyle.get(wipeTarget, "display") === "none") {
                      dojo.fx.wipeIn({ node: wipeTarget }).play();
                      dojo.attr("exIcon" + mapID, "src", "./scripts/innovate/images/minus2.png"); //note: these paths will need to change when move servers
                  } else {
                      dojo.fx.wipeOut({ node: wipeTarget }).play();
                      dojo.attr("exIcon" + mapID, "src", "./scripts/innovate/images/greenPlus2.gif"); //note: these paths will need to change when move servers
                  }

              });

              //Find Full Screen button on right side of Map and connect EventHandler
              on(dom.byId("fullScreen" + mapID), "click", fullscreenMode);

              //FullScreen button EventHandler
              function fullscreenMode() {

                  //add from innovat.js
                  var maxWidth = 1360, maxHeight = 1360
                , screenHeight = parseInt($(window).height())
                , screenWidth = parseInt($(window).width())
                , width = screenWidth, height = screenHeight
                , top = 0
                , left = 0
                , userConfig = innovate.getUserConfigForMap(mapID);
                  if (screenHeight > maxHeight || screenWidth > maxWidth) {
                      if (screenWidth > maxWidth) {
                          width = maxWidth;
                      } else {
                          width = screenWidth;
                      }
                      if (screenHeight > maxHeight) {
                          height = maxHeight;
                      } else {
                          height = screenHeight;
                      }
                      top = parseInt((screenHeight - height) / 2);
                      left = parseInt((screenWidth - width) / 2);
                  }
                  width = width - 6;
                  height = height - 6;

                  $.blockUI({
                      message: "<div id=\"mapPopupHeader\" style=\"cursor:pointer;height:24px;background-color:#9DB6DB;\">" +
                              "<div style=\"float:left; padding-left:10px;\">" + userConfig["header"] + "</div>" +
                              "<div style=\"float:right; padding-right:5px;\"><a href=\"javaScript:innovate.closeModal();\">Close</a></div>" +
                              "</div>" +
                              "<div>" +
                              "<div id=\"mapPopupLoading\" style=\"position:relative; top:0px; left:0px; width:" + width + "px; height:" + height + "px; z-index:1003; margin:auto auto;  \"><div style=\"margin-top:" + Math.floor(height / 2) + "px;\"><div style=\"text-align:center; \">Loading...</div><div><img src=\"images/ajax-loader.gif\" /></div></div></div>" +
                              "<iframe name=\"innovateFullScreenFrame\" id=\"innovateFullScreenFrame\" src=\"getMap.html?width=" + (width) + "&height=" + (height - 24) + "&mapId=" + mapID + "&exHeight=110px" + "\" frameborder=\"0\" scrolling=\"no\" width=\"" + width + "\" height=\"" + (height - 24) + "\"></iframe>" +
                              "</div>", //note: this path will need to change when move servers
                      css: {
                          "position": "fixed",
                          "width": width,
                          "height": height,
                          "top": top,
                          "left": left
                      },
                      bindEvents: false
                  });
              }

          });
    }

    //Wet Sulfate Deposition
    //Innovate Map # 13
    this.ROE_WetSulfateDeposition1989_1991 = function () {
        var compare, compare2;

        require([
          "esri/map",
          "esri/layers/ArcGISDynamicMapServiceLayer",
          "esri/layers/ImageParameters",
          "esri/InfoTemplate",
          "esri/dijit/Popup",
          "esri/dijit/PopupTemplate",
          "esri/layers/FeatureLayer",
          "esri/dijit/Legend",
          "esri/tasks/query",
          "esri/geometry/Extent",
          "esri/renderers/SimpleRenderer",
          "esri/symbols/SimpleMarkerSymbol",
          //"esri/symbols/SimpleFillSymbol",
          //"esri/symbols/SimpleLineSymbol",
          "esri/tasks/GeometryService",
          "dojo/dom-construct",
          "esri/dijit/BasemapToggle",
          "esri/dijit/Scalebar",
          "dojo/dom",
          "dojo/number",
          "dojo/on",
          "dojo/parser",
          "dojo/_base/array",
          "esri/Color",
          "dojo/string",
          "esri/request",
          "dojo/dom-style",
          "dijit/form/HorizontalSlider",
          "dijit/popup",
          "dijit/layout/BorderContainer",
          "dijit/layout/ContentPane",
          "dojox/layout/ExpandoPane",
          "dojo/domReady!"
        ],
          function (
            Map, ArcGISDynamicMapServiceLayer, ImageParameters, InfoTemplate, Popup, PopupTemplate, FeatureLayer, Legend, Query, Extent, SimpleRenderer, SimpleMarkerSymbol, GeometryService,
            domConstruct, BasemapToggle, Scalebar, dom, number, on, parser, arrayUtils, Color, string, esriRequest, domStyle, HorizontalSlider, popup
        ) {

              parser.parse();

              //var restEnd = "http://geodata.epa.gov/arcgis/rest/services/ORD/"; //EPA Production Rest Endpoint
              //var restEnd = "http://gisstg.rtpnc.epa.gov/arcgis/rest/services/ord/"; //EPA Staging Rest Endpoint
              var restEnd = "http://it.innovateteam.com/arcgis/rest/services/ROE/"; //Innovate Rest Endpoint

              esriConfig.defaults.geometryService = new GeometryService("http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
              var layer, visibleLayerIds = []; //list of visible layers

              //Add map and set map properties
              roeMapWetS = new Map("mapDiv" + mapID, {
                  basemap: "hybrid",  //satellite hybrid
                  center: currentObject.config.center,
                  extent: new Extent({
                      xmin: currentObject.config.zoomToExtent[0],
                      ymin: currentObject.config.zoomToExtent[1],
                      xmax: currentObject.config.zoomToExtent[2],
                      ymax: currentObject.config.zoomToExtent[3],
                      spatialReference: { "wkid": 3857 }
                  }),
                  maxZoom: currentObject.config.endResolution,
                  minZoom: currentObject.config.startResolution,
                  zoom: currentObject.config.startResolution, //currentObject.config.defaultZoomLevel, //Defaultzoomlevel from the config file
                  logo: false,
                  sliderStyle: "large"
              });

              //Add Scalebar and set scalebar properties
              var scalebar = new Scalebar({
                  map: roeMapWetS,
                  attachTo: "bottom-right",
                  scalebarUnit: "dual"
              });

              //Add Layers from map_Config
              var imageParameters = new ImageParameters();
              imageParameters.format = "jpeg"; //set the image type to PNG24, note default is PNG8.

              //Dynamically add layers specified in the Config file//
              //First layer in the list will be in the legend      //
              var dynamicMapSerives = [];

              //Find element that checkbox controls for visibility of layers will be appended into
              var layersContainer = document.getElementById("layer_list" + mapID);
              var layersYears = document.getElementById("layersNode" + mapID);

              //Hard code layers for now

              dynamicMapSerives[0] = new ArcGISDynamicMapServiceLayer("http://geodata.epa.gov/arcgis/rest/services/ORD/" + currentObject.config.layers[0] + "/MapServer", {
                  //"opacity": 1,
                  "imageParameters": imageParameters,

              });
              dynamicMapSerives[1] = new ArcGISDynamicMapServiceLayer(restEnd + currentObject.config.layers[1] + "/MapServer", {
                  //"opacity": 1,
                  "imageParameters": imageParameters,
              });

              //Add the layers to the map
              roeMapWetS.addLayers(dynamicMapSerives);
              dynamicMapSerives[0].visible = false;

              //Add checkboxs for layer visibility
              $(layersContainer).append("<input type=\"checkbox\" class=\"list_item\" id=\"layer_" + 0 + "_" + mapID + "\" value=0 />" + currentObject.config.layerDisplayName[0] + "<br />");
              on(dom.byId("layer_" + 0 + "_" + mapID), "change", updateVisibility);
              $(layersContainer).append("<input type=\"checkbox\" checked=\"True\" class=\"list_item\" id=\"layer_" + 1 + "_" + mapID + "\" value=0 />" + currentObject.config.layerDisplayName[1] + "<br />");
              on(dom.byId("layer_" + 1 + "_" + mapID), "change", updateVisibility);

              ////checkboxc button for Map layers visibility
              function updateVisibility(evt) {
                  evt = evt || window.event;
                  //get the layer index from the element id
                  var lName = evt.target.id.split("_");
                  //If radio button is checked show Map layer
                  if (dom.byId(evt.target.id).checked) {
                      dynamicMapSerives[lName[1]].show();
                      domStyle.set("btn_" + lName[1] + "_" + mapID, {
                          background: "white",
                          color: "#64acf7"
                      });
                  } else {
                      dynamicMapSerives[lName[1]].hide();
                      domStyle.set("btn_" + lName[1] + "_" + mapID, {
                          background: "#64acf7",
                          color: "black"
                      });
                  }
              }

              //Add buttons onto the map for the years
              $(layersYears).after("<div id=\"dsetFrm\">" +
            "<input class=\"button1\" type=\"button\" name=\"old\" id=\"btn_0_" + mapID + "\" value=\"1989-1991\" style=\"background: white; color: #64acf7\" />" +
            "<input class=\"button1\" type=\"button\" name=\"new\" id=\"btn_1_" + mapID + "\" value=\"2011-2013\" checked=\"True\" style=\"background: #64acf7; color: black\" />" +
            "</div>");

              on(dom.byId("btn_0_" + mapID), "click", updateSulfLayer);
              on(dom.byId("btn_1_" + mapID), "click", updateSulfLayer);

              function updateSulfLayer(evt) {
                  evt = evt || window.event;
                  var lName = evt.target.id.split("_");

                  if (lName[1] === "0") {
                      //alert(lName[1]);
                      dom.byId("layer_0_" + mapID).checked = true;
                      dom.byId("layer_1_" + mapID).checked = false;
                      dynamicMapSerives[0].show();
                      dynamicMapSerives[1].hide();
                      domStyle.set("btn_1_" + mapID, {
                          background: "white",
                          color: "#64acf7"
                      });

                  } else {
                      //alert(lName[1]);
                      dom.byId("layer_0_" + mapID).checked = false;
                      dom.byId("layer_1_" + mapID).checked = true;
                      dynamicMapSerives[0].hide();
                      dynamicMapSerives[1].show();
                      domStyle.set("btn_0_" + mapID, {
                          background: "white",
                          color: "#64acf7"
                      });

                  }
                  domStyle.set(evt.target, {
                      background: "#64acf7",
                      color: "black"
                  });

              }

              //Legend json request
              var content = "<div align=\"middle\"><img alt=\"\" align=\"middle\" src=\"" + currentObject.config.legend.url + "\"></div>"; //"<div class=\"innvateLegend\"><div></div>";
              //content = content + "<div><img alt=\"\" src=\"" + currentObject.config.legend.url + "\"></div>";
              var legendContainer = document.getElementById("legendDiv" + mapID);
              $(legendContainer).append(content);
              //End Legend

              //Add Opacity slider
              var slider = new HorizontalSlider({
                  name: "slider" + mapID,
                  value: 1,
                  minimum: 0,
                  maximum: 1,
                  intermediateChanges: true,
                  style: "width:200px;",
                  onChange: function (value) {
                      //dom.byId("sliderValue").value = value;
                      //map.getLayer(map.layerIds[1]).setOpacity(value);
                      dynamicMapSerives[0].setOpacity(value);

                      if (dynamicMapSerives[0].visible) {
                          dynamicMapSerives[0].setOpacity(value);
                      } else {
                          dynamicMapSerives[1].setOpacity(value);
                      }
                  }
              }, "oslider" + mapID).startup();

              //Code for basemap radio buttons
              on(dom.byId("blayerS" + mapID), "change", updateBaseMap0);
              on(dom.byId("blayerG" + mapID), "change", updateBaseMap0);
              //switch base map based on checked radio button
              function updateBaseMap0() {
                  //alert(mapID);
                  if (dom.byId("blayerS" + mapID).checked) {
                      roeMapWetS.setBasemap("hybrid");
                  } else {
                      roeMapWetS.setBasemap("gray");
                  }
              }

              //on mouse over 
              dojo.connect(roeMapWetS, "onMouseOver", refreshMapPosition);
              //makes sur that the map is refreshed and positioned correctly
              function refreshMapPosition() {
                  //alert("on Map");
                  roeMapWetS.resize();
                  roeMapWetS.reposition();
              }
              //May need this at some point
              roeMapWetS.resize();
              roeMapWetS.reposition();

              //No Popups

              //find FullScreen and layer Visisbility button elements on right side of Map
              var layerbutton = dojo.byId("expandIcon" + mapID),
                  wipeTarget = dojo.byId("layersNode" + mapID);

              //assign the Eventerhandlers for FullScreen and layer Visisbility button  
              on(layerbutton, "click", function (evt) {
                  if (domStyle.get(wipeTarget, "display") === "none") {
                      dojo.fx.wipeIn({ node: wipeTarget }).play();
                      dojo.attr("exIcon" + mapID, "src", "./scripts/innovate/images/minus2.png"); //note: these paths will need to change when move servers
                  } else {
                      dojo.fx.wipeOut({ node: wipeTarget }).play();
                      dojo.attr("exIcon" + mapID, "src", "./scripts/innovate/images/greenPlus2.gif"); //note: these paths will need to change when move servers
                  }

              });

              //Find Full Screen button on right side of Map and connect EventHandler
              on(dom.byId("fullScreen" + mapID), "click", fullscreenMode);

              //FullScreen button EventHandler
              function fullscreenMode() {

                  //add from innovat.js
                  var maxWidth = 1360, maxHeight = 1360
                , screenHeight = parseInt($(window).height())
                , screenWidth = parseInt($(window).width())
                , width = screenWidth, height = screenHeight
                , top = 0
                , left = 0
                , userConfig = innovate.getUserConfigForMap(mapID);
                  if (screenHeight > maxHeight || screenWidth > maxWidth) {
                      if (screenWidth > maxWidth) {
                          width = maxWidth;
                      } else {
                          width = screenWidth;
                      }
                      if (screenHeight > maxHeight) {
                          height = maxHeight;
                      } else {
                          height = screenHeight;
                      }
                      top = parseInt((screenHeight - height) / 2);
                      left = parseInt((screenWidth - width) / 2);
                  }
                  width = width - 6;
                  height = height - 6;

                  $.blockUI({
                      message: "<div id=\"mapPopupHeader\" style=\"cursor:pointer;height:24px;background-color:#9DB6DB;\">" +
                              "<div style=\"float:left; padding-left:10px;\">" + userConfig["header"] + "</div>" +
                              "<div style=\"float:right; padding-right:5px;\"><a href=\"javaScript:innovate.closeModal();\">Close</a></div>" +
                              "</div>" +
                              "<div>" +
                              "<div id=\"mapPopupLoading\" style=\"position:relative; top:0px; left:0px; width:" + width + "px; height:" + height + "px; z-index:1003; margin:auto auto;  \"><div style=\"margin-top:" + Math.floor(height / 2) + "px;\"><div style=\"text-align:center; \">Loading...</div><div><img src=\"images/ajax-loader.gif\" /></div></div></div>" +
                              "<iframe name=\"innovateFullScreenFrame\" id=\"innovateFullScreenFrame\" src=\"getMap.html?width=" + (width) + "&height=" + (height - 24) + "&mapId=" + mapID + "&exHeight=110px" + "\" frameborder=\"0\" scrolling=\"no\" width=\"" + width + "\" height=\"" + (height - 24) + "\"></iframe>" +
                              "</div>", //note: this path will need to change when move servers
                      css: {
                          "position": "fixed",
                          "width": width,
                          "height": height,
                          "top": top,
                          "left": left
                      },
                      bindEvents: false
                  });
              }

          });
    }

    //Total Nitrogen Deposition 
    //Innovate Map # 15
    this.ROE_TotalNitrogenDeposition1989_1991 = function () {
        var map, compare, compare2;

        require([
          "esri/map",
          "esri/layers/ArcGISDynamicMapServiceLayer",
          "esri/layers/ImageParameters",
          "esri/InfoTemplate",
          "esri/dijit/Popup",
          "esri/dijit/PopupTemplate",
          "esri/layers/FeatureLayer",
          "esri/dijit/Legend",
          "esri/tasks/query",
          "esri/geometry/Extent",
          "esri/renderers/SimpleRenderer",
          "esri/symbols/SimpleMarkerSymbol",
          //"esri/symbols/SimpleFillSymbol",
          //"esri/symbols/SimpleLineSymbol",
          "esri/tasks/GeometryService",
          "dojo/dom-construct",
          "esri/dijit/BasemapToggle",
          "esri/dijit/Scalebar",
          "dojo/dom",
          "dojo/number",
          "dojo/on",
          "dojo/parser",
          "dojo/_base/array",
          "esri/Color",
          "dojo/string",
          "dojo/dom-style",
          "dijit/form/HorizontalSlider",
          "dijit/popup",
          "dijit/layout/BorderContainer",
          "dijit/layout/ContentPane",
          "dojox/layout/ExpandoPane",
          "dojo/domReady!"
        ],
          function (
            Map, ArcGISDynamicMapServiceLayer, ImageParameters,InfoTemplate, Popup, PopupTemplate, FeatureLayer, Legend, Query, Extent, SimpleRenderer, SimpleMarkerSymbol, GeometryService, 
            domConstruct, BasemapToggle, Scalebar, dom, number, on, parser, arrayUtils, Color, string, domStyle, HorizontalSlider, popup
        ) {

              parser.parse();

              //var restEnd = "http://geodata.epa.gov/arcgis/rest/services/ORD/"; //EPA Rest Endpoint
              //var restEnd = "http://gisstg.rtpnc.epa.gov/arcgis/rest/services/ord/"; //EPA Staging Rest Endpoint
              var restEnd = "http://it.innovateteam.com/arcgis/rest/services/ROE/";

              esriConfig.defaults.geometryService = new GeometryService("http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
              var layer, visibleLayerIds = []; //list of visible layers

              //Add map and set map properties
              roeMapTNit = new Map("mapDiv" + mapID, {
                  basemap: currentObject.config.baseMap[0],  //satellite hybrid
                  center: currentObject.config.center,
                  maxZoom: currentObject.config.endResolution,
                  minZoom: currentObject.config.startResolution,
                  zoom: currentObject.config.defaultZoomLevel, //currentObject.config.defaultZoomLevel, //Defaultzoomlevel from the config file
                  logo: false,
                  sliderStyle: "large"
              });

              //Add Scalebar and set scalebar properties
              var scalebar = new Scalebar({
                  map: roeMapTNit,
                  attachTo: "bottom-left",
                  scalebarUnit: "dual"
              });

              //Add Layers from map_Config
              var imageParameters = new ImageParameters();
              imageParameters.format = "jpeg"; //set the image type to PNG24, note default is PNG8.

              //Dynamically add layers specified in the Config file//
              //First layer in the list will be in the legend      //
              var dynamicMapSerives = [];

              //Find element that checkbox controls for visibility of layers will be appended into
              var layersContainer = document.getElementById("layer_list" + mapID);
              var layersYears = document.getElementById("layersNode" + mapID);

              //Hard code layers for now
              dynamicMapSerives[0] = new ArcGISDynamicMapServiceLayer(restEnd + currentObject.config.layers[0] + "/MapServer", {
                  //"opacity": 1,
                  "imageParameters": imageParameters,
                  "visible": false
              });
              dynamicMapSerives[1] = new ArcGISDynamicMapServiceLayer(restEnd + currentObject.config.layers[1] + "/MapServer", {
                  //"opacity": 1,
                  "imageParameters": imageParameters,
              });
              //dynamicMapSerives[2] = new ArcGISDynamicMapServiceLayer("http://geodata.epa.gov/arcgis/rest/services/ORD/" + currentObject.config.layers[2] + "/MapServer", {
              //    //"opacity": 1,
              //    "imageParameters": imageParameters,
              //});
              
              //Loop through layer list in the config file.
              //for (var i = 0; i < currentObject.config.layers.length; i++) {
              //    dynamicMapSerives[i] = new ArcGISDynamicMapServiceLayer("http://geodata.epa.gov/arcgis/rest/services/ORD/" + currentObject.config.layers[i] + "/MapServer", {
              //        //"opacity": 1,
              //        "imageParameters": imageParameters,
              //    });
              //}
              //Add the layers to the map
              roeMapTNit.addLayers(dynamicMapSerives);

              $(layersContainer).append("<input type=\"checkbox\" class=\"list_item\" id=\"layer_" + 0 + "_" + mapID + "\" value=0 />" + currentObject.config.layerDisplayName[0] + "<br />");
              on(dom.byId("layer_" + 0 + "_" + mapID), "change", updateVisibility);
              $(layersContainer).append("<input type=\"checkbox\" checked=\"True\" class=\"list_item\" id=\"layer_" + 1 + "_" + mapID + "\" value=0 />" + currentObject.config.layerDisplayName[1] + "<br />");
              on(dom.byId("layer_" + 1 + "_" + mapID), "change", updateVisibility);
              //alert(currentObject.config.layers.length);
              //For each layer in the config file add a check box for the layers visibility. The element id includes the index for the layer
              //for (var c = 0; c < currentObject.config.layers.length; c++) {
              //    $(layersContainer).append("<input type=\"checkbox\" checked=\"True\" class=\"list_item\" id=\"layer_" + c + "_" + mapID + "\" value=0 />" + currentObject.config.layerDisplayName[c] + "<br />");
              //    lyr = currentObject.config.layers[c];
              //    on(dom.byId("layer_" + c + "_" + mapID), "change", updateVisibility);
              //}
              
              ////checkboxc button for Map layers visibility
              function updateVisibility(evt) {
                  evt = evt || window.event;
                  //get the layer index from the element id
                  var lName = evt.target.id.split("_");
                  //If radio button is checked show Map layer
                  if (dom.byId(evt.target.id).checked) {
                      dynamicMapSerives[lName[1]].show();
                      domStyle.set("btn_"+ lName[1]+ "_" + mapID, {
                          background: "white",
                          color: "#64acf7"
                      });
                  } else {
                      dynamicMapSerives[lName[1]].hide();
                      domStyle.set("btn_" +lName[1]+ "_" + mapID, {
                          background: "#64acf7",
                          color: "black"
                      });
                  }
              }

              //Add buttons onto the map for the years
              $(layersYears).after("<div id=\"dsetFrm\">" +
            "<input class=\"button1\" type=\"button\" name=\"old\" id=\"btn_0_" + mapID + "\" value=\"1989-1991\" style=\"background: white; color: #64acf7\" />" +
            "<input class=\"button1\" type=\"button\" name=\"new\" id=\"btn_1_" + mapID + "\" value=\"2011-2013\" checked=\"True\" style=\"background: #64acf7; color: black\" />" +  
            "</div>");

              on(dom.byId("btn_0_" + mapID), "click", updateNitLayer);
              on(dom.byId("btn_1_" + mapID), "click", updateNitLayer);

              function updateNitLayer(evt) {
                  evt = evt || window.event;
                  var lName = evt.target.id.split("_");
                  
                  if (lName[1] === "0") {
                      //alert(lName[1]);
                      dom.byId("layer_0_" + mapID).checked = true;
                      dom.byId("layer_1_" + mapID).checked = false;
                      dynamicMapSerives[0].show();
                      dynamicMapSerives[1].hide();  
                      domStyle.set("btn_1_" + mapID, {
                          background: "white",
                          color: "#64acf7"
                      });
                      queryTaskNit = new esri.tasks.QueryTask(restEnd + currentObject.config.layers[0] + "/MapServer/0");
                  } else {
                      //alert(lName[1]);
                      dom.byId("layer_0_" + mapID).checked = false;
                      dom.byId("layer_1_" + mapID).checked = true;
                      dynamicMapSerives[0].hide();
                      dynamicMapSerives[1].show();
                      domStyle.set("btn_0_" + mapID, {
                          background: "white",
                          color: "#64acf7"
                      }); 
                      queryTaskNit = new esri.tasks.QueryTask(restEnd + currentObject.config.layers[1] + "/MapServer/0");
                  }
                  domStyle.set(evt.target, {
                      background: "#64acf7",
                      color: "black"
                  });

              }

              //Legend goes here
              var content = "<div align=\"middle\"><img alt=\"\" align=\"middle\" src=\"" + currentObject.config.legend.url + "\"></div>"; //"<div class=\"innvateLegend\"><div></div>";
                        //content = content + "<div><img alt=\"\" src=\"" + currentObject.config.legend.url + "\"></div>";
                        var legendContainer = document.getElementById("legendDiv" + mapID);
                        $(legendContainer).append(content);

              var slider = new HorizontalSlider({
                  name: "slider" + mapID,
                  value: 1,
                  minimum: 0,
                  maximum: 1,
                  intermediateChanges: true,
                  style: "width:200px;",
                  onChange: function (value) {
                      //dom.byId("sliderValue").value = value;
                      //map.getLayer(map.layerIds[1]).setOpacity(value);
                      dynamicMapSerives[0].setOpacity(value);

                      if (dynamicMapSerives[0].visible) {
                          dynamicMapSerives[0].setOpacity(value);
                      } else {
                          dynamicMapSerives[1].setOpacity(value);
                      }
                  }
              }, "oslider" + mapID).startup();

              //Code for basemap radio buttons
              on(dom.byId("blayerS" + mapID), "change", updateBaseMap0);
              on(dom.byId("blayerG" + mapID), "change", updateBaseMap0);
              //switch base map based on checked radio button
              function updateBaseMap0() {
                  //alert(mapID);
                  if (dom.byId("blayerS" + mapID).checked) {
                      roeMapTNit.setBasemap(currentObject.config.baseMap[0]);
                  } else {
                      roeMapTNit.setBasemap(currentObject.config.baseMap[1]);
                  }
              }

              //on mouse over 
              dojo.connect(roeMapTNit, "onMouseOver", refreshMapPosition);
              //makes sur that the map is refreshed and positioned correctly
              function refreshMapPosition() {
                  //alert("on Map");
                  roeMapTNit.resize();
                  roeMapTNit.reposition();
              }

              //this.map = roeMap;
              //rMap = roeMap

              //May need this at some point
              roeMapTNit.resize();
              roeMapTNit.reposition();

              //Popup go here
              dojo.connect(roeMapTNit, "onClick", executeQueryTask);
              dojo.connect(roeMapTNit.infoWindow, "onHide", function () { roeMapTNit.graphics.clear(); });
              //alert(restEnd + currentObject.config.layers[0] + "/MapServer/0");
              queryTaskNit = new esri.tasks.QueryTask(restEnd + currentObject.config.layers[1] + "/MapServer/0");
              
              queryNit = new esri.tasks.Query();
              queryNit.outSpatialReference = { "wkid": 102100 };
              queryNit.returnGeometry = true;
              queryNit.outFields = ["*"];

              function executeQueryTask(evt) {
                  //Hide existing popups and clear existing graphics
                  roeMapTNit.infoWindow.hide();
                  roeMapTNit.graphics.clear();
                  featuresetNit = null;
                  //Create point user clicked and create an extent
                  var pt = new esri.geometry.Point(evt.mapPoint.x, evt.mapPoint.y, evt.mapPoint.spatialReference);
                  var mapWidth = roeMapTNit.extent.getWidth();
                  var pixelWidth = mapWidth / roeMapTNit.width;
                  var tolerance = 15 * pixelWidth;

                  var queryExtent = new esri.geometry.Extent(1, 1, tolerance, tolerance, evt.mapPoint.spatialReference);

                  
                  queryNit.geometry = queryExtent.centerAt(pt);//evt.mapPoint;//extent;
                  //alert(evt.mapPoint.x);
                  //Execute query
                  queryTaskNit.execute(queryNit, function (fsetN) {
                      //alert(fsetN.features.length);
                      if (fsetN.features.length === 1) {
                          
                          showFeature(fsetN.features[0], evt);
                      } else if (fsetN.features.length != 0) {
                          showFeature(fsetN.features[0], evt);
                          //alert(fset.features.length);
                          //alert(fset.feature[0].attributes["SITE_ID"] + " " + fset.feature[1].attributes["SITE_ID"]);
                      }
                      //alert(fset.features.length);
                  });

              }

              function showFeature(feature, evt) {
                  roeMapTNit.graphics.clear();
                  
                  //var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 2), new dojo.Color([255, 255, 255, 0]));
                  var symbol = new SimpleMarkerSymbol("circle", 32, null, new Color([0, 0, 0, 0.25]))
                  feature.setSymbol(symbol);

                  //function toTitleCase(str) {
                  //            return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
                  //        }

                  var attr = feature.attributes;
                  var title = "Nitrogen Deposition";

                  var content = "";
                 
                  //alert(queryTask.url);
                  if (queryTaskNit.url == (restEnd + currentObject.config.layers[1] + "/MapServer/0")) {
                      var percent = Math.round((parseFloat(attr["DRY_NITROG"]) * 100.0) / parseFloat(attr["TOTAL_NITR"]));
                      //alert("2014");
                      content = "";
                      content += "<div style=\"width:280px;\">"
                      content += "<div style=\" margin-bottom: 6px\"><img src=\"" + "images/pies/nitrogen/dry_" + percent + ".png" + "\" width=\"30px\" height=\"30px\"/></div>";
                      content += "<div style=\" margin-bottom: 6px\"><span style=\"border:1px solid #CCC; width:15px; height:15px;background-color:rgb(252,204,78);display:block; float: left; margin-right:4px;\"></span><span>Dry deposition : " + feature.attributes["DRY_NITROG"].toFixed(2) + " kg/ha</span></div>"
                      content += "<div style=\" margin-bottom: 6px\"><span style=\"border:1px solid #CCC; width:15px; height:15px;background-color:rgb(0,166,81);display:block; float: left; margin-right:4px;\"></span><span>Wet deposition : " + feature.attributes["WET_NITROG"].toFixed(2) + " kg/ha</span></div>"
                      content += "<div><span >Total : </span><span>" + feature.attributes["TOTAL_NITR"].toFixed(2) + " kg/ha</span></div>"
                      content += "</div>";
                  } else {
                      var percent = Math.round((parseFloat(attr["DRY_N"]) * 100.0) / parseFloat(attr["TOTAL_N"]));
                      //alert("1991");
                      content = "";
                      content += "<div style=\"width:280px;\">"
                      content += "<div style=\" margin-bottom: 6px\"><img src=\"" + "images/pies/nitrogen/dry_" + percent + ".png" + "\" width=\"30px\" height=\"30px\"/></div>";
                      content += "<div style=\" margin-bottom: 6px\"><span style=\"border:1px solid #CCC; width:15px; height:15px;background-color:rgb(252,204,78);display:block; float: left; margin-right:4px;\"></span><span>Dry deposition : " + feature.attributes["DRY_N"].toFixed(2) + " kg/ha</span></div>"
                      content += "<div style=\" margin-bottom: 6px\"><span style=\"border:1px solid #CCC; width:15px; height:15px;background-color:rgb(0,166,81);display:block; float: left; margin-right:4px;\"></span><span>Wet deposition : " + feature.attributes["WET_N"].toFixed(2) + " kg/ha</span></div>"
                      content += "<div><span >Total : </span><span>" + feature.attributes["TOTAL_N"].toFixed(2) + " kg/ha</span></div>"
                      content += "</div>";
                  }
                  
                  roeMapTNit.graphics.add(feature);

                  roeMapTNit.infoWindow.setTitle(title);
                  roeMapTNit.infoWindow.setContent(content);

                  (evt) ? roeMapTNit.infoWindow.show(evt.screenPoint, roeMapTNit.getInfoWindowAnchor(evt.screenPoint)) : null;
                  roeMapTNit.infoWindow.resize(300, 130);
              }
              //End popups

              //find FullScreen and layer Visisbility button elements on right side of Map
              var layerbutton = dojo.byId("expandIcon" + mapID),
                  wipeTarget = dojo.byId("layersNode" + mapID);

              //assign the Eventerhandlers for FullScreen and layer Visisbility button  
              on(layerbutton, "click", function (evt) {
                  if (domStyle.get(wipeTarget, "display") === "none") {
                      dojo.fx.wipeIn({ node: wipeTarget }).play();
                      dojo.attr("exIcon" + mapID, "src", "./scripts/innovate/images/minus2.png"); //note: these paths will need to change when move servers
                  } else {
                      dojo.fx.wipeOut({ node: wipeTarget }).play();
                      dojo.attr("exIcon" + mapID, "src", "./scripts/innovate/images/greenPlus2.gif"); //note: these paths will need to change when move servers
                  }

              });

              //Find Full Screen button on right side of Map and connect EventHandler
              on(dom.byId("fullScreen" + mapID), "click", fullscreenMode);

              //FullScreen button EventHandler
              function fullscreenMode() {

                  //add from innovat.js
                  var maxWidth = 1360, maxHeight = 1360
                , screenHeight = parseInt($(window).height())
                , screenWidth = parseInt($(window).width())
                , width = screenWidth, height = screenHeight
                , top = 0
                , left = 0
                , userConfig = innovate.getUserConfigForMap(mapID);
                  if (screenHeight > maxHeight || screenWidth > maxWidth) {
                      if (screenWidth > maxWidth) {
                          width = maxWidth;
                      } else {
                          width = screenWidth;
                      }
                      if (screenHeight > maxHeight) {
                          height = maxHeight;
                      } else {
                          height = screenHeight;
                      }
                      top = parseInt((screenHeight - height) / 2);
                      left = parseInt((screenWidth - width) / 2);
                  }
                  width = width - 6;
                  height = height - 6;

                  $.blockUI({
                      message: "<div id=\"mapPopupHeader\" style=\"cursor:pointer;height:24px;background-color:#9DB6DB;\">" +
                              "<div style=\"float:left; padding-left:10px;\">" + userConfig["header"] + "</div>" +
                              "<div style=\"float:right; padding-right:5px;\"><a href=\"javaScript:innovate.closeModal();\">Close</a></div>" +
                              "</div>" +
                              "<div>" +
                              "<div id=\"mapPopupLoading\" style=\"position:relative; top:0px; left:0px; width:" + width + "px; height:" + height + "px; z-index:1003; margin:auto auto;  \"><div style=\"margin-top:" + Math.floor(height / 2) + "px;\"><div style=\"text-align:center; \">Loading...</div><div><img src=\"images/ajax-loader.gif\" /></div></div></div>" +
                              "<iframe name=\"innovateFullScreenFrame\" id=\"innovateFullScreenFrame\" src=\"getMap.html?width=" + (width) + "&height=" + (height - 24) + "&mapId=" + mapID + "&exHeight=92px" + "\" frameborder=\"0\" scrolling=\"no\" width=\"" + width + "\" height=\"" + (height - 24) + "\"></iframe>" +
                              "</div>", //note: this path will need to change when move servers
                      css: {
                          "position": "fixed",
                          "width": width,
                          "height": height,
                          "top": top,
                          "left": left
                      },
                      bindEvents: false
                  });
              }

          });
    }

    //Total Sulfate Depostion
    //Innovate Map #17
    this.ROE_TotalSulfurDeposition1989_1991 = function () {
        var map, compare, compare2;

        require([
          "esri/map",
          "esri/layers/ArcGISDynamicMapServiceLayer",
          "esri/layers/ImageParameters",
          "esri/InfoTemplate",
          "esri/dijit/Popup",
          "esri/dijit/PopupTemplate",
          "esri/layers/FeatureLayer",
          "esri/dijit/Legend",
          "esri/tasks/query",
          "esri/geometry/Extent",
          "esri/renderers/SimpleRenderer",
          "esri/symbols/SimpleMarkerSymbol",
          //"esri/symbols/SimpleFillSymbol",
          //"esri/symbols/SimpleLineSymbol",
          "esri/tasks/GeometryService",
          "dojo/dom-construct",
          "esri/dijit/BasemapToggle",
          "esri/dijit/Scalebar",
          "dojo/dom",
          "dojo/number",
          "dojo/on",
          "dojo/parser",
          "dojo/_base/array",
          "esri/Color",
          "dojo/string",
          "dojo/dom-style",
          "dijit/form/HorizontalSlider",
          "dijit/popup",
          "dijit/layout/BorderContainer",
          "dijit/layout/ContentPane",
          "dojox/layout/ExpandoPane",
          "dojo/domReady!"
        ],
          function (
            Map, ArcGISDynamicMapServiceLayer, ImageParameters, InfoTemplate, Popup, PopupTemplate, FeatureLayer, Legend, Query, Extent, SimpleRenderer, SimpleMarkerSymbol, GeometryService,
            domConstruct, BasemapToggle, Scalebar, dom, number, on, parser, arrayUtils, Color, string, domStyle, HorizontalSlider, popup
        ) {

              parser.parse();

              //var restEnd = "http://geodata.epa.gov/arcgis/rest/services/ORD/"; //EPA Rest Endpoint
              //var restEnd = "http://gisstg.rtpnc.epa.gov/arcgis/rest/services/ord/"; //EPA Staging Rest Endpoint
              var restEnd = "http://it.innovateteam.com/arcgis/rest/services/ROE/";

              esriConfig.defaults.geometryService = new GeometryService("http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
              var layer, visibleLayerIds = []; //list of visible layers

              //Add map and set map properties
              roeMapSulf = new Map("mapDiv" + mapID, {
                  basemap: currentObject.config.baseMap[0],  //satellite hybrid
                  center: currentObject.config.center,
                  maxZoom: currentObject.config.endResolution,
                  minZoom: currentObject.config.startResolution,
                  zoom: currentObject.config.defaultZoomLevel, //currentObject.config.defaultZoomLevel, //Defaultzoomlevel from the config file
                  logo: false,
                  sliderStyle: "large"
              });

              //Add Scalebar and set scalebar properties
              var scalebar = new Scalebar({
                  map: roeMapSulf,
                  attachTo: "bottom-left",
                  scalebarUnit: "dual"
              });

              //Add Layers from map_Config
              var imageParameters = new ImageParameters();
              imageParameters.format = "jpeg"; //set the image type to PNG24, note default is PNG8.

              //Dynamically add layers specified in the Config file//
              //First layer in the list will be in the legend      //
              var dynamicMapSerives = [];

              //Find element that checkbox controls for visibility of layers will be appended into
              var layersContainer = document.getElementById("layer_list" + mapID);
              var layersYears = document.getElementById("layersNode" + mapID);

              //Hard code layers for now

              dynamicMapSerives[0] = new ArcGISDynamicMapServiceLayer(restEnd + currentObject.config.layers[0] + "/MapServer", {
                  //"opacity": 1,
                  "imageParameters": imageParameters,
                  "visible": false
              });
              dynamicMapSerives[1] = new ArcGISDynamicMapServiceLayer(restEnd + currentObject.config.layers[1] + "/MapServer", {
                  //"opacity": 1,
                  "imageParameters": imageParameters,
              });

              //Loop through layer list in the config file.
              //for (var i = 0; i < currentObject.config.layers.length; i++) {
              //    dynamicMapSerives[i] = new ArcGISDynamicMapServiceLayer("http://geodata.epa.gov/arcgis/rest/services/ORD/" + currentObject.config.layers[i] + "/MapServer", {
              //        //"opacity": 1,
              //        "imageParameters": imageParameters,
              //    });
              //}
              //Add the layers to the map
              roeMapSulf.addLayers(dynamicMapSerives);

              $(layersContainer).append("<input type=\"checkbox\" class=\"list_item\" id=\"layer_" + 0 + "_" + mapID + "\" value=0 />" + currentObject.config.layerDisplayName[0] + "<br />");
              on(dom.byId("layer_" + 0 + "_" + mapID), "change", updateVisibility);
              $(layersContainer).append("<input type=\"checkbox\" checked=\"True\" class=\"list_item\" id=\"layer_" + 1 + "_" + mapID + "\" value=0 />" + currentObject.config.layerDisplayName[1] + "<br />");
              on(dom.byId("layer_" + 1 + "_" + mapID), "change", updateVisibility);
              //alert(currentObject.config.layers.length);
              //For each layer in the config file add a check box for the layers visibility. The element id includes the index for the layer
              //for (var c = 0; c < currentObject.config.layers.length; c++) {
              //    $(layersContainer).append("<input type=\"checkbox\" checked=\"True\" class=\"list_item\" id=\"layer_" + c + "_" + mapID + "\" value=0 />" + currentObject.config.layerDisplayName[c] + "<br />");
              //    lyr = currentObject.config.layers[c];
              //    on(dom.byId("layer_" + c + "_" + mapID), "change", updateVisibility);
              //}

              //checkboxc button for Map layers visibility
              function updateVisibility(evt) {
                  evt = evt || window.event;
                  //get the layer index from the element id
                  var lName = evt.target.id.split("_");
                  //If radio button is checked show Map layer
                  if (dom.byId(evt.target.id).checked) {
                      dynamicMapSerives[lName[1]].show();
                      domStyle.set("btn_" + lName[1] + "_" + mapID, {
                          background: "white",
                          color: "#64acf7"
                      });
                  } else {
                      dynamicMapSerives[lName[1]].hide();
                      domStyle.set("btn_" + lName[1] + "_" + mapID, {
                          background: "#64acf7",
                          color: "black"
                      });
                  }
              }

              //Add buttons onto the map for the years
            $(layersYears).after("<div id=\"dsetFrm\">" +
            "<input class=\"button1\" type=\"button\" name=\"old\" id=\"btn_0_" + mapID + "\" value=\"1989-1991\" style=\"background: white; color: #64acf7\" />" +
            "<input class=\"button1\" type=\"button\" name=\"new\" id=\"btn_1_" + mapID + "\" value=\"2011-2013\" checked=\"True\" style=\"background: #64acf7; color: black\" />" +
            "</div>");

              on(dom.byId("btn_0_" + mapID), "click", updateSulfLayer);
              on(dom.byId("btn_1_" + mapID), "click", updateSulfLayer);

              function updateSulfLayer(evt) {
                  evt = evt || window.event;
                  var lName = evt.target.id.split("_");

                  if (lName[1] === "0") {
                      //alert(lName[1]);
                      dom.byId("layer_0_" + mapID).checked = true;
                      dom.byId("layer_1_" + mapID).checked = false;
                      dynamicMapSerives[0].show();
                      dynamicMapSerives[1].hide();
                      domStyle.set("btn_1_" + mapID, {
                          background: "white",
                          color: "#64acf7"
                      });
                      queryTask = new esri.tasks.QueryTask(restEnd + currentObject.config.layers[0] + "/MapServer/0");
                  } else {
                      //alert(lName[1]);
                      dom.byId("layer_0_" + mapID).checked = false;
                      dom.byId("layer_1_" + mapID).checked = true;
                      dynamicMapSerives[0].hide();
                      dynamicMapSerives[1].show();
                      domStyle.set("btn_0_" + mapID, {
                          background: "white",
                          color: "#64acf7"
                      });
                      queryTask = new esri.tasks.QueryTask(restEnd + currentObject.config.layers[1] + "/MapServer/0");
                  }
                  domStyle.set(evt.target, {
                      background: "#64acf7",
                      color: "black"
                  });

              }

              //Legend goes here
              var content = "<div align=\"center\"><img alt=\"\" align=\"middle\" src=\"" + currentObject.config.legend.url + "\"></div>"; //"<div class=\"innvateLegend\"><div></div>";
              //content = content + "<div><img alt=\"\" src=\"" + currentObject.config.legend.url + "\"></div>";
              var legendContainer = document.getElementById("legendDiv" + mapID);
              $(legendContainer).append(content);

              var slider = new HorizontalSlider({
                  name: "slider" + mapID,
                  value: 1,
                  minimum: 0,
                  maximum: 1,
                  intermediateChanges: true,
                  style: "width:200px;",
                  onChange: function (value) {
                      //dom.byId("sliderValue").value = value;
                      //map.getLayer(map.layerIds[1]).setOpacity(value);
                      dynamicMapSerives[0].setOpacity(value);

                      if (dynamicMapSerives[0].visible) {
                          dynamicMapSerives[0].setOpacity(value);
                      } else {
                          dynamicMapSerives[1].setOpacity(value);
                      }
                  }
              }, "oslider" + mapID).startup();

              //Code for basemap radio buttons
              on(dom.byId("blayerS" + mapID), "change", updateBaseMap0);
              on(dom.byId("blayerG" + mapID), "change", updateBaseMap0);
              //switch base map based on checked radio button
              function updateBaseMap0() {
                  //alert(mapID);
                  if (dom.byId("blayerS" + mapID).checked) {
                      roeMapSulf.setBasemap(currentObject.config.baseMap[0]);
                  } else {
                      roeMapSulf.setBasemap(currentObject.config.baseMap[1]);
                  }
              }

              //on mouse over 
              dojo.connect(roeMapSulf, "onMouseOver", refreshMapPosition);
              //makes sur that the map is refreshed and positioned correctly
              function refreshMapPosition() {
                  //alert("on Map");
                  roeMapSulf.resize();
                  roeMapSulf.reposition();
              }

              //May need this at some point
              roeMapSulf.resize();
              roeMapSulf.reposition();

              //Popup go here
              dojo.connect(roeMapSulf, "onClick", executeQueryTask);
              dojo.connect(roeMapSulf.infoWindow, "onHide", function () { roeMapSulf.graphics.clear(); });
              queryTask = new esri.tasks.QueryTask(restEnd + currentObject.config.layers[1] + "/MapServer/0");

              query = new esri.tasks.Query();
              query.outSpatialReference = { "wkid": 102100 };
              query.returnGeometry = true;
              query.outFields = ["*"];

              function executeQueryTask(evt) {

                  roeMapSulf.infoWindow.hide();
                  roeMapSulf.graphics.clear();
                  featureset = null;

                  var pt = new esri.geometry.Point(evt.mapPoint.x, evt.mapPoint.y, evt.mapPoint.spatialReference);
                  var mapWidth = roeMapSulf.extent.getWidth();
                  var pixelWidth = mapWidth / roeMapSulf.width;
                  var tolerance = 15 * pixelWidth;

                  var queryExtent = new esri.geometry.Extent(1, 1, tolerance, tolerance, evt.mapPoint.spatialReference);


                  query.geometry = queryExtent.centerAt(pt);//evt.mapPoint;//extent;
                  //alert(evt.mapPoint.x);
                  queryTask.execute(query, function (fset) {
                      if (fset.features.length === 1) {
                          showFeature(fset.features[0], evt);
                      } else if (fset.features.length != 0) {
                          showFeature(fset.features[0], evt);
                          //alert(fset.features.length);
                          //alert(fset.feature[0].attributes["SITE_ID"] + " " + fset.feature[1].attributes["SITE_ID"]);
                      }
                      //alert(fset.features.length);
                  });

              }

              function showFeature(feature, evt) {
                  roeMapSulf.graphics.clear();

                  //var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 2), new dojo.Color([255, 255, 255, 0]));
                  var symbol = new SimpleMarkerSymbol("circle", 32, null, new Color([0, 0, 0, 0.25]))
                  feature.setSymbol(symbol);

                  //function toTitleCase(str) {
                  //            return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
                  //        }

                  var attr = feature.attributes;
                  var title = "Sulfur Deposition";

                  var content = "";

                  //alert(queryTask.url);
                  if (queryTask.url == (restEnd + currentObject.config.layers[1] +"/MapServer/0")) {
                      var percent = Math.round((parseFloat(attr["Dry_Sulfur"]) * 100.0) / parseFloat(attr["TOTAL_SULF"]));
                      //alert("2014");
                      content = "";
                      content += "<div style=\"width:280px;\">"
                      content += "<div style=\" margin-bottom: 6px\"><img src=\"" + "images/pies/sulfur/dry_" + percent + ".png" + "\" width=\"30px\" height=\"30px\"/></div>";
                      content += "<div style=\" margin-bottom: 6px\"><span style=\"border:1px solid #CCC; width:15px; height:15px;background-color:rgb(255,205,78);display:block; float: left; margin-right:4px;\"></span><span>Dry deposition : " + feature.attributes["Dry_Sulfur"].toFixed(2) + " kg/ha</span></div>"
                      content += "<div style=\" margin-bottom: 6px\"><span style=\"border:1px solid #CCC; width:15px; height:15px;background-color:rgb(201,100,78);display:block; float: left; margin-right:4px;\"></span><span>Wet deposition : " + feature.attributes["Wet_Sulfur"].toFixed(2) + " kg/ha</span></div>"
                      content += "<div><span >Total : </span><span>" + feature.attributes["TOTAL_SULF"].toFixed(2) + " kg/ha</span></div>"
                      content += "</div>";
                  } else {
                      var percent = Math.round((parseFloat(attr["DRY_S"]) * 100.0) / parseFloat(attr["TOTAL_S"]));
                      //alert("1991");
                      content = "";
                      content += "<div style=\"width:280px;\">"
                      content += "<div style=\" margin-bottom: 6px\"><img src=\"" + "images/pies/sulfur/dry_" + percent + ".png" + "\" width=\"30px\" height=\"30px\"/></div>";
                      content += "<div style=\" margin-bottom: 6px\"><span style=\"border:1px solid #CCC; width:15px; height:15px;background-color:rgb(255,205,78);display:block; float: left; margin-right:4px;\"></span><span>Dry deposition : " + feature.attributes["DRY_S"].toFixed(2) + " kg/ha</span></div>"
                      content += "<div style=\" margin-bottom: 6px\"><span style=\"border:1px solid #CCC; width:15px; height:15px;background-color:rgb(201,100,78);display:block; float: left; margin-right:4px;\"></span><span>Wet deposition : " + feature.attributes["WET_S"].toFixed(2) + " kg/ha</span></div>"
                      content += "<div><span >Total : </span><span>" + feature.attributes["TOTAL_S"].toFixed(2) + " kg/ha</span></div>"
                      content += "</div>";
                  }

                  roeMapSulf.graphics.add(feature);

                  roeMapSulf.infoWindow.setTitle(title);
                  roeMapSulf.infoWindow.setContent(content);

                  (evt) ? roeMapSulf.infoWindow.show(evt.screenPoint, roeMapSulf.getInfoWindowAnchor(evt.screenPoint)) : null;
                  roeMapSulf.infoWindow.resize(300, 130);
              }
              //End popups

              //find FullScreen and layer Visisbility button elements on right side of Map
              var layerbutton = dojo.byId("expandIcon" + mapID),
                  wipeTarget = dojo.byId("layersNode" + mapID);

              //assign the Eventerhandlers for FullScreen and layer Visisbility button  
              on(layerbutton, "click", function (evt) {
                  if (domStyle.get(wipeTarget, "display") === "none") {
                      dojo.fx.wipeIn({ node: wipeTarget }).play();
                      dojo.attr("exIcon" + mapID, "src", "./scripts/innovate/images/minus2.png"); //note: these paths will need to change when move servers
                  } else {
                      dojo.fx.wipeOut({ node: wipeTarget }).play();
                      dojo.attr("exIcon" + mapID, "src", "./scripts/innovate/images/greenPlus2.gif"); //note: these paths will need to change when move servers
                  }

              });

              //Find Full Screen button on right side of Map and connect EventHandler
              on(dom.byId("fullScreen" + mapID), "click", fullscreenMode);

              //FullScreen button EventHandler
              function fullscreenMode() {

                  //add from innovat.js
                  var maxWidth = 1360, maxHeight = 1360
                , screenHeight = parseInt($(window).height())
                , screenWidth = parseInt($(window).width())
                , width = screenWidth, height = screenHeight
                , top = 0
                , left = 0
                , userConfig = innovate.getUserConfigForMap(mapID);
                  if (screenHeight > maxHeight || screenWidth > maxWidth) {
                      if (screenWidth > maxWidth) {
                          width = maxWidth;
                      } else {
                          width = screenWidth;
                      }
                      if (screenHeight > maxHeight) {
                          height = maxHeight;
                      } else {
                          height = screenHeight;
                      }
                      top = parseInt((screenHeight - height) / 2);
                      left = parseInt((screenWidth - width) / 2);
                  }
                  width = width - 6;
                  height = height - 6;

                  $.blockUI({
                      message: "<div id=\"mapPopupHeader\" style=\"cursor:pointer;height:24px;background-color:#9DB6DB;\">" +
                              "<div style=\"float:left; padding-left:10px;\">" + userConfig["header"] + "</div>" +
                              "<div style=\"float:right; padding-right:5px;\"><a href=\"javaScript:innovate.closeModal();\">Close</a></div>" +
                              "</div>" +
                              "<div>" +
                              "<div id=\"mapPopupLoading\" style=\"position:relative; top:0px; left:0px; width:" + width + "px; height:" + height + "px; z-index:1003; margin:auto auto;  \"><div style=\"margin-top:" + Math.floor(height / 2) + "px;\"><div style=\"text-align:center; \">Loading...</div><div><img src=\"images/ajax-loader.gif\" /></div></div></div>" +
                              "<iframe name=\"innovateFullScreenFrame\" id=\"innovateFullScreenFrame\" src=\"getMap.html?width=" + (width) + "&height=" + (height - 24) + "&mapId=" + mapID + "&exHeight=92px" + "\" frameborder=\"0\" scrolling=\"no\" width=\"" + width + "\" height=\"" + (height - 24) + "\"></iframe>" +
                              "</div>", //note: this path will need to change when move servers
                      css: {
                          "position": "fixed",
                          "width": width,
                          "height": height,
                          "top": top,
                          "left": left
                      },
                      bindEvents: false
                  });
              }

          });
    }

    //Ecological hubs and corridors
    //Innovate Map # 18
    this.ROE_EcologicalHubsAndCorridors = function () {
        var compare, compare2;

        require([
          "esri/map",
          "esri/layers/ArcGISDynamicMapServiceLayer",
          "esri/layers/ImageParameters",
          "esri/InfoTemplate",
          "esri/dijit/Popup",
          "esri/dijit/PopupTemplate",
          "esri/layers/FeatureLayer",
          "esri/dijit/Legend",
          "esri/tasks/query",
          "esri/geometry/Extent",
          "esri/renderers/SimpleRenderer",
          "esri/symbols/SimpleMarkerSymbol",
          //"esri/symbols/SimpleFillSymbol",
          //"esri/symbols/SimpleLineSymbol",
          "esri/tasks/GeometryService",
          "dojo/dom-construct",
          "esri/dijit/BasemapToggle",
          "esri/dijit/Scalebar",
          "dojo/dom",
          "dojo/number",
          "dojo/on",
          "dojo/parser",
          "dojo/_base/array",
          "esri/Color",
          "dojo/string",
          "esri/request",
          "dojo/dom-style",
          "dijit/form/HorizontalSlider",
          "dijit/popup",
          "dijit/layout/BorderContainer",
          "dijit/layout/ContentPane",
          "dojox/layout/ExpandoPane",
          "dojo/domReady!"
        ],
          function (
            Map, ArcGISDynamicMapServiceLayer, ImageParameters, InfoTemplate, Popup, PopupTemplate, FeatureLayer, Legend, Query, Extent, SimpleRenderer, SimpleMarkerSymbol, GeometryService,
            domConstruct, BasemapToggle, Scalebar, dom, number, on, parser, arrayUtils, Color, string, esriRequest, domStyle, HorizontalSlider, popup
        ) {

              parser.parse();

              var restEnd = "http://geodata.epa.gov/arcgis/rest/services/ORD/"; //EPA production Rest Endpoint
              //var restEnd = "http://gisstg.rtpnc.epa.gov/arcgis/rest/services/ord/"; //EPA Staging Rest Endpoint
              //var restEnd = "http://it.innovateteam.com/arcgis/rest/services/ROE/";

              //Add map and set map properties
              roeMapEco = new Map("mapDiv" + mapID, {
                  basemap: currentObject.config.baseMap[0], //"hybrid",  //satellite hybrid
                  center: currentObject.config.center,
                  //extent: new Extent({
                  //    xmin: currentObject.config.zoomToExtent[0],
                  //    ymin: currentObject.config.zoomToExtent[1],
                  //    xmax: currentObject.config.zoomToExtent[2],
                  //    ymax: currentObject.config.zoomToExtent[3],
                  //    spatialReference: { "wkid": 3857 }
                  //}),
                  maxZoom: currentObject.config.endResolution,
                  minZoom: currentObject.config.startResolution,
                  zoom: currentObject.config.defaultZoomLevel, //currentObject.config.defaultZoomLevel, //Defaultzoomlevel from the config file
                  logo: false,
                  sliderStyle: "large"
              });

              //Add Scalebar and set scalebar properties
              var scalebar = new Scalebar({
                  map: roeMapEco,
                  attachTo: "bottom-left",
                  scalebarUnit: "dual"
              });

              //Add Layers from map_Config
              var imageParameters = new ImageParameters();
              imageParameters.format = "jpeg"; //set the image type to PNG24, note default is PNG8.

              //Dynamically add layers specified in the Config file//
              //First layer in the list will be in the legend      //
              var dynamicMapSerives = [];

              //Find element that checkbox controls for visibility of layers will be appended into
              var layersContainer = document.getElementById("layer_list" + mapID);
              var layersYears = document.getElementById("layersNode" + mapID);

              //Add layers specified in the Config
              for (var i = 0; i < currentObject.config.layers.length; i++) {
                  dynamicMapSerives[i] = new ArcGISDynamicMapServiceLayer(restEnd + currentObject.config.layers[i] + "/MapServer", {
                      //"opacity": 1,
                      "imageParameters": imageParameters,
                  });
              }

              //Add the layers to the map
              roeMapEco.addLayers(dynamicMapSerives);

              //alert(currentObject.config.layers.length);
              //For each layer in the config file add a check box for the layers visibility. The element id includes the index for the layer
              for (var c = 0; c < currentObject.config.layers.length; c++) {
                  $(layersContainer).append("<input type=\"checkbox\" checked=\"True\" class=\"list_item\" id=\"layer_" + c + "_" + mapID + "\" value=0 />" + currentObject.config.layerDisplayName[c] + "<br />");
                  lyr = currentObject.config.layers[c];
                  on(dom.byId("layer_" + c + "_" + mapID), "change", updateNLCDVisibility);
              }

              ////Radio button for Map layers visibility
              function updateNLCDVisibility(evt) {
                  evt = evt || window.event;
                  //get the layer index from the element id
                  var lName = evt.target.id.split("_");
                  //If radio button is checked show Map layer
                  if (dom.byId(evt.target.id).checked) {
                      dynamicMapSerives[lName[1]].show();
                  } else {
                      dynamicMapSerives[lName[1]].hide();
                  }
              }

              //Legend json request
              var url = restEnd + currentObject.config.legend.url + "?f=pjson";
              //alert(currentObject.config.legend.url);
              var requestHandle = esriRequest({
                  "url": url,
                  "content": {
                      "f": "json"
                  },
                  "callbackParamName": "callback"
              });
              requestHandle.then(requestSucceeded, requestFailed);
              function requestSucceeded(response, io) {

                  var content = "";
                  content = content + "<div class=\"innvateLegend\"><div><b></b></div><table><tbody><tr>";
                  //Loop through layers for the table of contents
                  for (var lIndex = 0; lIndex < 2; lIndex++) {
                      //Add title if specified in the config
                      //if (typeof (currentObject.config.legend.layers[lIndex]) != "undefined") {
                      //    content = content + "<div class=\"innvateLegend\"><div><b>" + currentObject.config.legend.layers[lIndex] + "</b></div><table><tbody><tr>";
                      //} else {
                         
                      //}
                      //add legend componets for this layaer
                      var mLegend = response.layers[lIndex]["legend"];
                      var imgURL = "";
                      //alert(mLegend.length);
                      for (var i = 0; i < mLegend.length; i++) {
                          imgURL = restEnd + currentObject.config.layers[0] + "/MapServer/" + lIndex + "/images/" + mLegend[i]["url"];
                          //alert(mLegend[i]["label"]);
                          content = content + "<td valign=\"middle\" align=\"center\"><div><img alt=\"\" src=\"" + imgURL + "\"></div></td>" +
                              "<td valign=\"middle\" align=\"left\" style=\"padding: 3px 50px 0px 5px\">" + mLegend[i]["label"] + "</td>";
                      }
                      
                  }
                  content = content + "</tr></tbody></table></div>";
                  //Add to the legend div
                  var legendContainer = document.getElementById("legendDiv" + mapID);
                  $(legendContainer).append(content);

              }
              function requestFailed(error, io) {
                  alert("Failed");
              }
              //End Legend

              //Add Opacity slider
              var slider = new HorizontalSlider({
                  name: "slider" + mapID,
                  value: 1,
                  minimum: 0,
                  maximum: 1,
                  intermediateChanges: true,
                  style: "width:200px;",
                  onChange: function (value) {
                      //dom.byId("sliderValue").value = value;
                      //map.getLayer(map.layerIds[1]).setOpacity(value);
                      dynamicMapSerives[0].setOpacity(value);

                      if (dynamicMapSerives[0].visible) {
                          dynamicMapSerives[0].setOpacity(value);
                      } else {
                          dynamicMapSerives[1].setOpacity(value);
                      }
                  }
              }, "oslider" + mapID).startup();

              //Code for basemap radio buttons
              on(dom.byId("blayerS" + mapID), "change", updateBaseMap0);
              on(dom.byId("blayerG" + mapID), "change", updateBaseMap0);
              //switch base map based on checked radio button
              function updateBaseMap0() {
                  //alert(mapID);
                  if (dom.byId("blayerS" + mapID).checked) {
                      roeMapEco.setBasemap(currentObject.config.baseMap[0]);
                  } else {
                      roeMapEco.setBasemap(currentObject.config.baseMap[1]);
                  }
              }

              //on mouse over 
              dojo.connect(roeMapEco, "onMouseOver", refreshMapPosition);
              //makes sur that the map is refreshed and positioned correctly
              function refreshMapPosition() {
                  //alert("on Map");
                  roeMapEco.resize();
                  roeMapEco.reposition();
              }
              //May need this at some point
              roeMapEco.resize();
              roeMapEco.reposition();

              //No Popups

              //find FullScreen and layer Visisbility button elements on right side of Map
              var layerbutton = dojo.byId("expandIcon" + mapID),
                  wipeTarget = dojo.byId("layersNode" + mapID);

              //assign the Eventerhandlers for FullScreen and layer Visisbility button  
              on(layerbutton, "click", function (evt) {
                  if (domStyle.get(wipeTarget, "display") === "none") {
                      dojo.fx.wipeIn({ node: wipeTarget }).play();
                      dojo.attr("exIcon" + mapID, "src", "./scripts/innovate/images/minus2.png"); //note: these paths will need to change when move servers
                  } else {
                      dojo.fx.wipeOut({ node: wipeTarget }).play();
                      dojo.attr("exIcon" + mapID, "src", "./scripts/innovate/images/greenPlus2.gif"); //note: these paths will need to change when move servers
                  }

              });

              //Find Full Screen button on right side of Map and connect EventHandler
              on(dom.byId("fullScreen" + mapID), "click", fullscreenMode);

              //FullScreen button EventHandler
              function fullscreenMode() {

                  //add from innovat.js
                  var maxWidth = 1360, maxHeight = 1360
                , screenHeight = parseInt($(window).height())
                , screenWidth = parseInt($(window).width())
                , width = screenWidth, height = screenHeight
                , top = 0
                , left = 0
                , userConfig = innovate.getUserConfigForMap(mapID);
                  if (screenHeight > maxHeight || screenWidth > maxWidth) {
                      if (screenWidth > maxWidth) {
                          width = maxWidth;
                      } else {
                          width = screenWidth;
                      }
                      if (screenHeight > maxHeight) {
                          height = maxHeight;
                      } else {
                          height = screenHeight;
                      }
                      top = parseInt((screenHeight - height) / 2);
                      left = parseInt((screenWidth - width) / 2);
                  }
                  width = width - 6;
                  height = height - 6;

                  $.blockUI({
                      message: "<div id=\"mapPopupHeader\" style=\"cursor:pointer;height:24px;background-color:#9DB6DB;\">" +
                              "<div style=\"float:left; padding-left:10px;\">" + userConfig["header"] + "</div>" +
                              "<div style=\"float:right; padding-right:5px;\"><a href=\"javaScript:innovate.closeModal();\">Close</a></div>" +
                              "</div>" +
                              "<div>" +
                              "<div id=\"mapPopupLoading\" style=\"position:relative; top:0px; left:0px; width:" + width + "px; height:" + height + "px; z-index:1003; margin:auto auto;  \"><div style=\"margin-top:" + Math.floor(height / 2) + "px;\"><div style=\"text-align:center; \">Loading...</div><div><img src=\"images/ajax-loader.gif\" /></div></div></div>" +
                              "<iframe name=\"innovateFullScreenFrame\" id=\"innovateFullScreenFrame\" src=\"getMap.html?width=" + (width) + "&height=" + (height - 24) + "&mapId=" + mapID + "&exHeight=55px" + "\" frameborder=\"0\" scrolling=\"no\" width=\"" + width + "\" height=\"" + (height - 24) + "\"></iframe>" +
                              "</div>", //note: this path will need to change when move servers
                      css: {
                          "position": "fixed",
                          "width": width,
                          "height": height,
                          "top": top,
                          "left": left
                      },
                      bindEvents: false
                  });
              }

          });
    }

    //Gulf of Mexico Hypoxia
    //Innovate Map # 19
    this.ROE_GulfofMexicoHypoxia2014 = function () {
        
        //Add ESRI Map
        var roeMapGulf;
        var compare, compare2;
        //alert(mapID);
        require([
          "esri/map",
          "esri/layers/ArcGISDynamicMapServiceLayer",
          "esri/layers/ImageParameters",
          "esri/InfoTemplate",
          "esri/layers/FeatureLayer",
          "esri/dijit/Legend",
          "esri/tasks/query",
          "esri/renderers/SimpleRenderer",
          "esri/symbols/SimpleFillSymbol",
          "esri/symbols/SimpleLineSymbol",
          "esri/dijit/BasemapToggle",
          "esri/dijit/Scalebar",
          "dojo/dom",
          "dojo/number",
          "dojo/on",
          "dojo/parser",
          "dojo/_base/array",
          "esri/Color",
          "dojo/string",
          "esri/request",
          "dojo/dom-style",
          "dijit/form/HorizontalSlider",
          "dijit/popup",
          "dijit/layout/BorderContainer",
          "dijit/layout/ContentPane",
          "dojox/layout/ExpandoPane",
          "dojo/domReady!"
        ],
          function (
            Map, ArcGISDynamicMapServiceLayer, ImageParameters, InfoTemplate, FeatureLayer, Legend, Query, SimpleRenderer, SimpleFillSymbol,
            SimpleLineSymbol, BasemapToggle, Scalebar, dom, number, on, parser, arrayUtils, Color, string, esriRequest, domStyle, HorizontalSlider, popup
        ) {

              //parser.parse(dom.byId("mframe" + mapID));
              parser.parse();

              //var restEnd = "http://geodata.epa.gov/arcgis/rest/services/ORD/"; //EPA Production Rest Endpoint
              //var restEnd = "http://gisstg.rtpnc.epa.gov/arcgis/rest/services/ord/"; //EPA Staging Rest Endpoint
              var restEnd = "http://it.innovateteam.com/arcgis/rest/services/ROE/"; //Innovate Rest Endpoint

              var layer, visibleLayerIds = []; //list of visible layers

              //Add map and set map properties
              roeMapGulf = new Map("mapDiv" + mapID, {
                  basemap: currentObject.config.baseMap[0],  //hybrid, satellite
                  center: currentObject.config.center,
                  maxZoom: currentObject.config.endResolution,
                  minZoom: currentObject.config.startResolution,
                  zoom: currentObject.config.defaultZoomLevel,
                  logo: false,
                  sliderStyle: "large"
              });

              //Add Scalebar and set scalebar properties
              var scalebar = new Scalebar({
                  map: roeMapGulf,
                  attachTo: "bottom-right",
                  scalebarUnit: "dual"
              });

              //Add Layers from map_Config
              var imageParameters = new ImageParameters();
              imageParameters.format = "jpeg"; //set the image type to PNG24, note default is PNG8.

              //Dynamically add layers specified in the Config file//
              //First layer in the list will be in the legend      //
              var dynamicMapSerives = [];

              //Find element that checkbox controls for visibility of layers will be appended into
              var layersContainer = document.getElementById("layer_list" + mapID);

              //Loop through layer list in the config file.
              for (var i = 0; i < currentObject.config.layers.length; i++) {
                  dynamicMapSerives[i] = new ArcGISDynamicMapServiceLayer(restEnd + currentObject.config.layers[i] + "/MapServer", {
                      //"opacity": 1,
                      "imageParameters": imageParameters,
                  });  
              }
              //Add the layers to the map
              roeMapGulf.addLayers(dynamicMapSerives);

              //test
              //for(var j = 0; j < roeMap.layerIds.length; j++) {
              //    var layer = roeMap.getLayer(roeMap.layerIds[j]);
              //    alert(layer.name + ' ' + layer.id + ' ' + layer.opacity + ' ' + layer.visible);
              //}
              //domStyle.set("dojox_layout_ExpandoPane_1", "height", "150px");


              //alert(currentObject.config.layers.length);
              //For each layer in the config file add a check box for the layers visibility. The element id includes the index for the layer
              for (var c = 0; c < currentObject.config.layers.length; c++) {
                  $(layersContainer).append("<input type=\"checkbox\" checked=\"True\" class=\"list_item\" id=\"layer_" + c + "_" + mapID + "\" value=0 />" + currentObject.config.layerDisplayName[c] + "<br />");
                  lyr = currentObject.config.layers[c];
                  on(dom.byId("layer_" + c + "_" + mapID), "change", updateGulfVisibility);
              }

              ////Radio button for Map layers visibility
              function updateGulfVisibility(evt) {
                  evt = evt || window.event;
                  //get the layer index from the element id
                  var lName = evt.target.id.split("_");
                  //If radio button is checked show Map layer
                  if (dom.byId(evt.target.id).checked) {
                      dynamicMapSerives[lName[1]].show();
                  } else {
                      dynamicMapSerives[lName[1]].hide();
                  }
              }

              //Legend goes here
              var content = "<div align=\"center\"><img alt=\"\" align=\"middle\" src=\"" + currentObject.config.legend.url + "\"></div>"; //"<div class=\"innvateLegend\"><div></div>";
              //content = content + "<div><img alt=\"\" src=\"" + currentObject.config.legend.url + "\"></div>";
              var legendContainer = document.getElementById("legendDiv" + mapID);
              $(legendContainer).append(content);
              //End Legend


              var slider = new HorizontalSlider({
                  name: "slider" + mapID,
                  value: 1,
                  minimum: 0,
                  maximum: 1,
                  intermediateChanges: true,
                  style: "width:200px;",
                  onChange: function (value) {
                      //dom.byId("sliderValue").value = value;
                      //map.getLayer(map.layerIds[1]).setOpacity(value);
                      dynamicMapSerives[0].setOpacity(value);
                  }
              }, "oslider" + mapID).startup();

              //Code for basemap radio buttons
              on(dom.byId("blayerS" + mapID), "change", updateBaseMap0);
              on(dom.byId("blayerG" + mapID), "change", updateBaseMap0);
              //switch base map based on checked radio button
              function updateBaseMap0() {
                  //alert(mapID);
                  if (dom.byId("blayerS" + mapID).checked) {
                      roeMapGulf.setBasemap(currentObject.config.baseMap[0]);//hybrid
                  } else {
                      roeMapGulf.setBasemap(currentObject.config.baseMap[1]);
                  }
              }

              //on mouse over 
              dojo.connect(roeMapGulf, "onMouseOver", refreshMapPosition);
              //makes sur that the map is refreshed and positioned correctly
              function refreshMapPosition() {
                  //alert("on Map");
                  roeMapGulf.resize();
                  roeMapGulf.reposition();
              }

              //May need this at some point
              roeMapGulf.resize();
              roeMapGulf.reposition();

              //POPUPS
              //Query and infoWindow setup
              dojo.connect(roeMapGulf, "onClick", gulfExecuteQueryTask);
              dojo.connect(roeMapGulf.infoWindow, "onHide", function () { roeMapGulf.graphics.clear(); });
              QueryTaskGulf = new esri.tasks.QueryTask(restEnd + currentObject.config.layers[0] + "/MapServer/0");

              //Set query task
              gulfQuery = new esri.tasks.Query();
              gulfQuery.outSpatialReference = { "wkid": 102100 }; //3857
              gulfQuery.returnGeometry = true;
              gulfQuery.outFields = ["*"];

              //Execute query
              function gulfExecuteQueryTask(evt) {
                  roeMapGulf.infoWindow.hide();    //Hide Popup
                  roeMapGulf.graphics.clear();     //Clear Graphics
                  lihFeatureSet = null;        //Reset the Featureset
                  //Gets the extent for where the user clicked on the map
                  var extentGeom = pointToExtent(roeMapGulf, evt.mapPoint, 5);

                  //clicked location and execute query
                  gulfQuery.geometry = extentGeom;
                  //builds the extent -where user clicked 
                  function pointToExtent(hMap, point, toleranceInPixel) {
                      //calculate map coords represented per pixel
                      var pixelWidth = hMap.extent.getWidth() / hMap.width;
                      //calculate map coords for tolerance in pixel
                      var toleraceInMapCoords = toleranceInPixel * pixelWidth;
                      //calculate & return computed extent
                      return new esri.geometry.Extent(point.x - toleraceInMapCoords,
                                      point.y - toleraceInMapCoords,
                                      point.x + toleraceInMapCoords,
                                      point.y + toleraceInMapCoords,
                                      hMap.spatialReference);
                  }
                  //execute the query - if there are results call lihShowFeature
                  QueryTaskGulf.execute(gulfQuery, function (fset) {
                      //alert(fset.features.length);
                      if (fset.features.length === 1) {
                          gulfShowFeature(fset.features[0], evt);
                      } else if (fset.features.length !== 0) {
                          //alert("Multiple selected");
                          gulfShowFeature(fset.features[0], evt);
                          //showFeatureSet(fset, evt);
                      }
                  });
              }

              //Show feature that was clicked
              function gulfShowFeature(feature, evt) {
                  //alert("clicked on long Island");
                  roeMapGulf.graphics.clear();     //Clear graphics on the map

                  //set graphic symbol
                  var symbol = new esri.symbol.SimpleMarkerSymbol().setColor(new dojo.Color([0, 0, 0, 0.25])); //[255, 0, 0]
                  feature.setSymbol(symbol);
                  //Use to convert text to for Title to Title cas if need
                  function toTitleCase(str) {
                      return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
                  }
                  // Build text and layout for the popup
                  var attr = feature.attributes;
                  var lat = parseFloat(attr.Lat_dec).toFixed(2);
                  var long = parseFloat(attr.Long_dec).toFixed(2);

                  var title = lat + "&#176;N, " + long + "&#176;W"; //+ ", " + toTitleCase(attr.StateName);
                  var content = "<div> Dissolved oxygen concentration: " + attr.Bott_DO + " mg/L</div>"

                  //Add graphics
                  roeMapGulf.graphics.add(feature);
                  //Set title and content for the popup window
                  roeMapGulf.infoWindow.setTitle(title);
                  roeMapGulf.infoWindow.setContent(content);

                  (evt) ? roeMapGulf.infoWindow.show(evt.screenPoint, roeMapGulf.getInfoWindowAnchor(evt.screenPoint)) : null;
                  roeMapGulf.infoWindow.resize(300, 120);
              }
              //END POPUPS

              //find FullScreen and layer Visisbility button elements on right side of Map
              var layerbutton = dojo.byId("expandIcon" + mapID),
                  wipeTarget = dojo.byId("layersNode" + mapID);

              //assign the Eventerhandlers for FullScreen and layer Visisbility button  
              on(layerbutton, "click", function (evt) {
                  if (domStyle.get(wipeTarget, "display") === "none") {
                      dojo.fx.wipeIn({ node: wipeTarget }).play();
                      dojo.attr("exIcon" + mapID, "src", "./scripts/innovate/images/minus2.png"); //note: these paths will need to change when move servers
                  } else {
                      dojo.fx.wipeOut({ node: wipeTarget }).play();
                      dojo.attr("exIcon" + mapID, "src", "./scripts/innovate/images/greenPlus2.gif"); //note: these paths will need to change when move servers
                  }

              });


              //Find Full Screen button on right side of Map and connect EventHandler
              on(dom.byId("fullScreen" + mapID), "click", fullscreenMode);


              //FullScreen button EventHandler
              function fullscreenMode() {

                  //add from innovat.js
                  var maxWidth = 1360, maxHeight = 1360
                , screenHeight = parseInt($(window).height())
                , screenWidth = parseInt($(window).width())
                , width = screenWidth, height = screenHeight
                , top = 0
                , left = 0
                , userConfig = innovate.getUserConfigForMap(mapID);
                  if (screenHeight > maxHeight || screenWidth > maxWidth) {
                      if (screenWidth > maxWidth) {
                          width = maxWidth;
                      } else {
                          width = screenWidth;
                      }
                      if (screenHeight > maxHeight) {
                          height = maxHeight;
                      } else {
                          height = screenHeight;
                      }
                      top = parseInt((screenHeight - height) / 2);
                      left = parseInt((screenWidth - width) / 2);
                  }
                  width = width - 6;
                  height = height - 6;

                  $.blockUI({
                      message: "<div id=\"mapPopupHeader\" style=\"cursor:pointer;height:24px;background-color:#9DB6DB;\">" +
                              "<div style=\"float:left; padding-left:10px;\">" + userConfig["header"] + "</div>" +
                              "<div style=\"float:right; padding-right:5px;\"><a href=\"javaScript:innovate.closeModal();\">Close</a></div>" +
                              "</div>" +
                              "<div>" +
                              "<div id=\"mapPopupLoading\" style=\"position:relative; top:0px; left:0px; width:" + width + "px; height:" + height + "px; z-index:1003; margin:auto auto;  \"><div style=\"margin-top:" + Math.floor(height / 2) + "px;\"><div style=\"text-align:center; \">Loading...</div><div><img src=\"images/ajax-loader.gif\" /></div></div></div>" +
                              "<iframe name=\"innovateFullScreenFrame\" id=\"innovateFullScreenFrame\" src=\"getMap.html?width=" + (width) + "&height=" + (height - 24) + "&mapId=" + mapID + "&exHeight=90px" + "\" frameborder=\"0\" scrolling=\"no\" width=\"" + width + "\" height=\"" + (height - 24) + "\"></iframe>" +
                              "</div>", //note: this path will need to change when move servers
                      css: {
                          "position": "fixed",
                          "width": width,
                          "height": height,
                          "top": top,
                          "left": left
                      },
                      bindEvents: false
                  });
              }
          });
    }

    //Biomass Per Square Mile
    //Innovate Map # 21
    this.ROE_BiomassPerSquareMile = function () {
        //var baseLayerType = this.innovateLayerObj.getBaseLayerType();
        //Add ESRI Map
        var roeMapBio;
        var compare, compare2;
        //alert(mapID);
        require([
          "esri/map",
          "esri/layers/ArcGISDynamicMapServiceLayer",
          "esri/layers/ImageParameters",
          "esri/InfoTemplate",
          "esri/layers/FeatureLayer",
          "esri/dijit/Legend",
          "esri/tasks/query",
          "esri/geometry/Extent",
          "esri/renderers/SimpleRenderer",
          "esri/symbols/SimpleFillSymbol",
          "esri/symbols/SimpleLineSymbol",
          "esri/dijit/BasemapToggle",
          "esri/dijit/Scalebar",
          "dojo/dom",
          "dojo/number",
          "dojo/on",
          "dojo/parser",
          "dojo/_base/array",
          "esri/Color",
          "dojo/string",
          "esri/request",
          "dojo/dom-style",
          "dijit/form/HorizontalSlider",
          "dijit/popup",
          "dijit/layout/BorderContainer",
          "dijit/layout/ContentPane",
          "dojox/layout/ExpandoPane",
          "dojo/domReady!"
        ],
          function (
            Map, ArcGISDynamicMapServiceLayer, ImageParameters, InfoTemplate, FeatureLayer, Legend, Query, Extent, SimpleRenderer, SimpleFillSymbol,
            SimpleLineSymbol, BasemapToggle, Scalebar, dom, number, on, parser, arrayUtils, Color, string, esriRequest, domStyle, HorizontalSlider, popup
        ) {

              //parser.parse(dom.byId("mframe" + mapID));
              parser.parse();

              //var restEnd = "http://geodata.epa.gov/arcgis/rest/services/ORD/"; //EPA Production Rest Endpoint
              //var restEnd = "http://gisstg.rtpnc.epa.gov/arcgis/rest/services/ord/"; //EPA Staging Rest Endpoint
              var restEnd = "http://it.innovateteam.com/arcgis/rest/services/ROE/";

              //Add map and set map properties
              roeMapBio = new Map("mapDiv" + mapID, {
                  basemap: currentObject.config.baseMap[0],
                  center: currentObject.config.center,
                  //extent: new Extent({
                  //    xmin: currentObject.config.zoomToExtent[0],
                  //    ymin: currentObject.config.zoomToExtent[1],
                  //    xmax: currentObject.config.zoomToExtent[2],
                  //    ymax: currentObject.config.zoomToExtent[3],
                  //    spatialReference: { "wkid": 3857 }
                  //}),
                  maxZoom: currentObject.config.endResolution,
                  minZoom: currentObject.config.startResolution,
                  zoom: currentObject.config.defaultZoomLevel, //Defaultzoomlevel from the config file
                  logo: false,
                  sliderStyle: "large"
              });

              //Add Scalebar and set scalebar properties
              var scalebar = new Scalebar({
                  map: roeMapBio,
                  attachTo: "bottom-right",
                  scalebarUnit: "dual"
              });

              //Add Layers from map_Config
              var imageParameters = new ImageParameters();
              imageParameters.format = "jpeg"; //set the image type to PNG24, note default is PNG8.

              //Dynamically add layers specified in the Config file//
              //First layer in the list will be in the legend      //
              var dynamicMapSerives = [];

              //Find element that checkbox controls for visibility of layers will be appended into
              var layersContainer = document.getElementById("layer_list" + mapID);

              //Loop through layer list in the config file.
              for (var i = 0; i < currentObject.config.layers.length; i++) {
                  dynamicMapSerives[i] = new ArcGISDynamicMapServiceLayer(restEnd + currentObject.config.layers[i] + "/MapServer", {
                      //"opacity": 1,
                      "imageParameters": imageParameters,
                  });
              }
              //Add the layers to the map
              roeMapBio.addLayers(dynamicMapSerives);

              //alert(currentObject.config.layers.length);
              //For each layer in the config file add a check box for the layers visibility. The element id includes the index for the layer
              for (var c = 0; c < currentObject.config.layers.length; c++) {
                  $(layersContainer).append("<input type=\"checkbox\" checked=\"True\" class=\"list_item\" id=\"layer_" + c + "_" + mapID + "\" value=0 />" + currentObject.config.layerDisplayName[c] + "<br />");
                  lyr = currentObject.config.layers[c];
                  on(dom.byId("layer_" + c + "_" + mapID), "change", updateBioVisibility);
              }

              ////Radio button for Map layers visibility
              function updateBioVisibility(evt) {
                  evt = evt || window.event;
                  //get the layer index from the element id
                  var lName = evt.target.id.split("_");
                  //If radio button is checked show Map layer
                  if (dom.byId(evt.target.id).checked) {
                      dynamicMapSerives[lName[1]].show();
                  } else {
                      dynamicMapSerives[lName[1]].hide();
                  }
              }
              
              //Create Horizontal Legend
              var url = restEnd + currentObject.config.legend.url + "?f=pjson";
              //alert(currentObject.config.legend.url);
              var requestHandle = esriRequest({
                  "url": url,
                  "content": {
                      "f": "json"
                  },
                  "callbackParamName": "callback"
              });
              requestHandle.then(requestSucceeded, requestFailed);
              function requestSucceeded(response, io) {
                  
                  var content = "";
                  //Loop through layers for the table of contents
                  for (var lIndex = 0; lIndex < 3; lIndex++) {
                      //Add title if specified in the config
                      if (currentObject.config.legend.discard[lIndex] != "Y" ) { 
                          if (typeof (currentObject.config.legend.layers[lIndex]) != "undefined") {
                              content = content + "<div class=\"innvateLegend\"><div><b>" + currentObject.config.legend.layers["1"] + "</b></div><table><tbody><tr>";
                          } else {
                              content = content + "<div class=\"innvateLegend\"><div><b></b></div><table><tbody><tr>";
                          }
                          //add legend componets for this layaer
                          var mLegend = response.layers[lIndex]["legend"];
                          var imgURL = "";
                          //alert(mLegend.length);
                          for (var i = 0; i < mLegend.length; i++) {
                              imgURL = restEnd + currentObject.config.layers[0] + "/MapServer/" + lIndex + "/images/" + mLegend[i]["url"];
                              //alert(mLegend[i]["label"]);
                              content = content + "<td valign=\"middle\" align=\"center\"><div><img alt=\"\" src=\"" + imgURL + "\"></div></td>" +
                                  "<td valign=\"middle\" align=\"left\" style=\"padding: 3px 70px 0px 5px\">" + mLegend[i]["label"] + "</td>";
                          }
                          content = content + "</tr></tbody></table></div>";
                      }
                  }
                  //Add to the legend div
                  var legendContainer = document.getElementById("legendDiv" + mapID);
                  $(legendContainer).append(content);

              }
              function requestFailed(error, io) {
                  alert("Failed");
              }
              //End Legend

              var oSlider = document.getElementById(".dojoxExpandTitle");
              var slider = new HorizontalSlider({
                  name: "slider" + mapID,
                  title: "Opacity",
                  value: 1,
                  minimum: 0,
                  maximum: 1,
                  intermediateChanges: true,
                  style: "width:200px;",
                  onChange: function (value) {
                      //dom.byId("sliderValue").value = value;
                      //map.getLayer(map.layerIds[1]).setOpacity(value);
                      dynamicMapSerives[0].setOpacity(value);
                  }
              }, "oslider" + mapID).startup(); //"slider" + mapID

              //Code for basemap radio buttons
              on(dom.byId("blayerS" + mapID), "change", updateBaseMap0);
              on(dom.byId("blayerG" + mapID), "change", updateBaseMap0);
              //switch base map based on checked radio button
              function updateBaseMap0() {
                  //alert(mapID);
                  if (dom.byId("blayerS" + mapID).checked) {
                      roeMapBio.setBasemap(currentObject.config.baseMap[0]);
                  } else {
                      roeMapBio.setBasemap(currentObject.config.baseMap[1]);
                  }
              }

              //on mouse over 
              dojo.connect(roeMapBio, "onMouseOver", refreshMapPosition);
              //makes sur that the map is refreshed and positioned correctly
              function refreshMapPosition() {
                  //alert("on Map");
                  roeMapBio.resize();
                  roeMapBio.reposition();
              }

              //May need this at some point
              roeMapBio.resize();
              roeMapBio.reposition();

              //Query and infoWindow setup
              dojo.connect(roeMapBio, "onClick", executeBioQueryTask);
              dojo.connect(roeMapBio.infoWindow, "onHide", function () { roeMapBio.graphics.clear(); });
              queryTaskBio = new esri.tasks.QueryTask(restEnd + currentObject.config.layers[0] + "/MapServer/1");
              //alert("http://it.innovateteam.com/arcgis/rest/services/ROE/" + currentObject.config.layers[0] + "/MapServer/1");
              //Set query task
              queryBio = new esri.tasks.Query();
              queryBio.outSpatialReference = { "wkid": 3857 };
              queryBio.returnGeometry = true;
              queryBio.outFields = ["*"];

              //Execute query
              function executeBioQueryTask(evt) {

                  roeMapBio.infoWindow.hide();    //Hide Popup
                  roeMapBio.graphics.clear();     //Clear Graphics
                  featureSet = null;        //Reset the Featureset

                  //Find clicked location and execute query
                  queryBio.geometry = evt.mapPoint;
                  queryTaskBio.execute(queryBio, function (fset) {
                      //showFeature(fset.features[0], evt);
                      if (fset.features.length === 1) {
                          //this[controlName]();
                          showFeature(fset.features[0], evt);
                      } else if (fset.features.length !== 0) {
                          showFeatureSet(fset, evt);
                      }
                  });
              }

              //Show feature that was clicked
              function showFeature(feature, evt) {
                  roeMapBio.graphics.clear();     //Clear graphics on the map
                  
                    //set graphic symbol
                    var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 2), new dojo.Color([255, 255, 255, 0]));
                    feature.setSymbol(symbol);

                    function toTitleCase(str) {
                        return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
                    }
                   
                    // Build text and layout for the popup
                    var attr = feature.attributes;
                   
                    //alert(attr.Biomass_sm.toFixed(3));
                    var st = attr.ST_NAME; //attr.STATENAME;
                    var county = attr.NAME; //attr.CountyName;
                    var title = county + ", " + st;//attr.NAMELSAD + ", " + toTitleCase(attr.StateName);
                    var content = "";

                    if (attr.Biomass_pe != null){
                        content += "<div>" + attr.Biomass_pe.toFixed(3) + " million metric tons of forest carbon per square mile of land </div>";
                    } else{
                        content += "<div>No forest or no data</div>";
                    }
                  
                  //Add graphics
                  roeMapBio.graphics.add(feature);
                  //Set title and content for the popup window
                  roeMapBio.infoWindow.setTitle(title);
                  roeMapBio.infoWindow.setContent(content);

                  (evt) ? roeMapBio.infoWindow.show(evt.screenPoint, roeMapBio.getInfoWindowAnchor(evt.screenPoint)) : null;
                  roeMapBio.infoWindow.resize(300, 120);
              }

              //find FullScreen and layer Visisbility button elements on right side of Map
              var layerbutton = dojo.byId("expandIcon" + mapID),
                  wipeTarget = dojo.byId("layersNode" + mapID);

              //assign the Eventerhandlers for FullScreen and layer Visisbility button  
              on(layerbutton, "click", function (evt) {
                  if (domStyle.get(wipeTarget, "display") === "none") {
                      dojo.fx.wipeIn({ node: wipeTarget }).play();
                      dojo.attr("exIcon" + mapID, "src", "./scripts/innovate/images/minus2.png"); //note: these paths will need to change when move servers
                  } else {
                      dojo.fx.wipeOut({ node: wipeTarget }).play();
                      dojo.attr("exIcon" + mapID, "src", "./scripts/innovate/images/greenPlus2.gif"); //note: these paths will need to change when move servers
                  }

              });

              //Find Full Screen button on right side of Map and connect EventHandler
              on(dom.byId("fullScreen" + mapID), "click", fullscreenMode);

              //FullScreen button EventHandler
              function fullscreenMode() {

                  //add from innovat.js
                  var maxWidth = 1360, maxHeight = 1360
                , screenHeight = parseInt($(window).height())
                , screenWidth = parseInt($(window).width())
                , width = screenWidth, height = screenHeight
                , top = 0
                , left = 0
                , userConfig = innovate.getUserConfigForMap(mapID);
                  if (screenHeight > maxHeight || screenWidth > maxWidth) {
                      if (screenWidth > maxWidth) {
                          width = maxWidth;
                      } else {
                          width = screenWidth;
                      }
                      if (screenHeight > maxHeight) {
                          height = maxHeight;
                      } else {
                          height = screenHeight;
                      }
                      top = parseInt((screenHeight - height) / 2);
                      left = parseInt((screenWidth - width) / 2);
                  }
                  width = width - 6;
                  height = height - 6;

                  $.blockUI({
                      message: "<div id=\"mapPopupHeader\" style=\"cursor:pointer;height:24px;background-color:#9DB6DB;\">" +
                              "<div style=\"float:left; padding-left:10px;\">" + userConfig["header"] + "</div>" +
                              "<div style=\"float:right; padding-right:5px;\"><a href=\"javaScript:innovate.closeModal();\">Close</a></div>" +
                              "</div>" +
                              "<div>" +
                              "<div id=\"mapPopupLoading\" style=\"position:relative; top:0px; left:0px; width:" + width + "px; height:" + height + "px; z-index:1003; margin:auto auto;  \"><div style=\"margin-top:" + Math.floor(height / 2) + "px;\"><div style=\"text-align:center; \">Loading...</div><div><img src=\"images/ajax-loader.gif\" /></div></div></div>" +
                              "<iframe name=\"innovateFullScreenFrame\" id=\"innovateFullScreenFrame\" src=\"getMap.html?width=" + (width) + "&height=" + (height - 24) + "&mapId=" + mapID + "&exHeight=105px" + "\" frameborder=\"0\" scrolling=\"no\" width=\"" + width + "\" height=\"" + (height - 24) + "\"></iframe>" +
                              "</div>", //note: this path will need to change when move servers
                      css: {
                          "position": "fixed",
                          "width": width,
                          "height": height,
                          "top": top,
                          "left": left
                      },
                      bindEvents: false
                  });
              }
          });
    }

    //Percent change in carbon stored in U.S. forests
    //Innovate Map # 22
    this.ROE_PercentChangeCarbonStorage = function () {
        //var baseLayerType = this.innovateLayerObj.getBaseLayerType();
        //Add ESRI Map
        var roeMapCarbon;
        var compare, compare2;
        //alert(mapID);
        require([
          "esri/map",
          "esri/layers/ArcGISDynamicMapServiceLayer",
          "esri/layers/ImageParameters",
          "esri/InfoTemplate",
          "esri/layers/FeatureLayer",
          "esri/dijit/Legend",
          "esri/tasks/query",
          "esri/geometry/Extent",
          "esri/renderers/SimpleRenderer",
          "esri/symbols/SimpleFillSymbol",
          "esri/symbols/SimpleLineSymbol",
          "esri/dijit/BasemapToggle",
          "esri/dijit/Scalebar",
          "dojo/dom",
          "dojo/number",
          "dojo/on",
          "dojo/parser",
          "dojo/_base/array",
          "esri/Color",
          "dojo/string",
          "esri/request",
          "dojo/dom-style",
          "dijit/form/HorizontalSlider",
          "dijit/popup",
          "dijit/layout/BorderContainer",
          "dijit/layout/ContentPane",
          "dojox/layout/ExpandoPane",
          "dojo/domReady!"
        ],
          function (
            Map, ArcGISDynamicMapServiceLayer, ImageParameters, InfoTemplate, FeatureLayer, Legend, Query, Extent, SimpleRenderer, SimpleFillSymbol,
            SimpleLineSymbol, BasemapToggle, Scalebar, dom, number, on, parser, arrayUtils, Color, string, esriRequest, domStyle, HorizontalSlider, popup
        ) {

              //parser.parse(dom.byId("mframe" + mapID));
              parser.parse();

              //var restEnd = "http://geodata.epa.gov/arcgis/rest/services/ORD/"; //EPA Production Rest Endpoint
              //var restEnd = "http://gisstg.rtpnc.epa.gov/arcgis/rest/services/ord/"; //EPA Staging Rest Endpoint
              var restEnd = "http://it.innovateteam.com/arcgis/rest/services/ROE/";

              //Add map and set map properties
              roeMapCarbon = new Map("mapDiv" + mapID, {
                  basemap: currentObject.config.baseMap[0],
                  center: currentObject.config.center,
                  //extent: new Extent({
                  //    xmin: currentObject.config.zoomToExtent[0],
                  //    ymin: currentObject.config.zoomToExtent[1],
                  //    xmax: currentObject.config.zoomToExtent[2],
                  //    ymax: currentObject.config.zoomToExtent[3],
                  //    spatialReference: { "wkid": 3857 }
                  //}),
                  maxZoom: currentObject.config.endResolution,
                  minZoom: currentObject.config.startResolution,
                  zoom: currentObject.config.defaultZoomLevel, //Defaultzoomlevel from the config file
                  logo: false,
                  //showAttribution: false,
                  sliderStyle: "large"
              });

              //Add Scalebar and set scalebar properties
              var scalebar = new Scalebar({
                  map: roeMapCarbon,
                  attachTo: "bottom-right",
                  scalebarUnit: "dual"
              });

              //Add Layers from map_Config
              var imageParameters = new ImageParameters();
              imageParameters.format = "jpeg"; //set the image type to PNG24, note default is PNG8.

              //Dynamically add layers specified in the Config file//
              //First layer in the list will be in the legend      //
              var dynamicMapSerives = [];

              //Find element that checkbox controls for visibility of layers will be appended into
              var layersContainer = document.getElementById("layer_list" + mapID);

              //Loop through layer list in the config file.
              for (var i = 0; i < currentObject.config.layers.length; i++) {
                  dynamicMapSerives[i] = new ArcGISDynamicMapServiceLayer(restEnd + currentObject.config.layers[i] + "/MapServer", {
                      //"opacity": 1,
                      "imageParameters": imageParameters,
                  });
              }
              //Add the layers to the map
              roeMapCarbon.addLayers(dynamicMapSerives);

              //alert(currentObject.config.layers.length);
              //For each layer in the config file add a check box for the layers visibility. The element id includes the index for the layer
              for (var c = 0; c < currentObject.config.layers.length; c++) {
                  $(layersContainer).append("<input type=\"checkbox\" checked=\"True\" class=\"list_item\" id=\"layer_" + c + "_" + mapID + "\" value=0 />" + currentObject.config.layerDisplayName[c] + "<br />");
                  lyr = currentObject.config.layers[c];
                  on(dom.byId("layer_" + c + "_" + mapID), "change", updateCarbonVisibility);
              }

              ////Radio button for Map layers visibility
              function updateCarbonVisibility(evt) {
                  evt = evt || window.event;
                  //get the layer index from the element id
                  var lName = evt.target.id.split("_");
                  //If radio button is checked show Map layer
                  if (dom.byId(evt.target.id).checked) {
                      dynamicMapSerives[lName[1]].show();
                  } else {
                      dynamicMapSerives[lName[1]].hide();
                  }
              }

              //Create Horizontal Legend
              var url = restEnd + currentObject.config.legend.url + "?f=pjson";
              //alert(currentObject.config.legend.url);
              var requestHandle = esriRequest({
                  "url": url,
                  "content": {
                      "f": "json"
                  },
                  "callbackParamName": "callback"
              });
              requestHandle.then(requestSucceeded, requestFailed);
              function requestSucceeded(response, io) {

                  var content = "";
                  //Loop through layers for the table of contents
                  for (var lIndex = 0; lIndex < 3; lIndex++) {
                      //Add title if specified in the config
                      if (currentObject.config.legend.discard[lIndex] != "Y") {
                          if (typeof (currentObject.config.legend.layers[lIndex]) != "undefined") {
                              content = content + "<div class=\"innvateLegend\"><div><b>" + currentObject.config.legend.layers["1"] + "</b></div><table><tbody><tr>";
                          } else {
                              content = content + "<div class=\"innvateLegend\"><div><b></b></div><table><tbody><tr>";
                          }
                          //add legend componets for this layaer
                          var mLegend = response.layers[lIndex]["legend"];
                          var imgURL = "";
                          //alert(mLegend.length);
                          for (var i = 0; i < mLegend.length; i++) {
                              imgURL = restEnd + currentObject.config.layers[0] + "/MapServer/" + lIndex + "/images/" + mLegend[i]["url"];
                              //alert(mLegend[i]["label"]);
                              content = content + "<td valign=\"middle\" align=\"center\"><div><img alt=\"\" src=\"" + imgURL + "\"></div></td>" +
                                  "<td valign=\"middle\" align=\"left\" style=\"padding: 3px 10px 0px 5px\">" + mLegend[i]["label"] + "</td>";
                          }
                          content = content + "</tr></tbody></table></div>";
                      }
                  }
                  //Add to the legend div
                  var legendContainer = document.getElementById("legendDiv" + mapID);
                  $(legendContainer).append(content);

              }
              function requestFailed(error, io) {
                  alert("Failed");
              }
              //End Legend

              var oSlider = document.getElementById(".dojoxExpandTitle");
              var slider = new HorizontalSlider({
                  name: "slider" + mapID,
                  title: "Opacity",
                  value: 1,
                  minimum: 0,
                  maximum: 1,
                  intermediateChanges: true,
                  style: "width:200px;",
                  onChange: function (value) {
                      //dom.byId("sliderValue").value = value;
                      //map.getLayer(map.layerIds[1]).setOpacity(value);
                      dynamicMapSerives[0].setOpacity(value);
                  }
              }, "oslider" + mapID).startup(); //"slider" + mapID

              //Code for basemap radio buttons
              on(dom.byId("blayerS" + mapID), "change", updateBaseMap0);
              on(dom.byId("blayerG" + mapID), "change", updateBaseMap0);
              //switch base map based on checked radio button
              function updateBaseMap0() {
                  //alert(mapID);
                  if (dom.byId("blayerS" + mapID).checked) {
                      roeMapCarbon.setBasemap(currentObject.config.baseMap[0]);
                  } else {
                      roeMapCarbon.setBasemap(currentObject.config.baseMap[1]);
                  }
              }

              //on mouse over 
              dojo.connect(roeMapCarbon, "onMouseOver", refreshMapPosition);
              //makes sur that the map is refreshed and positioned correctly
              function refreshMapPosition() {
                  //alert("on Map");
                  roeMapCarbon.resize();
                  roeMapCarbon.reposition();
              }

              //May need this at some point
              roeMapCarbon.resize();
              roeMapCarbon.reposition();

              //Query and infoWindow setup
              dojo.connect(roeMapCarbon, "onClick", executeCarbonQueryTask);
              dojo.connect(roeMapCarbon.infoWindow, "onHide", function () { roeMapCarbon.graphics.clear(); });
              queryTaskPct = new esri.tasks.QueryTask(restEnd + currentObject.config.layers[0] + "/MapServer/1");

              //Set query task
              queryPct = new esri.tasks.Query();
              queryPct.outSpatialReference = { "wkid": 3857 };
              queryPct.returnGeometry = true;
              queryPct.outFields = ["*"];

              //Execute query
              function executeCarbonQueryTask(evt) {

                  roeMapCarbon.infoWindow.hide();    //Hide Popup
                  roeMapCarbon.graphics.clear();     //Clear Graphics
                  featureSet = null;        //Reset the Featureset

                  //Find clicked location and execute query
                  queryPct.geometry = evt.mapPoint;
                  queryTaskPct.execute(queryPct, function (fset) {
                      //showFeature(fset.features[0], evt);
                      if (fset.features.length === 1) {
                          //this[controlName]();
                          showFeature(fset.features[0], evt);
                      } else if (fset.features.length !== 0) {
                          showFeatureSet(fset, evt);
                      }
                  });
              }

              //Show feature that was clicked
              function showFeature(feature, evt) {
                  roeMapCarbon.graphics.clear();     //Clear graphics on the map

                  //set graphic symbol
                  var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 2), new dojo.Color([255, 255, 255, 0]));
                  feature.setSymbol(symbol);

                  function toTitleCase(str) {
                      return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
                  }

                  // Build text and layout for the popup
                  var attr = feature.attributes;
                  //alert(attr.Biomass_sm.toFixed(3));
                  var st = attr.ST_NAME;
                  var county = attr.NAME;
                  var title = county + ", " + st;//attr.NAMELSAD + ", " + toTitleCase(attr.StateName);
                  var content = "";
                  var percentChnge = ""; //attr.PerentCh_1 ? parseFloat(attr.PerentCh_1).toFixed(2) + "%" : null;
                  var perChnge = attr.PercentChg;

                  if (perChnge === 0) {
                      percentChnge = attr.PercentChg + "%";
                  } else {
                      percentChnge = attr.PercentChg ? parseFloat(attr.PercentChg).toFixed(2) + "%" : null;
                  }

                  //alert(perChnge + "   " + percentChnge);
                  if (percentChnge != null) {
                      if (perChnge === 0) {
                          content += "<div>+" + percentChnge + "</div>";
                      } else if (percentChnge.substr(0, 1) != "-") {
                          content += "<div>+" + percentChnge + "</div>";
                      } else {
                          content += "<div>" + percentChnge + "</div>";
                      }
                  } else {
                      content += "<div>No forest or no data</div>";
                  }

                  //Add graphics
                  roeMapCarbon.graphics.add(feature);
                  //Set title and content for the popup window
                  roeMapCarbon.infoWindow.setTitle(title);
                  roeMapCarbon.infoWindow.setContent(content);

                  (evt) ? roeMapCarbon.infoWindow.show(evt.screenPoint, roeMapCarbon.getInfoWindowAnchor(evt.screenPoint)) : null;
                  roeMapCarbon.infoWindow.resize(300, 120);
              }

              //find FullScreen and layer Visisbility button elements on right side of Map
              var layerbutton = dojo.byId("expandIcon" + mapID),
                  wipeTarget = dojo.byId("layersNode" + mapID);

              //assign the Eventerhandlers for FullScreen and layer Visisbility button  
              on(layerbutton, "click", function (evt) {
                  if (domStyle.get(wipeTarget, "display") === "none") {
                      dojo.fx.wipeIn({ node: wipeTarget }).play();
                      dojo.attr("exIcon" + mapID, "src", "./scripts/innovate/images/minus2.png"); //note: these paths will need to change when move servers
                  } else {
                      dojo.fx.wipeOut({ node: wipeTarget }).play();
                      dojo.attr("exIcon" + mapID, "src", "./scripts/innovate/images/greenPlus2.gif"); //note: these paths will need to change when move servers
                  }

              });

              //Find Full Screen button on right side of Map and connect EventHandler
              on(dom.byId("fullScreen" + mapID), "click", fullscreenMode);

              //FullScreen button EventHandler
              function fullscreenMode() {

                  //add from innovat.js
                  var maxWidth = 1360, maxHeight = 1360
                , screenHeight = parseInt($(window).height())
                , screenWidth = parseInt($(window).width())
                , width = screenWidth, height = screenHeight
                , top = 0
                , left = 0
                , userConfig = innovate.getUserConfigForMap(mapID);
                  if (screenHeight > maxHeight || screenWidth > maxWidth) {
                      if (screenWidth > maxWidth) {
                          width = maxWidth;
                      } else {
                          width = screenWidth;
                      }
                      if (screenHeight > maxHeight) {
                          height = maxHeight;
                      } else {
                          height = screenHeight;
                      }
                      top = parseInt((screenHeight - height) / 2);
                      left = parseInt((screenWidth - width) / 2);
                  }
                  width = width - 6;
                  height = height - 6;

                  $.blockUI({
                      message: "<div id=\"mapPopupHeader\" style=\"cursor:pointer;height:24px;background-color:#9DB6DB;\">" +
                              "<div style=\"float:left; padding-left:10px;\">" + userConfig["header"] + "</div>" +
                              "<div style=\"float:right; padding-right:5px;\"><a href=\"javaScript:innovate.closeModal();\">Close</a></div>" +
                              "</div>" +
                              "<div>" +
                              "<div id=\"mapPopupLoading\" style=\"position:relative; top:0px; left:0px; width:" + width + "px; height:" + height + "px; z-index:1003; margin:auto auto;  \"><div style=\"margin-top:" + Math.floor(height / 2) + "px;\"><div style=\"text-align:center; \">Loading...</div><div><img src=\"images/ajax-loader.gif\" /></div></div></div>" +
                              "<iframe name=\"innovateFullScreenFrame\" id=\"innovateFullScreenFrame\" src=\"getMap.html?width=" + (width) + "&height=" + (height - 24) + "&mapId=" + mapID + "&exHeight=105px" + "\" frameborder=\"0\" scrolling=\"no\" width=\"" + width + "\" height=\"" + (height - 24) + "\"></iframe>" +
                              "</div>", //note: this path will need to change when move servers
                      css: {
                          "position": "fixed",
                          "width": width,
                          "height": height,
                          "top": top,
                          "left": left
                      },
                      bindEvents: false
                  });
              }
          });
    }

    //this.legend_Image = function () {

    //    require([
    //      "esri/map",
    //      "esri/layers/ArcGISDynamicMapServiceLayer",
    //      "esri/layers/ImageParameters",
    //      "esri/InfoTemplate",
    //      "esri/layers/FeatureLayer",
    //      "esri/dijit/Legend",
    //      "esri/tasks/query",
    //      "esri/renderers/SimpleRenderer",
    //      "esri/symbols/SimpleFillSymbol",
    //      "esri/symbols/SimpleLineSymbol",
    //      "esri/dijit/BasemapToggle",
    //      "esri/dijit/Scalebar",
    //      "dojo/dom",
    //      "dojo/number",
    //      "dojo/on",
    //      "dojo/parser",
    //      "dojo/_base/array",
    //      "esri/Color",
    //      "dojo/string",
    //      "esri/request",
    //      "dojo/dom-style",
    //      "dijit/form/HorizontalSlider",
    //      "dijit/popup",
    //      "dijit/layout/BorderContainer",
    //      "dijit/layout/ContentPane",
    //      "dojox/layout/ExpandoPane",
    //      "dojo/domReady!",
    //    ],
    //      function (
    //        Map, ArcGISDynamicMapServiceLayer, ImageParameters, InfoTemplate, FeatureLayer, Legend, Query, SimpleRenderer, SimpleFillSymbol,
    //        SimpleLineSymbol, BasemapToggle, Scalebar, dom, number, on, parser, arrayUtils, Color, string, esriRequest, domStyle, HorizontalSlider, popup
    //    ) {
    //          alert(currentObject.config.legend.url);
    //          var content = "<div><img alt=\"\" width=\"450px\" align=\"middle\" src=\"" + currentObject.config.legend.url + "\"></div>"; //"<div class=\"innvateLegend\"><div></div>";
    //          //content = content + "<div><img alt=\"\" src=\"" + currentObject.config.legend.url + "\"></div>";
    //          var legendContainer = document.getElementById("legendDiv" + mapID);
    //          $(legendContainer).append(content);

    //      });
    //}

    //this.click_radon = function () {
    //    var roeMap = rMap;
    //    require([
    //      "esri/map",
    //      "esri/layers/ArcGISDynamicMapServiceLayer",
    //      "esri/layers/ImageParameters",
    //      "esri/InfoTemplate",
    //      "esri/layers/FeatureLayer",
    //      "esri/dijit/Legend",
    //      "esri/tasks/query",
    //      "esri/renderers/SimpleRenderer",
    //      "esri/symbols/SimpleFillSymbol",
    //      "esri/symbols/SimpleLineSymbol",
    //      "esri/dijit/BasemapToggle",
    //      "esri/dijit/Scalebar",
    //      "dojo/dom",
    //      "dojo/number",
    //      "dojo/on",
    //      "dojo/parser",
    //      "dojo/_base/array",
    //      "esri/Color",
    //      "dojo/string",
    //      "esri/request",
    //      "dojo/dom-style",
    //      "dijit/form/HorizontalSlider",
    //      "dijit/popup",
    //      "dijit/layout/BorderContainer",
    //      "dijit/layout/ContentPane",
    //      "dojox/layout/ExpandoPane",
    //      "dojo/domReady!",
    //    ],
    //      function (
    //        Map, ArcGISDynamicMapServiceLayer, ImageParameters, InfoTemplate, FeatureLayer, Legend, Query, SimpleRenderer, SimpleFillSymbol,
    //        SimpleLineSymbol, BasemapToggle, Scalebar, dom, number, on, parser, arrayUtils, Color, string, esriRequest, domStyle, HorizontalSlider, popup
    //    ) {


    //          //adding code 6/20/14
    //          //Query and infoWindow setup
    //          dojo.connect(roeMap, "onClick", executeQueryTask);
    //          dojo.connect(roeMap.infoWindow, "onHide", function () { roeMap.graphics.clear(); });
    //          radonQueryTask = new esri.tasks.QueryTask("http://geodata.epa.gov/arcgis/rest/services/ORD/" + currentObject.config.layers[0] + "/MapServer/0");

    //          //Set query task
    //          radonQuery = new esri.tasks.Query();
    //          radonQuery.outSpatialReference = { "wkid": 3857 };
    //          radonQuery.returnGeometry = true;
    //          radonQuery.outFields = ["*"];

    //          //Execute query
    //          function executeQueryTask(evt) {
    //              roeMap.infoWindow.hide();    //Hide Popup
    //              roeMap.graphics.clear();     //Clear Graphics
    //              radonFeatureSet = null;        //Reset the Featureset

    //              //Find clicked location and execute query
    //              radonQuery.geometry = evt.mapPoint;
    //              radonQueryTask.execute(radonQuery, function (fset) {
    //                  if (fset.features.length === 1) {
    //                      radonShowFeature(fset.features[0], evt);
    //                  } else if (fset.features.length !== 0) {
    //                      showFeatureSet(fset, evt);
    //                  }
    //              });
    //          }
    //          //Show feature that was clicked
    //          function radonShowFeature(feature, evt) {
    //              roeMap.graphics.clear();     //Clear graphics on the map
    //              //set graphic symbol
    //              var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 2), new dojo.Color([255, 255, 255, 0]));
    //              feature.setSymbol(symbol);
    //              //function to set text to tittle case
    //              function toTitleCase(str) {
    //                  return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    //              }
    //              // Build text and layout for the popup
    //              var attr = feature.attributes;
    //              var title = attr.NAMELSAD + ", " + toTitleCase(attr.StateName); //Title in the popup
    //              var content = "";     //holds the content in the popup

    //              var rVal = attr.RadonZone;
    //              var content = "";
    //              var desc = "";
    //              var priority = "";
    //              if (rVal == "1") {
    //                  //alert(rState);
    //                  desc = "<b>Zone 1 </b>counties have a predicted average indoor radon screening level greater than 4 pCi/L (picocuries per liter) <b>(red zones)</b>";
    //                  priority = "<b>Highest Potential</b>";
    //                  //imgURL = "http://it.innovateteam.com/arcgis/rest/services/ROE/ROE_Radon/MapServer/0/images/3b6a386668a6d07b8d8e029744820282"
    //                  imgURL = "http://geodata.epa.gov/arcgis/rest/services/ORD/ROE_Radon/MapServer/0/images/7222a20623b288194ba3a4929f4a9610";
    //              } else if (rVal == "2") {
    //                  //alert(rVal + "should be 2");
    //                  desc = "<b>Zone 2 </b>counties have a predicted average indoor radon screening level between 2 and 4 pCi/L<b>(orange zones)</b>";
    //                  priority = "<b>Moderate Potential</b>";
    //                  //imgURL = "http://it.innovateteam.com/arcgis/rest/services/ROE/ROE_Radon/MapServer/0/images/52edb92fef3b3447d910ea3f4e3bad06"
    //                  imgURL = "http://geodata.epa.gov/arcgis/rest/services/ORD/ROE_Radon/MapServer/0/images/0af36609991455aceba15b73b91ce066";
    //              } else if (rVal == "3") {
    //                  //alert(rVal + "should be 3");
    //                  desc = "<b>Zone 3 </b>counties have a predicted average indoor radon screening level less than 2 pCi/L <b>(yellow zones)</b>";
    //                  priority = "<b>Low Potential</b>";
    //                  //imgURL = "http://it.innovateteam.com/arcgis/rest/services/ROE/ROE_Radon/MapServer/0/images/d1573b09a0505bef245b2a380a18e380"
    //                  imgURL = "http://geodata.epa.gov/arcgis/rest/services/ORD/ROE_Radon/MapServer/0/images/77ea99fb7956be59e6314b0eb1ddefe3";
    //              }

    //              content = "<div>Radon risk zone: " + rVal + "</div></br>" +
    //                      "<table style=\"width:420px\height:120px\"><tbody><tr style=\"background-color: #EEEEEE; border-color:#DDDDDD;border-style: solid; border-width: 1px 0 1px 0px;padding: 5px;\">" +
    //                      "<td valign=\"top\" align=\"center\"><div><img alt=\"\" src=\"" + imgURL + "\"></div></td>" +
    //                      "<td valign=\"top\" align=\"left\">" + desc + "</td>" +
    //                      "<td valign=\"top\" align=\"left\">" + priority + "</td></tr></tbody></table>";
    //              //Add graphics
    //              roeMap.graphics.add(feature);
    //              //Set title and content for the popup window
    //              roeMap.infoWindow.setTitle(title);
    //              roeMap.infoWindow.setContent(content);

    //              (evt) ? roeMap.infoWindow.show(evt.screenPoint, roeMap.getInfoWindowAnchor(evt.screenPoint)) : null;
    //              roeMap.infoWindow.resize(300, 120);
    //          }
    //      });
    //}

   
}