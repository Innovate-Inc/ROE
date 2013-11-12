innovate.Controls = function(innovateMapObj) {
    var currentObject = this;
    this.config = innovateMapObj.config;

    /*
     * factory method that returns a control object 
     * @param   controlName     String      name of the function in this class that returns a control
     */
    this.getControl = function(controlName) {
        var control = this[controlName]();
        return control;
    }

    /*
     * Returns a pan zoom bar control
     */
    this.PanZoomBar = function() {
        return new OpenLayers.Control.PanZoomBar({
            documentDrag: true
        });
    }

    /*
     * Returns a mouse position control, this control displays the location of the mouse on the map
     */
    this.MousePosition = function() {
        return new OpenLayers.Control.MousePosition({
            documentDrag: true
        });
    }

    this.Attribution = function() {
        return new OpenLayers.Control.Attribution({
            documentDrag: true
        });
    }

    this.Navigation = function() {
        return new OpenLayers.Control.Navigation({
            documentDrag: true
        });
    }

    this.ScaleLine = function() {
        return new OpenLayers.Control.ScaleLine({
            documentDrag: true
        });
    }

    this.LayerSwitcher = function() {
        return new OpenLayers.Control.LayerSwitcher({
            documentDrag: true
        });
    }

    this.InnovateMapFooter = function() {
        var footerControl = new OpenLayers.Control.InnovateMapFooter({
            documentDrag: true
        });
        footerControl.setConfig(innovateMapObj.config);
        return footerControl;
    }

    this.InnovateMapTitle = function() {
        if (OpenLayers.Control.InnovateMapTitle) {
            var titleControl = new OpenLayers.Control.InnovateMapTitle({
                documentDrag: true
            });
            titleControl.setConfig(innovateMapObj.config);
            return titleControl;
        } else {
            return null;
        }
    }

    this.InnovateFindAddress = function() {
        if (OpenLayers.Control.InnovateFindAddress) {
            var InnovateFindAddressControl = new OpenLayers.Control.InnovateFindAddress({
                documentDrag: true
            });
            InnovateFindAddressControl.setConfig(innovateMapObj.config);
            return InnovateFindAddressControl;
        } else {
            return null;
        }
    }

    this.InnovateMapLegend = function() {
        if (OpenLayers.Control.InnovateMapLegend) {
            var legendControl = new OpenLayers.Control.InnovateMapLegend({
                documentDrag: true
            });
            legendControl.setConfig(innovateMapObj.config);
            return legendControl;
        } else {
            return null;
        }
    }

    this.InnovateOverlaySwitcher = function() {
        var control = new OpenLayers.Control.InnovateOverlaySwitcher({
            documentDrag: true
        });
        control.setConfig(innovateMapObj);
        return control;
    }

    /*
     * This function extracts the first table content HTML 
     * @param   reposneString     String    it contains the HTML response after doing the feature request, it sometimes contains multiple <table> elements
     * @return  String      it returns the first complete table HTML encountered
     */
    this.getTableContentOutOfResponse = function(responseString) {
        var tableStart = -1, tableEnd = -1, condition = true, headStart, headEnd, bodyStart, bodyEnd, exp, content = "";
        while (condition) {
            tableStart = responseString.indexOf("<table", tableStart + 1);
            tableEnd = responseString.indexOf("</table>", tableEnd + 1);
            if (tableStart == -1) {
                condition = false;
                break;
            }
            headStart = responseString.toString().indexOf("<tr>", tableStart);
            headEnd = responseString.toString().indexOf("</tr>", headStart);
            bodyStart = responseString.indexOf("<tr>", headEnd);
            bodyEnd = responseString.indexOf("</tr>", bodyStart);

            exp = /(<th>)((.)*?)(<\/th>)/g;
            var matchVal = responseString.substr(headStart, (headEnd - headStart)).match(exp);
            if (matchVal != null) {
                content += responseString.substr(tableStart, (tableEnd - tableStart + 8));
            }
        }
        return content.replace(/Â/g, "");
    }


    /*
     * returns full screen control 
     */
    this.InnovateMapFullScreen = function() {
        if (OpenLayers.Control.InnovateMapFullScreen) {
            var legendControl = new OpenLayers.Control.InnovateMapFullScreen({
                documentDrag: true
            });
            legendControl.setConfig(innovateMapObj.config);
            return legendControl;
        } else {
            return null;
        }
    }

    /*
     * It parses the first table HTML component it encounters in the responseString and returns it as a collection object
     * If just reads the first row of the table
     * @param   responseString      String      generally string content returns by get feature info 
     * @param   layers              Array<int>  make object out of response for only given layers eg. [0,1]
     * Eg : makeObjectOutOfResponse('<table><tr><td>name</td><td>age</td></tr><tr><td>a</td><td>1</td></tr><tr><td>b</td><td>2</td></tr></table>')
     * returns {"name":"a","age":"1"}
     */
    this.makeObjectOutOfResponse = function(responseString, layers) {
        var keys = new Array();
        var values = new Array();
        var returnObj = new Object();
        var match_, exp, headStart, headEnd, bodyStart, bodyEnd, tableStart;
        var initalSearchIndex = 0, condition = true;
        var curLayer = -1, layerCheck = false;

        while (condition) {
            tableStart = responseString.indexOf("<table", initalSearchIndex);
            initalSearchIndex = tableStart + 1;

            if (tableStart == -1) {
                condition = false;
                break;
            }
            ++curLayer;
            //layers in defined so just read parse the data from the layers defined
            if (layers) {
                layerCheck = false;
                for (var i = 0, len = layers.length; i < len; i++) {
                    if (layers[i] === curLayer) {
                        layerCheck = true;
                        break;
                    }
                }
                if (!layerCheck) {
                    continue;
                }
            }
            headStart = responseString.toString().indexOf("<tr>", tableStart);
            headEnd = responseString.toString().indexOf("</tr>", headStart);
            bodyStart = responseString.indexOf("<tr>", headEnd);
            bodyEnd = responseString.indexOf("</tr>", bodyStart);

            exp = /(<th>)((.)*?)(<\/th>)/g;
            var matchVal = responseString.substr(headStart, (headEnd - headStart)).match(exp);
            if (matchVal != null) {
                for (var i = 0; i < matchVal.length; i++) {
                    match_ = matchVal[i].match(/(<th>)((.)*?)(<\/th>)/);
                    keys[keys.length] = match_[2];
                }

                exp = /(<td>)((.)*?)(<\/td>)/g;
                matchVal = responseString.substr(bodyStart, (bodyEnd - bodyStart)).match(exp);

                for (i = 0; i < matchVal.length; i++) {
                    match_ = matchVal[i].match(/(<td>)((.)*?)(<\/td>)/);
                    values[values.length] = match_[2];
                }
            }

        }
        for (i = 0; i < keys.length; i++) {
            returnObj[$.trim(((keys[i]).toString())).toLowerCase()] = $.trim(values[i]);
        }
        return returnObj;
    }

    /*
     * Returns OpenLayers.Control.WMSGetFeatureInfo control, this function can be used as a default click handler on maps
     * It returns the html content returned by the feature info to eb shown in the popup
     * @param   layerName     String    innovate.Layers.layerDefinitions.name property
     */
    this.click_defaultHandler = function(layerName) {
        //we don't want to query State Boundaries layer because its just for visual help 
        if (layerName === "State Boundaries") {
            return null;
        }

        var map = innovateMapObj.map,
                serviceURL = null,
                thisObject = null,
                layers = map.layers.slice();

        if (layerName) {
            for (var i = 0; i < layers.length; i++) {
                if (!(layers[i].isBaseLayer)) {
                    if (layers[i].name === layerName) {
                        serviceURL = layers[i].url;
                        break;
                    }
                }
            }
        }

        OpenLayers.ProxyHost = innovate.proxyURL;
        return new OpenLayers.Control.WMSGetFeatureInfo({
            url: serviceURL,
            title: 'Identify features by clicking',
            queryVisible: true,
            eventListeners: {
                getfeatureinfo: function(event) {
                    var thisObject = new innovate.Controls(innovateMapObj)
                            , eventResponse = thisObject.getTableContentOutOfResponse(event.text);

                    var boxSize = null;
                    var mapID = innovateMapObj.config.id;
                    //hide any open popup on click
                    if (innovate.popupbox[mapID]) {
                        $("#innovate_info_popup_" + mapID).hide();
                    }
                    if (!(eventResponse)) {
                        return;
                    }
                    innovate.lastPopupCenter[mapID] = map.getCenter();

                    var content = eventResponse;
                    if (innovate.popupbox[mapID]) {
                        innovate.popupbox[mapID].lonlat = map.getLonLatFromPixel(event.xy);
                        innovate.popupbox[mapID].setContentHTML(content);
                        innovate.popupbox[mapID].panIntoView();
                        innovate.popupbox[mapID].updatePosition();
                        innovate.popupbox[mapID].show();
                    } else {
                        //first popup load - we will create a popup object
                        //and for next time we will reuse this object rather than creating a new one
                        innovate.popupbox[mapID] = new OpenLayers.Popup.FramedCloud(
                                "innovate_info_popup_" + mapID,
                                map.getLonLatFromPixel(event.xy),
                                boxSize,
                                content,
                                null,
                                true
                                );
                        innovate.popupbox[mapID].hide = function() {
                            this.div.style.display = 'none';
                            map.panTo(innovate.lastPopupCenter[mapID]);
                        }
                        map.addPopup(innovate.popupbox[mapID]);
                        boxSize = new OpenLayers.Size((parseInt(($("#innovate_info_popup_" + mapID + "_contentDiv").css("width")).replace("px", "")) + 10), (parseInt(($("#innovate_info_popup_" + mapID + "_contentDiv").css("height")).replace("px", "")) + 20));
                        innovate.popupbox[mapID].setSize(boxSize);
                    }
                }
            }
        });
    }

    /*
     * Control to display feature info for 'Total nitrogen deposition in the contiguous U.S.'
     */
    this.click_nitrogenDeposition = function(layerName) {
        //we don't want to query State Boundaries layer because its just for visual help 
        if (layerName === "State Boundaries") {
            return null;
        }
        var map = innovateMapObj.map,
                layer = null,
                layers = map.layers.slice(),
                content = "";

        if (layerName) {
            for (var i = 0; i < layers.length; i++) {
                if (!(layers[i].isBaseLayer)) {
                    if (layers[i].name === layerName) {
                        layer = layers[i];
                        break;
                    }
                }
            }
        }

        return new OpenLayers.Control.SelectFeature(layer, {
            onSelect: createPopup,
            onUnselect: destroyPopup
        });


        function createPopup(feature) {
            var boxSize = null
                    , mapID = innovateMapObj.config.id;
            //hide any open popup on click
            if (innovate.popupbox[mapID]) {
                $("#innovate_info_popup_" + mapID).hide();
            }
            var chartValues = [];
            chartValues[chartValues.length] = feature.attributes["WET_N"];
            chartValues[chartValues.length] = feature.attributes["DRY_N"];
            var size = feature.attributes["image_size"];
            var chartDiv = "chart_" + mapID;

            innovate.lastPopupCenter[mapID] = map.getCenter();
            content = "";
            content += "<div style=\"width:280px;\">"
            content += "<div><img src=\"" + feature.attributes["image"] + "\" width=\"" + feature.attributes["image_size"] + "\" height=\"" + feature.attributes["image_size"] + "\"/></div>";
            content += "<div><span style=\"border:1px solid #CCC; width:15px; height:15px;background-color:rgb(252,204,78);display:block; float:left; margin-right:4px;\"></span><span>Dry deposition : " + feature.attributes["DRY_N"].toFixed(2) + " kg/ha</span></div>"
            content += "<div><span style=\"border:1px solid #CCC; width:15px; height:15px;background-color:rgb(0,166,81);display:block; float:left; margin-right:4px;\"></span><span>Wet deposition : " + feature.attributes["WET_N"].toFixed(2) + " kg/ha</span></div>"
            content += "<div><span >Total : </span><span>" + feature.attributes["TOTAL_N"].toFixed(2) + " kg/ha</span></div>"
            content += "</div>";
            boxSize = new OpenLayers.Size(300, (parseInt(size) + parseInt(100)));
            if (innovate.popupbox[mapID]) {
                innovate.popupbox[mapID].lonlat = feature.geometry.getBounds().getCenterLonLat();
                innovate.popupbox[mapID].setContentHTML(content);
                innovate.popupbox[mapID].setSize(boxSize);
                innovate.popupbox[mapID].panIntoView();
                innovate.popupbox[mapID].updatePosition();
                innovate.popupbox[mapID].show();
            } else {
                //first popup load - we will create a popup object
                //and for next time we will reuse this object rather than creating a new one
                innovate.popupbox[mapID] = new OpenLayers.Popup.FramedCloud(
                        "innovate_info_popup_" + mapID,
                        feature.geometry.getBounds().getCenterLonLat(),
                        boxSize,
                        content,
                        null,
                        true
                        );
                innovate.popupbox[mapID].autoSize = false;
                innovate.popupbox[mapID].hide = function() {
                    this.div.style.display = 'none';
                    map.panTo(innovate.lastPopupCenter[mapID]);
                }
                map.addPopup(innovate.popupbox[mapID]);
            }

        }

        function destroyPopup(feature) {
            var mapID = innovateMapObj.config.id;
            if (innovate.popupbox[mapID]) {
                $("#innovate_info_popup_" + mapID).hide();
            }
        }
    }

    this.click_sulfurDeposition = function(layerName) {
        if (layerName == "State Boundaries") {
            return null;
        }
        var map = innovateMapObj.map,
                layer = null,
                layers = map.layers.slice(),
                content = "";

        if (layerName) {
            for (var i = 0; i < layers.length; i++) {
                if (!(layers[i].isBaseLayer)) {
                    if (layers[i].name == layerName) {
                        layer = layers[i];
                        break;
                    }
                }
            }
        }


        return new OpenLayers.Control.SelectFeature(layer, {
            onSelect: createPopup,
            onUnselect: destroyPopup
        });

        function createPopup(feature) {
            var boxSize = null
                    , mapID = innovateMapObj.config.id;
            //hide any open popup on click
            if (innovate.popupbox[mapID]) {
                $("#innovate_info_popup_" + mapID).hide();
            }

            var chartValues = [];
            chartValues[chartValues.length] = feature.attributes["WET_S"];
            chartValues[chartValues.length] = feature.attributes["DRY_S"];
            var chartDiv = "chart_" + mapID;
            var size = feature.attributes["image_size"];

            innovate.lastPopupCenter[mapID] = map.getCenter();
            content = "";
            content += "<div style=\"width:280px;\">"
            content += "<div><img src=\"" + feature.attributes["image"] + "\" width=\"" + feature.attributes["image_size"] + "\" height=\"" + feature.attributes["image_size"] + "\"/></div>";
            content += "<div><span style=\"border:1px solid #CCC; width:15px; height:15px;background-color:#ffcd4e;display:block; float:left; margin-right:4px;\"></span><span>Dry deposition : " + feature.attributes["DRY_S"].toFixed(2) + " kg/ha</span></div>"
            content += "<div><span style=\"border:1px solid #CCC; width:15px; height:15px;background-color:#C9644E;display:block; float:left; margin-right:4px;\"></span><span>Wet deposition : " + feature.attributes["WET_S"].toFixed(2) + " kg/ha</span></div>"
            content += "<div><span >Total : </span><span>" + feature.attributes["TOTAL_S"].toFixed(2) + " kg/ha</span></div>"
            content += "</div>";

            boxSize = new OpenLayers.Size(300, parseInt(feature.attributes["image_size"]) + 100);
            if (innovate.popupbox[mapID]) {
                innovate.popupbox[mapID].lonlat = feature.geometry.getBounds().getCenterLonLat();
                innovate.popupbox[mapID].setContentHTML(content);
                innovate.popupbox[mapID].setSize(boxSize);
                innovate.popupbox[mapID].panIntoView();
                innovate.popupbox[mapID].updatePosition();
                innovate.popupbox[mapID].show();
            } else {
                //first popup load - we will create a popup object
                //and for next time we will reuse this object rather than creating a new one
                innovate.popupbox[mapID] = new OpenLayers.Popup.FramedCloud(
                        "innovate_info_popup_" + mapID,
                        feature.geometry.getBounds().getCenterLonLat(),
                        boxSize,
                        content,
                        null,
                        true
                        );
                innovate.popupbox[mapID].autoSize = false;
                innovate.popupbox[mapID].hide = function() {
                    this.div.style.display = 'none';
                    map.panTo(innovate.lastPopupCenter[mapID]);
                }
                map.addPopup(innovate.popupbox[mapID]);
            }
        }

        function destroyPopup(feature) {
            var mapID = innovateMapObj.config.id;
            if (innovate.popupbox[mapID]) {
                $("#innovate_info_popup_" + mapID).hide();
            }
        }
    }

    //click handler for layer roefishloss
    this.click_roefishloss = function(layerName) {
        if (layerName == "State Boundaries") {
            return null;
        }
        var map = innovateMapObj.map,
                layer = null,
                serviceURL = null,
                content = "",
                widthPerChar = 7,
                boxWidth = 0,
                layers = map.layers.slice();

        for (var i = 0; i < layers.length; i++) {
            if (!(layers[i].isBaseLayer)) {
                layer = layers[i];
                serviceURL = layers[i].url;
                break;
            }
        }


        OpenLayers.ProxyHost = innovate.proxyURL;
        return new OpenLayers.Control.WMSGetFeatureInfo({
            layers: [layer],
            url: serviceURL,
            title: 'Identify features by clicking',
            queryVisible: true,
            eventListeners: {
                getfeatureinfo: function(event) {
                    var thisObject = new innovate.Controls(innovateMapObj);
                    var obj = thisObject.makeObjectOutOfResponse(event.text);
                    var boxSize = null;
                    var mapID = innovateMapObj.config.id;
                    //hide any open popup on click
                    if (innovate.popupbox[mapID]) {
                        $("#innovate_info_popup_" + mapID).hide();
                    }
                    if ($.isEmptyObject(obj) || obj === false) {
                        return;
                    }
                    innovate.lastPopupCenter[mapID] = map.getCenter();

                    var huc6WithPad = obj["huc6code"];
                    while (huc6WithPad.length < 6) {
                        huc6WithPad = "0" + huc6WithPad;
                    }

                    content = "<div>" + obj['basinname'] + " watershed (HUC code: " + huc6WithPad + ")</div>";
                    boxWidth = (content.length - 10) * widthPerChar;
                    if (parseInt(obj['historicaldiversity'], 10) == 0 && parseInt(obj['absoluteloss'], 10) == 0) {
                        //fishless
                        content += "<div>Fishless</div>";
                    } else {
                        content += "<div>Historical species: " + obj['historicaldiversity'] + "</div>";
                        content += "<div>Species lost: " + obj['absoluteloss'] + "</div>";
                    }

                    boxSize = new OpenLayers.Size(boxWidth, 80);
                    if (innovate.popupbox[mapID]) {
                        innovate.popupbox[mapID].lonlat = map.getLonLatFromPixel(event.xy);
                        innovate.popupbox[mapID].setContentHTML(content);
                        innovate.popupbox[mapID].setSize(boxSize);
                        innovate.popupbox[mapID].panIntoView();
                        innovate.popupbox[mapID].updatePosition();
                        innovate.popupbox[mapID].show();
                    } else {
                        //first popup load - we will create a popup object
                        //and for next time we will reuse this object rather than creating a new one
                        innovate.popupbox[mapID] = new OpenLayers.Popup.FramedCloud(
                                "innovate_info_popup_" + mapID,
                                map.getLonLatFromPixel(event.xy),
                                boxSize,
                                content,
                                null,
                                true
                                );
                        innovate.popupbox[mapID].hide = function() {
                            this.div.style.display = 'none';
                            map.panTo(innovate.lastPopupCenter[mapID]);
                        }
                        map.addPopup(innovate.popupbox[mapID]);
                    }
                }
            }
        });
    }

    //click handler for layer roefishloss
    this.click_roefishlosspercent = function(layerName) {
        if (layerName == "State Boundaries") {
            return null;
        }

        var map = innovateMapObj.map,
                layer = null,
                serviceURL = null,
                content = "",
                widthPerChar = 7,
                boxWidth = 0,
                layers = map.layers.slice();

        for (var i = 0; i < layers.length; i++) {
            if (!(layers[i].isBaseLayer)) {
                layer = layers[i];
                serviceURL = layers[i].url;
                break;
            }
        }


        OpenLayers.ProxyHost = innovate.proxyURL;
        return new OpenLayers.Control.WMSGetFeatureInfo({
            layers: [layer],
            url: serviceURL,
            title: 'Identify features by clicking',
            queryVisible: true,
            eventListeners: {
                getfeatureinfo: function(event) {
                    var mapID = innovateMapObj.config.id;
                    var thisObject = new innovate.Controls(innovateMapObj);
                    var obj = thisObject.makeObjectOutOfResponse(event.text);
                    var boxSize = null;
                    //hide any open popup on click
                    if (innovate.popupbox[mapID]) {
                        //innovate.popupbox[mapID].hide(); cannot do this because it sometime causes the popup to not have enough space at the edges
                        $("#innovate_info_popup_" + mapID).hide();
                    }
                    if ($.isEmptyObject(obj) || obj === false) {
                        return;
                    }
                    innovate.lastPopupCenter[mapID] = map.getCenter();
                    var huc6WithPad = obj["huc6"];
                    while (huc6WithPad.length < 6) {
                        huc6WithPad = "0" + huc6WithPad;
                    }


                    content = "<div>" + obj['name'] + " watershed (HUC code: " + huc6WithPad + ")</div>";
                    boxWidth = (content.length - 10) * widthPerChar;
                    if (parseInt(obj['historicdiversity'], 10) == 0 && parseInt(obj['absoluteloss'], 10) == 0) {
                        //fishless
                        content += "<div>Fishless</div>";
                    } else {
                        content += "<div>" + (parseFloat(obj['percentloss']) * 100).toFixed(2) + "% reduction in fish species</div>";
                    }
                    boxSize = new OpenLayers.Size(boxWidth, 50);
                    if (innovate.popupbox[mapID]) {
                        innovate.popupbox[mapID].lonlat = map.getLonLatFromPixel(event.xy);
                        innovate.popupbox[mapID].setContentHTML(content);
                        innovate.popupbox[mapID].setSize(boxSize);
                        innovate.popupbox[mapID].panIntoView();
                        innovate.popupbox[mapID].updatePosition();
                        innovate.popupbox[mapID].show();
                    } else {
                        //first popup load - we will create a popup object
                        //and for next time we will reuse this object rather than creating a new one
                        innovate.popupbox[mapID] = new OpenLayers.Popup.FramedCloud(
                                "innovate_info_popup_" + mapID,
                                map.getLonLatFromPixel(event.xy),
                                boxSize,
                                content,
                                null,
                                true
                                );
                        innovate.popupbox[mapID].hide = function() {
                            this.div.style.display = 'none';
                            map.panTo(innovate.lastPopupCenter[mapID]);
                        }
                        map.addPopup(innovate.popupbox[mapID]);
                    }




                }
            }
        });
    }

    /*
     * handles the map click control for 'EPA map of radon zones'
     */
    this.click_radons = function(layerName) {
        if (layerName == "State Boundaries") {
            return null;
        }
        var map = innovateMapObj.map,
                layer = null,
                serviceURL = null,
                layers = map.layers.slice(),
                content = "",
                desc = null,
                img = null,
                priority = null;

        //because we don't want to query base layer
        for (var i = 0; i < layers.length; i++) {
            if (!(layers[i].isBaseLayer)) {
                layer = layers[i];
                serviceURL = layers[i].url;
                break;
            }
        }


        OpenLayers.ProxyHost = innovate.proxyURL;
        return new OpenLayers.Control.WMSGetFeatureInfo({
            layers: [layer],
            url: serviceURL,
            title: 'Identify features by clicking',
            queryVisible: true,
            eventListeners: {
                getfeatureinfo: function(event) {
                    var thisObject = new innovate.Controls(innovateMapObj)
                    obj = thisObject.makeObjectOutOfResponse(event.text);

                    var boxSize = null
                            , mapID = innovateMapObj.config.id;
                    //hide any open popup on click
                    if (innovate.popupbox[mapID]) {
                        $("#innovate_info_popup_" + mapID).hide();
                    }
                    if ($.isEmptyObject(obj) || obj === false) {
                        return;
                    }
                    innovate.lastPopupCenter[mapID] = map.getCenter();

                    if (obj['radonzone'] == 1) {
                        desc = "<b>Zone 1 </b>counties have a predicted average indoor radon screening level greater than 4 pCi/L (picocuries per liter) <b>(red zones)</b>";
                        priority = "<b>Highest Potential</b>";
                        img = "3b6a386668a6d07b8d8e029744820282";
                    } else if (obj['radonzone'] == 2) {
                        desc = "<b>Zone 2 </b>counties have a predicted average indoor radon screening level between 2 and 4 pCi/L <b>(orange zones)</b>";
                        priority = "<b>Moderate Potential</b>";
                        img = "52edb92fef3b3447d910ea3f4e3bad06";
                    } else if (obj['radonzone'] == 3) {
                        desc = "<b>Zone 3 </b>counties have a predicted average indoor radon screening level less than 2 pCi/L <b>(yellow zones)</b>";
                        priority = "<b>Low Potential</b>";
                        img = "d1573b09a0505bef245b2a380a18e380";
                    }
                    var stateName = obj['statename'], initCapedStateName = "";
                    stateName = stateName.split(" ");
                    for (var keys in stateName) {
                        initCapedStateName += stateName[keys].substr(0, 1) + stateName[keys].substr(1).toLowerCase() + " ";
                    }

                    var imgURL = innovate.mapServiceBaseURL["legend"] + innovateMapObj.config.legend["url"] + "/../0/images/" + img;
                    content = "<div>" + obj['namelsad'] + ", " + initCapedStateName + "</div>" +
                            "<div>Radon risk zone: " + obj['radonzone'] + "</div>" +
                            "<table style=\"width:420px\height:120px\"><tbody><tr style=\"background-color: #EEEEEE; border-color:#DDDDDD;border-style: solid; border-width: 1px 0 1px 0px;padding: 5px;\"><td valign=\"top\" align=\"center\"><div><img alt=\"\" src=\"" + imgURL + "\"></div></td>" +
                            "<td valign=\"top\" align=\"left\">" + desc + "</td>" +
                            "<td valign=\"top\" align=\"left\">" + priority + "</td></tr></tbody></table>";

                    boxSize = new OpenLayers.Size(450, 120);
                    if (innovate.popupbox[mapID]) {

                        innovate.popupbox[mapID].lonlat = map.getLonLatFromPixel(event.xy);
                        innovate.popupbox[mapID].setContentHTML(content);
                        innovate.popupbox[mapID].setSize(boxSize);
                        //innovate.popupbox[mapID].panIntoView();
                        //innovate.popupbox[mapID].updatePosition();
                        innovate.popupbox[mapID].show();
                    } else {
                        //first popup load - we will create a popup object
                        //and for next time we will reuse this object rather than creating a new one
                        innovate.popupbox[mapID] = new OpenLayers.Popup.FramedCloud(
                                "innovate_info_popup_" + mapID,
                                map.getLonLatFromPixel(event.xy),
                                boxSize,
                                content,
                                null,
                                true
                                );

                        innovate.popupbox[mapID].panMapIfOutOfView = true;
                        innovate.popupbox[mapID].hide = function() {
                            this.div.style.display = 'none';
                            map.panTo(innovate.lastPopupCenter[mapID]);
                        }
                        map.addPopup(innovate.popupbox[mapID]);
                    }
                }
            }
        });
    }



    this.click_biomasspersquaremile = function(layerName) {
        if (layerName == "State Boundaries") {
            return null;
        }
        var map = innovateMapObj.map,
                layer = null,
                serviceURL = null,
                layers = map.layers.slice(),
                content = "",
                desc = null,
                img = null,
                priority = null;

        //because we don't want to query base layer
        for (var i = 0; i < layers.length; i++) {
            if (!(layers[i].isBaseLayer)) {
                layer = layers[i];
                serviceURL = layers[i].url;
                break;
            }
        }

        OpenLayers.ProxyHost = innovate.proxyURL;
        return new OpenLayers.Control.WMSGetFeatureInfo({
            layers: [layer],
            url: serviceURL,
            title: 'Identify features by clicking',
            queryVisible: true,
            eventListeners: {
                getfeatureinfo: function(event) {
                    var thisObject = new innovate.Controls(innovateMapObj)
                    obj = thisObject.makeObjectOutOfResponse(event.text);

                    var boxSize = null
                            , mapID = innovateMapObj.config.id;

                    //hide any open popup on click if one is already open
                    if (innovate.popupbox[mapID]) {
                        $("#innovate_info_popup_" + mapID).hide();
                    }
                    if ($.isEmptyObject(obj) || obj === false) {
                        return;
                    }
                    innovate.lastPopupCenter[mapID] = map.getCenter();

                    var stateName = obj['statename'] ? obj['statename'] : ""
                            , cityName = obj['countyname'] ? obj['countyname'] : null
                            , biomass_sqmi = obj['biomass_sqmi'] ? parseFloat(obj['biomass_sqmi']).toFixed(3) : null;
                    
                    //if state is Puerto Rico
                    if(obj.statename.toString().toLowerCase()==="puerto rico"){
                        cityName = cityName.replace(/county$/ig,"");
                        cityName = $.trim(cityName);
                        cityName += " Municipality";
                    }
                    
                    content = "<div>" + cityName + ", " + stateName + "</div>";
                    if (biomass_sqmi != null)
                        content += "<div>" + biomass_sqmi + " million metric tons of forest carbon per square mile of land </div>";
                    else
                        content += "<div>No forest or no data</div>";

                    boxSize = new OpenLayers.Size(320, 80);
                    if (innovate.popupbox[mapID]) {

                        innovate.popupbox[mapID].lonlat = map.getLonLatFromPixel(event.xy);
                        innovate.popupbox[mapID].setContentHTML(content);
                        innovate.popupbox[mapID].setSize(boxSize);
                        //innovate.popupbox[mapID].panIntoView();
                        //innovate.popupbox[mapID].updatePosition();
                        innovate.popupbox[mapID].show();
                    } else {
                        //first popup load - we will create a popup object
                        //and for next time we will reuse this object rather than creating a new one
                        innovate.popupbox[mapID] = new OpenLayers.Popup.FramedCloud(
                                "innovate_info_popup_" + mapID,
                                map.getLonLatFromPixel(event.xy),
                                boxSize,
                                content,
                                null,
                                true
                                );

                        innovate.popupbox[mapID].panMapIfOutOfView = true;
                        innovate.popupbox[mapID].hide = function() {
                            this.div.style.display = 'none';
                            map.panTo(innovate.lastPopupCenter[mapID]);
                        }
                        map.addPopup(innovate.popupbox[mapID]);
                    }

                }
            }
        });
    }

    this.click_perchangecarbonstoreage = function(layerName) {
        if (layerName == "State Boundaries") {
            return null;
        }
        var map = innovateMapObj.map,
                layer = null,
                serviceURL = null,
                layers = map.layers.slice(),
                content = "",
                desc = null,
                img = null,
                priority = null;

        //because we don't want to query base layer
        for (var i = 0; i < layers.length; i++) {
            if (!(layers[i].isBaseLayer)) {
                layer = layers[i];
                serviceURL = layers[i].url;
                break;
            }
        }

        OpenLayers.ProxyHost = innovate.proxyURL;
        return new OpenLayers.Control.WMSGetFeatureInfo({
            layers: [layer],
            url: serviceURL,
            title: 'Identify features by clicking',
            queryVisible: true,
            eventListeners: {
                getfeatureinfo: function(event) {
                    var thisObject = new innovate.Controls(innovateMapObj)
                    obj = thisObject.makeObjectOutOfResponse(event.text);

                    var boxSize = null
                            , mapID = innovateMapObj.config.id;

                    //hide any open popup on click if one is already open
                    if (innovate.popupbox[mapID]) {
                        $("#innovate_info_popup_" + mapID).hide();
                    }
                    if ($.isEmptyObject(obj) || obj === false) {
                        return;
                    }
                    innovate.lastPopupCenter[mapID] = map.getCenter();

                    var stateName = obj['statename'] ? obj['statename'] : ""
                    , cityName = obj['countyname'] ? obj['countyname'] : null
                    , percentChange = obj['perentch_1'] ? parseFloat(obj['perentch_1']).toFixed(2) + "%" : null;
                    //if state is Puerto Rico
                    if(obj.statename.toString().toLowerCase()==="puerto rico"){
                        cityName = cityName.replace(/county$/ig,"");
                        cityName = $.trim(cityName);
                        cityName += " Municipality";
                    }
                    content = "<div>" + cityName + ", " + stateName + "</div>";
                    if (percentChange != null){
                        if(percentChange.substr(0,1)!="-"){
                            content += "<div>+" + percentChange + "</div>";
                        }else{
                            content += "<div>" + percentChange + "</div>";
                        }
                    }
                    else
                        content += "<div>No forest or no data</div>";


                    boxSize = new OpenLayers.Size(350, 60);
                    if (innovate.popupbox[mapID]) {

                        innovate.popupbox[mapID].lonlat = map.getLonLatFromPixel(event.xy);
                        innovate.popupbox[mapID].setContentHTML(content);
                        innovate.popupbox[mapID].setSize(boxSize);
                        //innovate.popupbox[mapID].panIntoView();
                        //innovate.popupbox[mapID].updatePosition();
                        innovate.popupbox[mapID].show();
                    } else {
                        //first popup load - we will create a popup object
                        //and for next time we will reuse this object rather than creating a new one
                        innovate.popupbox[mapID] = new OpenLayers.Popup.FramedCloud(
                                "innovate_info_popup_" + mapID,
                                map.getLonLatFromPixel(event.xy),
                                boxSize,
                                content,
                                null,
                                true
                                );

                        innovate.popupbox[mapID].panMapIfOutOfView = true;
                        innovate.popupbox[mapID].hide = function() {
                            this.div.style.display = 'none';
                            map.panTo(innovate.lastPopupCenter[mapID]);
                        }
                        map.addPopup(innovate.popupbox[mapID]);
                    }

                }
            }
        });
    }

    this.click_longislandhypoxia = function(layerName) {
        if (layerName == "State Boundaries") {
            return null;
        }
        var map = innovateMapObj.map,
                serviceURL = null,
                thisObject = null,
                widthPerChar = 7,
                boxWidth = 0,
                content = "";

        OpenLayers.ProxyHost = innovate.proxyURL;
        return new OpenLayers.Control.WMSGetFeatureInfo({
            url: serviceURL,
            title: 'Identify features by clicking',
            queryVisible: true,
            eventListeners: {
                getfeatureinfo: function(event) {
                    var thisObject = new innovate.Controls(innovateMapObj)
                    obj = thisObject.makeObjectOutOfResponse(event.text);

                    var boxSize = null
                            , mapID = innovateMapObj.config.id;
                    //hide any open popup on click
                    if (innovate.popupbox[mapID]) {
                        $("#innovate_info_popup_" + mapID).hide();
                    }
                    if ($.isEmptyObject(obj) || obj === false || !(obj['minimumwinklervaluelowestdissolvedoxygenatthatsite'])) {
                        return;
                    }
                    innovate.lastPopupCenter[mapID] = map.getCenter();

                    content = "<div>Dissolved oxygen concentration:  " + obj['minimumwinklervaluelowestdissolvedoxygenatthatsite'] + " mg/L </div>";
                    boxWidth = (content.length - 10) * widthPerChar;

                    boxSize = new OpenLayers.Size(boxWidth, 25);
                    if (innovate.popupbox[mapID]) {
                        innovate.popupbox[mapID].lonlat = map.getLonLatFromPixel(event.xy);
                        innovate.popupbox[mapID].setContentHTML(content);
                        innovate.popupbox[mapID].setSize(boxSize);
                        innovate.popupbox[mapID].panIntoView();
                        innovate.popupbox[mapID].updatePosition();
                        innovate.popupbox[mapID].show();
                    } else {
                        //first popup load - we will create a popup object
                        //and for next time we will reuse this object rather than creating a new one
                        innovate.popupbox[mapID] = new OpenLayers.Popup.FramedCloud(
                                "innovate_info_popup_" + mapID,
                                map.getLonLatFromPixel(event.xy),
                                boxSize,
                                content,
                                null,
                                true
                                );
                        innovate.popupbox[mapID].hide = function() {
                            this.div.style.display = 'none';
                            map.panTo(innovate.lastPopupCenter[mapID]);
                        }
                        map.addPopup(innovate.popupbox[mapID]);
                    }

                }
            }
        });
    }


    this.click_sealevelrelative = function(layerName) {
        if (layerName === "State Boundaries") {
            return null;
        }
        var map = innovateMapObj.map,
                layer = null,
                serviceURL = null,
                thisObject = null,
                popup = null,
                layers = map.layers.slice(),
                content = "",
                widthPerChar = 6,
                boxWidth = 0,
                increase = false;

        for (var i = 0; i < layers.length; i++) {
            if (!(layers[i].isBaseLayer)) {
                layer = layers[i];
                serviceURL = layers[i].url;
                break;
            }
        }

        return new OpenLayers.Control.SelectFeature(layer, {
            onSelect: createPopup,
            onUnselect: destroyPopup
        })


        function createPopup(feature) {
            var boxSize = null
                    , mapID = innovateMapObj.config.id;
            //hide any open popup on click
            if (innovate.popupbox[mapID]) {
                $("#innovate_info_popup_" + mapID).hide();
            }

            innovate.lastPopupCenter[mapID] = map.getCenter();

            if (parseFloat(feature.attributes.mm_per_year) > 0) {
                increase = "Rising";
            } else {
                increase = "Falling";
            }
            content = "<div>Relative sea level change, 1960-2012: ";
            if (increase === "Rising") {
                content += "+";
            }
            content += feature.attributes.mm_per_year.toFixed(2) + " millimeters per year</div>";
            boxWidth = (content.length - 10) * widthPerChar;

            var css = (increase === "Rising") ? "bottom" : "top";
            content += '<table border="0"><tr><td><img src="' + feature.attributes.image + '" ></td><td style="vertical-align:' + css + '; padding-bottom:5px;">' + increase + '</td></tr></table>';

            var state = feature.attributes.State ? feature.attributes.State : "";
            var stationName = $.trim(feature.attributes.Station_Name + ", " + state);
            stationName = stationName.replace(/,$/, "");

            content = "<div>" + stationName + "</div>" + content;//first line 
            //because IE is annoying
            if (innovate.getInternetExplorerVersion() != -1 && parseInt(innovate.getInternetExplorerVersion()) <= 8) {
                boxSize = new OpenLayers.Size(boxWidth, 160);
            } else if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
                boxSize = new OpenLayers.Size(boxWidth, 130);
            } else {
                boxSize = new OpenLayers.Size(boxWidth, 110);
            }
            if (innovate.popupbox[mapID]) {
                innovate.popupbox[mapID].lonlat = feature.geometry.getBounds().getCenterLonLat();
                innovate.popupbox[mapID].setContentHTML(content);
                innovate.popupbox[mapID].setSize(boxSize);
                innovate.popupbox[mapID].panIntoView();
                innovate.popupbox[mapID].updatePosition();
                innovate.popupbox[mapID].show();
            } else {
                //first popup load - we will create a popup object
                //and for next time we will reuse this object rather than creating a new one
                innovate.popupbox[mapID] = new OpenLayers.Popup.FramedCloud(
                        "innovate_info_popup_" + mapID,
                        feature.geometry.getBounds().getCenterLonLat(),
                        boxSize,
                        content,
                        null,
                        true
                        );
                innovate.popupbox[mapID].hide = function() {
                    this.div.style.display = 'none';
                    map.panTo(innovate.lastPopupCenter[mapID]);
                }
                map.addPopup(innovate.popupbox[mapID]);
            }

        }

        function destroyPopup(feature) {
            var mapID = innovateMapObj.config.id;
            if (innovate.popupbox[mapID]) {
                $("#innovate_info_popup_" + mapID).hide();
            }
        }


    }


    this.click_GulfOfMexicoHypoxia = function(layerName) {
        if (layerName == "State Boundaries") {
            return null;
        }

        var map = innovateMapObj.map,
                layer = null,
                serviceURL = null,
                content = "",
                widthPerChar = 7,
                boxWidth = 0,
                layers = map.layers.slice();

        for (var i = 0; i < layers.length; i++) {
            if (!(layers[i].isBaseLayer)) {
                layer = layers[i];
                serviceURL = layers[i].url;
                break;
            }
        }


        OpenLayers.ProxyHost = innovate.proxyURL;
        return new OpenLayers.Control.WMSGetFeatureInfo({
            layers: [layer],
            url: serviceURL,
            title: 'Identify features by clicking',
            queryVisible: true,
            eventListeners: {
                getfeatureinfo: function(event) {
                    var mapID = innovateMapObj.config.id;
                    var thisObject = new innovate.Controls(innovateMapObj);
                    var obj = thisObject.makeObjectOutOfResponse(event.text);
                    var boxSize = null;
                    //hide any open popup on click
                    if (innovate.popupbox[mapID]) {
                        //innovate.popupbox[mapID].hide(); cannot do this because it sometime causes the popup to not have enough space at the edges
                        $("#innovate_info_popup_" + mapID).hide();
                    }
                    if ($.isEmptyObject(obj) || obj === false) {
                        return;
                    }
                    innovate.lastPopupCenter[mapID] = map.getCenter();
                    if (!(obj["bott_do"])) {
                        return;
                    }
                    content = "<div>" + obj['lat_dec'] + "°N, " + obj['long_dec'] + "°W</div>";
                    content += "<div> Dissolved oxygen concentration: " + obj["bott_do"] + " mg/L</div>"
                    boxWidth = 300;

                    boxSize = new OpenLayers.Size(boxWidth, 50);
                    if (innovate.popupbox[mapID]) {
                        innovate.popupbox[mapID].lonlat = map.getLonLatFromPixel(event.xy);
                        innovate.popupbox[mapID].setContentHTML(content);
                        innovate.popupbox[mapID].setSize(boxSize);
                        innovate.popupbox[mapID].panIntoView();
                        innovate.popupbox[mapID].updatePosition();
                        innovate.popupbox[mapID].show();
                    } else {
                        //first popup load - we will create a popup object
                        //and for next time we will reuse this object rather than creating a new one
                        innovate.popupbox[mapID] = new OpenLayers.Popup.FramedCloud(
                                "innovate_info_popup_" + mapID,
                                map.getLonLatFromPixel(event.xy),
                                boxSize,
                                content,
                                null,
                                true
                                );
                        innovate.popupbox[mapID].hide = function() {
                            this.div.style.display = 'none';
                            map.panTo(innovate.lastPopupCenter[mapID]);
                        }
                        map.addPopup(innovate.popupbox[mapID]);
                    }
                }
            }
        });
    }
}