innovate.Map = function(mapID){
    var currentObject = this;
        
    this.map = null;
    this.config = innovate.getUserConfigForMap(mapID);
    this.innovateLayerObj = new innovate.Layers(this);
    this.innovateControlsObj = new innovate.Controls(this);
    this.clickControls = {};
    this.mapClickControlIds = {};
    
    //build map object
    this.setMap = function(){
        var baseLayerType = this.innovateLayerObj.getBaseLayerType();
        this.map = new OpenLayers.Map('container-map'+mapID, { 
            allOverlays: false,
            fallThrough : true,
            projection: currentObject.config.projection,
            controls: [
            new OpenLayers.Control.PanZoomBar()
            ]
        //,eventListeners: {"mouseout": innovate.handleOnMouseOutOnMap,"mouseover":innovate.handleOnMouseOverOnMap}
        });
        
        if(baseLayerType==="arcgiscache"){
            this.map.setOptions({ 
                maxExtent: new OpenLayers.Bounds(currentObject.config.maxExtent[0],currentObject.config.maxExtent[1],currentObject.config.maxExtent[2],currentObject.config.maxExtent[3])
            });
        }else if (baseLayerType==="bing"){
            this.map.setOptions({ 
                maxExtent: new OpenLayers.Bounds(currentObject.config.maxExtent[0],currentObject.config.maxExtent[1],currentObject.config.maxExtent[2],currentObject.config.maxExtent[3])
            });
        }
    }
    
    //set all the base layer as well as overlays
    this.setLayers = function(){
        var layer = null;
        for (key in this.config['baseMap']) {
            layer = this.innovateLayerObj.getLayer(this.config['baseMap'][key]);
            this.map.addLayer(layer);
        }
        
        for (key in this.config['layers']) {
            layer = this.innovateLayerObj.getLayer(this.config['layers'][key]);
            
            if(this.config['initialDisplayLayer']){
                if(key!=parseInt(this.config['initialDisplayLayer'])){
                    layer.setVisibility(false);
                }
            }
            this.map.addLayer(layer);
        }
        
        if(this.config['layers'].length>1 && this.config['initialDisplayLayer']){
            var layers = this.map.layers.slice(),count=0;
            for(var i=0;i<layers.length;i++){
                if(!(layers[i].isBaseLayer)){
                    if(count!=this.config['initialDisplayLayer']){
                        layers[i].setVisibility(false);
                    }
                    count++;
                }
            }
            
        }
    }
    
    this.reactivateClickEvents = function(){
        //first remove the click control from the map
        //for some reason in dev, the click control was added twice!
        //same issue did not arrise in local
        //but adding code to delete the control and then add it back did the trick
        for(var keys in this.map.controls){
            if(this.mapClickControlIds[this.map.controls[keys].id]){
                //alert("removed"+this.map.controls[keys].id);
                this.map.controls[keys].deactivate();
                this.map.removeControl(this.map.controls[keys]);
            }
        }
        this.mapClickControlIds=[];
       
        var control = null,layerName;
        for (key in this.config['controls']) {
            
            var controlName = this.config['controls'][key];
            if(controlName.substr(0,6)=='click_'){
                for(var layerIndx in this.config["layers"]){
                    
                    layerName = this.innovateLayerObj.layerDefinitions[this.config["layers"][layerIndx]]["name"];
                    control = (this.innovateControlsObj[controlName]).call(this.innovateControlsObj,layerName);
                    if(control!=null){
                        this.clickControls[layerName] = control;
                        this.map.addControl(control);
                        control.activate();
                        this.mapClickControlIds[control.id]=1;
                    }
                    
                }
            }
        }
           
    }
    
    //set all the controls
    this.setControls = function(){
        var control = null,layerName;
        for (key in this.config['controls']) {
            var controlName = this.config['controls'][key];
            if(controlName.substr(0,6)==='click_'){
                for(var layerIndx in this.config["layers"]){
                    
                    layerName = this.innovateLayerObj.layerDefinitions[this.config["layers"][layerIndx]]["name"];
                    control = (this.innovateControlsObj[controlName]).call(this.innovateControlsObj,layerName);
                    if(control!=null){
                        this.clickControls[layerName] = control;
                        this.map.addControl(control);
                        control.activate();
                        this.mapClickControlIds[control.id]=1;
                    }
                    
                }
            }
            else{
                control = this.innovateControlsObj.getControl(controlName);
                if(control!=null){
                    this.map.addControl(control);
                }
            }
        }
    }
    
    /*
     * Thus function builds map based on map id set to the current innovate.Map function
     */
    this.buildMap=function(){
        this.setMap();
        this.setLayers();
        this.setControls();
        
        var baseLayerType = this.innovateLayerObj.getBaseLayerType();
        
        if(currentObject.config.zoomToExtent){
            this.map.zoomToExtent(new OpenLayers.Bounds(currentObject.config.zoomToExtent[0],currentObject.config.zoomToExtent[1],currentObject.config.zoomToExtent[2],currentObject.config.zoomToExtent[3]));
        }else if(this.config.center){
            var zoomLevel = this.config.defaultZoomLevel?this.config.defaultZoomLevel-this.config.startResolution:0;
            var geographic = new OpenLayers.Projection("EPSG:4326");
            var mercator = new OpenLayers.Projection(this.config["projection"]);
            this.map.setCenter(new OpenLayers.LonLat(this.config.center[0], this.config.center[1]).transform(geographic,mercator),zoomLevel);
            
        }else if(baseLayerType==="arcgiscache"){
            this.map.zoomTo(this.config.startResolution);
        }
    }
}