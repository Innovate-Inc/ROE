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
OpenLayers.Control.InnovateMapFooter = 
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
            
            var footer=""
            ,style={
                "z-index":"1002", 
                "position":"absolute",
                "bottom":"50px",
                "left":"0px", 
                "margin":"0px 5px",
                "padding":"0px",
                "color": "#ffffff",
                "opacity": "0.6",
                "width":"100%",
                "font-weight":"bold"
            }
            footer += "<div class=\"innovate_mapFooter\">";
            footer += "<div >"+this.invConfig['footNote']+"</div>";
            footer += "<div><span style=\"font-weight: bold;\">Data Source : </span><span style=\"font-style: italic;\">"+this.invConfig['dataSource']+"</span></div>";
            footer += "<div>";
            
            $(this.div).css(style);
            $(this.div).append(footer);
           
            return this.div;
        },
        //called when the user removes the control from the map
        destroy: function(){
            OpenLayers.Control.prototype.destroy.apply(this);
        },
        CLASS_NAME: "OpenLayers.Control.InnovateMapFooter"
    });
