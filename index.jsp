
<!DOCTYPE html>
<html lang="en">
    <!-- EPA Template, OneEPA Web, 17 November 2010 -->
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=8" />
        <title>EPA's Report on the Environment | US Environmental Protection Agency</title>
        <meta name="DC.description" content="EPA's Report on the Environment (ROE) presents the best available indicators of national trends in the environment and human health. This website allows users to explore the ROE data through interactive graphs and maps." />
        <meta name="keywords" content="ROE, report, environment, indicator, metric, data, condition, status, trend" />
        <meta name="DC.title" content="EPA's Report on the Environment" />
        <meta name="DC.type" content="Reports & Assessments" />
        <meta name="DC.Subject.epachannel" content="Science & Technology" />
        <meta name="DC.Subject.epabrm" content="" />
        <meta name="DC.Subject.epacat" content="" />
        <meta name="DC.Subject.epaect" content="" />
        <meta name="DC.Subject.epaemt" content="" />

        <meta name="DC.Subject.epahealth" content="" />
        <meta name="DC.Subject.epaindustry" content="" />
        <meta name="DC.Subject.epaopt" content="" />
        <meta name="DC.Subject.epappt" content="" />
        <meta name="DC.Subject.eparat" content="" />
        <meta name="DC.Subject.eparegulation" content="" />
        <meta name="DC.Subject.eparit" content="" />
        <meta name="DC.Subject.epasubstance" content="" />
        <meta name="DC.audience" content="" />
        <meta name="DC.coverage" content="" />
        <meta name="DC.date.created" content="" />
        <meta name="DC.date.modified" content="" />
        <meta name="DC.date.archivedate" content="" />
        <meta name="DC.creator" content="US EPA, Office of Research and Development, National Center for Environmental Assessment" />
        <meta name="DC.language" content="en" />
        <meta name="viewport" content="width=device-width; initial-scale=1.0"/>

        <link rel="schema.DC" href="http://purl.org/dc/elements/1.1/" />
        <link rel="meta" href="http://www.epa.gov/labels.rdf" type="application/rdf+xml" title="ICRA labels" />
        <!--RSS Feeds -->
        <link rel="alternate" type="application/atom+xml" title="EPA.gov News" href="http://yosemite.epa.gov/opa/admpress.nsf/RSSRecentNews" />
        <link rel="alternate" type="application/atom+xml" title="EPA.gov Headquarters Press Releases" href="http://yosemite.epa.gov/opa/admpress.nsf/RSSByLocation?open&location=Headquarters" />
        <link rel="alternate" type="application/atom+xml" title="Greenversations, EPA's Blog" href="http://blog.epa.gov/blog/feed/" />

        <!-- ALL PAGE STYLES BELOW THIS LINE -->
        <link rel="stylesheet" href="http://www.epa.gov/epafiles/templates/webcms/css/epa.css" type="text/css" />
        <link rel="stylesheet" href="http://app2.erg.com/ROEsystem/public/styles/default.css" type="text/css" media="screen" />
        <link rel="stylesheet" href="http://app2.erg.com/ROEsystem/public/styles/print.css" type="text/css" media="print" />
        <link rel="stylesheet" href="http://app2.erg.com/ROEsystem/public/styles/jquery.qtip.css" type="text/css" />
        <link rel="stylesheet" href="http://app2.erg.com/ROEsystem/public/styles/innovate_style.css" type="text/css" />
        <link rel="stylesheet" href="http://app2.erg.com/ROEsystem/public/styles/jquery-ui.css" type="text/css" />	

        <!--[if IE 7]><link rel="stylesheet" href="http://www.epa.gov/epafiles/templates/webcms/css/ie7.css"/><![endif]-->
        <!--[if lt IE 7]><link rel="stylesheet" href="http://www.epa.gov/epafiles/templates/webcms/css/ie6.css"/><![endif]-->
        <!--[if IE]><script type="text/javascript" src="http://app2.erg.com/ROEsystem/public/scripts/excanvas.compiled.js"></script><![endif]-->

        <!--<script type="text/javascript" src="http://www.epa.gov/epafiles/js/third-party/jquery.js"></script>--><!--EPA's jQuery causes error in IE and doesn't work with parsing.js -->
        <script type="text/javascript" src="http://app2.erg.com/ROEsystem/public/scripts/jquery-1.8.2.min.js"></script> 
        <script type="text/javascript" src="http://app2.erg.com/ROEsystem/public/scripts/jquery-ui.min.js"></script>

        <!-- Mapping scripts -->
        <script type="text/javascript" src="scripts/jquery.blockUI.js"></script>
        <script type="text/javascript" src="scripts/jquery.ui.touch-punch.js"></script>
        <script type="text/javascript" src="scripts/OpenLayers/lib/OpenLayers.js"></script>
        <script type="text/javascript" src="scripts/OpenLayers/lib/OpenLayers/Control/InnovateMapTitle.js"></script>
        <script type="text/javascript" src="scripts/OpenLayers/lib/OpenLayers/Control/InnovateMapLegend.js"></script>
        <script type="text/javascript" src="scripts/OpenLayers/lib/OpenLayers/Control/InnovateMapFooter.js"></script>
        <script type="text/javascript" src="scripts/OpenLayers/lib/OpenLayers/Control/InnovateMapFullScreen.js"></script>
        <script type="text/javascript" src="scripts/OpenLayers/lib/OpenLayers/Control/InnovateOverlaySwitcher.js"></script>
        <script type="text/javascript" src="scripts/map_config.js"></script>
        <script type="text/javascript" src="scripts/innovate.js"></script>
        <script type="text/javascript" src="scripts/innovateControls.js"></script>
        <script type="text/javascript" src="scripts/innovateLayers.js"></script>
        <script type="text/javascript" src="scripts/innovateMap.js"></script>
        <script type="text/javascript" src="scripts/innovateOpacitySelector.js"></script>

        <!-- /Mapping scripts -->

        <!-- Chart scripts -->
        <script type="text/javascript" src="http://app2.erg.com/ROEsystem/public/scripts/parsing.js"></script>
        <!-- /Chart scripts -->

    </head>

    <!--[if lt IE 7 ]> <body class="no-js ie6 basic"> <![endif]-->
    <!--[if IE 7 ]>    <body class="no-js ie7 basic"> <![endif]-->
    <!--[if IE 8 ]>    <body class="no-js ie8 basic"> <![endif]-->



    <!--[if (gte IE 9)|!(IE)]><!--> <body class="no-js basic"> <!--<![endif]-->

        <!--googleoff: index-->
        <p id="sitewidec"></p>
        <p class="skip">Jump to <a href="#main" title="Jump to main content">main content</a> or <a href="#areanav" title="Jump to area navigation.">area navigation</a>.</p>

        <div id="header">
            <p><a href="http://www.epa.gov/" title="US EPA Home Page"><img src="http://www.epa.gov/epafiles/templates/webcms/css/i/print-epa-logo.gif" alt="US Environmental Protection Agency logo" /></a></p>
            <form id="EPAsearch" method="get" action="http://nlquery.epa.gov/epasearch/epasearch">
                <fieldset>
                    <ol>
                        <li id="azindex"><a href="http://www.epa.gov/epahome/quickfinder.htm" title="Alphabetical list of top EPA topics">A-Z Index</a></li>
                        <li><a href="http://www.epa.gov/search.html" title="Advanced search with additional filters">Advanced Search</a></li>
                        <li>

                            <fieldset id="search">
                                <legend>What are you looking for?</legend>
                                <input name="querytext" id="searchbox" value=""/>
                                <button id="searchbutton" type="submit" title="Search">Search</button>
                            </fieldset>
                        </li>
                    </ol>
                    <input type="hidden" name="fld" value="" />

                    <input type="hidden" name="areaname" value="" />
                    <input type="hidden" name="areacontacts" value="" />
                    <input type="hidden" name="areasearchurl" value="" />
                    <input type="hidden" name="typeofsearch" value="epa" />
                    <input type="hidden" name="result_template" value="epafiles_default.xsl" />
                    <input type="hidden" name="filter" value="sample4filt.hts" />
                </fieldset>

            </form><!-- /search -->
            <ul>

                <li id="learn"><a href="http://www.epa.gov/gateway/learn/" title="Learn the Issues">Learn the Issues</a></li>
                <li id="scitech"><a href="http://www.epa.gov/gateway/science/" title="Science and Technology">Science &amp; Technology</a></li>
                <li id="laws"><a href="http://www.epa.gov/lawsregs/" title="Laws and Regulations">Laws &amp; Regulations</a></li>
                <li id="about"><a href="http://www.epa.gov/aboutepa/" title="About EPA">About EPA</a></li>
            </ul><!-- /IA Buckets -->

        </div><!-- /header -->

        <div id="content">


            <div id="area">
                <p><a href="http://app2.erg.com/ROEsystem/public/contactus.cfm">Contact Us</a></p>
                <p>EPA's Report on the Environment</p>
            </div><!-- /area -->

            <div id="page" class="wide vert">
                <div id="main">  

                    <ul id="breadcrumbs">
                        <li class="first"><b>You are here:</b> <a href="http://www.epa.gov/">EPA Home</a></li>
                        <li><a href="index.cfm">ROE Home</a></li>
                        <li>Acid Deposition</li>
                    </ul>
                    <!--googleon: index-->
                    <p class='sitewide-note'>*** External Review Draft ***</p>
                    <h1>EPA's Report on the Environment</h1>
                    <!-- nav -->

                    <!-- main nav -->

                    <div id="smoothmenu" class="ddsmoothmenu">
                        <ul>    



                            <li class="air"><a class="drop" href="http://app2.erg.com/ROEsystem/public/chapter/air/index.cfm">Air</a>
                                <ul>

                                    <li><a class="subdrop" href="http://app2.erg.com/ROEsystem/public/chapter/air/outdoorair.cfm">Outdoor Air Quality</a>
                                        <ul>
                                            <li><a class="subdrop narrow" href="#">A &ndash; L</a>
                                                <ul>

                                                    <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=1">Acid Deposition</a></li>

                                                    <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=12">Acidity in Lakes and Streams</a></li>

                                                    <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=20">Air Quality Index: Days Above 100</a></li>

                                                    <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=90">Air Toxics Concentrations</a></li>

                                                    <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=2">Air Toxics Emissions</a></li>

                                                    <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=4">Carbon Monoxide Concentrations</a></li>

                                                    <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=10">Carbon Monoxide Emissions</a></li>

                                                    <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=93">Energy Use</a></li>

                                                    <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=5">Lead Concentrations</a></li>

                                                    <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=13">Lead Emissions</a></li>

                                                </ul>
                                            </li>
                                            <li><a class="subdrop narrow" href="#">M &ndash; O</a>
                                                <ul>

                                                    <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=6">Manganese Concentrations in Region 5</a></li>

                                                    <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=14">Mercury Emissions</a></li>

                                                    <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=7">Nitrogen Dioxide Concentrations</a></li>

                                                    <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=15">Nitrogen Oxides Emissions</a></li>

                                                    <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=8">Ozone Concentrations</a></li>

                                                    <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=17">Ozone Injury to Forest Plants</a></li>

                                                    <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=18">Ozone Levels over North America</a></li>

                                                    <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=16">Ozone and Particulate Matter Concentrations Along U.S./Mexico Border</a></li>

                                                    <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=11">Ozone-Depleting Substances Concentrations</a></li>

                                                </ul>
                                            </li>
                                            <li><a class="subdrop narrow" href="#">P &ndash; V</a>
                                                <ul>

                                                    <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=9">Particulate Matter Concentrations</a></li>

                                                    <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=19">Particulate Matter Emissions</a></li>

                                                    <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=21">Regional Haze</a></li>

                                                    <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=91">Sulfur Dioxide Concentrations</a></li>

                                                    <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=22">Sulfur Dioxide Emissions</a></li>

                                                    <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=23">Volatile Organic Compounds Emissions</a></li>

                                                </ul>
                                            </li>
                                        </ul>                    
                                    </li>                        


                                    <li><a class="subdrop" href="http://app2.erg.com/ROEsystem/public/chapter/air/ghgs.cfm">Greenhouse Gases</a>
                                        <ul>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=93">Energy Use</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=24">Greenhouse Gas Concentrations</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=87">Sea Level</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=88">Sea Surface Temperature</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=89">Temperature and Precipitation</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=25">U.S. Greenhouse Gas Emissions</a></li>

                                        </ul>                    

                                    </li>


                                    <li><a class="subdrop" href="http://app2.erg.com/ROEsystem/public/chapter/air/indoorair.cfm">Indoor Air Quality</a>
                                        <ul>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=26">Blood Cotinine</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=27">Radon: Homes Above EPA's Action Level</a></li>

                                        </ul>                    

                                    </li>



                                </ul>
                            </li>


                            <li class="water"><a class="drop" href="http://app2.erg.com/ROEsystem/public/chapter/water/index.cfm">Water</a>
                                <ul>

                                    <li><a class="subdrop" href="http://app2.erg.com/ROEsystem/public/chapter/water/surface.cfm">Fresh Surface Waters</a>
                                        <ul>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=12">Acidity in Lakes and Streams</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=28">Benthic Macroinvertebrates in Wadeable Streams</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=94">Freshwater Withdrawals</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=31">Nitrogen and Phosphorus in Agricultural Streams</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=33">Nitrogen and Phosphorus in Large Rivers</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=32">Nitrogen and Phosphorus in Wadeable Streams</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=34">Pesticides in Agricultural Streams</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=29">Stream Flows</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=35">Streambed Stability</a></li>

                                        </ul>                    

                                    </li>


                                    <li><a class="subdrop" href="http://app2.erg.com/ROEsystem/public/chapter/water/ground.cfm">Ground Water</a>
                                        <ul>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=94">Freshwater Withdrawals</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=36">Nitrate and Pesticides in Ground Water</a></li>

                                        </ul>                    

                                    </li>


                                    <li><a class="subdrop" href="http://app2.erg.com/ROEsystem/public/chapter/water/wetlands.cfm">Wetlands</a>
                                        <ul>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=37">Wetlands</a></li>

                                        </ul>                    

                                    </li>


                                    <li><a class="subdrop" href="http://app2.erg.com/ROEsystem/public/chapter/water/coastal.cfm">Coastal Waters</a>
                                        <ul>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=38">Coastal Benthic Communities</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=39">Coastal Fish Tissue</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=40">Coastal Sediment Quality</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=41">Hypoxia in Gulf of Mexico and Long Island Sound</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=42">Submerged Aquatic Vegetation in Chesapeake Bay</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=43">Trophic State of Coastal Waters</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=37">Wetlands</a></li>

                                        </ul>                    

                                    </li>


                                    <li><a class="subdrop" href="http://app2.erg.com/ROEsystem/public/chapter/water/drinking.cfm">Drinking Water</a>
                                        <ul>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=45">Drinking Water</a></li>

                                        </ul>                    

                                    </li>


                                    <li><a class="subdrop" href="http://app2.erg.com/ROEsystem/public/chapter/water/recreational.cfm">Recreational Waters</a>
                                        <ul>

                                            <li><a>[No indicators for this topic]</a></li>

                                        </ul>                    

                                    </li>


                                    <li><a class="subdrop" href="http://app2.erg.com/ROEsystem/public/chapter/water/fish.cfm">Consumable Fish and Shellfish</a>
                                        <ul>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=39">Coastal Fish Tissue</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=47">Lake Fish Tissue</a></li>

                                        </ul>                    

                                    </li>



                                </ul>
                            </li>


                            <li class="land"><a class="drop" href="http://app2.erg.com/ROEsystem/public/chapter/land/index.cfm">Land</a>
                                <ul>

                                    <li><a class="subdrop" href="http://app2.erg.com/ROEsystem/public/chapter/land/cover.cfm">Land Cover</a>
                                        <ul>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=48">Forest Extent and Type</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=49">Land Cover</a></li>

                                        </ul>                    

                                    </li>


                                    <li><a class="subdrop" href="http://app2.erg.com/ROEsystem/public/chapter/land/use.cfm">Land Use</a>
                                        <ul>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=51">Land Use</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=52">Urbanization and Population Change</a></li>

                                        </ul>                    

                                    </li>


                                    <li><a class="subdrop" href="http://app2.erg.com/ROEsystem/public/chapter/land/chemicals.cfm">Chemicals Used on Land</a>
                                        <ul>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=55">Agricultural Fertilizer</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=57">Pesticide Incidents</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=56">Pesticide Residues in Food</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=58">Toxic Chemicals in Wastes</a></li>

                                        </ul>                    

                                    </li>


                                    <li><a class="subdrop" href="http://app2.erg.com/ROEsystem/public/chapter/land/wastes.cfm">Wastes</a>
                                        <ul>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=54">Hazardous Waste</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=53">Municipal Solid Waste</a></li>

                                        </ul>                    

                                    </li>


                                    <li><a class="subdrop" href="http://app2.erg.com/ROEsystem/public/chapter/land/contaminated.cfm">Contaminated Land</a>
                                        <ul>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=60">Contaminated Ground Water Migration at Cleanup Sites</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=59">Human Exposures at Cleanup Sites</a></li>

                                        </ul>                    

                                    </li>



                                </ul>
                            </li>


                            <li class="health"><a class="drop" href="http://app2.erg.com/ROEsystem/public/chapter/health/index.cfm">Human Exposure and Health</a>
                                <ul>

                                    <li><a class="subdrop" href="http://app2.erg.com/ROEsystem/public/chapter/health/exposure.cfm">Exposure to Environmental Contaminants</a>
                                        <ul>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=61">Blood Cadmium</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=26">Blood Cotinine</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=63">Blood Lead</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=64">Blood Mercury</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=65">Blood Persistent Organic Pollutants</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=66">Urinary Pesticides</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=67">Urinary Phthalates</a></li>

                                        </ul>                    

                                    </li>


                                    <li><a class="subdrop" href="http://app2.erg.com/ROEsystem/public/chapter/health/status.cfm">Health Status</a>
                                        <ul>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=68">General Mortality</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=69">Infant Mortality</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=70">Life Expectancy</a></li>

                                        </ul>                    

                                    </li>


                                    <li><a class="subdrop" href="http://app2.erg.com/ROEsystem/public/chapter/health/disease.cfm">Disease and Conditions</a>
                                        <ul>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=71">Asthma</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=72">Birth Defects</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=73">Cancer</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=74">Cardiovascular Disease</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=75">Childhood Cancer</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=76">Chronic Obstructive Pulmonary Disease</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=77">Infectious Diseases</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=78">Low Birthweight</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=79">Preterm Delivery</a></li>

                                        </ul>                    

                                    </li>



                                </ul>
                            </li>


                            <li class="eco"><a class="drop" href="http://app2.erg.com/ROEsystem/public/chapter/eco/index.cfm">Ecological Condition</a>
                                <ul>

                                    <li><a class="subdrop" href="http://app2.erg.com/ROEsystem/public/chapter/eco/extent.cfm">Extent and Distribution</a>
                                        <ul>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=80">Ecological Connectivity</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=48">Forest Extent and Type</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=81">Forest Fragmentation</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=49">Land Cover</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=51">Land Use</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=52">Urbanization and Population Change</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=37">Wetlands</a></li>

                                        </ul>                    

                                    </li>


                                    <li><a class="subdrop" href="http://app2.erg.com/ROEsystem/public/chapter/eco/balance.cfm">Diversity and Biological Balance</a>
                                        <ul>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=28">Benthic Macroinvertebrates in Wadeable Streams</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=83">Bird Populations</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=38">Coastal Benthic Communities</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=84">Fish Faunal Intactness</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=85">Non-Indigenous Estuarine Species in Pacific Northwest</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=42">Submerged Aquatic Vegetation in Chesapeake Bay</a></li>

                                        </ul>                    

                                    </li>


                                    <li><a class="subdrop" href="http://app2.erg.com/ROEsystem/public/chapter/eco/processes.cfm">Ecological Processes</a>
                                        <ul>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=86">Carbon Storage in Forests</a></li>

                                        </ul>                    

                                    </li>


                                    <li><a class="subdrop" href="http://app2.erg.com/ROEsystem/public/chapter/eco/physical.cfm">Physical and Chemical Attributes</a>
                                        <ul>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=12">Acidity in Lakes and Streams</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=41">Hypoxia in Gulf of Mexico and Long Island Sound</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=31">Nitrogen and Phosphorus in Agricultural Streams</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=33">Nitrogen and Phosphorus in Large Rivers</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=32">Nitrogen and Phosphorus in Wadeable Streams</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=87">Sea Level</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=88">Sea Surface Temperature</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=29">Stream Flows</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=35">Streambed Stability</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=89">Temperature and Precipitation</a></li>

                                        </ul>                    

                                    </li>


                                    <li><a class="subdrop" href="http://app2.erg.com/ROEsystem/public/chapter/eco/exposure.cfm">Ecological Exposure to Contaminants</a>
                                        <ul>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=39">Coastal Fish Tissue</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=47">Lake Fish Tissue</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=17">Ozone Injury to Forest Plants</a></li>

                                        </ul>                    

                                    </li>



                                </ul>
                            </li>


                            <li class="sustain"><a class="drop" href="http://app2.erg.com/ROEsystem/public/chapter/sustain/index.cfm">Sustainability</a>
                                <ul>

                                    <li><a class="subdrop" href="http://app2.erg.com/ROEsystem/public/chapter/sustain/resource.cfm">Resource Consumption</a>
                                        <ul>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=93">Energy Use</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=94">Freshwater Withdrawals</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=54">Hazardous Waste</a></li>

                                            <li><a href="http://app2.erg.com/ROEsystem/public/indicator.cfm?i=53">Municipal Solid Waste</a></li>

                                        </ul>                    

                                    </li>



                                </ul>
                            </li>

                        </ul>
                    </div>


                    <h2 id="title">Acid Deposition</h2>
                    <p class="note">Note to reviewers: Exhibits for this indicator have been updated with the latest available data (through 2011). The text and technical documentation are still in the process of being updated, and the updated content has not yet been reviewed by the EPA program that provided the data.</p>             

                    <div id="innovate_container">
                        <div id="graphs">
                            <div id="graphsInner" class="clearfix">

                                <div id="onecolumn-container">

                                    <div style="width:180px; height:600px; margin-top:10px; overflow-y:auto; float:left;"><!-- thumbnails - need to pull titles from the database -->
                                        <p id="coda-nav-1" class="coda-nav onecol" style="font-size:11px;line-height:13px;">
                                    </div><!--//thumbnails-->

                                    <div id="coda-slider-onecolumn" class="coda-slider onecolumn leftalign">

                                        <!-- <div class="panel onecolumn">
                                             <div class="panel-wrapper onecolumngraph">
                                                 <div id="container-map1" class="innovate_container"></div>
                                                 <div id="footnotes-map1" class="indicator-footnotes"></div>
                                             </div>      
                                             <ul class="tools alignright">
                                                 <li><a href="#" title="Get a PDF of this page"><img src="images/pdf_icon.png" id="export-ghgemissions1" width="30" height="30" alt="Get a PDF of this page" /></a></li>
                                                 <li><a href="#" title="Add a statistical layer to this exhibit [No statistical information for this exhibit at this time]"><img src="images/data_icon.png" id="layer"  width="30" height="30" alt="Add a statistical layer to this exhibit" /></a></li>
                                                 <li><a href="#" title="View this exhibit data in Excel"><img src="images/xls_icon.png" id="excel" width="30" height="30" alt="View this exhibit data in Excel" /></a></li>
                                                 <li><a href="#" title="Click here for help in using this indicator dashboard"><img src="images/help_icon.png" id="help" width="30" height="30" alt="Click here for help in using this indicator dashboard" /></a></li>
                                             </ul>        
                                         </div>
                                        -->



                                    </div>
                                </div><!--one column container-->
                            </div>
                        </div>
                    </div>


                    <script type="text/javascript">
                       
                        $(document).ready(function() {
                            innovate.setMapLinks();
                
                
                            if(innovate.getInternetExplorerVersion()==-1){
                                $("image").each(function(){
                                    $(this).attr("class","pointerCursor");
                                });
                            }
                            if(parseInt(innovate.getInternetExplorerVersion())>7){
                    
                                $('meta[http\\-equiv="X\\-UA\\-Compatible"]').attr("content","IE=7");
                            }
                            //innovate.buildMap(1);
                            //innovate.setFooter(1);
                
                            //innovate.buildMap(2);
                            //innovate.setFooter(2);
                
                        });
                        
                        //must be called before including functions.js or else when initial load is a map it tends to hide footer because when coda slider sets the height of the div, the content has not been set - by content I mean the footer details
                        //innovate.initalizeMaps();
                        //initalizeMaps does the task of rendering the map by using OL api
                    </script>


                    <!-- indicator ID 1 Exhibit 5 (D) -->
                    <script type="text/javascript">
                        $(document).ready(function() {
                            var highchartsOptions = Highcharts.setOptions(Highcharts.theme);
                            var chart;
                            var type = 'D';
	
                            var options = {
                                chart: {
                                    renderTo: 'container5'
                                },
                                legend: {
                                    y: -165
                                },
                                title: {},
                                subtitle: {},
                                xAxis: {
                                    endOnTick: true,
                                    title: {
                                        text: ''
                                    },
                                    labels: {
                                        formatter: function() {
                                            return this.value;	
                                        }
                                    }
                                },
                                yAxis: {
                                    title: {
                                        text: ''
                                    }
                                    // no plotLines for this exhibit
                                },
                                tooltip: {
                                    crosshairs: true,
                                    formatter: function() {
                                        var units = this.series.tooltipOptions.valueSuffix;
                                        if(this.series.type == 'arearange')
                                            return '<strong>'+this.x +':</strong><br>'+ '90% of sites have concentrations below '+ Highcharts.numberFormat(this.point.high, 2, '.') + ' ' + units + '<br>' + '10% of sites have concentrations below ' + Highcharts.numberFormat(this.point.low, 2, '.') + ' ' + units;
                                        else return '<strong>'+ this.series.name +'</strong><br>'+
                                            this.x +': '+ Highcharts.numberFormat(this.y, 2, '.') + ' ' + units;
                                    }
                                },
                                plotOptions: {
                                    series: {
                                        stacking: false,
                                        threshold: -2
                                    },
                                    arearange: {
                                        lineWidth: 1,
                                        index: 1
                                    },
                                    line: {
                                        index: 100,
                                        lineWidth: 1,
                                        marker: {
                                            radius: 2,
                                            lineWidth: 1,
                                            enabled: false    
                                        }
                                    }
                                },
                                series: []
                            };
                            
                            /*
                            parseData(type, options, 'data/exh_045.csv', function(options) {	
                                options.series[0].type = 'line';
                                options.series[1].type = 'line';
                                options.series[2].type = 'arearange';
                                // Create the chart(s)
                                chart = new Highcharts.Chart(options);
                            });
                             */
                            // export handler
                            $('#export5').click(function () {
                                chart.exportChart({
                                    filename: 'acid-deposition_exhibit-5'
                                });
                            });
                            
                        });
                    </script>


                    <!-- indicator ID 1 Exhibit 6 (D) -->
                    <script type="text/javascript">
                        $(document).ready(function() {
                            var highchartsOptions = Highcharts.setOptions(Highcharts.theme);
                            var chart;
                            var type = 'D';
	
                            var options = {
                                chart: {
                                    renderTo: 'container6'
                                },
                                legend: {
                                    y: -165
                                },
                                title: {},
                                subtitle: {},
                                xAxis: {
                                    endOnTick: true,
                                    title: {
                                        text: ''
                                    },
                                    labels: {
                                        formatter: function() {
                                            return this.value;	
                                        }
                                    }
                                },
                                yAxis: {
                                    title: {
                                        text: ''
                                    }
                                    // no plotLines for this exhibit
                                },
                                tooltip: {
                                    crosshairs: true,
                                    formatter: function() {
                                        //conditional tooltip
                                        var units = this.series.tooltipOptions.valueSuffix;
                                        if(this.series.type == 'arearange')
                                            return '<strong>'+ this.series.name +'</strong><br>'+
                                            this.x +': '+ Highcharts.numberFormat(this.point.low, 2, '.') + ' ' +  units +' to '+ Highcharts.numberFormat(this.point.high, 2, '.') + ' ' + units;
                                        else return '<strong>'+ this.series.name +'</strong><br>'+
                                            this.x +': '+ Highcharts.numberFormat(this.y, 2, '.') + ' ' + units;
                                    }
                                },
                                plotOptions: {
                                    series: {
                                        stacking: false,
                                        threshold: -2
                                    },
                                    arearange: {
                                        lineWidth: 1,
                                        index: 1
                                    },
                                    line: {
                                        index: 100,
                                        lineWidth: 1,
                                        marker: {
                                            radius: 2,
                                            lineWidth: 1,
                                            enabled: false    
                                        }
                                    }
                                },
                                series: []
                            };
                            
                            /*
                            parseData(type, options, 'data/exh_046.csv', function(options) {	
                                options.series[0].type = 'line';
                                options.series[1].type = 'line';
                                options.series[2].type = 'arearange';
                                // Create the chart(s)
                                chart = new Highcharts.Chart(options);
                            });
                             */

                            // export handler
                            $('#export6').click(function () {
                                chart.exportChart({
                                    filename: 'acid-deposition_exhibit-6'
                                });
                            });
                        });
                    </script>



                    <div class="accordion">
                        <h3><span>Introduction</span></h3>
                        <div class="pane">
                            <p>
                                Every year, millions of tons of sulfur dioxide and nitrogen oxides are emitted to the atmosphere as a result of the burning of fossil fuels and from other high temperature sources (the <a href="indicator.cfm?i=22">Sulfur Dioxide Emissions indicator</a>; the <a href="indicator.cfm?i=15">Nitrogen Oxides Emissions indicator</a>). These gases react with water, oxygen, and oxidants to form acidic compounds, which may be carried hundreds of miles by the wind&mdash;even across state or national borders. Acid deposition occurs when these compounds fall to the Earth in one of two forms: wet (dissolved in rain, snow, and fog) or dry (solid and gaseous particles deposited on surfaces during periods of no precipitation). While wet deposition is the more widely recognized form (more commonly referred to as &ldquo;acid rain&rdquo;), dry deposition can account for 20 to 80 percent of total acid deposition depending on location and climate (MACTEC Engineering and Consulting, Inc., 2005). In the environment, acid deposition causes soils and water bodies to acidify, which can make the water unsuitable for some fish and other wildlife. Some types of ecosystems, those with less &ldquo;buffering&rdquo; capacity, are more sensitive to acid deposition than others.</p>
                            <p>
                                Scientists often use acid neutralizing capacity, a measure of the amount of anions, protons, and non-proton cations in the water, as an indicator of which lakes and streams are most sensitive to acidification (NAPAP, 1991). Most surface waters in the West do not exhibit many symptoms of acidification, because relatively small amounts of acid deposition occur in acid-sensitive regions. In the Northeast and along the Appalachian Mountains, however, relatively high levels of acid deposition occur in acid-sensitive regions, or regions without enough geochemical buffering capacity to prevent acidification of surface waters by acid deposition (the <a href="indicator.cfm?i=12">Lake and Stream Acidity indicator</a>). Therefore, reductions in acid deposition have the largest impact on acidification of lakes and streams in those areas.</p>
                            <p>
                                Acid deposition damages some trees, particularly at high elevations, and speeds the decay of buildings, statues, and sculptures that are part of our national heritage (U.S. EPA, 2003). The nitrogen portion of acid deposition also contributes to eutrophication in coastal ecosystems, the symptoms of which include potentially toxic algal blooms, fish kills, and loss of plant and animal diversity. Acidification of lakes and streams can increase the amount of methylmercury available in aquatic systems (Winfrey and Rudd, 1990). Finally, increased levels of sulfate in ground-level air, a phenomenon related to dry deposition, can contribute to decreased visibility as well as a variety of human health problems (U.S. EPA, 2003).</p>
                            <p>
                                Total acid deposition in this indicator is determined using wet deposition measurements and dry deposition calculated from ambient air concentration measurements. Wet deposition is measured through chemical analysis of rainwater collected at sites across the U.S. The primary source of wet deposition information comes from the National Atmospheric Deposition Program/National Trends Network. The chemical components of wet deposition include sulfate, nitrate, and ammonium. Dry deposition is not measured directly. EPA&rsquo;s Clean Air Status and Trends Network determines dry deposition inferentially by measuring ambient air concentrations of acidic compounds and then calculating deposition rates using a multi-layer model that depends on meteorological data collected at the sites as well as local vegetative conditions (<a href="http://www.epa.gov/castnet/">http://www.epa.gov/castnet/</a>). Chemicals measured include components of particulate matter (sulfate [SO<sub>4</sub><sup>2-</sup>] and nitrate [NO<sub>3</sub><sup>-</sup>]), gaseous nitric acid (HNO<sub>3</sub>), sulfur dioxide (SO<sub>2</sub>), ammonia (NH<sub>3</sub>), and ammonium (NH<sub>4</sub><sup>+</sup>).</p>
                            <p>
                                This indicator uses the 3-year average from 1989-1991 as a baseline, as this period immediately predates controls on sulfur and nitrogen oxide emissions mandated by the 1990 Clean Air Act Amendments. Baseline data are compared to the most recent 3-year average data available (2005-2007). Use of 3-year average data helps ensure that trends reflect actual changes in acid deposition, instead of shorter-term fluctuations in meteorological conditions. Additionally, this indicator presents annual trend data for total deposition, which characterizes deposition over the entire period of record, not just for the baseline and most recent 3-year average periods.</p>

                        </div>
                        <h3><span>What the Data Show</span></h3>
                        <div class="pane">
                            <p>
                                <em>Wet Deposition Trends</em></p>
                            <p>
                                Analyses of long-term monitoring data from the National Atmospheric Deposition Program show that wet deposition of both sulfur and nitrogen compounds has decreased over the last 19 years (Exhibits 1 and 2).</p>
                            <p>
                                Wet sulfate deposition decreased across much of the U.S. since 1989 (Exhibit 1). The greatest reductions in wet sulfate deposition occurred in the Mid-Appalachian region (Maryland, New York, West Virginia, Virginia, and most of Pennsylvania) and the Ohio River Valley. Less dramatic reductions were observed across much of New England and portions of the Southern Appalachians. Average regional decreases in wet deposition of sulfate between the periods 1989-1991 (panel A) and 2005-2007 (panel B) were approximately 35 percent in the Northeast, 33 percent in the Midwest, 29 percent in the Mid-Atlantic, and 28 percent in the Southeast.</p>
                            <p>
                                Wet nitrate deposition decreased approximately 31 percent across the Northeast and 29 percent in the Mid-Atlantic between the periods 1989-1991 and 2005-2007&nbsp;&nbsp;(Exhibit 2). However, there is a high degree of variability in the measurements used to calculate these percentages, complicating efforts to reliably estimate trends for wet nitrate deposition. Wet deposition of inorganic nitrogen has not changed substantially in the rest of the country over this period.</p>
                            <p>
                                <em>Total Deposition Trends</em></p>
                            <p>
                                As with wet deposition, total deposition (the sum of wet and dry deposition) decreased between 1989-1991 and 2005-2007, and reductions were more substantial for sulfur compounds than for nitrogen compounds (Exhibits 3 and 4). In the eastern U.S., where data are most abundant, total sulfur deposition decreased by 44 percent between 1990 and 2007 (Exhibit 5), while total nitrogen deposition decreased by 25 percent over the same time frame (Exhibit 6). Note that total nitrogen deposition in this indicator does not include nitrogen components, such as ammonia, which can be a significant portion of the dry deposition.</p>

                        </div>
                        <h3><span>Limitations</span></h3>
                        <div class="pane">
                            <ul>
                                <li>
                                    Geographic coverage is limited, particularly for dry deposition (and thus total deposition as well), but the concentration of sites in the Midwest and Northeast is justified by the fact that acid rain is much more of a problem in those regions than it is in the West, Great Plains, or Southeast.</li>
                                <br />
                                <li>
                                    Measurement techniques for dry deposition have improved substantially, but characterization of dry deposition still requires a combination of measurements and modeling, which has inherent uncertainties. Further, dry deposition presented in this indicator does not include contributions from deposition of gaseous ammonia.</li>
                            </ul>

                        </div>
                        <h3><span>Data Sources</span></h3>
                        <div class="pane">
                            <p>
                                Summary data in this indicator were provided by EPA&rsquo;s Office of Atmospheric Programs, based on deposition data from two sources. Wet deposition data are from the National Atmospheric Deposition Program/National Trends Network (NADP, 2008) (<a href="http://nadp.sws.uiuc.edu/">http://nadp.sws.uiuc.edu/</a>), and dry deposition data are from the Clean Air Status and Trends Network (U.S. EPA, 2008) (<a href="http://www.epa.gov/castnet">http://www.epa.gov/castnet</a>). This indicator aggregates data across 3-year periods to avoid influences from short-term fluctuations in meteorological conditions, and wet deposition data were interpolated among monitoring stations to generate the maps shown in Exhibits 1 and 2.</p>

                        </div>
                    </div>


                    <!-- hidden div used for printing References -->
                    <div id="print-references" style="display:none;">
                        <h2 id="title">References</h2>
                        <p>
                            MACTEC Engineering and Consulting, Inc. 2008. Data from the Clean Air Status and Trends Network. Accessed 2008. <a href="http://www.epa.gov/castnet/data.html">http://www.epa.gov/castnet/data.html</a></p>
                        <p>
                            MACTEC Engineering and Consulting, Inc. 2005. Clean Air Status and Trends Network (CASTNET): 2004 annual report. Prepared for U.S. EPA, Office of Air and Radiation. <a href="http://www.epa.gov/castnet/library.html">http://www.epa.gov/castnet/library.html</a></p>
                        <p>
                            NADP (National Atmospheric Deposition Program). 2008. Data from the NADP/National Trends Network. Accessed 2008. <a href="http://nadp.sws.uiuc.edu/">http://nadp.sws.uiuc.edu</a></p>
                        <p>
                            NAPAP (National Acid Precipitation Assessment Program). 1991. 1990 integrated assessment report. Washington, DC.</p>
                        <p>
                            U.S. EPA (United States Environmental Protection Agency). 2008. Data from the Clean Air Status and Trends Network. Accessed 2008. <a href="http://www.epa.gov/castnet/">http://www.epa.gov/castnet/</a></p>
                        <p>
                            U.S. EPA. 2003. Latest findings on national air quality: 2002 status and trends. EPA/454/K-03/001. Research Triangle Park, NC. <a href="http://www.epa.gov/air/airtrends/aqtrnd02/2002_airtrends_final.pdf">http://www.epa.gov/air/airtrends/aqtrnd02/2002_airtrends_final.pdf (PDF)</a><span class="fileinfo">(36 pp, 4.7MB)</span></p>
                        <p>
                            Winfrey, M.R., and J.W.M. Rudd. 1990. Environmental factors affecting the formation of methyl mercury in low pH lakes. Environ. Toxicol. Chem. 9(7):853-869.</p>

                    </div><!--//end hidden div for printing-->

                    <div id="indicatorinfo">   
                        <div id="indicatorinfoleft">
                            <div id="popuplinks">    

                                <a onclick="techDocPopup(1,'','')">View Technical Documentation</a> 

                                <a onclick="refPopup(1,'','')">View References</a>

                            </div>

                            <div id="moreinfo">
                                <h2>For More Information</h2>
                                <ul>            

                                    <li><a href="http://nadp.sws.uiuc.edu/" target="_blank">National Atmospheric Deposition Program </a></li>

                                    <li><a href="http://www.epa.gov/acidrain/" target="_blank">EPA Acid Rain Program </a></li>

                                    <li>Learn how this indicator fits into 

                                        conceptual diagrams                     

                                        for: 
                                        <a href="frameworks.cfm?id1=rain#frameworkdds">Acid Deposition</a>, <a href="frameworks.cfm?id1=hypoxia#frameworkdds">Coastal Hypoxia</a>, <a href="frameworks.cfm?id1=nutrients#frameworkdds">Nutrient Impacts</a>

                                    </li>

                                    <li>This indicator relates to:   

                                        <a href="chapter/air/outdoorair.cfm">Outdoor Air Quality</a> 
                                    </li>
                                </ul>
                            </div>
                            <br/>
                        </div>


                        <div id="disclaimerbox"><h2>&nbsp;</h2><p>This page provides links to non-EPA websites that provide additional information about this topic. You will leave the EPA.gov domain, and EPA cannot attest to the accuracy of information on that non-EPA page. Providing links to a non-EPA website is not an endorsement of the other site or the information it contains by EPA or any of its employees. Also, be aware that the privacy protection provided on the EPA.gov domain (see <a href=" http://www.epa.gov/epafiles/usenotice.htm">Privacy and Security Notice</a>) may not be available at the external link. <a href="http://www.epa.gov/epahome/exitepa.htm"  target="_blank" title="EPA's External Link Disclaimer"><img src=" http://www.epa.gov/epafiles/images/epafiles_misc_exitepadisc.gif " width="87" height="13" alt="Exit EPA Disclaimer" /></a></p>

                            <p>You will need the free Adobe Reader to view some of the files on this page. See <a href="http://www.epa.gov/epahome/pdf.html" target="_blank">EPA's PDF page</a> to learn more.</p>
                        </div>

                    </div>



                    <br style="clear:both;" /><div id="footerlinks"><a href="http://app2.erg.com/ROEsystem/public/index.cfm">ROE Home</a><span class="pagetop" style="margin-left:10px;"><a href="#content">Top of Page</a></span></div>
                    <!--googleoff: index-->

                    <!--      <p id="areafooter">{Area footer content goes here}</p>-->

                </div><!-- /main -->

                <div id="areanav">
                    <h4 class="skip">Area Navigation</h4>
                    <ul>
                        <li class="separator"><a href="http://app2.erg.com/ROEsystem/public/index.cfm">ROE Home</a><hr /></li>
                        <li><a href="http://app2.erg.com/ROEsystem/public/basicinfo.cfm">Basic Information</a></li>
                        <li><a href="http://app2.erg.com/ROEsystem/public/whereyoulive.cfm">Where You Live</a></li>
                        <li><a href="http://app2.erg.com/ROEsystem/public/whatyoucando.cfm">What You Can Do</a></li>
                        <li><a href="http://app2.erg.com/ROEsystem/public/indicators.cfm">Indicators A-Z</a></li>
                        <li><a href="http://app2.erg.com/ROEsystem/public/faqs.cfm">Frequent Questions</a></li>
                        <li><a href="http://app2.erg.com/ROEsystem/public/history.cfm">History of the ROE</a></li>
                        <li><a href="http://app2.erg.com/ROEsystem/public/frameworks.cfm">Conceptual Framework</a></li>
                        <li><a href="http://app2.erg.com/ROEsystem/public/glossary.cfm">Glossary</a></li>
                    </ul>
                </div><!-- /area-nav -->
            </div><!-- /page -->
        </div><!-- /content -->
        <div id="footer">
            <ul id="goodies">
                <li id="rss-news"><a href="http://www.epa.gov/newsroom/rssfeeds.htm">News Feeds</a></li>
                <li id="podcasts"><a href="http://www.epa.gov/epahome/podcasts.htm">Podcasts</a></li>
                <li id="mobile"><a href="http://m.epa.gov/">EPA Mobile</a></li>

                <li id="email-news"><a href="http://www.epa.gov/newsroom/email_signups.htm">News by Email</a></li>
                <li id="widgets"><a href="http://www.epa.gov/widgets/">Widgets</a></li>
            </ul>
            <ul id="globalfooter">
                <li><a href="http://www.epa.gov/">EPA Home</a></li>
                <li><a href="http://www.epa.gov/epahome/usenotice.htm">Privacy and Security Notice</a></li>
                <li class="last"><a href="http://app2.erg.com/ROEsystem/public/contactus.cfm">Contact Us</a></li>

            </ul>
            <p id="seal">The Seal of the United States Environmental Protection Agency</p>
        </div><!-- /footer -->
        <p class="skip"><a href="#content" title="Jump to main content.">Jump to main content.</a></p>

        <!--<script src="http://www.epa.gov/epafiles/js/epa-core-v4.js"></script>--><!--used with EPA's jQuery, causes error when EPA jQuery version not used-->


        <script type="text/javascript" src="http://app2.erg.com/ROEsystem/public/scripts/jquery.qtip.min.js"></script>
        <script type="text/javascript" src="http://app2.erg.com/ROEsystem/public/scripts/jquery.tabify.js"></script>
        <script type="text/javascript" src="http://app2.erg.com/ROEsystem/public/scripts/jquery.coda-slider-2.0.js"></script>
        <script type="text/javascript" src="http://app2.erg.com/ROEsystem/public/scripts/jquery.easing.1.3.js"></script>
        <script type="text/javascript" src="http://app2.erg.com/ROEsystem/public/scripts/jquery.tools.min.js"></script>
        <script type="text/javascript" src="scripts/functions.js"></script>
        <script type="text/javascript" src="http://app2.erg.com/ROEsystem/public/scripts/highcharts.src.js"></script>
        <script type="text/javascript" src="http://app2.erg.com/ROEsystem/public/scripts/highcharts-more.js"></script>
        <script type="text/javascript" src="http://app2.erg.com/ROEsystem/public/scripts/erg-theme-css.js"></script>
        <!--<script type="text/javascript" src="http://app2.erg.com/ROEsystem/public/scripts/exporting.js"></script>-->
        <!--<script type="text/javascript" src="scripts/fancybox/jquery.fancybox-1.3.4.js"></script>--><!--not used-->
        <script src="http://www.epa.gov/epafiles/js/third-party/jquery.cycle.lite.min.js"></script>
        <script src="http://www.epa.gov/epafiles/js/third-party/jquery.tools.1.2.min.js"></script>

        <!-- nav menu js -->
        <script type="text/javascript" src="http://app2.erg.com/ROEsystem/public/scripts/navmenu.js"></script>
        <script type="text/javascript">
            ddsmoothmenu.init({
                mainmenuid: "smoothmenu",
                orientation: 'h',
                classname: 'ddsmoothmenu',
                contentsource: "markup" //"markup" or ["container_id", "path_to_menu_file"]
            })

            $.ajaxSetup({ cache: false });
	
            <!-- preload banner images -->
            $.fn.preload = function() {
                this.each(function(){
                    $('<img/>')[0].src = this;
                });
            }
	
            $(document).ready(function() {
                innovate.setMenuZindex();//correct the z-index of that the map does not overlap the menu
            });
		


            $(['images/banner_photos/air-ghgs.jpg', 'images/banner_photos/air-indoor.jpg', 'images/banner_photos/air-outdoor.jpg', 'images/banner_photos/water-coastal.jpg', 'images/banner_photos/water-drinking.jpg', 'images/banner_photos/water-fish.jpg', 'images/banner_photos/water-ground.jpg', 'images/banner_photos/water-recreational.jpg',  'images/banner_photos/water-surface.jpg', 'images/banner_photos/water-wetlands.jpg', 'images/banner_photos/land-chemicals.jpg', 'images/banner_photos/land-contaminated.jpg','images/banner_photos/land-cover.jpg', 'images/banner_photos/land-use.jpg', 'images/banner_photos/land-wastes.jpg', 'images/banner_photos/health-disease.jpg','images/banner_photos/health-exposure.jpg', 'images/banner_photos/health-status.jpg', 'images/banner_photos/eco-balance.jpg',  'images/banner_photos/eco-exposure.jpg', 'images/banner_photos/eco-extent.jpg', 'images/banner_photos/eco-physical.jpg', 'images/banner_photos/eco-processes.jpg', 'images/banner_photos/sustain-resource.jpg']).preload();
        </script>

    </body>
</html> 