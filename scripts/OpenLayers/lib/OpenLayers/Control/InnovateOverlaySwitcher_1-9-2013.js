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
OpenLayers.Control.InnovateOverlaySwitcher = 
    OpenLayers.Class(OpenLayers.Control, {
    
        invConfig:null
        //Constructor
        ,
        innovateMap:null
        ,
        initialize: function(options){
            OpenLayers.Control.prototype.initialize.apply(this, arguments);
        }
        ,
        setConfig:function(map){
            this.innovateMap = map;
            this.invConfig = this.innovateMap["config"];
        }
        //called when the user adds the control to the map. if the control wants to display information
        ,
        isLayerSwitchable:function(layer){
            if(layer.isBaseLayer){
                return false;
            }
            var layerName = layer.name
            ,layersObj = new innovate.Layers({});
            
            if(this.invConfig["overlaySwitcherLayers"]){
                for(keys in this.invConfig["overlaySwitcherLayers"]) {
                    if(layersObj.layerDefinitions[this.invConfig["overlaySwitcherLayers"][keys]].name == layerName){
                        return true;
                    }
                }
            }else{
                return true;
            }
            return false;
        }
        ,
        getToggleDisplayText:function(layer){
            var layerName = layer.name
            ,layersObj = new innovate.Layers({});
            
            for(keys in layersObj.layerDefinitions) {
                if(layersObj.layerDefinitions[keys].name == layerName){
                    return layersObj.layerDefinitions[keys]["time frame"];
                }
            }
            return null;
        }
        ,
        getVisibleOverlayLayer:function(){
            var currentMap = this.map
            ,allLayers = currentMap.layers.slice()
            ,visibleLayerIndex = 0
            ,maxZIndex = 0
            ,divSelector = null;
            
            for(var i=0, len=allLayers.length; i<len; i++) {
                if(this.isLayerSwitchable(allLayers[i])){
                //if(!(allLayers[i].isBaseLayer)){
                    divSelector = (allLayers[i].id).replace(/\./g, "\\.");
                    if(allLayers[i].getVisibility() && parseInt($("#"+divSelector).css("z-index"))>maxZIndex){
                        maxZIndex = parseInt($("#"+divSelector).css("z-index"));
                        visibleLayerIndex = i;
                    }
                }
            }
            return allLayers[visibleLayerIndex];
        }
        ,
        draw: function(){
            OpenLayers.Control.prototype.draw.apply(this);
            
            var currentMap = this.map
            ,allLayers = currentMap.layers.slice()
            ,style={
                "z-index":"1002", 
                "position":"absolute",
                "top":"10px",
                "right":"40%"
            },imgLocation = OpenLayers.Util.getImagesLocation()
            ,overlayLayers = []
            ,currentOverlayLayer = null
            ,curObj = this
            ,divElement = null
            ,allDivs = []
            ,fadeSpeed = this.invConfig["overlaySwitcherRefreshDuration"]!=null?this.invConfig["overlaySwitcherRefreshDuration"]:50
            ,visibleLayer = curObj.getVisibleOverlayLayer()
            ,clickEventFunction = function(layer){
                var layerIndex = $(layer).attr("index")
                ,minOpacity = 0
                ,maxOpacity = 1
                ,timer = null
                ,overlaySwitcherDiv = this
                ,visibleLayer = curObj.getVisibleOverlayLayer()
                ,toggleOpacity = function(){
                    maxOpacity = parseFloat(parseFloat(maxOpacity)-0.1).toFixed(2);
                    minOpacity = parseFloat(parseFloat(minOpacity)+0.1).toFixed(2);
                    
                
                    for(var i=0, len=overlayLayers.length; i<len; i++){
                        if(visibleLayer.name==overlayLayers[i].name){
                            //hide this layer
                            if(maxOpacity=="0.00"){
                                overlayLayers[i].setVisibility(false);
                                overlayLayers[i].setOpacity(parseFloat(1.0));
                                
                            }else{
                                overlayLayers[i].setOpacity(parseFloat(maxOpacity));
                            }
                        }else{
                            if(minOpacity=="1.00"){
                                overlayLayers[i].setVisibility(true);
                            }
                            overlayLayers[i].setOpacity(parseFloat(minOpacity));
                            
                        }
                    }
                    if(minOpacity!="1.00" && maxOpacity!="0.00"){    
                        timer=setTimeout(toggleOpacity,fadeSpeed);
                    }else{
                        clearTimeout(timer);
                        $(overlaySwitcherDiv).html(curObj.getToggleDisplayText(curObj.getVisibleOverlayLayer()));
                        innovate.opacitySelectors[curObj.invConfig.id].setSliderValue(1);
                    }
                };
                if(overlayLayers[layerIndex].name==visibleLayer.name){
                    return;
                }
                for(var i=0;i<allDivs.length;i++){
                    if(parseInt($(allDivs[i]).attr("index"))==parseInt(layerIndex)){
                        if(curObj.innovateMap.clickControls[$(allDivs[i]).attr("layername")]){
                            curObj.innovateMap.clickControls[$(allDivs[i]).attr("layername")].activate();//activate click event on the currently selected layer
                            
                        }
                        $(allDivs[i]).addClass("selected");
                    }else{
                        if(curObj.innovateMap.clickControls[$(allDivs[i]).attr("layername")])
                            curObj.innovateMap.clickControls[$(allDivs[i]).attr("layername")].deactivate();
                        $(allDivs[i]).removeClass("selected");
                    }
                }
                
                for(i=0, len=overlayLayers.length; i<len; i++) {
                    if(visibleLayer.name!=overlayLayers[i].name){
                        overlayLayers[i].setOpacity(parseFloat(0.0));
                    }
                    overlayLayers[i].setVisibility(true);
                }
                if(fadeSpeed!=0)
                    timer=setTimeout(toggleOpacity,fadeSpeed);
                else{
                    for(i=0, len=overlayLayers.length; i<len; i++) {
                        overlayLayers[i].setOpacity(parseFloat(1.0));
                        if(visibleLayer.name!=overlayLayers[i].name){
                            overlayLayers[i].setVisibility(true);
                            if(curObj.innovateMap.clickControls[overlayLayers[i].name])
                                curObj.innovateMap.clickControls[overlayLayers[i].name].activate();
                        }else{
                            overlayLayers[i].setVisibility(false);
                            if(curObj.innovateMap.clickControls[overlayLayers[i].name])
                                curObj.innovateMap.clickControls[overlayLayers[i].name].deactivate();
                        }
                    }
                }
                innovate.opacitySelectors[curObj.invConfig.id].setSliderValue(1);
                var mapID = curObj.invConfig["id"];
                if(innovate.popupbox[mapID]){
                    $("#innovate_info_popup_"+mapID).hide();
                }
                
                
            };
                        
            
            for(var i=0, len=allLayers.length; i<len; i++) {
                
                //if(!(allLayers[i].isBaseLayer)){
                if(curObj.isLayerSwitchable(allLayers[i])){
                    overlayLayers[overlayLayers.length] = allLayers[i];
                    
                    divElement  = document.createElement("a");
                    $(divElement).attr("index",(overlayLayers.length-1));
                    $(divElement).attr("class","toggle_button");
                    $(divElement).attr("layername",allLayers[i].name);
                    $(divElement).html(this.getToggleDisplayText(allLayers[i]));
                    $(divElement).click(function(){
                        clickEventFunction(this);
                    });
                    
                    if(visibleLayer.name==allLayers[i].name){
                        if(this.innovateMap.clickControls[allLayers[i].name])
                            this.innovateMap.clickControls[allLayers[i].name].activate();
                        $(divElement).addClass("selected");
                    }else{
                        if(this.innovateMap.clickControls[allLayers[i].name])
                            this.innovateMap.clickControls[allLayers[i].name].deactivate();
                        $(divElement).removeClass("selected");
                    }
                    
                    $(this.div).append(divElement);
                    allDivs[allDivs.length] = divElement;
                    
                    
                }
            }
            
            $(this.div).css(style);
            return this.div;
        },
        //called when the user removes the control from the map
        destroy: function(){
            OpenLayers.Control.prototype.destroy.apply(this);
        },
        CLASS_NAME: "OpenLayers.Control.InnovateOverlaySwitcher"
    });
