var innovate = {
    maps : {}
    ,
    popupbox : {}//popup object for each map
    ,
    curMapPos : 0
    ,
    curMapID : 0
    ,
    openedMap : {}
    ,
    opacitySelectors:{}
    ,
    legendOpen :false
    , 
    baseFolder : ""
    ,
    //proxyURL : "proxy.cfm?url="
    //,
    buildMap : function(v_mapID){
        // if(v_mapID=1){
          var obj = new innovate.Map(v_mapID);
          obj.buildMap();
          this.openedMap[v_mapID] = obj;
        // }

        
    },
    setFooter: function (v_mapID) {
        
        var footer = "";
        footer += "<div class=\"innovate_mapFooter\">";
        footer += "<div >" + this.openedMap[v_mapID].config['footNote'] + "</div>";
        footer += "<div><span style=\"font-weight: bold;\">Data source: &nbsp;</span>"+this.openedMap[v_mapID].config['dataSource']+"</div>";
        footer += "<div>";
        
        $("#footnotes-map"+v_mapID).html(footer);
    },
    setHeader : function(v_mapID){
        $("#coda-nav-1 a[mapID=\""+v_mapID+"\"]").parent().find(".exhibit_title").html(innovate.openedMap[v_mapID].config['header']);
        $("#container-map"+v_mapID).parent().find(".mapTitle").html(innovate.openedMap[v_mapID].config['header']);
    }
    ,
    mapServiceBaseURL : {
        "map":"http://Geodata.epa.gov/ArcGIS/services/ORD/",
        "legend":"http://geodata.epa.gov/ArcGIS/rest/services/ORD/"
    }
    ,
    initalizeMaps : function(){
        $("#coda-nav-1 a").each(function(){
            var mapID = null;
            if((mapID = $(this).attr("mapID"))){
                innovate.buildMap(mapID);
                innovate.setHeader(mapID);
                innovate.setFooter(mapID);
                $(this).click(function(){
                    innovate.readjustScaleLine($(this).attr("mapID"));
                    innovate.curMapID = $(this).attr("mapID");
                });
            }
        });
        
       //this.initializeOpacitySelectors();
       //this.attachEventsForControls();
    }
    ,
    setMapLinks: function () {//creates html exhibit link(on the left corner) for each map 
        
        var container = document.getElementById("coda-nav-1")
        ,mapContainer = document.getElementById("coda-slider-onecolumn")
        ,curParam = null
        ,loopCount = innovate_config.maps.length
        ,indx
        , linksHTML = "<table class=\"innovateMapLinks\">";
                      //  0         1       2         3       4      5         6        7       8        9      10       11       12       13       14       15      16      17      18      19      20      21       22
        var expandoW = ["162px", "70px", "70px", "115px", "125px", "125px", "120px", "135px", "100px", "95px", "90px", "110px", "162px", "110px", "162px", "92px", "92px", "92px", "45px", "90px", "162px", "90px", "90px"];
        for (var i = 0; i < loopCount; i++) {
            
            curParam = innovate_config.maps[i];
            //innovate_container  curParam["id"] == 8 || curParam["id"] == 15 || curParam["id"] == 9 || curParam["id"] == 17 || curParam["id"] == 10
            //height: 162px;
            //curParam["id"] == 8 || curParam["id"] == 15 || curParam["id"] == 9 || curParam["id"] == 17 || curParam["id"] == 10 || curParam["id"] == 11 || curParam["id"] == 13 || curParam["id"] == 7 || curParam["id"] == 3 || curParam["id"] == 6 || curParam["id"] == 19 || curParam["id"] == 21 || curParam["id"] == 22
            // if (curParam["id"] == 1 || curParam["id"] == 4 || curParam["id"] == 5 || curParam["id"] == 2 || curParam["id"] == 8 || curParam["id"] == 15 || curParam["id"] == 9 || curParam["id"] == 17 || curParam["id"] == 18 || curParam["id"] == 10 || curParam["id"] == 11 || curParam["id"] == 13 || curParam["id"] == 7 || curParam["id"] == 3 || curParam["id"] == 6 || curParam["id"] == 19 || curParam["id"] == 21 || curParam["id"] == 22) {
            if ( curParam["id"] == 1 || curParam["id"] == 2 || curParam["id"] == 3 || curParam["id"] == 4 || curParam["id"] == 5
                || curParam["id"] == 6 || curParam["id"] == 7 || curParam["id"] == 8 || curParam["id"] == 9 || curParam["id"] == 10
                || curParam["id"] == 11 || curParam["id"] == 13 || curParam["id"] == 15 || curParam["id"] == 17 || curParam["id"] == 18
                || curParam["id"] == 19 ){
            //alert(curParam["id"]);
                indx = i + 1;
                linksHTML += "<tr><td align=\"center\"><span><a href=\"#" + indx + "\" mapID=\"" + curParam["id"] + "\"><img src=\"images/area_icon.png\" alt=\"\" width=\"30\" height=\"30\" border=\"0\" /></a></span></td><td><span class=\"thumbnailtitle\"><strong>Exhibit " + curParam["id"] + ".</strong> " + curParam["header"] + "</span></td></tr>"
                $(mapContainer).append("<div class=\"panel onecolumn\">" +
                        "<div class=\"panel-wrapper onecolumngraph\">" +
                        "<div class=\"mapTitle\">" + curParam["header"] + "</div>" +
                        "<div id=\"container-map" + curParam["id"] + "\" class=\"innovate_container soria\">" +

                        //need to be in ERG's include. Begin//
                        "<div id=\"mframe" + curParam["id"] + "\" class=\"mframe\" data-dojo-type=\"dijit/layout/BorderContainer\" data-dojo-props=\"design:'headline', gutters:true\" style=\"text-align:left;\">" +
                        "<div data-dojo-type=\"dojox/layout/ExpandoPane\" data-dojo-props=\"title:'<div style=float:left>Opacity:</div><div class=oslider id=oslider" + curParam["id"] + "></div>Click here to toggle legend', duration:300, maxHeight:'162px', region:'bottom', easeIn:'easing.linear', easeOut:'easing.linear'\" style=\"height: " + expandoW[curParam["id"]] + "; font-size: x-small;\">" +
                        //"<div id=\"slider" + curParam["id"]+ "\">Opacity</div>" +
                        "<div id=\"legendDiv" + curParam["id"] + "\"></div>" +
                        "</div>" +
                        "<div id=\"fullScreen" + curParam["id"] + "\" class=\"fullScreen\"><img id=\"fullScreenIcon\" src=\"./scripts/innovate/images/icon_fullscreen.gif\" /></div>" +
                        "<div id=\"expandIcon" + curParam["id"] + "\" class=\"expandIcon\"><img id=\"exIcon" + curParam["id"] + "\" src=\"./scripts/innovate/images/greenPlus2.gif\" style=\"width:14px; height:14px\" /></div>" +
                        "<div id=\"layersNode" + curParam["id"] + "\" class=\"layersNode\"style=\"display: none\">" +
                        "Base Layer:<span>" +
                        "<br />" +
                        "<input type='radio' name=\"blayer" + curParam["id"] + "\" id=\"blayerS"  + curParam["id"] + "\" value=0 checked=\"True\" />Aerial Imagery<br />" +
                        "<input type='radio' name=\"blayer" + curParam["id"] + "\" id=\"blayerG"  + curParam["id"] + "\" value=1 />World Light Gray Base" +
                        "</span><br />" +
                        "Overlays: <span id=\"layer_list" + curParam["id"] + "\">" +
                        "<br />" +
                        //"<input type='checkbox' checked='True' class='list_item' id='layer0CheckBox' value=0 />States<br />" +
                        //"<input type='checkbox' checked='True' class='list_item' id='layer1CheckBox' value=1 />Radon Zones" +
                        "</span><br />" +
                        "</div>" +
                        "<div id=\"mapDiv" + curParam["id"] + "\" class=\"mapDiv\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props=\"region:'center'\">" +
                        "</div>" +
                        "</div>" +
                        //Need to be in ERG's include. End//

                        "</div>" +
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
        }
        linksHTML+="</table>";
        //$(container).append("<span class=\"tab\"><a href=\"#"+indx+"\"><img src=\"images/area_icon.png\" alt=\"\" width=\"30\" height=\"30\" /></a> <span class=\"thumbnailtitle\"><strong>Exhibit "+indx+".</strong> "+curParam["header"]+"</span></span>");
        $(container).append(linksHTML);
        $("#coda-nav-1 a").click(function(){
            //innovate.readjustScaleLine($(this).attr("mapID"));
            //var mID = $(this).attr("mapID");
            //alert("Map switched" + mID);
            //var obj = openedMap[mID];
            //obj.resizeMap();
        });

        
        
        //this.initializeOpacitySelectors();
        //this.attachEventsForControls();
    },
    setStyleAndHeader:function(obj){
        var param_index = $(obj).attr("mapid"),
        mapPos = $(obj).attr("pos"),
        tdWidthStr=($("#mapContainer").css("width")),
        tdWidth=parseInt(tdWidthStr.substr(0, tdWidthStr.length-2),10),
        blocks=0;
        this.curMapID = param_index;
        
        $("#map_selectors img").removeClass();
        $(obj).addClass("selected");
        
        if(this.curMapPos==mapPos){
            return;
        }
        //scroll to the desired location
        if(mapPos>this.curMapPos){
            blocks = (mapPos-this.curMapPos)*tdWidth;
            $("#mapContainer").animate({
                scrollLeft : "+="+blocks
            }, 'slow');
        }else{
            blocks = (this.curMapPos-mapPos)*tdWidth;
            $("#mapContainer").animate({
                scrollLeft : "-="+blocks
            }, 'slow');
        }
        this.curMapPos = mapPos;
        innovate.readjustScaleLine(param_index);
    }
    ,
    toggleLegend:function(mapID){
        var openLegend = ($(".innovateGraphFooterBody").css("display")=="none")?true:false;
        $(".innovateGraphFooterBody").slideToggle("slow",function(){
            innovate.readjustScaleLine(mapID);
        });
        if(openLegend){
            this.opacitySelectors[mapID].legendOpen();
        }else{
            this.opacitySelectors[mapID].legendClose();
        }
        
        
    },
    initializeOpacitySelectors:function(){
       
        $("#coda-nav-1 a").each(function(){
            var mapID = null;
            if((mapID = $(this).attr("mapID"))){
                innovate.initializeOpacitySelector(mapID);
            }
        });
    },
    initializeOpacitySelector:function(mapID){
        var obj = new innovate.opacitySelector(mapID);
        obj.initialize();
        obj.legendOpen();
        this.opacitySelectors[mapID] = obj;
    }
    ,
    getUserConfigForMap:function(mapId){
        for(i=0;i<innovate_config.maps.length;i++){
            if(innovate_config.maps[i]['id']==mapId){
                return innovate_config.maps[i];
            }
        } 
        return null;
    },
    setLayerSwitcherHeight:function(divContainer){
        var divHeight = ($(divContainer).find(".baseLayersDiv").height())
        ,minHeight=52;
        
        if(divHeight>minHeight){
            if(this.getInternetExplorerVersion()!=-1 && parseInt(this.getInternetExplorerVersion())<=8){
                $("#innovate_container #map_"+this.curMapID+" .olControlLayerSwitcher .layersDiv .baseLayersDiv").css({
                    "height":minHeight+"px",
                    "overflow-y":"auto",
                    "margin-right":"10px"
                });
            }else{
                $("#innovate_container #map_"+this.curMapID+" .olControlLayerSwitcher .layersDiv .baseLayersDiv").css({
                    "height":minHeight+"px",
                    "overflow-y":"auto",
                    "width":"90%"
                });
            }
            
        }
    },
    getInternetExplorerVersion:function(){
        var rv = -1; // Return value assumes failure.
        if (navigator.appName == 'Microsoft Internet Explorer')
        {
            var ua = navigator.userAgent;
            var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null)
                rv = parseFloat( RegExp.$1 );
        }
        return rv;
    },
    pixelDetect:function(clickPosition){
        img = document.getElementById("OpenLayersDiv1146");
        canvas = document.createElement("canvas");  //Create HTML5 canvas: supported in latest firefox/chrome/safari/konquerer.  Support in IE9
        canvas.width = img.width;                   //Set width of your rendertarget
        canvas.height = img.height;                 // \  height \   \     \
        ctx = canvas.getContext("2d");              //Get the 2d context [the thing you draw on]
        ctx.drawImage(img, 0, 0,img.width,img.height);                   //Draw the picture on it.
        
        //alert(clickPosition.x+" ,"+clickPosition.y);
        var imgDat = ctx.getImageData(1, 1, 1, 1);
        var color = "#" + dec2hex(imgDat.data[0]) +dec2hex(imgDat.data[1]) +dec2hex(imgDat.data[2]);
        //alert(color);
    },
    lastPopupCenter : {}
    ,
    fullScreenOn : false
    ,
    stopPropagation:function(evt) { 
        OpenLayers.Event.stop(evt); 
    } 
    ,
    isIDevice:function(){
        var uagent = navigator.userAgent.toLowerCase();
        return (uagent.search("iphone") > -1)||(uagent.search("ipod") > -1)||(uagent.search("ipad") > -1);
    }
    ,
    fullScreen:function(mapID){
        innovate.fullScreenOn = true;
        var maxWidth = 1360,maxHeight = 1360
        ,screenHeight = parseInt($(window).height())
        ,screenWidth = parseInt($(window).width())
        ,width = screenWidth, height=screenHeight
        ,top = 0
        ,left = 0
        ,userConfig = innovate.getUserConfigForMap(mapID);
        if(screenHeight>maxHeight || screenWidth>maxWidth){
            if(screenWidth>maxWidth){
                width = maxWidth;
            }else{
                width = screenWidth;
            }
            if(screenHeight>maxHeight){
                height = maxHeight;
            }else{
                height = screenHeight;
            }
            top = parseInt((screenHeight - height)/2);
            left = parseInt((screenWidth - width)/2); 
        }
        width = width-6;
        height = height-6;
        
        /*$.blockUI({
            message:"<div id=\"mapPopupHeader\" style=\"cursor:pointer;height:24px;background-color:#9DB6DB;\">"+
                "<div style=\"float:left; padding-left:10px;\">"+userConfig["header"]+"</div>"+
                "<div style=\"float:right; padding-right:5px;\"><a href=\"javaScript:innovate.closeModal();\">Close</a></div>"+
                "</div>"+
                "<div>"+
                "<div id=\"mapPopupLoading\" style=\"position:relative; top:0px; left:0px; width:"+width+"px; height:"+height+"px; z-index:1003; margin:auto auto;  \"><div style=\"margin-top:"+Math.floor(height/2)+"px;\"><div style=\"text-align:center; \">Loading...</div><div><img src=\"images/ajax-loader.gif\" /></div></div></div>"+
                "<iframe name=\"innovateFullScreenFrame\" id=\"innovateFullScreenFrame\" src=\"getMap.html?width="+(width)+"&height="+(height-24)+"&mapId="+mapID+"\" frameborder=\"0\" scrolling=\"no\" width=\""+width+"\" height=\""+(height-24)+"\"></iframe>"+
                "</div>",
            css : {
                "position":"fixed",
                "width":width,
                "height":height, 
                "top":top,
                "left":left
            },
            bindEvents: false
        }); */
        if(innovate.isIDevice()){
            $(window).scrollTop(0);
            window.onscroll = function() {
                if(innovate.fullScreenOn){
                    $(window).scrollTop(0);
                }
            };

        }
    },
    closeLoadingImage:function(){
        $("#mapPopupLoading").remove();
    }
    ,
    closeModal : function(){
        $.unblockUI(); 
        innovate.fullScreenOn = false;
    },
    resizeMap:function(mapID){
        var maxWidth = 1360,maxHeight = 1360
        ,screenHeight = parseInt($(window).height())
        ,screenWidth = parseInt($(window).width())
        ,width = screenWidth, height=screenHeight
        ,top = 0
        ,left = 0;
        if(screenHeight>maxHeight || screenWidth>maxWidth){
            if(screenWidth>maxWidth){
                width = maxWidth;
            }else{
                width = screenWidth;
            }
            if(screenHeight>maxHeight){
                height = maxHeight;
            }else{
                height = screenHeight;
            }
            top = parseInt((screenHeight - height)/2);
            left = parseInt((screenWidth - width)/2); 
        }
        width = width-6;
        height = height-6;
        
        $(".blockMsg").css({
            "width":width,
            "height":height, 
            "top":top,
            "left":left
        });
        var myIframe =  parent.document.getElementById('innovateFullScreenFrame');
        myIframe.style.width =  width+"px";
        myIframe.style.height = (height-24)+"px";
        window.frames.innovateFullScreenFrame.resizeMap(width,(height-24));
    },
    readjustScaleLine: function (mapID) {

        var scalineWidth = $("#container-map"+mapID+" .olControlScaleLine").width();
        $("#container-map"+mapID+" .olControlScaleLine").css({
            "left":parseInt($("#innovateGraphFooterBody_"+mapID).parent().width()-scalineWidth)
            ,"bottom":$("#innovateGraphFooterBody_"+mapID).parent().height()
        });
    }
    ,
    attachEventsForControls : function(){
        var loopCount = innovate_config.maps.length,
        curParam = {};
        for(var i=0;i<loopCount;i++){
            curParam = innovate_config.maps[i];
            innovate.handleOnMouseOutOnMap(curParam["id"]);
            $('#container-map'+curParam["id"]).bind('mouseenter', innovate.handleOnMouseOverOnMap);
            $('#container-map'+curParam["id"]).bind('mouseleave', innovate.handleOnMouseOutOnMap);
            
        }
    }
    ,
    handleOnMouseOutOnMap:function(mapID){
        var curMapID = innovate.getCurrentMapID();
        if(typeof mapID != "number"){
            mapID = curMapID;
        }
        if(!(innovate.openedMap[mapID])){
            return ;
        }
        var currentMap = innovate.openedMap[mapID];
        var controls = currentMap.map.controls.slice();
        var userConfig = innovate.getUserConfigForMap(mapID);
        var controlDivID = null;
        if(userConfig["hide_controls"]){
            for(var i=0;i<userConfig["hide_controls"].length;i++){
                for(var j=0;j<controls.length;j++){
                    controlDivID = controls[j].id;
                    if(controlDivID.indexOf(userConfig["hide_controls"][i])!=-1){
                        $(controls[j].div).hide();
                        break;
                    }
                }
            }
        }
    },
    getQueryVariable:function(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        } 
        return false;
    }
                
    ,
    getCurrentMapID:function(){
        var url = (window.location).toString(),loc,id,links=[],mapId;
        
        if((mapId=innovate.getQueryVariable("mapId"))){
            return mapId;
        }else{
            if((loc=url.indexOf("#"))==-1){
                links = $("#coda-nav-1 a");
                return $(links[0]).attr("mapID");
            }else{
                loc = loc+1;
                id = parseInt(url.substr(loc))-1;
                links = $("#coda-nav-1 a");
                return $(links[id]).attr("mapID");
            
                //return innovate_config.maps[id]["id"];
            }
        }
    }
    ,
    handleOnMouseOverOnMap:function(event){
        var curMapID = innovate.getCurrentMapID();
        var currentMap = innovate.openedMap[curMapID];
        var controls = currentMap.map.controls.slice();
        var userConfig = innovate.getUserConfigForMap(curMapID);
        if(userConfig["hide_controls"]){
            for(var i=0;i<userConfig["hide_controls"].length;i++){
                for(var j=0;j<controls.length;j++){
                    if(controls[j].id.indexOf(userConfig["hide_controls"][i])!=-1){
                        $(controls[j].div).show();
                        break;
                    }
                }
            }
        }
        return false;
    }
    ,
    setMenuZindex:function(){
        $(document).ready(function($){
            var zindx = null;
            $("#smoothmenu li").each(function(){
           
                if((zindx=$(this).css("z-index"))){
                    zindx = parseInt(zindx)+2000;
                    $(this).css({
                        "z-index":zindx
                    });
                }
            });
        });
    }
}; 
