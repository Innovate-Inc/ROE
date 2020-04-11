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
OpenLayers.Control.InnovateMapTitle = 
    OpenLayers.Class(OpenLayers.Control, {
    
        invConfig:null
        //Constructor
        ,
        initialize: function(options){
            OpenLayers.Control.prototype.initialize.apply(this, arguments);
        }
        ,
        setConfig:function(config){
            this.invConfig = config;
        }
        //called when the user adds the control to the map. if the control wants to display information
        ,
        draw: function(){
            OpenLayers.Control.prototype.draw.apply(this);
            
            var mapDiv = $('#innovate_container .middle')
            ,mapDivWidth = $(mapDiv).width()
            ,headerStyle={
                "padding": "5px", 
                "background-color":"#ffffff", 
                "border":"1px solid #369", 
                "opacity":"0.6",
                "filter":"alpha(opacity=60)", 
                "z-index":"1000", 
                "position":"relative", 
                "top": "10px", 
                "left":"50px", 
                "font-size":"12px", 
                "font-weight": "bold", 
                "color":"#000", 
                "-webkit-border-radius": "10px", 
                "-moz-border-radius": "10px", 
                "border-radius": "10px",
                "width":(parseInt(mapDivWidth, 10)-100)+"px"
            }
            $(this.div).css(headerStyle);
            $(this.div).append($('<div></div>').html(this.invConfig["header"]));
            return this.div;
        },
        //called when the user removes the control from the map
        destroy: function(){
            OpenLayers.Control.prototype.destroy.apply(this);
        },
        CLASS_NAME: "OpenLayers.Control.InnovateMapTitle"
    });
