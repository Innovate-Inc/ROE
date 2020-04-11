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
OpenLayers.Control.InnovateFindAddress = 
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
            var mapID = this.invConfig['id'];
            OpenLayers.Control.prototype.draw.apply(this);
            var content=""
            ,style={
                "z-index":"1002", 
                "position":"absolute",
                "top":"20px",
                "left":"18px", 
                "padding":"0px",
                "font-weight":"bold"
            },
            imgLocation = OpenLayers.Util.getImagesLocation();
            
            content += "<div><img id=\"inno_find_address_img\" src=\""+imgLocation+"drag-rectangle-on.png\" title=\"Click to mark an address\" style=\"width:18px; height:18px; cursor:pointer;\"  /></div>";
            
            $(this.div).css(style);
            $(this.div).append(content);
            
            
            //define the click event here
            $(this.div).find("#inno_find_address_img").click(function(){
                //add a form to the page first
                //first check if the form has already been added to the page
                if($("#inno_location-search-form").length>0){
                    $("#inno_location-search-form").remove();
                }
            
                var form = '<div id="inno_location-search-form" title="Search location">'+
                '<form name="inno_search_address">'+
                '<table>'+
                '<tr>'+
                '<td style="width:120px; text-align: right;">Address :</td>'+
                '<td>'+
                '<input class="text ui-widget-content ui-corner-all" id="inn_address" maxlength="128" name="inn_address" type="text"/>'+
                '</td>'+
                '</tr>'+
                '<tr>'+
                '<td style="width:120px; text-align: right;">City :</td>'+
                '<td>'+
                '<input class="text ui-widget-content ui-corner-all" id="inn_city" name="inn_city" type="text"/>'+
                '</td>'+
                '</tr>'+
                '<tr>'+
                '<td style="width:120px; text-align: right;">State :</td>'+
                '<td>'+
                '<input class="text ui-widget-content ui-corner-all" id="inn_state" name="inn_state" type="text"/>'+
                '</td>'+
                '</tr>'+
                '<tr>'+
                '<td style="width:120px; text-align: right;">Zip :</td>'+
                '<td>'+
                '<input class="text ui-widget-content ui-corner-all" id="inn_zip" name="inn_zip" type="text"/>'+
                '</td>'+
                '</tr>'+
                '<tr>'+
                '<td></td>'+
                '<td>'+
                '<input type="button" value="Locate" id="inn_locate"  name="inn_locate" />'+
                '</td>'+
                '</tr>'+
                '</table>'+
                '</form>'+
                '</div>';
                $(document.body).append(form);
                
                form = $("#inno_location-search-form");
        
        
                $(form).find("#inn_locate").click(function(){
                    var address = $(form).find("#inn_address").val();
                    var city = $(form).find("#inn_city").val();
                    var state = $(form).find("#inn_state").val();
                    var zip = $(form).find("#inn_zip").val();
            
                    //http://msdn.microsoft.com/en-us/library/ff701714.aspx for mode details on the rest api
                    //make a rest request to get the long lat
                    var dataURL = innovate.proxyURL+encodeURI("http://dev.virtualearth.net/REST/v1/Locations?CountryRegion=US&adminDistrict="+state+"&locality="+city+"&postalCode="+zip+"&addressLine="+address+"&key=AkpioNuOZOdJiXnWUQtWloLIACB-AJpwTpvS884VsCzcmjWtT9Tf3l3qvREekSgF");
                    $.ajax({
                        type: "GET",
                        url: dataURL,
                        async : false,
                        dataType:"json",
                        success: function(data){
                    
                            var latlong = data["resourceSets"][0]["resources"][0]["geocodePoints"][0]["coordinates"];
                            var curMap = innovate.openedMap[mapID].map;
                            this.marker = new OpenLayers.Layer.Markers("Markers");
                            var geographic = new OpenLayers.Projection("EPSG:4326");
                    
                            var lonLat = new OpenLayers.LonLat(parseFloat(latlong[1]),parseFloat(latlong[0]) ).transform(
                                geographic, // transform from WGS 1984
                                curMap.getProjectionObject()  // to Spherical Mercator Projection
                                );
                            
                            var size = new OpenLayers.Size(21,25);
                            var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
                            var icon = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker.png', size, offset);
                            this.marker.addMarker(new OpenLayers.Marker(lonLat,icon));
                            curMap.panTo(lonLat);
                            curMap.addLayer(this.marker);
                
                            $(form).dialog("destroy");
                        }
                    });
            
            
                });
                $(form).dialog();
            });
        
            return this.div;
        },
        //called when the user removes the control from the map
        destroy: function(){
            OpenLayers.Control.prototype.destroy.apply(this);
        },
        CLASS_NAME: "OpenLayers.Control.InnovateFindAddress"
    });
