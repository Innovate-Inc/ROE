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
            ,curObj = this
            ,divElement = null
            ,allDivs = []
            ,fadeSpeed = this.invConfig["overlaySwitcherRefreshDuration"]!=null?this.invConfig["overlaySwitcherRefreshDuration"]:50
            ,visibleLayer = curObj.getVisibleOverlayLayer()
            ,showHide=function(layers){
                var layerToShow = layers.show;
                var layerToHide = layers.hide;
                var showOpacityStart=0.0;
                var hideOpacityStart=1.0;
                var timer;
                
                var layerToShowIndex = currentMap.getLayerIndex(layerToShow);
                var layerToHideIndex = currentMap.getLayerIndex(layerToHide);
                
                if(layerToShowIndex>layerToHideIndex){
                    currentMap.setLayerIndex(layerToShow,layerToHideIndex);//the index of the later to be displyed should be less for proper transition
                    currentMap.setLayerIndex(layerToHide,layerToShowIndex);
                }
                
                layerToShow.setOpacity(showOpacityStart);
                layerToHide.setOpacity(hideOpacityStart);
                
                layerToShow.display(true);    
                layerToHide.display(true);
                layerToShow.setVisibility(true);    
                layerToHide.setVisibility(true);
                
                timer = setInterval(function(){
                    showOpacityStart = (parseFloat(showOpacityStart)+0.1).toFixed(1);
                    layerToShow.setOpacity(showOpacityStart);
                    hideOpacityStart = (parseFloat(hideOpacityStart)-0.1).toFixed(1);
                    layerToHide.setOpacity(hideOpacityStart);
                    
                    //console.log(showOpacityStart+" "+hideOpacityStart);
                    //console.log(parseFloat(showOpacityStart)+" "+(parseFloat(showOpacityStart)==1.0));
                    if(parseFloat(showOpacityStart)==1.0){
                        //console.log("inside");
                        layerToHide.setVisibility(false);
                        layerToHide.setOpacity(1.0);
                        layerToShow.setVisibility(true);    
                        clearTimeout(timer);
                    }
                },fadeSpeed);
            }
            ,clickEventFunction = function(layer){
                var layerId = $(layer).attr("layerid");
                
                allLayers = currentMap.layers.slice();
                //toggleButton selection
                var parentContainer = $(layer).parent();
                $(parentContainer).find("a").each(function(){
                    if($(this).attr("layerid")==layerId){
                        if(curObj.innovateMap.clickControls[$(this).attr("layername")])
                            curObj.innovateMap.clickControls[$(this).attr("layername")].activate();
                        $(this).addClass("selected");
                    }else{
                        if(curObj.innovateMap.clickControls[$(this).attr("layername")])
                            curObj.innovateMap.clickControls[$(this).attr("layername")].deactivate();
                        $(this).removeClass("selected");
                    }
                })
                
                var showHideLayers={
                    "show":"",
                    "hide":""
                };
                for(var i=0, len=overlayLayers.length; i<len; i++) {
                    if(layerId==overlayLayers[i].id){
                        showHideLayers.show = overlayLayers[i];
                    }
                    else{
                        showHideLayers.hide = overlayLayers[i];
                    }
                }
                showHide(showHideLayers);
                
            
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
                    $(divElement).attr("layerid",allLayers[i].id);
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
