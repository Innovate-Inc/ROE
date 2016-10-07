//handles all the layers related tasks
innovate.Layers = function(innovateMapObj) {

    var currentObject = this;
    this.config = innovateMapObj.config;
    this.maxSulfurValue = null;
    this.nitrogenPieSizeRatio = null;
    this.wms_totalnitrogendeposition_data = {};//added later so that we don't need to make extra HTTP requets when the layers are getting generated'
    this.sulfurPieSizeRatio = null;
    this.wms_totalsulfurdeposition_data = {};//added later so that we don't need to make extra HTTP requets when the layers are getting generated'
    
    /*
     * This function returns maximum size to maximum value ratio so that we can use this ratio to define size of pie charts for other data points 
     */
    this.getTotalSulfurDepositionPieSizeRatio = function() {
        if (currentObject.sulfurPieSizeRatio != null)
            return currentObject.sulfurPieSizeRatio;

        var featureURL = {
            "1989-1991": innovate.proxyURL + escape(innovate.mapServiceBaseURL.legend + "ROE_TotalSulfurDeposition1989_1991/MapServer/1/query?where=1%3D1&outSR=3857&f=json&pretty=true&outFields=DRY_S,WET_S,TOTAL_S")
                    ,
            "2009-2011": innovate.proxyURL + escape(innovate.mapServiceBaseURL.legend + "ROE_TotalSulfurDeposition2011/MapServer/1/query?where=1%3D1&outSR=3857&f=json&pretty=true&outFields=DRY_SULFUR,WET_SULFUR,TOTAL_SULFUR")
        };

        var maxVal = 0, totalS = 0, maxSize = 160;

        $.ajax({
            type: "GET",
            url: featureURL["1989-1991"],
            dataType: 'json',
            async: false,
            success: function(data) {
                currentObject.wms_totalsulfurdeposition_data["1989-1991"] = data["features"];
            }
        });
        $.ajax({
            type: "GET",
            url: featureURL["2009-2011"],
            dataType: 'json',
            async: false,
            success: function(data) {
                for (var i = 0, len = data["features"].length; i < len; i++) {
                    data["features"][i]["attributes"]["DRY_S"] = data["features"][i]["attributes"]["DRY_SULFUR"];
                    data["features"][i]["attributes"]["WET_S"] = data["features"][i]["attributes"]["WET_SULFUR"];
                    data["features"][i]["attributes"]["TOTAL_S"] = data["features"][i]["attributes"]["TOTAL_SULFUR"];
                }
                currentObject.wms_totalsulfurdeposition_data["2009-2011"] = data["features"];
            }
        });

        for (var keys in currentObject.wms_totalsulfurdeposition_data["1989-1991"]) {
            totalS = parseFloat(currentObject.wms_totalsulfurdeposition_data["1989-1991"][keys]["attributes"]["TOTAL_S"]);
            if (parseFloat(totalS) > parseFloat(maxVal)) {
                maxVal = totalS;
            }
        }
        for (keys in currentObject.wms_totalsulfurdeposition_data["2009-2011"]) {
            totalS = parseFloat(currentObject.wms_totalsulfurdeposition_data["2009-2011"][keys]["attributes"]["TOTAL_SULFUR"]);
            if (parseFloat(totalS) > parseFloat(maxVal)) {
                maxVal = totalS;
            }
        }
        currentObject.sulfurPieSizeRatio = maxSize / maxVal;
        return currentObject.sulfurPieSizeRatio;
    }

    /*
     * This function returns maximum size to maximum value ratio so that we can use this ratio to define size of pie charts for other data points 
     */
    this.getTotalNitrogenDepositionPieSizeRatio = function() {
        if (currentObject.nitrogenPieSizeRatio != null)
            return currentObject.nitrogenPieSizeRatio;

        var featureURL = {
            "1989-1991": innovate.proxyURL + escape(innovate.mapServiceBaseURL.legend + "ROE_TotalNitrogenDeposition1989_1991/MapServer/1/query?where=1%3D1&outSR=3857&f=json&pretty=true&outFields=DRY_N,WET_N,TOTAL_N")
                    ,
            "2009-2011": innovate.proxyURL + escape(innovate.mapServiceBaseURL.legend + "ROE_TotalNitrogenDeposition2011/MapServer/1/query?where=1%3D1&outSR=3857&f=json&pretty=true&outFields=DRY_NITROGEN,WET_NITROGEN,TOTAL_NITROGEN")
        };

        var maxVal = 0, totalS = 0, maxSize = 40, ratio;

        $.ajax({
            type: "GET",
            url: featureURL["1989-1991"],
            dataType: 'json',
            async: false,
            success: function(data) {
                currentObject.wms_totalnitrogendeposition_data["1989-1991"] = data["features"];
            }
        });
        $.ajax({
            type: "GET",
            url: featureURL["2009-2011"],
            dataType: 'json',
            async: false,
            success: function(data) {
                for (var i = 0, len = data["features"].length; i < len; i++) {
                    data["features"][i]["attributes"]["DRY_N"] = data["features"][i]["attributes"]["DRY_NITROGEN"];
                    data["features"][i]["attributes"]["WET_N"] = data["features"][i]["attributes"]["WET_NITROGEN"];
                    data["features"][i]["attributes"]["TOTAL_N"] = data["features"][i]["attributes"]["TOTAL_NITROGEN"];
                }
                currentObject.wms_totalnitrogendeposition_data["2009-2011"] = data["features"];
            }
        });

        for (var keys in currentObject.wms_totalnitrogendeposition_data["1989-1991"]) {
            totalS = parseFloat(currentObject.wms_totalnitrogendeposition_data["1989-1991"][keys]["attributes"]["TOTAL_N"]);
            if (parseFloat(totalS) > parseFloat(maxVal)) {
                maxVal = totalS;
            }
        }
        for (keys in currentObject.wms_totalnitrogendeposition_data["2009-2011"]) {
            totalS = parseFloat(currentObject.wms_totalnitrogendeposition_data["2009-2011"][keys]["attributes"]["TOTAL_NITROGEN"]);
            if (parseFloat(totalS) > parseFloat(maxVal)) {
                maxVal = totalS;
            }
        }


        currentObject.nitrogenPieSizeRatio = maxSize / maxVal;
        return currentObject.nitrogenPieSizeRatio;
    }
    
    
    /*
     * This property defined the resolution ratios for bing and argis base maps
     */
    this.layerTypeBasedConfig = {
        "arcgis": {
            "resolutions": [
                156543.033928, 78271.5169639999, 39135.7584820001, 19567.8792409999, 9783.93962049996, 4891.96981024998, 2445.98490512499
                        , 1222.99245256249, 611.49622628138, 305.748113140558, 152.874056570411, 76.4370282850732, 38.2185141425366, 19.1092570712683
                        , 9.55462853563415, 4.77731426794937, 2.38865713397468, 1.19432856685505, 0.597164283559817, 0.298582141647617
            ],
            "origin": [-20037508.342787, 20037508.342787]
        }
        ,
        "bing": {
            "resolutions": [
                156543.03390625, 78271.516953125, 39135.7584765625, 19567.87923828125, 9783.939619140625, 4891.9698095703125,
                2445.9849047851562, 1222.9924523925781, 611.4962261962891, 305.74811309814453, 152.87405654907226, 76.43702827453613,
                38.218514137268066, 19.109257068634033, 9.554628534317017, 4.777314267158508, 2.388657133579254, 1.194328566789627,
                0.5971642833948135, 0.29858214169740677, 0.14929107084870338, 0.07464553542435169
            ]
        }
    };

    
    /*
     * This function checks if the given later is baselayer or not
     * @param   layerName   String      name of the layer
     * @return  boolean     true if the layer represented by layerName is baselayer else returns false
     */
    this.getBaseLayerType = function(layerName) {
        if (typeof layerName == "undefined") {
            for (var i = 0; i < this.config.baseMap.length; i++) {
                if (this.layerDefinitions[this.config.baseMap[i]])
                    return this.layerDefinitions[this.config.baseMap[i]]["type"];
            }
            return false;
        } else if (typeof layerName == "string") {
            return this.layerDefinitions[layerName]["type"];
        }
        return false;
    }

    //return a WMS layer object
    /*
     * This function returns WMS layer
     * @param   curLayerDef     Object
     * @return  Object
     */
    this.getWMSLayer = function(curLayerDef) {
        //to get to the wms configurations values 
        //you can go to ROE/LongIslandHypoxia/MapServer/WMSServer?service=WMS&request=GetCapabilities
        //for max extent go to http://www.fishcda.com/ArcGIS/rest/services/ROE/NLCD/MapServer
        var layers = [];

        return new OpenLayers.Layer.WMS(
                curLayerDef["name"]
                , (curLayerDef["url"].indexOf("http://") == -1 ? (innovate.mapServiceBaseURL["map"] + curLayerDef["url"]) : curLayerDef["url"])
                , {
            layers: curLayerDef["layers"],
            transparent: 'true',
            format: 'image/png',
            exceptions: 'application/vnd.ogc.se_inimage'
        }
        , {
            opacity: currentObject.config['opacity'],
            transitionEffect: 'resize',
            isBaseLayer: false,
            displayInLayerSwitcher: curLayerDef["displayInLayerSwitcher"] ? curLayerDef["displayInLayerSwitcher"] : true,
            wrapDateLine: curLayerDef["wrapDateLine"] ? curLayerDef["wrapDateLine"] : false
        }
        );
    }

    //build ArcGISCache layer and return it
    this.getArcGISCacheLayer = function(curLayerDef) {
        var layerObj = new OpenLayers.Layer.ArcGISCache(
                curLayerDef.name
                , "http://server.arcgisonline.com/ArcGIS/rest/services/" + curLayerDef.url,
                {
                    tileOrigin: new OpenLayers.LonLat(currentObject.layerTypeBasedConfig["arcgis"].origin[0], currentObject.layerTypeBasedConfig["arcgis"].origin[1]),
                    resolutions: currentObject.getResolutionList("arcgis"),
                    //resolutions: currentObject.layerTypeBasedConfig["arcgis"]["resolutions"],
                    sphericalMercator: true,
                    maxExtent: new OpenLayers.Bounds(currentObject.config.maxExtent[0], currentObject.config.maxExtent[1], currentObject.config.maxExtent[2], currentObject.config.maxExtent[3]),
                    useArcGISServer: true,
                    isBaseLayer: curLayerDef.baseLayer,
                    type: 'jpg',
                    projection: currentObject.config.projection
                }
        );
        return layerObj;
    }

    //return a layer object from the name provided
    this.getLayer = function(layerIdentifier) {
        return this.layerDefinitions[layerIdentifier].object();
    }

    //get resolution list from the zoom level defined in the config
    this.getResolutionList = function(layerType) {
        var resolutionList = []
                , count = 0
                , start = layerType == "arcgis" ? 0 : this.config['startResolution']
                , end = this.config['endResolution'] ? this.config['endResolution'] : (this.layerTypeBasedConfig[layerType].resolutions.length);
        for (var i = start; i <= end; i++) {
            resolutionList[count++] = this.layerTypeBasedConfig[layerType].resolutions[i];
        }
        return resolutionList;
    }

    //holds all the parameters needed to create a layer object
    this.layerDefinitions = {
        'wms_roefishloss': {
            "name": "Fish Faunal Loss",
            "url": "ROE_FishFaunaAbsoluteLoss/MapServer/WMSServer",
            "layers": "0",
            "object": function() {
                return currentObject.getWMSLayer(this);

            }
        },
        'wms_stateboundaries': {
            "name": "State Boundaries",
            "url": "ROE_StateBoundaries/MapServer/WMSServer",
            "layers": "0",
            //"displayInLayerSwitcher":false,
            "object": function() {
                return currentObject.getWMSLayer(this);

            }
        }
        ,
        'wms_stateboundariesThick': {
            "name": "State Boundaries",
            "url": "ROE_StateBoundariesThicker/MapServer/WMSServer",
            "layers": "0",
            //"displayInLayerSwitcher":false,
            "object": function() {
                return currentObject.getWMSLayer(this);

            }
        }
        ,
        'wms_fishfaunapercentloss': {
            "name": "Fish Faunal Intactness",
            "url": "ROE_FishFaunaPercentLoss/MapServer/WMSServer",
            "layers": "0",
            "object": function() {
                return currentObject.getWMSLayer(this);

            }
        }
        ,
        'wms_precipitation': {
            "name": "Precipitation 2013",
            "url": "ROE_Precipitation/MapServer/WMSServer",
            //"url": "http://it.innovateteam.com/arcgis/services/ROE/ROE_Precipitation2013/MapServer/WMSServer",
            "layers": ["0"],
            "object": function() {
                return currentObject.getWMSLayer(this);

            }
        }
        ,
        'wms_temperature': {
            "name": "Temperature 2013",
            "url":"ROE_Temperature/MapServer/WMSServer",
           //"url":"http://it.innovateteam.com/arcgis/services/ROE/ROE_Temperature2013/MapServer/WMSServer",
            "layers": "0",
            "object": function() {
                return currentObject.getWMSLayer(this);

            }
        }
        ,
        'wms_sea_level_absolute': {
            "name": "Sea Level",
            "url":"ROE_SeaLevelAbsolute/MapServer/WMSServer",
            //"url":"http://it.innovateteam.com/arcgis/services/ROE/ROE_SeaLevelAbsolute2013/MapServer/WMSServer",
            "layers": ["0"],
            "wrapDateLine": true,
            "object": function() {
                return currentObject.getWMSLayer(this);

            }
        }
        ,
        'wms_sea_level_relative':{
            "name":"Sea Level",
            "url":"ROE_SeaLevelRelative/MapServer/WMSServer",
            "layers": ["0","1"],
            "object":function(){
                //example http://harrywood.co.uk/maps/examples/openlayers/marker-popups.html
                // or http://dev.openlayers.org/releases/OpenLayers-2.11/examples/popupMatrix.html
                var vectorLayer = new OpenLayers.Layer.Vector("Sea Level");
                var legendURL = innovate.mapServiceBaseURL.legend;
				//This controls whether or not the symbology displays on the map
                //legendURL = "http://it.innovateteam.com/arcgis/rest/services/ROE/";
				legendURL = "http://geodata.epa.gov/arcgis/rest/services/ORD/";
                
                var featureURL = innovate.proxyURL+escape(innovate.mapServiceBaseURL.legend+"ROE_SeaLevelRelative/MapServer/0/query?where=1=1&outSR=3857&f=json&pretty=true&outFields=Station_Name,mm_per_year,label,State");
                
				var dataURL = innovate.proxyURL+escape(innovate.mapServiceBaseURL.legend+"ROE_SeaLevelRelative/MapServer/1?f=json&pretty=true");
                
				//Commented out by AW on 8/9/13
				//This is the source of the parsing error (we think), and it affects the sidebar display.
                //featureURL = innovate.proxyURL+escape("http://it.innovateteam.com/arcgis/rest/services/ROE/ROE_SeaLevelRelative2013/MapServer/0/query?where=1=1&outSR=3857&f=json&pretty=true&outFields=Station_Name,mm_per_year,label,State");
				featureURL = innovate.proxyURL+escape("http://geodata.epa.gov/arcgis/rest/services/ORD/ROE_SeaLevelRelative/MapServer/0/query?where=1=1&outSR=3857&f=json&pretty=true&outFields=Station_Name,mm_per_year,label,State");
				//featureURL = innovate.proxyURL+escape("ROE_SeaLevelRelative/MapServer/0/query?where=1=1&outSR=3857&f=json&pretty=true&outFields=Station_Name,mm_per_year,label,State");
                
				//Commented out by AW on 8/9/13
				//This controls whether or not the layer displays. 
				//dataURL = innovate.proxyURL+escape("http://it.innovateteam.com/arcgis/rest/services/ROE/ROE_SeaLevelRelative2013/MapServer/1?f=json&pretty=true");
				dataURL = innovate.proxyURL+escape("http://geodata.epa.gov/arcgis/rest/services/ORD/ROE_SeaLevelRelative/MapServer/1?f=json&pretty=true");
                
                var layerData = {};
                var getImageURL = function(val){
                    for(var keys in layerData){
                       //console.log(layerData[keys]["label"].toString().toLowerCase()+"==="+val.toString().toLowerCase());
                        if(layerData[keys]["label"].toString().toLowerCase()===val.toString().toLowerCase()){
                            var url = layerData[keys]["symbol"]["url"];
                            //Commented out by AW on 08/09/13
							//return legendURL+"ROE_SeaLevelRelative2013/MapServer/1/images/"+url;
							return legendURL+"ROE_SeaLevelRelative/MapServer/1/images/"+url;
                            break;
                        }
                    }
                    return null;
                }
                //fetch the data related to marker points first
               
                $.ajax({
                    type: "GET",
                    url: dataURL,
                    dataType: 'json',
                    async : false,
                    success: function(data){
                        layerData = data["drawingInfo"]["renderer"]["uniqueValueInfos"];
                    }
                });
                
                
                $.ajax({
                    type: "GET",
                    url: featureURL,
                    dataType: 'json',
                    async : false,
                    error : function(jqXHR, textStatus, errorThrown){
                        alert(textStatus+" on request "+featureURL);
                    },
                    success: function(data){
                         
                        for(var keys in data["features"]){
                            var x = data["features"][keys]["geometry"]["x"];
                            var y = data["features"][keys]["geometry"]["y"];
                            var trndVal = parseFloat(data["features"][keys]["attributes"]["mm_per_year"]);
                            var label = (data["features"][keys]["attributes"]["Label"]);
                            var attributes = data["features"][keys]["attributes"];
                            attributes["image"] = getImageURL(label);
                            
                            var xOff = -12;
                            var yOff = -10;
                            if(trndVal>0){
                                xOff = -15;
                                yOff = -28;
                            }else{
                                xOff = -15;
                                yOff = 0;
                            }
                            
                            var feature = new OpenLayers.Feature.Vector(
                                new OpenLayers.Geometry.Point( x, y  ),attributes,
                                {
                                    externalGraphic: getImageURL(label), 
                                    graphicHeight: 30, 
                                    graphicWidth: 30, 
                                    graphicXOffset:xOff, 
                                    graphicYOffset:yOff
                                }
                                );  
                            vectorLayer.addFeatures(feature);
                        }
                    }
                });
                return vectorLayer;
            }
        } 
        ,
        'wms_nlcd': {
            "name": "NLCD",
            "url": "ROE_NLCD/MapServer/WMSServer",
            "layers": ["0"],
            "object": function() {
                return currentObject.getWMSLayer(this);
            }
        },
        'wms_radons': {
            "name": "Radon",
            "url": "ROE_Radon/MapServer/WMSServer",
            "layers": ["0"],
            "object": function() {
                return currentObject.getWMSLayer(this);

            }
        },
        'wms_longislandhypoxia': {
            "name": "Long Island Hypoxia ",
            "url": "ROE_LongIslandHypoxia/MapServer/WMSServer",
            "layers": ["0", "1"],
            "object": function() {
                return currentObject.getWMSLayer(this);
            }
        },
        'wms_acidsensitivewaters': {
            "name": "Acid Sensitive Waters",
            "url": "ROE_AcidSensitiveWaters/MapServer/WMSServer",
            "layers": ["0"],
            "object": function() {
                return currentObject.getWMSLayer(this);
            }
        },
        'wms_wetnitratedeposition1989-1991': {
            "name": "Wet Nitrate Deposition 1989 - 1991",
            "url": "ROE_WetNitrateDeposition1989_1991/MapServer/WMSServer",
            "time frame": "1989-1991",
            "layers": ["0"],
            "object": function() {
                return currentObject.getWMSLayer(this);
            }
        },
        'wms_wetnitratedeposition2008-2010': {
            "name": "Wet Nitrate Deposition 2008-2010",
            "url": "ROE_WetNitrateDeposition2008_2010/MapServer/WMSServer",
            "time frame": "2008-2010",
            "layers": ["0", "1"],
            "object": function() {
                return currentObject.getWMSLayer(this);
            }
        },
        'wms_wetnitratedeposition2009-2011': {
            "name": "Wet Nitrate Deposition 2009-2011",
            "url": "ROE_WetNitrateDeposition2009_2011/MapServer/WMSServer",
            "time frame": "2009-2011",
            "layers": ["0"],
            "object": function() {
                return currentObject.getWMSLayer(this);
            }
        },
        'wms_gulfofmexicohypoxia': {
            "name": "Gulf Of Mexico Hypoxia 2012",
            "url":"ROE_GulfofMexicoHypoxia/MapServer/WMSServer",
            //"url":"http://it.innovateteam.com/arcgis/services/ROE/ROE_GulfofMexicoHypoxia2012/MapServer/WMSServer",
            "layers": ["0","1"],
            "object": function() {
                return currentObject.getWMSLayer(this);

            }
        },
        'wms_wetsulfatedeposition1989-1991': {
            "name": "Wet Sulfate Deposition 1989-1991",
            "url": "ROE_WetSulfateDeposition1989_1991/MapServer/WMSServer",
            "layers": ["0"],
            "time frame": "1989-1991",
            "object": function() {
                return currentObject.getWMSLayer(this);
            }
        },
        'wms_wetsulfatedeposition2008-2010': {
            "name": "Wet Sulfate Deposition 2008-2010",
            "url": "ROE_WetSulfateDeposition2008-2010/MapServer/WMSServer",
            "time frame": "2008-2010",
            "layers": ["0", "1"],
            "object": function() {
                return currentObject.getWMSLayer(this);
            }
        },
        'wms_wetsulfatedeposition2009-2011': {
            "name": "Wet Sulfate Deposition 2009-2011",
            "url": "ROE_WetSulfateDeposition2009_2011/MapServer/WMSServer",
            "time frame": "2009-2011",
            "layers": ["0"],
            "object": function() {
                return currentObject.getWMSLayer(this);
            }
        },
        'wms_totalnitrogendeposition1989-1991': {
            "name": "Total Nitrogen Deposition 1989-1991",
            "url": "ROE_TotalNitrogenDeposition1989_1991/MapServer/WMSServer",
            "layers": ["0", "1"],
            "time frame": "1989-1991",
            "object": function() {
                //return currentObject.getWMSLayer(this);
                //example http://harrywood.co.uk/maps/examples/openlayers/marker-popups.html
                // or http://dev.openlayers.org/releases/OpenLayers-2.11/examples/popupMatrix.html
                var vectorLayer = new OpenLayers.Layer.Vector("Total Nitrogen Deposition 1989-1991");

                var layerData = {};
                var ratio = currentObject.getTotalNitrogenDepositionPieSizeRatio();
                var getImageURL = function(dry_n, total_n) {
                    var percent = Math.round((parseFloat(dry_n) * 100.0) / parseFloat(total_n));
                    return "images/pies/nitrogen/dry_" + percent + ".png";
                }
                //fetch the data related to marker points first

                layerData = currentObject.wms_totalnitrogendeposition_data["1989-1991"];
                for (var keys in layerData) {
                    var x = layerData[keys]["geometry"]["x"];
                    var y = layerData[keys]["geometry"]["y"];
                    var attributes = layerData[keys]["attributes"];
                    var size = Math.ceil(attributes["TOTAL_N"] * ratio);

                    attributes["image"] = getImageURL(attributes["DRY_N"], attributes["TOTAL_N"]);
                    attributes["image_size"] = parseInt(size) + 20;

                    var feature = new OpenLayers.Feature.Vector(
                            new OpenLayers.Geometry.Point(x, y), attributes,
                            {
                                externalGraphic: getImageURL(attributes["DRY_N"], attributes["TOTAL_N"]),
                                graphicHeight: size,
                                graphicWidth: size,
                                graphicXOffset: (-1 * (size / 2)),
                                graphicYOffset: (-1 * (size / 2))
                            }
                    );
                    vectorLayer.addFeatures(feature);
                }
                return vectorLayer;
            }
        },
        'wms_totalnitrogendeposition2009-2011': {
            "name": "Total Nitrogen Deposition 2009-2011",
            "url": "ROE_TotalNitrogenDeposition2011/MapServer/WMSServer",
            "layers": ["0", "1"],
            "time frame": "2009-2011",
            "object": function() {
                //return currentObject.getWMSLayer(this);
                //example http://harrywood.co.uk/maps/examples/openlayers/marker-popups.html
                // or http://dev.openlayers.org/releases/OpenLayers-2.11/examples/popupMatrix.html
                var vectorLayer = new OpenLayers.Layer.Vector("Total Nitrogen Deposition 2009-2011");
                var layerData = {}, offset;
                var ratio = currentObject.getTotalNitrogenDepositionPieSizeRatio();
                var getImageURL = function(dry_n, total_n) {
                    var percent = Math.round((parseFloat(dry_n) * 100.0) / parseFloat(total_n));
                    if (isNaN(percent)) {
                        console.log(dry_n + " " + total_n);
                    }
                    return "images/pies/nitrogen/dry_" + percent + ".png";
                }
                //fetch the data related to marker points first
                layerData = currentObject.wms_totalnitrogendeposition_data["2009-2011"];

                for (var keys in layerData) {
                    var x = layerData[keys]["geometry"]["x"];
                    var y = layerData[keys]["geometry"]["y"];
                    var attributes = layerData[keys]["attributes"];
                    var size = Math.ceil(attributes["TOTAL_N"] * ratio);

                    attributes["image"] = getImageURL(attributes["DRY_N"], attributes["TOTAL_N"]);
                    attributes["image_size"] = parseInt(size) + 20;
                    offset = (-1 * (size / 2));

                    var feature = new OpenLayers.Feature.Vector(
                            new OpenLayers.Geometry.Point(x, y), attributes,
                            {
                                externalGraphic: getImageURL(attributes["DRY_N"], attributes["TOTAL_N"]),
                                graphicHeight: size,
                                graphicWidth: size,
                                graphicXOffset: offset,
                                graphicYOffset: offset
                            }
                    );
                    vectorLayer.addFeatures(feature);
                }

                return vectorLayer;
            }
        },
        'wms_totalnitrogendeposition2007-2009': {
            "name": "Total Nitrogen Deposition 2007-2009",
            "url": "ROE_TotalNitrogenDeposition2007-2009/MapServer/WMSServer",
            "layers": ["0", "1"],
            "time frame": "2007-2009",
            "object": function() {

                //return currentObject.getWMSLayer(this);
                //example http://harrywood.co.uk/maps/examples/openlayers/marker-popups.html
                // or http://dev.openlayers.org/releases/OpenLayers-2.11/examples/popupMatrix.html
                var vectorLayer = new OpenLayers.Layer.Vector("Total Nitrogen Deposition 2007-2009");
                var layerData = {}, offset;
                var ratio = currentObject.getTotalNitrogenDepositionPieSizeRatio();
                var getImageURL = function(dry_n, total_n) {
                    var percent = Math.round((parseFloat(dry_n) * 100.0) / parseFloat(total_n));
                    if (isNaN(percent)) {
                        console.log(dry_n + " " + total_n);
                    }
                    return "images/pies/nitrogen/dry_" + percent + ".png";
                }
                //fetch the data related to marker points first
                layerData = currentObject.wms_totalnitrogendeposition_data["2007-2009"];
                for (var keys in layerData) {
                    var x = layerData[keys]["geometry"]["x"];
                    var y = layerData[keys]["geometry"]["y"];
                    var attributes = layerData[keys]["attributes"];
                    var size = Math.ceil(attributes["TOTAL_N"] * ratio);

                    attributes["image"] = getImageURL(attributes["DRY_N"], attributes["TOTAL_N"]);
                    attributes["image_size"] = parseInt(size) + 20;
                    offset = (-1 * (size / 2));

                    var feature = new OpenLayers.Feature.Vector(
                            new OpenLayers.Geometry.Point(x, y), attributes,
                            {
                                externalGraphic: getImageURL(attributes["DRY_N"], attributes["TOTAL_N"]),
                                graphicHeight: size,
                                graphicWidth: size,
                                graphicXOffset: offset,
                                graphicYOffset: offset
                            }
                    );
                    vectorLayer.addFeatures(feature);
                }

                return vectorLayer;
            }
        },
        'wms_totalsulfurdeposition1989-1991': {
            "name": "Total Sulfur Deposition 1989-1991",
            "url": "ROE_TotalSulfurDeposition1989_1991/MapServer/WMSServer",
            "layers": ["0", "1"],
            "time frame": "1989-1991",
            "object": function() {
                //example http://harrywood.co.uk/maps/examples/openlayers/marker-popups.html
                // or http://dev.openlayers.org/releases/OpenLayers-2.11/examples/popupMatrix.html
                var vectorLayer = new OpenLayers.Layer.Vector("Total Sulfur Deposition 1989-1991");
                var layerData = {};
                var ratio = currentObject.getTotalSulfurDepositionPieSizeRatio();

                var getImageURL = function(dry_s, total_s) {
                    var percent = Math.round((parseFloat(dry_s) * 100.0) / parseFloat(total_s));
                    if (isNaN(percent)) {
                        console.log(dry_s + " " + total_s);
                    }
                    return "images/pies/sulfur/dry_" + percent + ".png";
                }
                //fetch the data related to marker points first

                layerData = currentObject.wms_totalsulfurdeposition_data["1989-1991"];
                for (var keys in layerData) {
                    var x = layerData[keys]["geometry"]["x"];
                    var y = layerData[keys]["geometry"]["y"];
                    var attributes = layerData[keys]["attributes"];
                    var size = Math.ceil(Math.sqrt(attributes["TOTAL_S"]) * ratio);
                    //if(size<10){
                    //    size=10;
                    //}
                    attributes["image"] = getImageURL(attributes["DRY_S"], attributes["TOTAL_S"]);
                    attributes["image_size"] = parseInt(size) + 20;

                    var feature = new OpenLayers.Feature.Vector(
                            new OpenLayers.Geometry.Point(x, y), attributes,
                            {
                                externalGraphic: getImageURL(attributes["DRY_S"], attributes["TOTAL_S"]),
                                graphicHeight: size,
                                graphicWidth: size,
                                graphicXOffset: (-1 * (size / 2)),
                                graphicYOffset: (-1 * (size / 2))
                            }
                    );
                    vectorLayer.addFeatures(feature);
                }

                return vectorLayer;

            }
        },
        'wms_totalsulfurdeposition2009-2011': {
            "name": "Total Sulfur Deposition 2009-2011",
            "url": "ROE_TotalSulfurDeposition2011/MapServer/WMSServer",
            "layers": ["0", "1"],
            "time frame": "2009-2011",
            "object": function() {
                //return currentObject.getWMSLayer(this);
                //example http://harrywood.co.uk/maps/examples/openlayers/marker-popups.html
                // or http://dev.openlayers.org/releases/OpenLayers-2.11/examples/popupMatrix.html
                var vectorLayer = new OpenLayers.Layer.Vector("Total Sulfur Deposition 2009-2011");
                var layerData = {}, offset;
                var ratio = currentObject.getTotalSulfurDepositionPieSizeRatio();
                var getImageURL = function(dry_s, total_s) {
                    var percent = Math.round((parseFloat(dry_s) * 100.0) / parseFloat(total_s));
                    if (isNaN(percent)) {
                        console.log(dry_s + " " + total_s);
                    }
                    return "images/pies/sulfur/dry_" + percent + ".png";
                }

                //fetch the data related to marker points first
                layerData = currentObject.wms_totalsulfurdeposition_data["2009-2011"];

                for (var keys in layerData) {
                    var x = layerData[keys]["geometry"]["x"];
                    var y = layerData[keys]["geometry"]["y"];
                    var attributes = layerData[keys]["attributes"];
                    var size = Math.ceil(Math.sqrt(attributes["TOTAL_SULFUR"]) * ratio);

                    attributes["image"] = getImageURL(attributes["DRY_SULFUR"], attributes["TOTAL_SULFUR"]);
                    attributes["image_size"] = parseInt(size) + 20;
                    offset = (-1 * (size / 2));

                    var feature = new OpenLayers.Feature.Vector(
                            new OpenLayers.Geometry.Point(x, y), attributes,
                            {
                                externalGraphic: getImageURL(attributes["DRY_SULFUR"], attributes["TOTAL_SULFUR"]),
                                graphicHeight: size,
                                graphicWidth: size,
                                graphicXOffset: offset,
                                graphicYOffset: offset
                            }
                    );
                    vectorLayer.addFeatures(feature);
                }

                return vectorLayer;
            }
        },
        'wms_totalsulfurdeposition2007-2009': {
            "name": "Total Sulfur Deposition 2007-2009",
            "url": "ROE_TotalSulfurDeposition2007-2009/MapServer/WMSServer",
            "layers": ["0", "1"],
            "time frame": "2007-2009",
            "object": function() {
                //return currentObject.getWMSLayer(this);
                //example http://harrywood.co.uk/maps/examples/openlayers/marker-popups.html
                // or http://dev.openlayers.org/releases/OpenLayers-2.11/examples/popupMatrix.html
                var vectorLayer = new OpenLayers.Layer.Vector("Total Sulfur Deposition 2007-2009");
                var featureURL = innovate.proxyURL + escape(innovate.mapServiceBaseURL.legend + "ROE_TotalSulfurDeposition2007_2009/MapServer/1/query?where=1%3D1&outSR=3857&f=json&pretty=true&outFields=DRY_S,WET_S,TOTAL_S");
                var featureURL1989_91 = innovate.proxyURL + escape(innovate.mapServiceBaseURL.legend + "ROE_TotalSulfurDeposition1989_1991/MapServer/1/query?where=1%3D1&outSR=3857&f=json&pretty=true&outFields=DRY_S,WET_S,TOTAL_S");
                var layerData = {};
                var maxVal = 0, totalS = 0, maxSize = 160, ratio;
                var getImageURL = function(dry_s, total_s) {
                    var percent = Math.round((parseFloat(dry_s) * 100.0) / parseFloat(total_s));
                    return "images/pies/sulfur/dry_" + percent + ".png";
                }
                //fetch the data related to marker points first

                $.ajax({
                    type: "GET",
                    url: featureURL,
                    dataType: 'json',
                    async: false,
                    success: function(data) {
                        layerData = data["features"];
                        for (var keys in layerData) {
                            totalS = parseFloat(layerData[keys]["attributes"]["TOTAL_S"]);
                            if (parseFloat(totalS) > parseFloat(maxVal)) {
                                maxVal = totalS;
                            }
                        }
                        if (currentObject.maxSulfurValue == null) {
                            //make another ajax request
                            $.ajax({
                                type: "GET",
                                url: featureURL1989_91,
                                dataType: 'json',
                                async: false,
                                success: function(data) {
                                    for (var keys in data["features"]) {
                                        totalS = parseFloat(data["features"][keys]["attributes"]["TOTAL_S"]);
                                        if (parseFloat(totalS) > parseFloat(maxVal)) {
                                            maxVal = totalS;
                                        }
                                    }
                                }
                            });
                            currentObject.maxSulfurValue = maxVal;
                        } else {
                            maxVal = currentObject.maxSulfurValue;
                        }

                        ratio = maxSize / maxVal;
                    }
                });

                for (var keys in layerData) {
                    var x = layerData[keys]["geometry"]["x"];
                    var y = layerData[keys]["geometry"]["y"];
                    var attributes = layerData[keys]["attributes"];
                    var size = Math.ceil(Math.sqrt(attributes["TOTAL_S"]) * ratio);
                    //if(size<10){
                    //    size=10;
                    //}
                    attributes["image"] = getImageURL(attributes["DRY_S"], attributes["TOTAL_S"]);
                    attributes["image_size"] = parseInt(size) + parseInt(20);

                    var feature = new OpenLayers.Feature.Vector(
                            new OpenLayers.Geometry.Point(x, y), attributes,
                            {
                                externalGraphic: getImageURL(attributes["DRY_S"], attributes["TOTAL_S"]),
                                graphicHeight: size,
                                graphicWidth: size,
                                graphicXOffset: (-1 * (size / 2)),
                                graphicYOffset: (-1 * (size / 2))
                            }
                    );
                    vectorLayer.addFeatures(feature);
                }

                return vectorLayer;
            }
        },
        'wms_totalsulfurdeposition1989-1991overlappingcharts': {
            "name": "Total Sulfur Deposition 1989-1991 Overlapping Charts",
            "url": "ROE_TotalSulfurDeposition1989-1991OverlappingCharts/MapServer/WMSServer",
            "layers": ["0"],
            "object": function() {
                return currentObject.getWMSLayer(this);
            }
        },
        'wms_ecologicalhubsandcorridors': {
            "name": "Ecological Hubs and Corridors",
            "url": "ROE_EcologicalHubsAndCorridors/MapServer/WMSServer",
            "layers": ["0", "1"],
            "object": function() {
                return currentObject.getWMSLayer(this);
            }
        }
        ,
        'wms_biomasspersquaremile': {
            "name": "Biomass Per Square Mile",
            "url": "ROE_BiomassPerSquareMile/MapServer/WMSServer",
            "layers": ["0","1","2"],
            "object": function() {
                return currentObject.getWMSLayer(this);
            }
        },
        'wms_percentchangecarbonstorage': {
            "name": "Percentage Change in Carbon Storage",
            "url": "ROE_PercentChangeCarbonStorage/MapServer/WMSServer",
            "layers": ["0","1","2"],
            "object": function() {
                return currentObject.getWMSLayer(this);
            }
        }

        /****************************************************************************************************************/
        /********************************************base layers starts here*********************************************/
        /****************************************************************************************************************/
        ,
        "bing": {
            "name": "Bing Aerial Imagery"
                    ,
            "baseLayer": true
                    ,
            "object": function() {
                var options = {
                    key: "AkpioNuOZOdJiXnWUQtWloLIACB-AJpwTpvS884VsCzcmjWtT9Tf3l3qvREekSgF",
                    type: "AerialWithLabels",
                    isBaseLayer: true,
                    name: this.name,
                    serverResolutions: currentObject.layerTypeBasedConfig.bing.resolutions,
                    resolutions: currentObject.getResolutionList("bing"),
                    wrapDateLine: true
                };
                return new OpenLayers.Layer.Bing(options);
            }
            ,
            "type": "bing"
        }
        ,"bingWithoutWrap": {
            "name": "Bing Aerial Imagery"
                    ,
            "baseLayer": true
                    ,
            "object": function() {
                var options = {
                    key: "AkpioNuOZOdJiXnWUQtWloLIACB-AJpwTpvS884VsCzcmjWtT9Tf3l3qvREekSgF",
                    type: "AerialWithLabels",
                    isBaseLayer: true,
                    name: this.name,
                    wrapDateLine: false
                };
                return new OpenLayers.Layer.Bing(options);
            }
            ,
            "type": "bing"
        },
        "bingRoads": {
            "name": "Bing Roads Imagery"
                    ,
            "baseLayer": true
                    ,
            "object": function() {
                var options = {
                    key: "AkpioNuOZOdJiXnWUQtWloLIACB-AJpwTpvS884VsCzcmjWtT9Tf3l3qvREekSgF",
                    type: "Road",
                    isBaseLayer: true,
                    serverResolutions: currentObject.layerTypeBasedConfig.bing.resolutions,
                    name: this.name,
                    resolutions: currentObject.getResolutionList("bing"),
                    wrapDateLine: true
                };
                return new OpenLayers.Layer.Bing(options);
            }
            ,
            "type": "bing"
        },
        'arcGisNatGeoWorldMap': {
            "name": "NatGeo World Map"
                    ,
            "url": "NatGeo_World_Map/MapServer"
                    ,
            "object": function() {
                return currentObject.getArcGISCacheLayer(this);
            }
            ,
            "baseLayer": true,
            "type": "arcgiscache"
        },
        'arcGisOceanBasemap': {
            "name": "Ocean Basemap"
                    ,
            "url": "Ocean_Basemap/MapServer"
                    ,
            "object": function() {
                return currentObject.getArcGISCacheLayer(this);
            }
            ,
            "baseLayer": true,
            "type": "arcgiscache"
        }
        ,
        'arcGisWorldTopo': {
            "name": "World Topo Map"
                    ,
            "url": "World_Topo_Map/MapServer"
                    ,
            "object": function() {
                return currentObject.getArcGISCacheLayer(this);
            }
            ,
            "baseLayer": true,
            "type": "arcgiscache"
        }
        ,
        'arcGisUSATopo': {
            "name": "USA Topo Maps"
                    ,
            "url": "USA_Topo_Maps/MapServer"
                    ,
            "object": function() {
                return currentObject.getArcGISCacheLayer(this);
            }
            ,
            "baseLayer": true,
            "type": "arcgiscache"
        }
        ,
        'arcGisWorldImagery': {
            "name": "World Imagery"
                    ,
            "url": "World_Imagery/MapServer"
                    ,
            "object": function() {
                return currentObject.getArcGISCacheLayer(this);
            }
            ,
            "baseLayer": true,
            "type": "arcgiscache"
        },
        'arcGisWorldPhysicalMap': {
            "name": "World Physical Map"
                    ,
            "url": "World_Physical_Map/MapServer"
                    ,
            "object": function() {
                return currentObject.getArcGISCacheLayer(this);
            }
            ,
            "baseLayer": true,
            "type": "arcgiscache"
        },
        'arcGisWorldShadedRelief': {
            "name": "World Shaded Relief"
                    ,
            "url": "World_Shaded_Relief/MapServer"
                    ,
            "object": function() {
                return currentObject.getArcGISCacheLayer(this);
            },
            "baseLayer": true,
            "type": "arcgiscache"
        },
        'arcGisWorldStreetMap': {
            "name": "World Street Map"
                    ,
            "url": "World_Street_Map/MapServer"
                    ,
            "object": function() {
                return currentObject.getArcGISCacheLayer(this);
            }
            ,
            "baseLayer": true,
            "type": "arcgiscache"
        },
        'arcGisWorldTerrainBase': {
            "name": "World Terrain Base"
                    ,
            "url": "World_Terrain_Base/MapServer"
                    ,
            "object": function() {
                return currentObject.getArcGISCacheLayer(this);
            }
            ,
            "baseLayer": true,
            "type": "arcgiscache"
        },
        'arcGisCanvasWorldLightGrayBase': {
            "name": "Canvas World Light Gray Base"
                    ,
            "url": "Canvas/World_Light_Gray_Base/MapServer"
                    ,
            "object": function() {
                return currentObject.getArcGISCacheLayer(this);
            }
            ,
            "baseLayer": true,
            "type": "arcgiscache"
        },
        'arcGisReferenceWorldBoundariesandPlaces': {
            "name": "Reference World Boundaries and Places"
                    ,
            "url": "Reference/World_Boundaries_and_Places/MapServer"
                    ,
            "object": function() {
                return currentObject.getArcGISCacheLayer(this);
            }
            ,
            "baseLayer": true,
            "type": "arcgiscache"
        },
        'arcGisReferenceWorldBoundariesandPlacesAlternate': {
            "name": "Reference World Boundaries and Places Alternate"
                    ,
            "url": "Reference/World_Boundaries_and_Places_Alternate/MapServer"
                    ,
            "object": function() {
                return currentObject.getArcGISCacheLayer(this);
            }
            ,
            "baseLayer": true,
            "type": "arcgiscache"
        },
        'arcGisReferenceWorldReferenceOverlay': {
            "name": "Reference World Reference Overlay"
                    ,
            "url": "Reference/World_Reference_Overlay/MapServer"
                    ,
            "object": function() {
                return currentObject.getArcGISCacheLayer(this);
            }
            ,
            "baseLayer": true,
            "type": "arcgiscache"
        },
        'arcGisReferenceWorldTransportation': {
            "name": "Reference World Transportation"
            ,"url": "Reference/World_Transportation/MapServer"
            ,"object": function() {
                return currentObject.getArcGISCacheLayer(this);
            }
            ,"baseLayer": true
            ,"type": "arcgiscache"
        },
        'arcGisSpecialtyDeLormeWorldBaseMap': {
            "name": "Specialty DeLorme World Base Map"
            ,"url": "Specialty/DeLorme_World_Base_Map/MapServer"
            ,"object": function() {
                return currentObject.getArcGISCacheLayer(this);
            }
            ,"baseLayer": true
            ,"type": "arcgiscache"
        },
        'arcGisSpecialtySoilSurveyMap': {
            "name": "Specialty Soil Survey Map"
                    ,
            "url": "Specialty/Soil_Survey_Map/MapServer"
                    ,
            "object": function() {
                /*http://server.arcgisonline.com/ArcGIS/rest/services/Specialty/Soil_Survey_Map/MapServer*/
                return currentObject.getArcGISCacheLayer(this);
            }
            ,
            "baseLayer": true,
            "type": "arcgiscache"
        },
        'arcGisSpecialtyWorldNavigationCharts': {
            "name": "Specialty World Navigation Charts"
                    ,
            "url": "Specialty/World_Navigation_Charts/MapServer"
                    ,
            "object": function() {
                return currentObject.getArcGISCacheLayer(this);
            }
            ,
            "baseLayer": true,
            "type": "arcgiscache"
        }
    };
}