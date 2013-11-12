var innovate = {
    //it is a collection of OpenLayers.Popup.FramedCloud object indexed by the map id
    //it was created so that we won't have to create new OpenLayers.Popup.FramedCloud object object every time when user clicks 
    //on the map to get feature info in popup box
    popupbox: {}
    ,curMapPos: 0
    ,curMapID: 0
    ,openedMap: {}//collection of all innovate.Map objects
    ,opacitySelectors: {}
    ,legendOpen: false
    ,baseFolder: ""
    ,lastPopupCenter: {}
    ,fullScreenOn: false
    ,
    /*
    * Due to same origin policy in our client server, sometimes we cannot call URL resouces that donot originate from client domain
    * To bypass this we need a proxy in client machine. For local(in wizaed) this is replicated by proxy.jsp
    * But for client, they have a cmf equivalent file for it
    */
    proxyURL: "proxy.jsp?"
    ,
    /*
    * Instantiates Innovate.Map object and stores it in global collection "openedMap" for future use
    * @param   v_mapID     String      id of the map, look in scripts/map_config.js for map id and settings associated with it
    */
    buildMap: function(v_mapID) {
        var obj = new innovate.Map(v_mapID);
        obj.buildMap();
        this.openedMap[v_mapID] = obj;
    },
    /*
    * This function sets the footer message on the map 
    * @param   v_mapID     String      map id as defined in map_config.js file or innovate_config object to be precise 
    */
    setFooter: function(v_mapID) {
        var footer = "";
        footer += "<div class=\"innovate_mapFooter\">";
        footer += "<div >" + this.openedMap[v_mapID].config['footNote'] + "</div>";
        footer += "<div><span style=\"font-weight: bold;\">Data Source : </span><span style=\"font-style: italic;\">" + this.openedMap[v_mapID].config['dataSource'] + "</span></div>";
        footer += "<div>";
        $("#footnotes-map" + v_mapID).html(footer);
    },
    /*
    * This function sets the header title on the map 
    * @param   v_mapID     String      map id as defined in map_config.js file or innovate_config object to be precise 
    */
    setHeader: function(v_mapID) {
        $("#coda-nav-1 a[mapID=\"" + v_mapID + "\"]").parent().find(".exhibit_title").html(innovate.openedMap[v_mapID].config['header']);
        $("#container-map" + v_mapID).parent().find(".mapTitle").html(innovate.openedMap[v_mapID].config['header']);
    }

    ,
    /*
     * Defined the base URL for maps and legends so when they change, I don't have to serach and change in all files
     */
    mapServiceBaseURL: {
        "map": "http://geodata.epa.gov/arcgis/services/ORD/",
        "legend": "http://geodata.epa.gov/ArcGIS/rest/services/ORD/"
    }
    ,
    /*
     * This is the entry point for rendering the maps in the client browse
     * The code goes through the coda navigation link which has attribute "mapID" 
     * and then finds the appropriate div within the dom to render/build the map in
     * 
     * This function is not used by our demo page(wiz.innovateteam.com:8080/ROE), because in demo page the coda navigation links are created dynamically
     */
    initalizeMaps: function() {

        $("#coda-nav-1 a").each(function() {
            var mapID = null;
            if ((mapID = $(this).attr("mapID"))) {
                innovate.buildMap(mapID);
                innovate.setHeader(mapID);
                innovate.setFooter(mapID);
                $(this).click(function() {
                    innovate.readjustScaleLine($(this).attr("mapID"));
                    innovate.curMapID = $(this).attr("mapID");
                });
            }
        });

        this.initializeOpacitySelectors();
        this.attachEventsForControls();
        innovate.readjustScaleLine(this.getCurrentMapID());
    }
    ,
    /*
     * creates html exhibit link(on the left corner) for each map defined in map_config.js file
     * this is used by our demo page
     */
    setMapLinks: function() {
        var container = document.getElementById("coda-nav-1")
                , mapContainer = document.getElementById("coda-slider-onecolumn")
                , curParam = null
                , loopCount = innovate_config.maps.length
                , indx
                , linksHTML = "<table class=\"innovateMapLinks\">";

        for (var i = 0; i < loopCount; i++) {
            curParam = innovate_config.maps[i];
            indx = i + 1;
            linksHTML += "<tr><td align=\"center\"><span><a href=\"#" + indx + "\" mapID=\"" + curParam["id"] + "\"><img src=\"images/area_icon.png\" alt=\"\" width=\"30\" height=\"30\" border=\"0\" /></a></span></td><td><span class=\"thumbnailtitle\"><strong>Exhibit " + curParam["id"] + ".</strong> " + curParam["header"] + "</span></td></tr>"
            $(mapContainer).append("<div class=\"panel onecolumn\">" +
                    "<div class=\"panel-wrapper onecolumngraph\">" +
                    "<div class=\"mapTitle\">" + curParam["header"] + "</div>" +
                    "<div id=\"container-map" + curParam["id"] + "\" class=\"innovate_container\"></div>" +
                    "<div id=\"footnotes-map" + curParam["id"] + "\" class=\"indicator-footnotes\"></div>" +
                    "</div>" +
                    "<ul class=\"tools alignright\">" +
                    "<li><a href=\"#\" title=\"Get a PDF of this page\"><img src=\"images/pdf_icon.png\" id=\"export-ghgemissions1\" width=\"30\" height=\"30\" alt=\"Get a PDF of this page\" /></a></li>" +
                    "<li><a href=\"#\" title=\"Add a statistical layer to this exhibit [No statistical information for this exhibit at this time]\"><img src=\"images/data_icon.png\" id=\"layer\"  width=\"30\" height=\"30\" alt=\"Add a statistical layer to this exhibit\" /></a></li>" +
                    "<li><a href=\"#\" title=\"View this exhibit data in Excel\"><img src=\"images/xls_icon.png\" id=\"excel\" width=\"30\" height=\"30\" alt=\"View this exhibit data in Excel\" /></a></li>" +
                    "<li><a href=\"#\" title=\"Click here for help in using this indicator dashboard\"><img src=\"images/help_icon.png\" id=\"help\" width=\"30\" height=\"30\" alt=\"Click here for help in using this indicator dashboard\" /></a></li>" +
                    "</ul>" +
                    "</div>");
            this.buildMap(curParam["id"]);
            this.setFooter(curParam["id"]);
        }
        linksHTML += "</table>";
        //$(container).append("<span class=\"tab\"><a href=\"#"+indx+"\"><img src=\"images/area_icon.png\" alt=\"\" width=\"30\" height=\"30\" /></a> <span class=\"thumbnailtitle\"><strong>Exhibit "+indx+".</strong> "+curParam["header"]+"</span></span>");
        $(container).append(linksHTML);
        $("#coda-nav-1 a").click(function() {
            innovate.readjustScaleLine($(this).attr("mapID"));
        });

        this.initializeOpacitySelectors();
        this.attachEventsForControls();
    },
    /*
     * This function slides open or closes the legend area
     * @param   mapID    string     
     */
    toggleLegend: function(mapID) {
        var openLegend = ($(".innovateGraphFooterBody").css("display") == "none") ? true : false;
        $(".innovateGraphFooterBody").slideToggle("slow", function() {
            innovate.readjustScaleLine(mapID);
        });
        if (openLegend) {
            this.opacitySelectors[mapID].legendOpen();
        } else {
            this.opacitySelectors[mapID].legendClose();
        }


    },
    /*
     * This function initializes opacity selector(the slider component in the footer area) for all map
     */
    initializeOpacitySelectors: function() {
        $("#coda-nav-1 a").each(function() {
            var mapID = null;
            if ((mapID = $(this).attr("mapID"))) {
                innovate.initializeOpacitySelector(mapID);
            }
        });
    },
    /*
     * This function initializes opacity selector(the slider component in the footer area) for a map
     * @param       mapID     String    id of the map whose opacity selector is to be initialized
     */
    initializeOpacitySelector: function(mapID) {
        var obj = new innovate.opacitySelector(mapID);
        obj.initialize();
        obj.legendOpen();
        this.opacitySelectors[mapID] = obj;
    }
    ,
    /*
     * This function returns configuration parameters defined in map_config.js(or innovate_config object)
     * @param   mapId   String      id of the map whose configuration settings are to be returned
     */
    getUserConfigForMap: function(mapId) {
        for (i = 0; i < innovate_config.maps.length; i++) {
            if (innovate_config.maps[i]['id'] == mapId) {
                return innovate_config.maps[i];
            }
        }
        return null;
    },
    /*
     * This function returns IE version
     * @return int  version of internet explorer, -1 if the browser is not ie
     */
    getInternetExplorerVersion: function() {
        var rv = -1; // Return value assumes failure.
        if (navigator.appName == 'Microsoft Internet Explorer')
        {
            var ua = navigator.userAgent;
            var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null)
                rv = parseFloat(RegExp.$1);
        }
        return rv;
    },
    stopPropagation: function(evt) {
        OpenLayers.Event.stop(evt);
    }
    ,
    /*
     * this function checks if the app is running in iphone or ipad
     * @return boolean  true if "i" product else false
     */
    isIDevice: function() {
        var uagent = navigator.userAgent.toLowerCase();
        return (uagent.search("iphone") > -1) || (uagent.search("ipod") > -1) || (uagent.search("ipad") > -1);
    }
    ,
    /*
     * This function opens up the map in full screen mode
     */
    fullScreen: function(mapID) {
        innovate.fullScreenOn = true;
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
                    "</div>",
            css: {
                "position": "fixed",
                "width": width,
                "height": height,
                "top": top,
                "left": left
            },
            bindEvents: false
        });
        if (innovate.isIDevice()) {
            $(window).scrollTop(0);
            window.onscroll = function() {
                if (innovate.fullScreenOn) {
                    $(window).scrollTop(0);
                }
            };

        }
    },
    closeLoadingImage: function() {
        $("#mapPopupLoading").remove();
    }
    ,
    closeModal: function() {
        $.unblockUI();
        innovate.fullScreenOn = false;
    },
    /*
     * Resizes full screen mode map when the window size is changed
     * DOESN'T WORK, NEED TO WORK ON IT 
     */
    resizeMap: function() {
        
        var maxWidth = 1360, maxHeight = 1360
                , screenHeight = parseInt($(window).height())
                , screenWidth = parseInt($(window).width())
                , width = screenWidth, height = screenHeight
                , top = 0
                , left = 0;
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
       
        $(".blockMsg").css({
            "width": width,
            "height": height,
            "top": top,
            "left": left
        });
        
        var myIframe = parent.document.getElementById('innovateFullScreenFrame');
        /*
        var src = myIframe.src;
        src = src.replace(/width=(\d+)/, "width="+width);
        src = src.replace(/height=(\d+)/, "height="+(height-24));
        myIframe.src = src;
        */
        if (myIframe) {
            myIframe.style.width = width + "px";
            myIframe.style.height = (height - 24) + "px";
            myIframe.contentWindow.resizeMap(width, (height - 24));
        }
        
    },
    /*
     * Move the scaline div to the right bottom corner of the parent div
     */
    readjustScaleLine: function(mapID) {
        var scalineWidth = $("#container-map" + mapID + " .olControlScaleLine").width();
        $("#container-map" + mapID + " .olControlScaleLine").css({
            "left": parseInt($("#innovateGraphFooterBody_" + mapID).parent().width() - scalineWidth)
                    , "bottom": $("#innovateGraphFooterBody_" + mapID).parent().height()
        });
    }
    ,
    /*
     * This function adds event to all maps so that when the mouse is over the map, it calls handleOnMouseOverOnMap
     * and when the mouse is out of the map, it calls handleOnMouseOutOnMap
     */        
    attachEventsForControls: function() {
        var loopCount = innovate_config.maps.length,
                curParam = {};
        for (var i = 0; i < loopCount; i++) {
            curParam = innovate_config.maps[i];
            innovate.handleOnMouseOutOnMap(curParam["id"]);
            $('#container-map' + curParam["id"]).bind('mouseenter', innovate.handleOnMouseOverOnMap);
            $('#container-map' + curParam["id"]).bind('mouseleave', innovate.handleOnMouseOutOnMap);

        }
    },
    /*
     * handles the event when mouse is over a map
     * it displays all the controls such as scaline, zoom bar etc
     */
    handleOnMouseOverOnMap: function(event) {
        var curMapID = innovate.getCurrentMapID();
        var currentMap = innovate.openedMap[curMapID];
        var controls = currentMap.map.controls.slice();
        var userConfig = innovate.getUserConfigForMap(curMapID);
        if (userConfig["hide_controls"]) {
            for (var i = 0; i < userConfig["hide_controls"].length; i++) {
                for (var j = 0; j < controls.length; j++) {
                    if (controls[j].id.indexOf(userConfig["hide_controls"][i]) != -1) {
                        $(controls[j].div).show();
                        break;
                    }
                }
            }
        }
        return false;
    }
    ,
     /*
     * handles the event when mouse is out a map
     * it hides all the controls defined in "hide_controls" property in map_congif.js file
     */
    handleOnMouseOutOnMap: function(mapID) {
        var curMapID = innovate.getCurrentMapID();
        if (typeof mapID != "number") {
            mapID = curMapID;
        }
        if (!(innovate.openedMap[mapID])) {
            return;
        }
        var currentMap = innovate.openedMap[mapID];
        var controls = currentMap.map.controls.slice();
        var userConfig = innovate.getUserConfigForMap(mapID);
        var controlDivID = null;
        if (userConfig["hide_controls"]) {
            for (var i = 0; i < userConfig["hide_controls"].length; i++) {
                for (var j = 0; j < controls.length; j++) {
                    controlDivID = controls[j].id;
                    if (controlDivID.indexOf(userConfig["hide_controls"][i]) != -1) {
                        $(controls[j].div).hide();
                        break;
                    }
                }
            }
        }
    },
    /*
     * This function is used to read the get parameter from the url
     * @param   variable    String      get parameter index
     * @return  boolean|String   return false if get index is not present else returns the get value from the URL
     * FOr eg: if window url is www.xyz.com?name=Dee&status=Y
     * then innovate.getQueryVariable('name') will return Dee
     * then innovate.getQueryVariable('age') will return false
     */        
    getQueryVariable: function(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        return false;
    }
    ,
    /*
     * Returns the id of the map that is currently being viewed
     * @return  String  mapid of currently active map
     */        
    getCurrentMapID: function() {
        var url = (window.location).toString(), loc, id, links = [], mapId;

        if ((mapId = innovate.getQueryVariable("mapId"))) {
            return mapId;
        } else {
            if ((loc = url.indexOf("#")) == -1) {
                links = $("#coda-nav-1 a");
                return $(links[0]).attr("mapID");
            } else {
                loc = loc + 1;
                id = parseInt(url.substr(loc)) - 1;
                links = $("#coda-nav-1 a");
                return $(links[id]).attr("mapID");
            }
        }
    }
    
    ,
    /*
     * This function was built to correct the z-index value of drop down menus
     * because if we don't do this, some of the map component will overlap the menu component
     */
    setMenuZindex: function() {
        $(document).ready(function($) {
            var zindx = null;
            $("#smoothmenu li").each(function() {

                if ((zindx = $(this).css("z-index"))) {
                    zindx = parseInt(zindx) + 2000;
                    $(this).css({
                        "z-index": zindx
                    });
                }
            });
        });
    }
};

/*
window.onresize = function(event) {
    innovate.resizeMap();
}*/