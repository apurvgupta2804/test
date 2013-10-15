/* JS for enabling mini-detail page popup in a page */
jQuery.noConflict();

jQuery(document).ready(function(){
    miniDetailItem.initialize();
    jQuery(".quickView").live('click',
        function() {
            miniDetailItem.openMiniDetailPopover(jQuery(this).parent());
            return false;
        }
    ).live('mousedown',
        function(){
            /* return false to prevent event bubbling/capture
               God knows what's causing it, but this is required to keep 
               QI button working after the first click.   
            */
            return false;
        }
    );
    jQuery(".miniDetailTarget").live('click',
        function() {
            miniDetailItem.openMiniDetailPopover(jQuery(this).parent());
            return false;
        }
    );
    jQuery(".topNavMenu").mouseover(
        function() {
            jQuery(".miniDetailTargetImage").css("position","static")
            return false;
        }
    );
    jQuery(".topNavMenu").mouseout(
        function() {
            jQuery(".miniDetailTargetImage").css("position","relative")
            return false;
        }
    );
    
    jQuery(".miniDetailTargetImage").live("mouseover",
        function() {
            jQuery(this).find(".quickView").show();
        }
    );
    jQuery(".miniDetailTargetImage").live("mouseout",
        function() {
            jQuery(this).find(".quickView").hide();
        }
    );
  //This should be using live() when we upgrade to a version of jQuery that supports it.
  jQuery(".miniDetailTargetImage").focus(
        function() {
		        jQuery(this).find(".quickView").show();
        }
    );
    
   jQuery(".quickView").live('keypress',
        function(e) {
        	if (e.which == 13) {
        		jQuery(".quickView").css("display", "none");
	            	miniDetailItem.openMiniDetailPopover(jQuery(this).parent());
            	return false;
            }
        }
    );
    //This should be using live() when we upgrade to a version of jQuery that supports it. 
    jQuery(".quickView").blur(function() {
        jQuery(".quickView").css("display", "none");
    });
});


var miniDetailItem = {   
	openMiniDetailPopover: function(domEle){
                var el = jQuery(domEle);
                var asin = el.parents(".miniDetailTargetImage").find("input:hidden[name=miniDetailAsin]").eq(0).val();
	        this.populateData(asin,null);
		this.showMiniPopUp();
		var topElement = el;
		jQuery("#outerDiv").attr('miniDetailTop',jQuery(window).scrollTop() + 50);
		if(typeof(miniDetailData)!='undefined'){	
			var tafUrl=miniDetailData.tafLink;
			tafUrl=tafUrl.replace('mdpChildAsin',asin);
			jQuery("#outerDiv").attr('tafSigninLink',tafUrl);
		}	
	},

	populateData: function(asin,linkArgs){
            var outerDivEle = jQuery("#outerDiv");
            outerDivEle.empty();
            var refValue = "";
	    var pageletDescObj = jQuery("input:hidden[name*=pageletDesc]");
	    if(pageletDescObj.length > 0 && pageletDescObj.val() != ""){
		    refValue = '&prevPageletDesc=' + pageletDescObj.val();
	    }
	        
            var mdpUrl = document.location.protocol + '//' + document.location.host + '/mdp/'+ asin+'?link=/dp/'+ asin + refValue;
            if(jQuery('#collections').length > 0){
                mdpUrl = mdpUrl +'&hideIndexes=0';
            }
             
            if(linkArgs!=null){
                mdpUrl = mdpUrl +'&'+linkArgs;
	    }
            var innerFrame = jQuery('<iframe scrolling=\"no\" frameborder=\"0\" allowtransparency=\"true\" />');    
            innerFrame.attr("src", mdpUrl);
            innerFrame.attr({       
                'id': 'innerFrame',         
                'className': 'innerFrame'   
            }); 
            var parentDoc = jQuery(parent.document);        
            innerFrame.attr('height', parentDoc.height());          
            innerFrame.attr('width', parentDoc.width());   
	    outerDivEle.append(innerFrame);
	},

    initialize: function(){
		var wrapperParent = jQuery('#wrapper').parent();

		var miniDetailFrame = jQuery('<iframe scrolling=\"no\" frameborder=\"0\" />');
		miniDetailFrame.attr('id','miniDetailFrame');
		miniDetailFrame.css('height', this.getWindowHeight());
		wrapperParent.append(miniDetailFrame);
              miniDetailFrame.hide();
              miniDetailFrame.fadeTo('slow',0,function()
        	{
			if (jQuery.browser.msie) {
				 miniDetailFrame.css({
					'opacity': '0',
					'-webkit-transition': 'opacity 1s linear'
				});
			}
	       });

        var outerDiv = jQuery('<div/>');
        outerDiv.attr({
            'id': 'outerDiv',
            'className': 'outerDiv'
        });
		outerDiv.hide();
        wrapperParent.append(outerDiv);      
		this.setupMiniPopup();       
		this.restoreMiniPopup();
    },
	
	restoreMiniPopup:function(){
		if(typeof(miniDetailData)!='undefined'){
			if (typeof(miniDetailData.miniDetailAction)!='undefined'&&miniDetailData.miniDetailAction=='ShowTAF'){
				this.populateData(miniDetailData.miniDetailChildAsin,"TAFSubscribe=true");
				this.showMiniPopUp();
			}
		}
	},

    setupMiniPopup: function(){
        var doc = jQuery(document);
        jQuery('#outerDiv').css({
            'top': '0px',
            'left': '0px',
            'height': doc.height() + 'px',
            'width': doc.width() + 'px'
        });    
        jQuery('#outerDiv').css('opacity', 0);    
    },

	showMiniPopUp: function(){
	    jQuery('#wrapper').fadeTo('slow',0.30);
		//the outerdiv.show() is placed in minidetail.js. This would stop flickering of the popup
		var miniDetailFrame = jQuery(parent.document).find('#miniDetailFrame');
		miniDetailFrame.show();
		miniDetailFrame.fadeTo('slow',0.1,function() {
			if (jQuery.browser.msie) {
				 miniDetailFrame.css({
					'opacity': '0.1',
					'-webkit-transition': 'opacity 1s linear'
				});
			}
		});
	},
	getWindowHeight:function()
	{
		var winH=0;
		if(typeof(window.innerHeight)!='undefined'&&winH<window.innerHeight)
			winH = window.innerHeight;
		if(typeof(document.body.clientHeight)!='undefined'&&winH<document.body.clientHeight)
			winH = document.body.clientHeight;
		if(typeof(document.documentElement.clientHeight)!='undefined'&&winH<document.documentElement.clientHeight)
			winH = document.documentElement.clientHeight;
		return winH;
    }
};
