$(document).ready(function() {
	
	$('body').removeClass('no-js');
	
	// Home page cycle banner photos
    $('#intro-banner').cycle();
	
	// Graph sliding tab
	$("#slides").scrollable().navigator({ 
		navi: '#controls',
		activeClass: 'selected' 
	});
	
	// Tooltips to indicator tools
	$('.tools a[title]').qtip({
		position: {
			my:	'right center',
			at:	'left center'
		},
		style: {
			classes: 'ui-tooltip-shadow ui-tooltip-rounded ui-tooltip-light'
		}
	});
	

//	 fancybox popup - NOT USED
//	$(".fancybox").fancybox({
//		width': 800,
//    	autoDimensions': false
//	});
	
//dialog popup for locator maps on indicator exhibits pages
	jQuery(function($) {
  	$('.dialogButton').each(function() {  
    $.data(this, 'dialog', 
      $(this).next('.dialogContent').dialog({
        autoOpen: false,   
        title: '',  
        width: 650,  
        //height: 650,
		closeOnEscape: true
		//buttons: {"Close": function() { $(this).dialog("close");}}
      })
    );  
  	}).click(function() {  
      $.data(this, 'dialog').dialog('open');  
	  $(".dialogContent").css("visibility", "visible");
      return false;  
  	});  
	}); 
	
	
//dialog popup for nine indicators on Where You Live page
	jQuery(function($) {
  	$('.dialogButtonNine').each(function() {  
    $.data(this, 'dialog', 
      $(this).next('.dialogContentNine').dialog({
        autoOpen: false,   
        title: ''  
        //width: 300,  
        //height: 500
      })
    );  
  	}).click(function() {  
      $.data(this, 'dialog').dialog('open');  
	  $(".dialogContentNine").css("visibility", "visible");
      return false;  
  	});  
	}); 

//Tooltips for Region Map on WYL page 
$('area.regionButton[title]').qtip({
      content: {
         text: false // Use each elements title attribute
      },
      style: 'cream mediumWidth',
	  position: { //needed for Chrome tooltip positioning
				target: 'mouse',
				adjust: { mouse:false }
			},
           hide: {
               fixed: true
			 }
   });

	
//Dialog for Region Map on WYL page
jQuery(function($) {
  $('.regionButton').each(function() {  
    $.data(this, 'dialog', 
      $(this).next('.regionDialog').dialog({
        autoOpen: false
      })
    );  
  }).click(function() {  
  	  $('.regionDialog').dialog('close');//close other instance
      $.data(this, 'dialog').dialog('open');  
      return false;  
  });  
});  


//Tooltips for State Map on WYL page 
$('area.maptooltip[title]').qtip({
      content: {
         text: false // Use each elements title attribute
      },
      style: 'cream mediumWidth',
	  position: { //needed for Chrome tooltip positioning
				target: 'mouse',
				adjust: { mouse:false }
			},
           hide: {
               fixed: true
			 }
   });

// Dialog for State Map on WYL page
jQuery(function($) {
   $('.maptooltip[id^="tooltip_"]').each(function() {  
    $.data(this, 'dialog', 
     $('#data_' + $(this).attr('id')).dialog({
        autoOpen: false,
		width:500
		
      })
    );  
  }).click(function() {  
  	  $('.dialoglinks').dialog('close');//close other instance
      $.data(this, 'dialog').dialog('open');  
      return false;  
  });  
});  
	
	
	
	
	
	
	//  Accordions
	$(".accordion div").hide();
	//setTimeout ("$('.accordion div').slideToggle('slow');", 1000);
	$('.accordion h3').click(function(){
		$(this).next('.pane').slideToggle('slow').siblings('.pane:visible').slideUp('slow');
		$(this).toggleClass('current');
		$(this).siblings('h3').removeClass('current');
	});
	
	// Coda-slider for indicator thumbnail sliders
	$('#coda-slider-onecolumn').codaSlider({
		autoHeight: true,
		dynamicTabs: false, 
		dynamicArrows: false,
		slideEaseDuration: 800
	});
	$('#coda-slider-twocolumn').codaSlider({
		autoHeight: true,
		dynamicTabs: false, 
		dynamicArrows: false,
		slideEaseDuration: 800
	});
	
	// slickbox sliders
	$('#slickbox1').hide();
	$('#slickbox2').hide();
	$('#slickbox3').hide(); 
	$('#slickbox4').hide();
	$('#slickbox4').hide();
	$('#slickbox5').hide();
	$('#slickbox6').hide();
	$('#slickbox7').hide();
	$('#slickbox8').hide();
	$('#slickbox9').hide();
 
	$('.slickbox h2').click(function() {
		$(this).next('div').slideToggle('slow');
		$(this).toggleClass('active');
	});
 

// "Learn More" expand text script
  	$('.full').hide();
	$('.synop').show();
	
	// with divs
	$(".readMore").click(function(){
		$(this).hide();
  		$(this).parent().next('div').show();
  		return false;
  	});
  	$(".collapse").click(function(){
  		$(this).closest('div.full').hide()
		$('.synop').find('a.readMore').show();
  		return false;
  	});
	
	// with spans
	$(".readMore").click(function(){
		$(this).hide();
  		$(this).parent().next('span').show();
  		return false;
  	});
  	$(".collapse").click(function(){
  		$(this).closest('span.full').hide()
		$('.synop').find('a.readMore').show();
  		return false;
  	});
	// end "learn More" expand text script 
	
	//toggle divs
	$(".toggle").next(".hidden").hide();
	$(".toggle").click(function() {
        $('.active').not(this).toggleClass('active').next('.hidden').slideToggle(300);
        $(this).toggleClass('active').next().slideToggle("fast");
		return false;
    });
	
	
	// admin tabs
//	$('#adminmenu').tabify();  MOVED TO PAGE SINCE IT STOPPED WORKING (RR 9/19/12)
	$('#chaptermenu').tabify();
	
	
// script for frameworks.cfm page	
	if($('#topic select').val() != 'pick') {
			$('#framework').show();
			$('#selection').show();
			
			var val1 = $('#topic select').val();
			var val2 = $('#framework select').val();
			getText(val1, val2);
			} else {
			$('#selection').hide();
			$('#framework').hide();
		}

	$('#topic select').change(function() {
		if($(this).val() != 'pick') {
			$('#framework').show();
			$('#selection').show();
			$('#framework option[value=overview]').attr('selected', 'selected');
			
			var val1 = $(this).val();
			var val2 = $('#framework select').val();
			//alert(val1 +' '+ val2);
			getText(val1, val2);
		} else {
			$('#selection').hide();
			$('#framework').hide();
		}
	});
	
	$('#framework select').change(function() {
		var val1 = $('#topic select').val();
		var val2 = $(this).val()
		getText(val1, val2);
	});	
	
	function getText(val1, val2) {
		/*
		$.get('options.xml', {}, function(xml) {
			$('option',xml).each(function(i) {
				var value1 = $(this).find('value1').text();
				var value2 = $(this).find('value2').text();
				var text = $(this).find('text').text();
				
				//alert(val1 +'= '+ value1 +' | '+ val2 +'= '+ value2);
				if(value1 == val1 && value2 == val2) {
					$('#selection').html(text);	
				}
				
				//alert(value +' | '+ text);
			});
		});
                */
	}
//end script

// contact form validation
$("#contact_form").validator();

});


