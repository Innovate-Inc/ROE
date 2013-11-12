/* Copyright (c) 2006-2011 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * @requires OpenLayers/Control.js
 */

/**
 * Class: OpenLayers.Control.Attribution
 * The attribution control adds attribution from layers to the map display. 
 * It uses 'attribution' property of each layer.
 *
 * Inherits from:
 *  - <OpenLayers.Control>
 */
OpenLayers.Control.InnovateMapLegend = 
    OpenLayers.Class(OpenLayers.Control, {
    
    invConfig:null
    //Constructor
    ,
    mapID:null
    ,
    legendImageSize : 18
    ,
    legendBaseURL:null
    ,
    initialize: function(options){
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
    }
    ,
    setConfig:function(config){
        this.invConfig = config;
        this.mapID = config["id"];
    }
    //called when the user adds the control to the map. if the control wants to display information
    ,
    getLedendData:function(mapID){
        //if the url is image then display image else make json ajax
        var isImageFile = this.invConfig["legend"]["url"].lastIndexOf("."),
        validImageExt = ["png","jpeg","gif","jpg","bmp"],
        varImg = this.invConfig["legend"]["url"];
        if(isImageFile!=-1 && $.inArray(this.invConfig["legend"]["url"].substr(isImageFile+1),validImageExt)!=-1){
            
            setTimeout(function(){
                $("#innovateGraphFooterBody_"+mapID).css({
                    "text-align":"center",
                    "padding":"10px 0px"
                }).append("<img src=\""+varImg+"\" align=\"middle\" >");
            }, 100);
            
        }else{
            
            //make ajax call to get the content
                
            if(this.invConfig["legend"]["url"].indexOf("http://")!=-1){
                this.legendBaseURL = this.invConfig["legend"]["url"];
            }else{
                this.legendBaseURL = innovate.mapServiceBaseURL["legend"]+this.invConfig["legend"]["url"];
            }
            var v_url = this.legendBaseURL+"?f=json&pretty=true";
            var curObj = this;
            OpenLayers.ProxyHost = innovate.proxyURL;
            OpenLayers.Request.GET({
                url: v_url,
                callback: function(req){
                    curObj.setLegendData(req.responseText);
                    innovate.readjustScaleLine(mapID);
                }
            });
        }
    },
    setLegendData:function(json){
        var myLegendObject = eval('(' + json + ')')
        ,loopCount = myLegendObject["layers"].length;
        $("#innovateGraphFooterBody_"+this.mapID).html("");
        for(i=0;i<loopCount;i++){
            if(this.invConfig["legend"]["discard"] && this.invConfig["legend"]["discard"][myLegendObject["layers"][i]["layerId"]]){
                continue;
            }
            this.createLegendTableForALayer(myLegendObject["layers"][i]);
        }
    }
    ,
    createLegendTableForALayer:function(json){
        var myLegendObject = json
        ,tableContent="<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"100%\">"
        ,rows = 6
        ,cols=1
        ,i=0,j=0
        ,curLegend = null
        ,indx = 0
        ,perCharPix = 6
        ,maxLength = 0
        ,avgLength = 0 
        ,divWidth = ($("#container-map"+this.mapID).length>0)?($("#container-map"+this.mapID).width()):680
        ,loopCount = myLegendObject["legend"].length
        ,blanks = null
        ,blank_array = {}
        ,legendTitle = (this.invConfig["legend"]["layers"])?this.invConfig["legend"]["layers"][myLegendObject.layerId]:null;
            
          
        //legendTitle = myLegendObject.layerId==this.invConfig["legend"]["layers"]
        for(i=0;i<loopCount;i++){
            if(myLegendObject["legend"][i]){
                curLegend = myLegendObject["legend"][i];
                maxLength = curLegend["label"].length>maxLength?curLegend["label"].length:maxLength;
                avgLength = avgLength+curLegend["label"].length;
            }
        }
            
        avgLength = Math.ceil(avgLength/loopCount);
        cols = Math.floor(divWidth/(((avgLength)*perCharPix)+this.legendImageSize+2+5));
        if(this.invConfig["legend"]["cols"]){
            cols = this.invConfig["legend"]["cols"];
        }
            
        rows = Math.ceil(loopCount/cols);
        blanks = (cols*rows)-loopCount;//last blanks will have no data
            
        if(blanks>1){
            var tmp = cols;
            for(i=1;i<=blanks;i++){
                blank_array[--tmp]=(blanks-i);
            }
        }
            
        if(legendTitle!=null){
            tableContent+="<tr><th colspan=\""+(cols*2)+"\">"+legendTitle+"</th></tr>";
        }
            
        for(j=0;j<rows;j++){
            tableContent+="<tr>";
            for(i=0;i<cols;i++){
                indx = (rows*i)+j;
                    
                if(blank_array[i]){
                    indx = indx - blank_array[i];
                }
                    
                if(((j*cols)+i+1)<=loopCount){
                    curLegend = myLegendObject["legend"][indx];
                    tableContent+="<td style=\"width:"+parseInt(this.legendImageSize+2,10)+"px;\"><img src=\""+this.legendBaseURL+"/../"+myLegendObject["layerId"]+"/images/"+curLegend["url"]+"\" style=\"width:"+this.legendImageSize+"px;height:"+this.legendImageSize+"px;\"></td><td style=\"padding-right:5px;\">"+curLegend["label"].replace(/Â/g,"")+"</td>";
                }else{
                    tableContent+="<td></td><td></td>";
                }
            }
            tableContent+="</tr>";
        }
        tableContent+="</table>";
           
        $("#innovateGraphFooterBody_"+this.mapID).append(tableContent);
    }
        
    ,
    draw: function(){
        var self = this;
        OpenLayers.Control.prototype.draw.apply(this);
        var footer=""
        ,style={
            "z-index":"1000", 
            "position":"absolute",
            "bottom":"0px",
            "left":"0px", 
            "color": "#000", 
            "margin":"0px",
            "padding":"0px",
            "border-top": "1px solid #369",
            "background-color":"#CCC",
            "width":"100%"
        }
        footer += "<div>"
        footer += "<div style=\"background-color:#9db6db; text-align:right;color:white;font-size:10px; padding-top:5px; font-weight:bold; height:18px; padding-right:5px;\"><span style=\"float:left; padding-left:10px;\">Set Opacity : &nbsp;</span><span style=\"float:left; width:90px;margin-top:2px;\" mapID =\""+this.invConfig['id']+"\" id=\"innovate_opacitySelector_"+this.invConfig['id']+"\"></span><a href=\"javaScript:innovate.toggleLegend("+this.invConfig['id']+");\" style=\"text-decoration:none; color:#FFF;\">Click here to toggle legend</a></div>";
        footer += "<div id=\"innovateGraphFooterBody_"+this.invConfig['id']+"\" class=\"innovateGraphFooterBody\">";
        footer += "</div>";
        footer += "</div>";
        $(this.div).css(style);
        $(this.div).append(footer);
        this.getLedendData(this.invConfig['id']);
        
        return this.div;
    }
    //called when the user removes the control from the map
    ,
    destroy: function(){
        OpenLayers.Control.prototype.destroy.apply(this);
    },
    CLASS_NAME: "OpenLayers.Control.InnovateMapLegend"
});
