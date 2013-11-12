var innovate_config = {
    maps:[
    {
        'id':1//must match param id
        ,'header':'Percent reduction in native fish species diversity in the contiguous U.S. from historical levels to 2006'
        ,'footNote':'Data are displayed by 6-digit hydrologic unit code (HUC-6) watershed. Percent reduction is based on the number of native species determined to be present as of 2006, compared with historical numbers documented prior to 1970. A species is considered "present" if there is at least one record of its presence in any 8-digit HUC within the 6-digit HUC.'
        ,'startResolution':4//gets the resolution from serverResolutions using the startResolution as index
        ,'endResolution':7//number of zoom levels you want, 21 is max and must be greater than startResolution
        ,'projection' : 'EPSG:3857'
        ,'maxExtent' : [-14617039.6948417,2697596.8976282,-6500380.5111317,6713979.93039427]
        //,'zoomToExtent' : [-13887751.0954,2816696.3039,-7453285.4516,6340548.1719]
        ,'center' : [-96,36] 
        ,'defaultZoomLevel' : 4
        ,'dataSource':'NatureServe, 2006'
        ,'legend':{
            "url":"ROE_FishFaunaPercentLoss/MapServer/legend"
            ,"layers":{"0":"Percent reduction in fish species :"}
        }
        ,'baseMap' : ['bing','arcGisCanvasWorldLightGrayBase']
        ,'layers':['wms_fishfaunapercentloss','wms_stateboundariesThick']
        ,'controls':['Navigation','LayerSwitcher','click_roefishlosspercent','InnovateMapFullScreen','ScaleLine','Attribution','InnovateMapLegend']
        ,'hide_controls':['Navigation','PanZoomBar']
    },{
        'id':2//must match param id
        ,'header':'Reduction in native fish species diversity in the contiguous U.S. from historical levels to 2006'
        ,'startResolution':4//gets the resolution from serverResolutions using the startResolution as index
        ,'endResolution':7//number of zoom levels you want, 21 is max and must be greater than startResolution
        ,'projection' : 'EPSG:3857'
        ,'maxExtent' : [-14617039.6948417,2697596.8976282,-6500380.5111317,6713979.93039427]
        //,'zoomToExtent' : [-13887751.0954,2816696.3039,-7453285.4516,6340548.1719]
        ,'center' : [-96,36] 
        ,'defaultZoomLevel' : 4
        ,'footNote':'This is a test footer note for this exhibit'
        ,'dataSource':'U.S. EPA, 2007d'
        ,'legend':{
            "url":"ROE_FishFaunaAbsoluteLoss/MapServer/legend"
            ,"layers":{"0":"Number of species lost:"}
        }
        ,'baseMap' : ['bing','arcGisCanvasWorldLightGrayBase']
        ,'layers':['wms_roefishloss','wms_stateboundaries']
        ,'controls':['Navigation','LayerSwitcher','click_roefishloss','InnovateMapFullScreen','ScaleLine','Attribution','InnovateMapLegend']
        ,'hide_controls':['Navigation','PanZoomBar']
    },{
        'id':3//must match param id
        ,'header':'Changes in absolute sea level along U.S. coasts, 1993-2011'
        ,'startResolution':2//gets the resolution from serverResolutions using the startResolution as index
        ,'endResolution':6//number of zoom levels you want, 21 is max and must be greater than startResolution
        ,'projection' : 'EPSG:3857'
        ,'maxExtent' : [-20037507.0671618,-30268942.7554826,20060008.5324932,30240971.9583862]
        //,'zoomToExtent' : [-14617039.6948417,2697596.8976282,-6500380.5111317,6713979.93039427]
        ,'center' : [-110,38] 
        ,'defaultZoomLevel' : 3
        ,'footNote':'This is a test footer note for this exhibit'
        ,'dataSource':'U.S. EPA, 2007d'
        ,'legend':{
            //"url":'ROE/SeaLevelAbsolute/MapServer/legend'
            "url":'http://wiz.innovateteam.com:8080/ROE/images/Exhibit-3-Changes-in-absolute.png'
           
        }
        ,'baseMap' : ['bing','arcGisCanvasWorldLightGrayBase']
        ,'layers':['wms_sea_level_absolute']
        ,'controls':['Navigation','LayerSwitcher','InnovateMapFullScreen','ScaleLine','Attribution','InnovateMapLegend']
        ,'hide_controls':['Navigation','PanZoomBar']
    },{
        'id':4//must match param id
        ,'header':'Annual precipitation anomalies in the U.S. by region, 1901-2012'
        ,'startResolution':3//gets the resolution from serverResolutions using the startResolution as index
        ,'endResolution':5//number of zoom levels you want, 21 is max and must be greater than startResolution
        ,'projection' : 'EPSG:3857'
        ,'maxExtent' : [-19146952.4164,1979106.4997,-7402746.1378,11935768.7022]
        ,'center' : [-120,38] 
        ,'defaultZoomLevel' : 3
        ,'footNote':'This is a test footer note for this exhibit'
        ,'dataSource':'U.S. EPA, 2007d'
        ,'legend':{
            // "url":'http://it.innovateteam.com/arcgis/rest/services/ROE/ROE_Precipitation2013/MapServer/legend'
			"url":'http://geodata.epa.gov/arcgis/rest/services/ORD/ROE_Precipitation/MapServer/legend'
            ,"layers":{"0":"Rate of change in precipitation (% per century):"}
            // ,"cols" : 4//manual override on no of columns to dispplay in legend because the average thing didn't work out for this map
        }
        ,'baseMap' : ['bing','arcGisCanvasWorldLightGrayBase']
        ,'layers':['wms_precipitation','wms_stateboundaries']
        ,'controls':['Navigation','LayerSwitcher','InnovateMapFullScreen','ScaleLine','Attribution','InnovateMapLegend']
        ,'hide_controls':['Navigation','PanZoomBar']
    },{
        'id':5//must match param id
        ,'header':'Annual temperature anomalies in the U.S. by region, 1901-2012'
        ,'startResolution':3//gets the resolution from serverResolutions using the startResolution as index
        ,'endResolution':5//number of zoom levels you want, 21 is max and must be greater than startResolution
        ,'projection' : 'EPSG:3857'
        ,'maxExtent' : [-19146952.4164,1979106.4997,-7402746.1378,11935768.7022]
        ,'center' : [-120,38] 
        ,'defaultZoomLevel' : 3
        ,'footNote':'This is a test footer note for this exhibit'
        ,'dataSource':'U.S. EPA, 2007d'
        ,'legend':{
            //"url":'http://it.innovateteam.com/arcgis/rest/services/ROE/ROE_Temperature2013/MapServer/legend'
			"url":'http://geodata.epa.gov/arcgis/rest/services/ORD/ROE_Temperature/MapServer/legend'
            ,"layers":{"0":"Rate of temperature change (°F per century):"}
            //,"cols":4
        }
        ,'baseMap' : ['bing','arcGisCanvasWorldLightGrayBase']
        ,'layers':['wms_temperature','wms_stateboundaries']
        ,'controls':['Navigation','LayerSwitcher','InnovateMapFullScreen','ScaleLine','Attribution','InnovateMapLegend']
        ,'hide_controls':['Navigation','PanZoomBar']
    },{
        'id':6//must match param id
        ,'header':'Changes in relative sea level along U.S. coasts, 1960-2012'
        ,'startResolution':1
        ,'endResolution':14
        ,'projection' : 'EPSG:3857'
        ,'maxExtent' : [-27793396.9831253,-1169812.67846703,7475631.88826576,12297505.9228368]
        ,'center' : [-120,38] 
        ,'defaultZoomLevel' : 3
        ,'footNote':'This is a test footer note for this exhibit'
        ,'dataSource':'U.S. EPA, 2007d'
        ,'legend':{
             "url":'http://app2.erg.com/ROEsystem/public/images/legend/87-1.png'
            //"url":'ROE_SeaLevelRelative/MapServer/legend'
            //,"layers":{"0":"Mean relative sea level change (mm per year):"}
            //,"cols" : 4//manual override on no of columns to dispplay in legend because the average thing didn't work out for this map
        }
        ,'baseMap' : ['bing','arcGisCanvasWorldLightGrayBase']
        ,'layers':['wms_sea_level_relative']
        ,'controls':['Navigation','LayerSwitcher','click_sealevelrelative','InnovateMapFullScreen','ScaleLine','Attribution','InnovateMapLegend']
        ,'hide_controls':['Navigation','PanZoomBar']
    },{
        'id':7//must match param id
        ,'header':'Land cover of the contiguous U.S., based on 2006 NLCD'
        ,'startResolution':4//gets the resolution from serverResolutions using the startResolution as index
        ,'endResolution':19//number of zoom levels you want, 21 is max and must be greater than startResolution
        ,'projection' : 'EPSG:3857'
        ,'maxExtent' : [-14497452.0992878,2480607.26634549,-7087932.09928778,6960327.26634549]
        ,'center' : [-96,37]
        ,'defaultZoomLevel' :5
        ,'footNote':'This is a test footer note for this exhibit'
        ,'dataSource':'U.S. EPA, 2007d'
        ,'legend':{
            "url":'ROE_NLCD/MapServer/legend'
            ,"cols" : 4//manual override on no of columns to dispplay in legend because the average thing didn't work out for this map
        }
        ,'baseMap' : ['bing','arcGisCanvasWorldLightGrayBase']
        ,'layers':['wms_nlcd','wms_stateboundaries']
        ,'controls':['Navigation','LayerSwitcher','InnovateMapFullScreen','ScaleLine','Attribution','InnovateMapLegend']
        ,'hide_controls':['Navigation','PanZoomBar']
    },{
        'id':8//must match param id
        ,'header':'EPA map of radon zones'
        ,'startResolution':2//gets the resolution from serverResolutions using the startResolution as index
        ,'endResolution':9//number of zoom levels you want, 21 is max and must be greater than startResolution
        ,'projection' : 'EPSG:3857'
        ,'maxExtent' : [-19951913.2278,-1643352.8198,20021888.1032,11554793.571]
        //,'zoomToExtent' : [-14617039.6948417,2697596.8976282,-6500380.5111317,6713979.93039427]
        ,'center' : [-120,38] 
        ,'defaultZoomLevel' : 3
        ,'footNote':'This is a test footer note for this exhibit'
        ,'dataSource':'U.S. EPA, 1992a'
        ,'legend':{
            "url":'ROE_Radon/MapServer/legend'
        }
        ,'baseMap' : ['bing','arcGisCanvasWorldLightGrayBase']
        ,'layers':['wms_radons','wms_stateboundariesThick']
        ,'controls':['Navigation','LayerSwitcher','click_radons','InnovateMapFullScreen','ScaleLine','Attribution','InnovateMapLegend']
        ,'hide_controls':['Navigation','PanZoomBar']
    } 
    ,{
        'id':9//must match param id
        ,'header':'Dissolved oxygen in Long Island Sound bottom waters'
        ,'startResolution':8//gets the resolution from serverResolutions using the startResolution as index
        ,'endResolution':11//number of zoom levels you want, 21 is max and must be greater than startResolution
        ,'projection' : 'EPSG:3857'
        ,'maxExtent' : [-20037507.0671618,-19971868.8804086,20037507.0671618,19971868.8804086]
        //,'zoomToExtent' : [-8228279.75314796,4934469.51342061,-7999645.00587846,5106182.74684707]
        ,'center' : [-73,41] 
        ,'defaultZoomLevel' : 8
        ,'footNote':'This is a test footer note for this exhibit'
        ,'dataSource':'Connecticut DEP, 2007'
        ,'legend':{
            "url":'ROE_LongIslandHypoxia/MapServer/legend'
            ,"layers":{"1":"Dissolved oxygen:"}
            //,"discard":{"0":"Y"}
        }
        ,'baseMap' : ['bing','arcGisCanvasWorldLightGrayBase']
        ,'layers':['wms_longislandhypoxia']
        ,'controls':['Navigation','LayerSwitcher','click_longislandhypoxia','InnovateMapFullScreen','ScaleLine','Attribution','InnovateMapLegend']
        ,'hide_controls':['Navigation','PanZoomBar']
    }
    ,{
        'id':10//must match param id
        ,'header':'ROE Acid Sensitive Waters'
        ,'startResolution':4//gets the resolution from serverResolutions using the startResolution as index
        ,'endResolution':7//number of zoom levels you want, 21 is max and must be greater than startResolution
        ,'projection' : 'EPSG:3857'
        ,'maxExtent' : [-20037507.0671618,-19971868.8804086,20037507.0671618,19971868.8804086]
        //,'zoomToExtent' : [-13887751.0954,2816696.3039,-7453285.4516,6340548.1719]
        ,'center' : [-96,37] 
        ,'defaultZoomLevel' : 4
        ,'footNote':'This is a test footer note for this exhibit'
        ,'dataSource':'Connecticut DEP, 2007'
        ,'legend':{
            "url":'ROE_AcidSensitiveWaters/MapServer/legend'
        }
        ,'baseMap' : ['bing','arcGisCanvasWorldLightGrayBase']
        ,'layers':['wms_acidsensitivewaters','wms_stateboundaries']
        ,'controls':['Navigation','LayerSwitcher','InnovateMapFullScreen','ScaleLine','Attribution','InnovateMapLegend']
        ,'hide_controls':['Navigation','PanZoomBar']
    }
    ,{
        'id':11//must match param id
        ,'header':'Wet Nitrate Deposition'
        ,'startResolution':4//gets the resolution from serverResolutions using the startResolution as index
        ,'endResolution':7//number of zoom levels you want, 21 is max and must be greater than startResolution
        ,'projection' : 'EPSG:3857'
        ,'maxExtent' : [-20037507.0671618,-19971868.8804086,20037507.0671618,19971868.8804086]
        ,'zoomToExtent' : [-13887751.0954,2816696.3039,-7453285.4516,6340548.1719]
        ,'footNote':'This is a test footer note for this exhibit'
        ,'dataSource':'Connecticut DEP, 2007'
        ,'legend':{
            "url":'ROE_WetNitrateDeposition1989_1991/MapServer/legend'
        }
        ,'baseMap' : ['bing','arcGisCanvasWorldLightGrayBase']
        ,'layers':['wms_wetnitratedeposition1989-1991','wms_wetnitratedeposition2009-2011','wms_stateboundaries']
        ,'controls':['Navigation','LayerSwitcher','InnovateMapFullScreen','ScaleLine','InnovateOverlaySwitcher','Attribution','InnovateMapLegend']
        ,'overlaySwitcherRefreshDuration' : 50
        ,'overlaySwitcherLayers' : ['wms_wetnitratedeposition1989-1991','wms_wetnitratedeposition2009-2011']
        ,'hide_controls':['Navigation','PanZoomBar']
    },{
        'id':13//must match param id
        ,'header':'Wet Sulfate Deposition'
        ,'startResolution':4//gets the resolution from serverResolutions using the startResolution as index
        ,'endResolution':7//number of zoom levels you want, 21 is max and must be greater than startResolution
        ,'projection' : 'EPSG:3857'
        ,'maxExtent' : [-20037507.0671618,-19971868.8804086,20037507.0671618,19971868.8804086]
        ,'zoomToExtent' : [-13887751.0954,2816696.3039,-7453285.4516,6340548.1719]
        ,'footNote':'This is a test footer note for this exhibit'
        ,'dataSource':'Connecticut DEP, 2007'
        ,'legend':{
            "url":'ROE_WetSulfateDeposition1989_1991/MapServer/legend'
        }
        ,'baseMap' : ['bing','arcGisCanvasWorldLightGrayBase']
        ,'layers':['wms_wetsulfatedeposition1989-1991','wms_wetsulfatedeposition2009-2011','wms_stateboundaries']
        ,'controls':['Navigation','LayerSwitcher','InnovateMapFullScreen','ScaleLine','InnovateOverlaySwitcher','Attribution','InnovateMapLegend']
         ,'overlaySwitcherRefreshDuration' : 200
         ,'overlaySwitcherLayers' : ['wms_wetsulfatedeposition1989-1991','wms_wetsulfatedeposition2009-2011']
         ,'hide_controls':['Navigation','PanZoomBar']
    },{
        'id':15//must match param id
        ,'header':'Total nitrogen deposition in the contiguous U.S.'
        ,'startResolution':4//gets the resolution from serverResolutions using the startResolution as index
        ,'endResolution':7//number of zoom levels you want, 21 is max and must be greater than startResolution
        ,'projection' : 'EPSG:3857'
        ,'maxExtent' : [-20037507.0671618,-19971868.8804086,20037507.0671618,19971868.8804086]
        ,'zoomToExtent' : [-13887751.0954,2816696.3039,-7453285.4516,6340548.1719]
        ,'footNote':'Coverage: 37 monitoring sites in 1989-1991/2007-2009'
        ,'dataSource':'NADP, 2008; U.S. EPA, 2008'
        ,'legend':{
            "url":'ROE_TotalNitrogenDeposition1989_1991/MapServer/legend'
            ,"discard":{"0":"Y"}
        }
        ,'baseMap' : ['bing','arcGisCanvasWorldLightGrayBase']
        ,'layers':['wms_totalnitrogendeposition1989-1991','wms_totalnitrogendeposition2009-2011']
        ,'initialDisplayLayer':1
        ,'controls':['Navigation','LayerSwitcher','InnovateMapFullScreen','ScaleLine','click_nitrogenDeposition','InnovateOverlaySwitcher','Attribution','InnovateMapLegend']
        ,'hide_controls':['Navigation','PanZoomBar']
        ,'overlaySwitcherRefreshDuration' : 50
    },{
        'id':17//must match param id
        ,'header':'Total sulfur deposition in the contiguous U.S.'
        ,'startResolution':4//gets the resolution from serverResolutions using the startResolution as index
        ,'endResolution':7//number of zoom levels you want, 21 is max and must be greater than startResolution
        ,'projection' : 'EPSG:3857'
        ,'maxExtent' : [-20037507.0671618,-19971868.8804086,20037507.0671618,19971868.8804086]
        ,'zoomToExtent' : [-13887751.0954,2816696.3039,-7453285.4516,6340548.1719]
        ,'footNote':'Coverage: 37 monitoring sites in 1989-1991/2007-2009'
        ,'dataSource':'NADP, 2008; U.S. EPA, 2008'
        ,'legend':{
            "url":'ROE_TotalSulfurDeposition1989_1991/MapServer/legend'
            ,"discard":{"0":"Y"}
        }
        ,'baseMap' : ['bing','arcGisCanvasWorldLightGrayBase']
        ,'layers':['wms_totalsulfurdeposition1989-1991','wms_totalsulfurdeposition2009-2011']
        ,'initialDisplayLayer':1
        ,'controls':['Navigation','LayerSwitcher','InnovateMapFullScreen','click_sulfurDeposition','InnovateOverlaySwitcher','ScaleLine','Attribution','InnovateMapLegend']
        ,'hide_controls':['Navigation','PanZoomBar']
        ,'overlaySwitcherRefreshDuration' : 50
    },{
        'id':18//must match param id
        ,'header':'Ecological hubs and corridors in the contiguous U.S., based on 2001 NLCD'
        ,'startResolution':4//gets the resolution from serverResolutions using the startResolution as index
        ,'endResolution':15//number of zoom levels you want, 21 is max and must be greater than startResolution
        ,'projection' : 'EPSG:3857'
        ,'maxExtent' : [-20037507.0671618,-19971868.8804086,20037507.0671618,19971868.8804086]
        //,'zoomToExtent' : [-13887751.0954,2816696.3039,-7453285.4516,6340548.1719]
        ,'center' : [-96,36] 
        ,'footNote':''
        ,'dataSource':'U.S. EPA, 2012'
        ,'legend':{
            "url":'ROE_EcologicalHubsAndCorridors/MapServer/legend'
        }
        ,'baseMap' : ['bing','arcGisCanvasWorldLightGrayBase']
        ,'layers':['wms_ecologicalhubsandcorridors']
        ,'controls':['Navigation','LayerSwitcher','InnovateMapFullScreen','ScaleLine','Attribution','InnovateMapLegend']
        ,'hide_controls':['Navigation','PanZoomBar']
    },{
        'id':19//must match param id
        ,'header':'Gulf Of Mexico Hypoxia 2012'
        ,'startResolution':4//gets the resolution from serverResolutions using the startResolution as index
        ,'endResolution':8//number of zoom levels you want, 21 is max and must be greater than startResolution
        ,'defaultZoomLevel' : 7
        ,'projection' : 'EPSG:3857'
        //,'zoomToExtent' : [-10525124.271100,3310044.643200,-9960311.438700,3465904.301900]
        ,'maxExtent' : [-20037507.0671618,-19971868.8804086,20037507.0671618,19971868.8804086]
        ,'center' : [-92,29] 
        ,'footNote':''
        ,'dataSource':'U.S. EPA, 2012'
        ,'legend':{
            "url":'ROE_GulfofMexicoHypoxia/MapServer/legend'
            ,"discard":{"1":"Y"}
        }
        ,'baseMap' : ['bing','arcGisCanvasWorldLightGrayBase']
        ,'layers':['wms_gulfofmexicohypoxia']
        ,'controls':['Navigation','LayerSwitcher','click_GulfOfMexicoHypoxia','InnovateMapFullScreen','ScaleLine','Attribution','InnovateMapLegend']
        ,'hide_controls':['Navigation','PanZoomBar']
    },{
        'id':20//must match param id
        ,'header':'Changes in relative sea level along U.S. coasts, 1960-2012'
        ,'startResolution':3//gets the resolution from serverResolutions using the startResolution as index
        ,'endResolution':14//gets the resolution from serverResolutions using the startResolution as index
        ,'projection' : 'EPSG:3857'
        ,'maxExtent' : [-27793396.9831253,-1169812.67846703,7475631.88826576,12297505.9228368]
        ,'center' : [-120,38] 
        ,'defaultZoomLevel' : 6
        ,'footNote':'This is a test footer note for this exhibit'
        ,'dataSource':'U.S. EPA, 2007d'
        ,'legend':{
             "url":'http://app2.erg.com/ROEsystem/public/images/legend/87-1.png'
            //"url":'ROE_SeaLevelRelative/MapServer/legend'
            //,"layers":{"0":"Mean relative sea level change (mm per year):"}
            //,"cols" : 4//manual override on no of columns to dispplay in legend because the average thing didn't work out for this map
        }
        ,'baseMap' : ['bingWithoutWrap','arcGisCanvasWorldLightGrayBase']
        ,'layers':['wms_sea_level_relative']
        ,'controls':['Navigation','LayerSwitcher','click_sealevelrelative','InnovateMapFullScreen','ScaleLine','Attribution','InnovateMapLegend']
        ,'hide_controls':['Navigation','PanZoomBar']
    }
  ,{
        'id':21//must match param id
        ,'header':'Forest biomass in U.S. counties per square mile of land, 2013'
        ,'startResolution':2//gets the resolution from serverResolutions using the startResolution as index
        ,'endResolution':9//number of zoom levels you want, 21 is max and must be greater than startResolution
        ,'projection' : 'EPSG:3857'
        ,'maxExtent' : [-19951913.2278,-1643352.8198,20021888.1032,11554793.571]
        //,'zoomToExtent' : [-14617039.6948417,2697596.8976282,-6500380.5111317,6713979.93039427]
        ,'center' : [-120,38]
        ,'defaultZoomLevel' : 3
        ,'footNote':'This is a test footer note for this exhibit'
        ,'dataSource':'U.S. EPA, 1992a'
        ,'legend':{
            "url":'http://geodata.epa.gov/arcgis/rest/services/ORD/ROE_BiomassPerSquareMile/MapServer/legend'
			,"layers":{"1":"Million metric tons of carbon per square mile:"}
            ,"discard":{"0":"Y"}
        }
        ,'baseMap' : ['bing','arcGisCanvasWorldLightGrayBase']
        ,'layers':['wms_biomasspersquaremile','wms_stateboundariesThick']
        ,'controls':['Navigation','LayerSwitcher','click_biomasspersquaremile','InnovateMapFullScreen','ScaleLine','Attribution','InnovateMapLegend']
        ,'hide_controls':['Navigation','PanZoomBar']
    } ,{
        'id':22//must match param id
        ,'header':'Percent change in carbon stored in U.S. forests, by county, 1990-2013'
        ,'startResolution':2//gets the resolution from serverResolutions using the startResolution as index
        ,'endResolution':9//number of zoom levels you want, 21 is max and must be greater than startResolution
        ,'projection' : 'EPSG:3857'
        ,'maxExtent' : [-19951913.2278,-1643352.8198,20021888.1032,11554793.571]
        //,'zoomToExtent' : [-14617039.6948417,2697596.8976282,-6500380.5111317,6713979.93039427]
        ,'center' : [-120,38]
        ,'defaultZoomLevel' : 3
        ,'footNote':'This is a test footer note for this exhibit'
        ,'dataSource':'U.S. EPA, 1992a'
        ,'legend':{
            "url":'http://geodata.epa.gov/arcgis/rest/services/ORD/ROE_PercentChangeCarbonStorage/MapServer/legend'
			,"layers":{"1":"Percent change in forest biomass:"}
            ,"discard":{"0":"Y"}
        }
        ,'baseMap' : ['bing','arcGisCanvasWorldLightGrayBase']
        ,'layers':['wms_percentchangecarbonstorage','wms_stateboundariesThick']
        ,'controls':['Navigation','LayerSwitcher','click_perchangecarbonstoreage','InnovateMapFullScreen','ScaleLine','Attribution','InnovateMapLegend']
        ,'hide_controls':['Navigation','PanZoomBar']
    } 
]
};