//popup windows for References, Tech Docs, and Footnotes
function refPopup(id,pv,a) {
if (a != "") {
	a = "#" + a;
}	
window.open( "references.cfm?i=" + id + "&pvw=" + pv + a, "_blank", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=yes, width=1000, height=600, top=100, left=200" )
}

function techDocPopup(id,pv,a) {
if (a != "") {
	a = "#" + a;
}
window.open( "technical-documentation.cfm?i=" + id + "&pvw=" + pv + a, "_blank", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=yes, width=1000, height=600, top=100, left=200" )
}

function footnotePopup(id) {
window.open( "../footnotes.cfm?i=" + id, "_blank", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=yes, width=1000, height=600" )
}

function helpPopup() {
window.open( "help.cfm", "_blank", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=yes, width=1000, height=700, top=100, left=200" )
}

function helpfaqPopup() {
window.open( "faqs.cfm?pop#statistical", "_blank", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=yes, width=1000, height=700, top=150, left=250" )
}


function defPopup(id) {
window.open( "definitions.cfm?i=" + id, "_blank", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=yes, width=1000, height=700, top=150, left=250" )
}

// Console log helpers. Alternative to console.log. Will prevent JS errors on browsers without Firebug, and more.
// usage: log('inside coolFunc', this, arguments);
window.log = function(){
  log.history = log.history || [];  
  log.history.push(arguments);
  arguments.callee = arguments.callee.caller;  
  if(this.console) console.log( Array.prototype.slice.call(arguments) );
};
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();)b[a]=b[a]||c})(window.console=window.console||{});


//testing for print -JM
//function print_url(url)
//{
// location=url;
// print();
// }
