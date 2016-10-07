innovate.Controls = function (mapID) {
    var currentObject = this;
    this.config = innovate.getUserConfigForMap(mapID);

    this.ROE_Radon = function () {
        
        var roeMap;
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
          "dojo/domReady!",
        ],
          function (
            Map, ArcGISDynamicMapServiceLayer, ImageParameters, InfoTemplate, FeatureLayer, Legend, Query, SimpleRenderer, SimpleFillSymbol,
            SimpleLineSymbol, BasemapToggle, Scalebar, dom, number, on, parser, arrayUtils, Color, string, esriRequest, domStyle, HorizontalSlider, popup
        ) {

              //parser.parse(dom.byId("mframe" + mapID));
              parser.parse();

              var layer, visibleLayerIds = []; //list of visible layers
              //fsMode = "false";

              //Add map and set map properties
              roeMap = new Map("mapDiv" + mapID, {
                  basemap: "satellite",
                  center: currentObject.config.center,
                  zoom: currentObject.config.defaultZoomLevel, //Defaultzoomlevel from the config file
                  logo: false,
                  sliderStyle: "large"
              });

              //Add Scalebar and set scalebar properties
              var scalebar = new Scalebar({
                  map: roeMap,
                  attachTo: "bottom-right",
                  scalebarUnit: "dual"
              });
              //Add basemap toggle and set properties
              //var toggle = new BasemapToggle({
              //    map: map,
              //    basemap: "gray"
              //}, "BasemapToggle");
              //toggle.startup();


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
                  dynamicMapSerives[i] = new ArcGISDynamicMapServiceLayer("http://geodata.epa.gov/arcgis/rest/services/ORD/" + currentObject.config.layers[i] + "/MapServer", {
                      "opacity": 1,
                      "imageParameters": imageParameters,
                  });
              }
              //Add the layers to the map
              roeMap.addLayers(dynamicMapSerives);

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

              //Controls
              //custom legend
              //var imgURL = "http://geodata.epa.gov/arcgis/rest/services/ORD/ROE_FishFaunaPercentLoss/0/images/6b51e92a5a359f7d32499705f3ffb361";
              //var desc = 
              //var lContent = "<table style=\"width:420px\height:120px\"><tbody><tr style=\"padding: 5px;\">" +
              //            "<td valign=\"top\" align=\"center\"><div><img alt=\"\" src=\"" + imgURL + "\"></div></td>" +
              //            "<td valign=\"top\" align=\"left\">" + desc + "</td>" +
              //            "<td valign=\"top\" align=\"left\">" + priority + "</td></tr></tbody></table>";  "title": "Radon Zones"
              //$("legendDiv" + mapID).append(lContent)

              roeMap.on("layers-add-result", function (evt) {
                  var legendDijit = new Legend({
                      map: roeMap,
                      layerInfos: [{ "defaultSymbol": false, "layer": dynamicMapSerives[0], "title": currentObject.config.layerDisplayName[0] }],

                  }, "legendDiv" + mapID);

                  legendDijit.startup();
              });



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
              }, "slider" + mapID).startup();

              //Code for basemap radio buttons
              on(dom.byId("blayerS" + mapID), "change", updateBaseMap0);
              on(dom.byId("blayerG" + mapID), "change", updateBaseMap0);
              //switch base map based on checked radio button
              function updateBaseMap0() {
                  alert(mapID);

                  if (dom.byId("blayerS" + mapID).checked) {
                      //alert(mapID);
                      roeMap.setBasemap("satellite");
                  } else {
                      //alert("G checked")
                      roeMap.setBasemap("gray");

                  }
              }

              dojo.connect(roeMap, "onMouseOver", refreshMapPosition);

              function refreshMapPosition() {
                  //alert("on Map");
                  roeMap.resize();
                  roeMap.reposition();
              }

              //May need this at some point
              //roeMap.resize();
              //roeMap.reposition();

              //this.map = roeMap;
              //rMap = roeMap

              //adding code 6/20/14
              //Query and infoWindow setup
              dojo.connect(roeMap, "onClick", executeQueryTask);
              dojo.connect(roeMap.infoWindow, "onHide", function () { roeMap.graphics.clear(); });
              queryTask = new esri.tasks.QueryTask("http://geodata.epa.gov/arcgis/rest/services/ORD/" + currentObject.config.layers[0] + "/MapServer/0");
              //alert(currentObject.config.layers[0]);
              //Set query task
              query = new esri.tasks.Query();
              query.outSpatialReference = { "wkid": 3857 };
              query.returnGeometry = true;
              query.outFields = ["*"];

              //Execute query
              function executeQueryTask(evt) {
                  //alert("execute Query");
                  roeMap.infoWindow.hide();    //Hide Popup
                  roeMap.graphics.clear();     //Clear Graphics
                  featureSet = null;        //Reset the Featureset
                  
                  //Find clicked location and execute query
                  query.geometry = evt.mapPoint;
                 
                  queryTask.execute(query, function (fset) {
                      //alert(fset.features.length);
                      if (fset.features.length === 1) {
                          //this[controlName];
                          //alert("Feature selected");
                          showFeature(fset.features[0], evt);
                      } else if (fset.features.length !== 0) {
                          //alert("Multiple Features selected");
                          showFeatureSet(fset, evt);
                      }
                  });
              }

              //Show feature that was clicked
              function showFeature(feature, evt) {
                  //alert("show Feature");
                  roeMap.graphics.clear();     //Clear graphics on the map

                  //set graphic symbol
                  var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 2), new dojo.Color([255, 255, 255, 0]));
                  feature.setSymbol(symbol);

                  function toTitleCase(str) {
                      return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
                  }
                  // Build text and layout for the popup
                  var attr = feature.attributes;
                  var title = attr.NAMELSAD + ", " + toTitleCase(attr.StateName);
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
                      imgURL = "http://geodata.epa.gov/arcgis/rest/services/ORD/ROE_Radon/MapServer/0/images/7222a20623b288194ba3a4929f4a9610";
                  } else if (rVal == "2") {
                      //alert(rVal + "should be 2");
                      desc = "<b>Zone 2 </b>counties have a predicted average indoor radon screening level between 2 and 4 pCi/L<b>(orange zones)</b>";
                      priority = "<b>Moderate Potential</b>";
                      //imgURL = "http://it.innovateteam.com/arcgis/rest/services/ROE/ROE_Radon/MapServer/0/images/52edb92fef3b3447d910ea3f4e3bad06"
                      imgURL = "http://geodata.epa.gov/arcgis/rest/services/ORD/ROE_Radon/MapServer/0/images/0af36609991455aceba15b73b91ce066";
                  } else if (rVal == "3") {
                      //alert(rVal + "should be 3");
                      desc = "<b>Zone 3 </b>counties have a predicted average indoor radon screening level less than 2 pCi/L <b>(yellow zones)</b>";
                      priority = "<b>Low Potential</b>";
                      //imgURL = "http://it.innovateteam.com/arcgis/rest/services/ROE/ROE_Radon/MapServer/0/images/d1573b09a0505bef245b2a380a18e380"
                      imgURL = "http://geodata.epa.gov/arcgis/rest/services/ORD/ROE_Radon/MapServer/0/images/77ea99fb7956be59e6314b0eb1ddefe3";
                  }

                  content = "<div>Radon risk zone: " + rVal + "</div></br>" +
                          "<table style=\"width:420px\height:120px\"><tbody><tr style=\"background-color: #EEEEEE; border-color:#DDDDDD;border-style: solid; border-width: 1px 0 1px 0px;padding: 5px;\">" +
                          "<td valign=\"top\" align=\"center\"><div><img alt=\"\" src=\"" + imgURL + "\"></div></td>" +
                          "<td valign=\"top\" align=\"left\">" + desc + "</td>" +
                          "<td valign=\"top\" align=\"left\">" + priority + "</td></tr></tbody></table>";
                  //Add graphics
                  roeMap.graphics.add(feature);
                  //Set title and content for the popup window
                  roeMap.infoWindow.setTitle(title);
                  roeMap.infoWindow.setContent(content);

                  (evt) ? roeMap.infoWindow.show(evt.screenPoint, roeMap.getInfoWindowAnchor(evt.screenPoint)) : null;
                  roeMap.infoWindow.resize(300, 120);
              }



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
                              "<iframe name=\"innovateFullScreenFrame\" id=\"innovateFullScreenFrame\" src=\"getMap.html?width=" + (width) + "&height=" + (height - 24) + "&mapId=" + mapID + "\" frameborder=\"0\" scrolling=\"no\" width=\"" + width + "\" height=\"" + (height - 24) + "\"></iframe>" +
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
                  //end from innovate.js
              }

              //find FullScreen and layer Visisbility button elements on right side of Map
              var layerbutton = dojo.byId("expandIcon" + mapID),
                  wipeTarget = dojo.byId("layersNode" + mapID);
              //assign the Eventerhandlers for FullScreen and layer Visisbility button  
              on(layerbutton, "click", function (evt) {
                  //
                  if (domStyle.get(wipeTarget, "display") === "none") {
                      dojo.fx.wipeIn({ node: wipeTarget }).play();
                      dojo.attr("exIcon" + mapID, "src", "/scripts/innovate/images/minus2.png"); //note: these paths will need to change when move servers
                  } else {
                      dojo.fx.wipeOut({ node: wipeTarget }).play();
                      dojo.attr("exIcon" + mapID, "src", "/scripts/innovate/images/greenPlus2.gif"); //note: these paths will need to change when move servers
                  }
              });
          });
        }

    this.ROE_LongIslandHypoxia = function (layerName) {
        var roeMap;
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
          "dojo/domReady!",
        ],
          function (
            Map, ArcGISDynamicMapServiceLayer, ImageParameters, InfoTemplate, FeatureLayer, Legend, Query, SimpleRenderer, SimpleFillSymbol,
            SimpleLineSymbol, BasemapToggle, Scalebar, dom, number, on, parser, arrayUtils, Color, string, esriRequest, domStyle, HorizontalSlider, popup
        ) {

              //parser.parse(dom.byId("mframe" + mapID));
              parser.parse();

              var layer, visibleLayerIds = []; //list of visible layers
              //fsMode = "false";

              //Add map and set map properties
              roeMap = new Map("mapDiv" + mapID, {
                  basemap: "satellite",
                  center: currentObject.config.center,
                  zoom: currentObject.config.defaultZoomLevel, //Defaultzoomlevel from the config file
                  logo: false,
                  sliderStyle: "large"
              });

              //Add Scalebar and set scalebar properties
              var scalebar = new Scalebar({
                  map: roeMap,
                  attachTo: "bottom-right",
                  scalebarUnit: "dual"
              });
              //Add basemap toggle and set properties
              //var toggle = new BasemapToggle({
              //    map: map,
              //    basemap: "gray"
              //}, "BasemapToggle");
              //toggle.startup();


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
                  dynamicMapSerives[i] = new ArcGISDynamicMapServiceLayer("http://geodata.epa.gov/arcgis/rest/services/ORD/" + currentObject.config.layers[i] + "/MapServer", {
                      "opacity": 1,
                      "imageParameters": imageParameters,
                  });
              }
              //Add the layers to the map
              roeMap.addLayers(dynamicMapSerives);

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

              //Controls
              //custom legend
              //var imgURL = "http://geodata.epa.gov/arcgis/rest/services/ORD/ROE_FishFaunaPercentLoss/0/images/6b51e92a5a359f7d32499705f3ffb361";
              //var desc = 
              //var lContent = "<table style=\"width:420px\height:120px\"><tbody><tr style=\"padding: 5px;\">" +
              //            "<td valign=\"top\" align=\"center\"><div><img alt=\"\" src=\"" + imgURL + "\"></div></td>" +
              //            "<td valign=\"top\" align=\"left\">" + desc + "</td>" +
              //            "<td valign=\"top\" align=\"left\">" + priority + "</td></tr></tbody></table>";  "title": "Radon Zones"
              //$("legendDiv" + mapID).append(lContent)

              roeMap.on("layers-add-result", function (evt) {
                  var legendDijit = new Legend({
                      map: roeMap,
                      layerInfos: [{ "defaultSymbol": false, "layer": dynamicMapSerives[0], "title": currentObject.config.layerDisplayName[0] }],

                  }, "legendDiv" + mapID);

                  legendDijit.startup();
              });



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
              }, "slider" + mapID).startup();

              //Code for basemap radio buttons
              on(dom.byId("blayerS" + mapID), "change", updateBaseMap0);
              on(dom.byId("blayerG" + mapID), "change", updateBaseMap0);
              //switch base map based on checked radio button
              function updateBaseMap0() {
                  alert(mapID);

                  if (dom.byId("blayerS" + mapID).checked) {
                      //alert(mapID);
                      roeMap.setBasemap("satellite");
                  } else {
                      //alert("G checked")
                      roeMap.setBasemap("gray");

                  }
              }

              dojo.connect(roeMap, "onMouseOver", refreshMapPosition);

              function refreshMapPosition() {
                  //alert("on Map");
                  roeMap.resize();
                  roeMap.reposition();
              }

              //May need this at some point
              roeMap.resize();
              roeMap.reposition();

              //this.map = roeMap;
              //rMap = roeMap

              //adding code 6/20/14
              //Query and infoWindow setup
              dojo.connect(roeMap, "onClick", executeQueryTask);
              dojo.connect(roeMap.infoWindow, "onHide", function () { roeMap.graphics.clear(); });
              queryTask = new esri.tasks.QueryTask("http://geodata.epa.gov/arcgis/rest/services/ORD/" + currentObject.config.layers[0] + "/MapServer/0");

              //Set query task
              query = new esri.tasks.Query();
              query.outSpatialReference = { "wkid": 3857 };
              query.returnGeometry = true;
              query.outFields = ["*"];

              //Execute query
              function executeQueryTask(evt) {

                  roeMap.infoWindow.hide();    //Hide Popup
                  roeMap.graphics.clear();     //Clear Graphics
                  featureSet = null;        //Reset the Featureset

                  //Find clicked location and execute query
                  query.geometry = evt.mapPoint;
                  queryTask.execute(query, function (fset) {
                      if (fset.features.length === 1) {
                          //this[controlName];
                          showFeature(fset.features[0], evt);
                      } else if (fset.features.length !== 0) {
                          showFeatureSet(fset, evt);
                      }
                  });
              }

              //Show feature that was clicked
              function showFeature(feature, evt) {
                  roeMap.graphics.clear();     //Clear graphics on the map

                  //set graphic symbol
                  var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 2), new dojo.Color([255, 255, 255, 0]));
                  feature.setSymbol(symbol);

                  function toTitleCase(str) {
                      return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
                  }
                  // Build text and layout for the popup
                  var attr = feature.attributes;
                  var title = attr.STATION_NA + " Station";//+ ", " + toTitleCase(attr.StateName);
                  var content = ""; 

                  //var rVal = attr.RadonZone;
                  var content = "";
                  //var desc = "";
                  //var priority = "";
                  //if (rVal == "1") {
                  //    //alert(rState);
                  //    desc = "<b>Zone 1 </b>counties have a predicted average indoor radon screening level greater than 4 pCi/L (picocuries per liter) <b>(red zones)</b>";
                  //    priority = "<b>Highest Potential</b>";
                  //    //imgURL = "http://it.innovateteam.com/arcgis/rest/services/ROE/ROE_Radon/MapServer/0/images/3b6a386668a6d07b8d8e029744820282"
                  //    imgURL = "http://geodata.epa.gov/arcgis/rest/services/ORD/ROE_Radon/MapServer/0/images/7222a20623b288194ba3a4929f4a9610";
                  //} else if (rVal == "2") {
                  //    //alert(rVal + "should be 2");
                  //    desc = "<b>Zone 2 </b>counties have a predicted average indoor radon screening level between 2 and 4 pCi/L<b>(orange zones)</b>";
                  //    priority = "<b>Moderate Potential</b>";
                  //    //imgURL = "http://it.innovateteam.com/arcgis/rest/services/ROE/ROE_Radon/MapServer/0/images/52edb92fef3b3447d910ea3f4e3bad06"
                  //    imgURL = "http://geodata.epa.gov/arcgis/rest/services/ORD/ROE_Radon/MapServer/0/images/0af36609991455aceba15b73b91ce066";
                  //} else if (rVal == "3") {
                  //    //alert(rVal + "should be 3");
                  //    desc = "<b>Zone 3 </b>counties have a predicted average indoor radon screening level less than 2 pCi/L <b>(yellow zones)</b>";
                  //    priority = "<b>Low Potential</b>";
                  //    //imgURL = "http://it.innovateteam.com/arcgis/rest/services/ROE/ROE_Radon/MapServer/0/images/d1573b09a0505bef245b2a380a18e380"
                  //    imgURL = "http://geodata.epa.gov/arcgis/rest/services/ORD/ROE_Radon/MapServer/0/images/77ea99fb7956be59e6314b0eb1ddefe3";
                  //}

                  //content = "<div>Radon risk zone: " + rVal + "</div></br>" +
                  //        "<table style=\"width:420px\height:120px\"><tbody><tr style=\"background-color: #EEEEEE; border-color:#DDDDDD;border-style: solid; border-width: 1px 0 1px 0px;padding: 5px;\">" +
                  //        "<td valign=\"top\" align=\"center\"><div><img alt=\"\" src=\"" + imgURL + "\"></div></td>" +
                  //        "<td valign=\"top\" align=\"left\">" + desc + "</td>" +
                  //        "<td valign=\"top\" align=\"left\">" + priority + "</td></tr></tbody></table>";
                  //Add graphics
                  roeMap.graphics.add(feature);
                  //Set title and content for the popup window
                  roeMap.infoWindow.setTitle(title);
                  roeMap.infoWindow.setContent(content);

                  (evt) ? roeMap.infoWindow.show(evt.screenPoint, roeMap.getInfoWindowAnchor(evt.screenPoint)) : null;
                  roeMap.infoWindow.resize(300, 120);
              }



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
                              "<iframe name=\"innovateFullScreenFrame\" id=\"innovateFullScreenFrame\" src=\"getMap.html?width=" + (width) + "&height=" + (height - 24) + "&mapId=" + mapID + "\" frameborder=\"0\" scrolling=\"no\" width=\"" + width + "\" height=\"" + (height - 24) + "\"></iframe>" +
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
                  //end from innovate.js
              }

              //find FullScreen and layer Visisbility button elements on right side of Map
              var layerbutton = dojo.byId("expandIcon" + mapID),
                  wipeTarget = dojo.byId("layersNode" + mapID);
              //assign the Eventerhandlers for FullScreen and layer Visisbility button  
              on(layerbutton, "click", function (evt) {
                  //
                  if (domStyle.get(wipeTarget, "display") === "none") {
                      dojo.fx.wipeIn({ node: wipeTarget }).play();
                      dojo.attr("exIcon" + mapID, "src", "/scripts/innovate/images/minus2.png"); //note: these paths will need to change when move servers
                  } else {
                      dojo.fx.wipeOut({ node: wipeTarget }).play();
                      dojo.attr("exIcon" + mapID, "src", "/scripts/innovate/images/greenPlus2.gif"); //note: these paths will need to change when move servers
                  }
              });
          });
    }

    
}