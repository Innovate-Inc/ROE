innovate.opacitySelector = function(mapId){
    this.currentValue = 1;
    this.previousValue = 1;
    this.curMap = innovate.openedMap[mapId];
    this.mapObj = this.curMap.map;
    //had to add this because in jquery-ui 1.8, the change event is triggered when the slider value is set 
    //we don't want that to happen because when we toggle the footer it changes the slider value 
    //and hence it reactivates controls that are already there
    this.enableActivateControl = true;
    
    this.initialize = function(){
        var curObj = this;
        if($("#innovate_opacitySelector_"+mapId).length>0){
            
            $("#innovate_opacitySelector_"+mapId).slider(
            {
                max:1
                ,
                min:0.0
                ,
                step:0.1
                ,
                value:curObj.currentValue
                ,
                start:function(event, ui) {
                    //disable map dragging
                    this.deactivatedControls = [];
                    for (var i = 0; i< curObj.mapObj.controls.length; i++) {
                        if (curObj.mapObj.controls[i].displayClass === "olControlNavigation") {
                            curObj.mapObj.controls[i].deactivate();
                        }
                    }
                    
                }
                ,
                slide: function(event, ui) {
                    curObj.setOverlayOpacity(ui.value);
                },
                change : function(event,ui){
                    //enable map dragging
                    
                    for (var i = 0; i< curObj.mapObj.controls.length; i++) {
                        if(curObj.mapObj.controls[i].id.indexOf("Navigation")!=-1){
                            curObj.mapObj.controls[i].activate();
                        }
                    }       
                    
                    if(curObj.enableActivateControl){
                        curObj.curMap.reactivateClickEvents();
                    }
                    curObj.setOverlayOpacity(ui.value);    
                    curObj.previousValue = curObj.currentValue;
                    curObj.currentValue = ui.value;
                }
            });
        }
    }
    /*
     * Do slide up animation to view the legend information of a map
     * Also set the opacity of map layers to 1 -  as requested by client; * 11.20.13 client requested opacity not change when legend is toggled    
     */
    this.legendOpen= function(){
        this.enableActivateControl = false;
        $("#innovate_opacitySelector_"+mapId).slider( "option" , "value" , this.currentValue);
        //this.setOverlayOpacity(1);
        this.enableActivateControl = true;
    }
    /*
     * Do slide down animation to hide the legend information of a map
     * Also set the opacity of map layers to what was set before(before being set to 1 by legendOpen function) -  as requested by client; * 11/20/13 client requested opacity not change when legendi is toggled
     */
    this.legendClose = function(){
        if(this.currentValue==1){
            this.setOverlayOpacity(this.previousValue);
            $("#innovate_opacitySelector_"+mapId).slider( "option" , "value" , this.currentValue);
        }
    }
    
    this.setSliderValue = function(val){
        this.enableActivateControl = false;
        $("#innovate_opacitySelector_"+mapId).slider( "option" , "value" , val);
        this.enableActivateControl = true;
    }
    
    this.setOverlayOpacity = function(opacity){
        var layers = this.curMap.map.layers.slice();
        for(var i=0;i<layers.length;i++){
            if(!(layers[i].isBaseLayer)){
                layers[i].setOpacity(parseFloat(opacity));
            }
        }
    }
    

}