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
OpenLayers.Control.InnovateMapFullScreen = 
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
            var content=""
            ,style={
                "z-index":"1002", 
                "position":"absolute",
                "top":"20px",
                "right":"0px", 
                "padding":"0px",
                "font-weight":"bold"
            },
            imgLocation = OpenLayers.Util.getImagesLocation();
            
            content += "<div><img src=\""+imgLocation+"Fullscreen-icon.png\" title=\"Click to open map in fullscreen mode\" style=\"width:18px; height:18px; cursor:pointer;\" onClick=\"innovate.fullScreen("+this.invConfig['id']+")\" /></div>";
            
            $(this.div).css(style);
            $(this.div).append(content);
            
            return this.div;
        },
        //called when the user removes the control from the map
        destroy: function(){
            OpenLayers.Control.prototype.destroy.apply(this);
        },
        CLASS_NAME: "OpenLayers.Control.InnovateMapFullScreen"
    });
