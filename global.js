
/* ********************************* */
// set up Firebug stub to prevent errors
if (typeof window.console == 'undefined') {
  window.console = {};
}
if (typeof window.console.debug == 'undefined') {
  window.console.debug =function(s) {
    // alert(s);
  };
}
/* ********************************* */
jQuery.noConflict();
jQuery(document).ready (
  function() {
    try {
      tier1Menu.init();
    }catch(e) {
      console.debug(e);
    }
    try{
      searchBars.init();
    }catch(e) {
      console.debug(e);
    }
    try{
        searchAgainBars.init();
      }catch(e) {
        console.debug(e);
    }
    try{
      miniCart.init();
    }catch(e) {
      console.debug(e);
    }
  }
);
/* ********************************* */
// Email field rollover
jQuery(document).ready(function() {

  jQuery("#inputSendEmail").mouseover(function () {
    jQuery("#inputLeftEmailOptInCorner").css("background-image","url(/media/inca/backgrounds/search_box_left_active.gif)");
    jQuery("#inputRightEmailOptInCorner").css("background-image","url(/media/inca/backgrounds/search_box_right_active.gif)");
  });

  jQuery("#inputSendEmail").mouseout(function () {
    jQuery("#inputLeftEmailOptInCorner").css("background-image","url(/media/inca/backgrounds/search_box_left.gif)");
    jQuery("#inputRightEmailOptInCorner").css("background-image","url(/media/inca/backgrounds/search_box_right.gif)");
  });
  
  jQuery("#inputSendEmail").focus(function () {
    if(this.value == 'Enter your email address'){
        this.value = '';
    }
  });
  
  jQuery("#inputSendEmail").blur(function () {
    if(this.value == ''){
        this.value = "Enter your email address";
    }
  });
});

/* ********************************* */
// Search field rollover
jQuery(document).ready(function() {

  jQuery("#searchKeywords").mouseover(function () {
    jQuery("#inputLeft").css("background-image","url(/media/inca/backgrounds/search_box_left_active.gif)");
    jQuery("#inputRight").css("background-image","url(/media/inca/backgrounds/search_box_right_active.gif)");
  });

  jQuery("#searchKeywords").mouseout(function () {
    jQuery("#inputLeft").css("background-image","url(/media/inca/backgrounds/search_box_left.gif)");
    jQuery("#inputRight").css("background-image","url(/media/inca/backgrounds/search_box_right.gif)");
  });

});

// Search field rollover for null results
jQuery(document).ready(function() {

  jQuery("#searchAgainInput").mouseover(function () {
    jQuery("#nullInputLeft").css("background-image","url(/media/inca/backgrounds/search_box_left_active.gif)");
    jQuery("#nullInputRight").css("background-image","url(/media/inca/backgrounds/search_box_right_active.gif)");
  });

  jQuery("#searchAgainInput").mouseout(function () {
    jQuery("#nullInputLeft").css("background-image","url(/media/inca/backgrounds/search_box_left.gif)");
    jQuery("#nullInputRight").css("background-image","url(/media/inca/backgrounds/search_box_right.gif)");
  });
});

/************************************  
*  IE doesn't respect text styling for disabled elements.  
*  Instead we will use the disabled class name.
*/
jQuery(document).ready(function() {
	if (jQuery.browser.msie) {
		jQuery("button[name='proceedToCheckout'][disabled]").addClass("disabled").removeAttr("disabled");
	}
	
	jQuery("button.disabled[name='proceedToCheckout']").click(function() {
		if(jQuery.browser.msie) {
 			return false;
		}
	});
});

// Search refinements show/hide
function slideAndHide (slideType, parentId, selector, hideId, showId) {
    if (slideType == 'up') {
        jQuery("#" + parentId).children(selector).slideUp();
    }
        else if (slideType == 'down') {
        jQuery("#" + parentId).children(selector).slideDown();
    }
        jQuery("#" + hideId).hide();
    jQuery("#" + showId).show();
}
/* ********************************* */

// Proxy methods to ensure that this is not breaking existing sellers who are using these methods. 
function configSearchBar(search_default_text) {
	configSearchBarInternal(search_default_text,"searchKeywords",jQuery("#search_go"));
}

function configSearchAgainBar(search_default_text_again) {
	configSearchBarInternal(search_default_text_again,"searchAgainInput", jQuery("input[name*=searchAgainButton]"));
}

function configSearchBarInternal(search_default_text, searchKeywordsName, searchSubmit) {

  if ((searchKeywordsName == null) || (searchSubmit == null)) {
	return;
  }	
  
  var searchKeywords = jQuery("#"+searchKeywordsName);

  var defaultSearchTextValue = jQuery("#defaultSearchTextValue").val();	  
  if(defaultSearchTextValue != null) {
    search_default_text = search_default_text || defaultSearchTextValue;
  }  
	  
  if(searchKeywords.value=='') {
    searchKeywords.value=search_default_text;
  }
  
  searchKeywords.focus( function(){
    disappear(search_default_text,this);
    return false;
  });
	  
  searchKeywords.blur( function(){
    appear(search_default_text,this);
    return false;
  });
  
  searchSubmit.click( function(){
    jQuery("#"+searchKeywordsName).val(jQuery.trim(jQuery("#"+searchKeywordsName).val()));
    disappear(search_default_text,document.getElementById(searchKeywordsName));
    return true;
  });
 
  appear(search_default_text,document.getElementById(searchKeywordsName));
}


// TODO rewrite for jQuery and move into searchBar object
function disappear(text,element){

        if(element==null){
            return;
        }
        
        if(element.value==text){
            element.value='';
        }
        element.className = "search";
}

function appear(text,element){

    if(element==null){
        return;
    }
        
    if(element.value==''){
        element.value=text;
    }
    if(element.value == text ){
        element.className = "search1";
    }else{
       element.className = "search";
    }
}

/* ********************************* */
/* Functions for a keyboard-accessible variant of the Suckerfish dropdown menus:
    http://carroll.org.uk/sandbox/suckerfish/bones2.html */

// TODO: rewrite for jQuery and move into tier1Menu
mcAccessible = function(topNavMenuElement) {

    /*
  // fix this later
  try {



    var mcEls = topNavMenuElement.find("A");
    for (var i = 0; i < mcEls.length; i++) {
      var el = mcEls[i];



        el.onfocus = function() {
            console.debug(this);
            this.className += (this.className.length > 0 ? " " : "") + "sffocus"; //a:focus
            var parentListItem = this.parentNode;
            parentListItem.className += (parentListItem.className.length > 0 ? " " : "") + "sfhover"; //li < a:focus

            // (equivalent to "this.parentNode.parentNode.parentNode")
            var grandparentListItem = parentListItem.parentNode.parentNode;

            if (grandparentListItem.tagName == "LI") {
                grandparentListItem.className += (grandparentListItem.className.length > 0 ? " " : "") + "sfhover"; //li < ul < li < a:focus

                // (equivalent to "this.parentNode.parentNode.parentNode.parentNode.parentNode")
                var greatGrandparentListItem = grandparentListItem.parentNode.parentNode;

                if (greatGrandparentListItem.tagName == "LI") {
                    greatGrandparentListItem.className += (greatGrandparentListItem.className.length > 0 ? " " : "") + "sfhover"; //li < ul < li < ul < li < a:focus
                }
            }
        } // end of el.onfocus



        el.onblur = function() {
            this.className = this.className.replace(new RegExp("( ?|^)sffocus\\b"), "");
            var parentListItem = this.parentNode;
            parentListItem.className = parentListItem.className.replace(new RegExp("( ?|^)sfhover\\b"), "");
            // (equivalent to "this.parentNode.parentNode.parentNode")
            var grandparentListItem = parentListItem.parentNode.parentNode;

            if (grandparentListItem.tagName == "LI") {
                grandparentListItem.className = grandparentListItem.className.replace(new RegExp("( ?|^)sfhover\\b"), "");

                // (equivalent to "this.parentNode.parentNode.parentNode.parentNode.parentNode")
                var greatGrandparentListItem = grandparentListItem.parentNode.parentNode;

                if (greatGrandparentListItem.tagName == "LI") {
                    greatGrandparentListItem.className = greatGrandparentListItem.className.replace(new RegExp("( ?|^)sfhover\\b"), "");
                }
            }
        } // end of el.onblur

        el.onclick = function() {
            // This ensures that the menus hides itself when clicked;
            // accessibility isn't harmed -- I've tested it :). --AB
            this.blur();
        }
    }
  }catch(e){
    console.debug(e.message);
  }
  */
} // end of mcAccessible

/* ********************************* */
// abstraction for various forms of dynamic UI messaging */
var messageDisplay = {
  initialized: false,
  init: function() {
    if (this.initialized) return;
    // use this to create divs, preload icons, etc.
    this.initialized = true;
  },
  error: function (message) {
    alert('messageDisplay.error: ' + message);
  },
  show: function() {},
  hide: function() {}
}
/* ********************************* */
// the dropdown menus
var tier1Menu = {
  container: null,
  containerSelector: "#topSlots div.topNavMenu",

  menuFirstLevelLI: null,
  initialized: false,

  init: function() {
    if (this.initialized) return;

    jQuery('body').addClass('javascript-enabled');

    var container = jQuery(this.containerSelector);
    var menuFirstLevelLI = container.children('ul:first').children();

    if (utils.isIE6()) {
      menuFirstLevelLI.each(
        function() {         
          /*remove the style given in the css for nonJS version and let JS take over*/
          jQuery('.topNavMenu ul').css("top","0px"); 
          jQuery('.topNavMenu ul').css("left","0px");
          
          utils.classBasedHover(this, "sfhover");
          utils.appendIframeShim(this);
        }
      );
    }

    mcAccessible(container);

    this.container = container;
    this.menuFirstLevelLI = menuFirstLevelLI;
    this.initialized = true;
  }
};
/* ********************************* */
function hasSessionCookie() {

    //
    // There is a jQuery plugin for cookie handling http://plugins.jquery.com/project/cookie
    // Additional cookie manipulation should make use of that lib, after clearing it with the open source committee

    if(document.cookie.length <= 0) return false;
    var rval = true;
    var c_names = new Array("ubid-main=", "session-id=", "session-id-time=");
    var c_jar = document.cookie.split(/[;\s]+/);
    var i;
    for(i in c_names) {
        var c_name = c_names[i];
        var c_is_set = false;
        var j;
        for(j in c_jar) {
            var c = c_jar[j];
            if(c.substring(0,c_name.length) == c_name) {
                c_is_set = true;
                break;
            }
        }
        rval = rval && c_is_set;
        if(!rval) return rval;
    }
    return rval;
}
var miniCart = {
  initialized: false,
  containerSelector: "#topSlots #miniCart",
  container: null,
  popup: null,

  slideDuration: 1000,
  pauseAfterAdd: 8000,
  pauseBeforeCollapse: 3000,

  itemCountSelector: ".cartInformation .itemCount",

  init: function() {
    if (this.initialized) return;

    var container = jQuery(this.containerSelector);
    if (container.length == 0) {
      return; // should throw exception?
    }
    
    /** Update the item count when the page is loaded **/
    this.itemCount = jQuery('span.itemCount', container);
        /*
          removed refresh to reduce fatal count: http://tt/0005838182

          Correct implementation uses hidden input as the authority
          and is preserved with the back button. JS here would update
          displayed value from hidden input.

          wwarner@ 09/11/09

    if(this.itemCount.length > 0 && hasSessionCookie() ){
        // Set to a null value while updating non js fallback
        // will just use old value.
        // Closure
        var self = this;
        this.itemCount.text('-');
        jQuery.post(
            addToCartPageSecureURL,
            {
                layoutDomain: "Starter",
                layoutId: "XML1",
                enableAnalytics: "false"
            },
            function(data){
               if(jQuery.browser['msie']){
                    var xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
                    xmlDoc.async="false";
                    xmlDoc.loadXML(data);                
                    iCount = jQuery('item_count', xmlDoc).text();
               }
               else{
                    iCount = jQuery('item_count', data).text();
               }
               self.itemCount.text(iCount);
            }
        );
    }
        */
    
    var popup = container.find(".cartPopUp");
    if (popup.length == 0) {
      return; // should throw exception?
    }

    // don't do mouseovers for empty cart
    var itemCount = container.find(this.itemCountSelector).text();
    if (itemCount && itemCount > 0) {
      //container.hover(this.expand, this.collapse);
      utils.swapSrcBasedHover(container.find(".checkoutButton"), '-hover');
    } else {
      // not implemented
      utils.setDisabled(container.find(".checkoutButton"));
    }

    this.container = container;
    this.popup = popup;
    this.initialized = true;
  },

  reinit: function() {
    // need a better way
    this.initialized = false;
    this.init();
  },

  expand: function() {
    miniCart.popup.slideDown(this.slideDuration);
    miniCart.container.addClass("expanded");
  },

  collapse: function(delay) {
    // TODO: handle case where UI triggers collapse before the timeout finishes
    // be specific here -- the first arg can be an event target.
    var timeout = (delay == true ? miniCart.pauseAfterAdd : miniCart.pauseBeforeCollapse);
    window.setTimeout(function(){
                        var popup = miniCart.popup;
                        popup.slideUp(this.slideDuration);
                        // note: this next effect is kind of cool, but not mentioned in the spec
                        popup.find(".cartMessage").slideUp(this.slideDuration);
                        miniCart.container.removeClass("expanded");
                      }, timeout);
  },

  replaceMiniCartHtml: function(html) {
    if(html) {
      this.container.replaceWith(html); // TODO: make sure this doesn't leak
      this.reinit();
      this.expand();
      this.collapse(true);
    }
  }

};
/* ********************************* */
var utils = {
  // defaults
  hoverSuffix: '_hover',
  disabledSuffix: '_disabled',

  // Borrowed this from changeRollover()
  // Works with both versioned and unversioned URLs:
  // go_button.gif <--> go_button_hover.gif
  // go_button._V257564918_.gif <--> go_button_hover._V257564918_.gif
  changeImageUrlRegex: /((\._\w\d+_)?\.\w{3,4})?$/,

  isIE6: function() {
    return jQuery.browser.msie && Math.round(jQuery.browser.version) == 6;
  },

  // iframe shim technique for z-index bug in ie6
  // http://www.dotnetjunkies.com/WebLog/jking/archive/2003/07/21/488.aspx
  iframeShim: null,

  getIframeShim: function() {
    // used for ie6 z-index workaround
    var iframe = this.iframeShim;
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.src = "/media/inca/logo.jpg";
      // make transparent so you can use with rounded corners
      iframe.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)';
      this.iframeShim = iframe;
    }
    return iframe.cloneNode(true);
  },

  appendIframeShim: function(el) {
    el.appendChild(utils.getIframeShim());
  },

  swapSrcBasedHover: function(el, hoverSuffix) {
    hoverSuffix = hoverSuffix || this.hoverSuffix;
    jQuery(el).hover(
      function() {
        this.src = this.src.replace(utils.changeImageUrlRegex, hoverSuffix + "$1");
      },
      function() {
        this.src = this.src.replace(hoverSuffix, "")
      }
    );
  },

  classBasedHover: function(el, className) {
    jQuery(el).hover(
      function() {
        jQuery(this).addClass(className);
      },
      function() {
        jQuery(this).removeClass(className);
      }
    );
  },

  setDisabled: function(el) {
    // similar to swap, except event handlers removed
    console.debug('setDisabled not implemented yet:', el);
    // speaking of which, am I accumulating multiple mouseover handlers etc.??
  }
};

// stub/wrapper
// TODO: move all the search-bar related stuff here and refactor
var searchBars = {
  init: function() {
	  configSearchBarInternal(jQuery(".searchDefaultText").text(),"searchKeywords",jQuery("#search_go"));
  },
  appear: appear,
  disappear: disappear
};

var searchAgainBars = {
  init: function() {
	  configSearchBarInternal(jQuery(".searchDefaultText").text(),"searchAgainInput", jQuery("input[name*=searchAgainButton]"));
  },
  appear: appear,
  disappear: disappear
};

// initialize search button mouseovers
// TODO move this into searchBars.init() and refactor
jQuery(document).ready(function(){
jQuery("#search_go").mouseover(function(){
jQuery("#search_go").attr({src:"/media/inca/buttons/go_button_hover.gif"});
});
jQuery("#search_go").mouseout(function(){
jQuery("#search_go").attr({src:"/media/inca/buttons/go_button.gif"});
});
});

jQuery(document).ready(function(){
jQuery(".form_button").mouseover(function(){
jQuery(".form_button").attr({src:"/media/inca/buttons/go_button_hover.gif"});
});
jQuery(".form_button").mouseout(function(){
jQuery(".form_button").attr({src:"/media/inca/buttons/go_button.gif"});
});
});

jQuery(document).ready(function(){
jQuery(".checkoutButton").mouseover(function(){
jQuery(".checkoutButton").attr({src:"/media/core/actionButtons/checkout-small-hover.gif"});
});
jQuery(".checkoutButton").mouseout(function(){
jQuery(".checkoutButton").attr({src:"/media/core/actionButtons/checkout-small.gif"});
});
});

jQuery(document).ready(function(){
    if (jQuery("#globalNav").length > 0) {
        jQuery("#globalNav").globalNav();
    }
    
    if (jQuery("div.dynamicExpander").length > 0) {
        jQuery("div.dynamicExpander").dynamicExpander();
    }
});

jQuery(document).ready(function(){

jQuery("#continue").attr({src:"/media/inca/buttons/btn1_continue.gif"});
jQuery("#continue").mouseover(function(){
jQuery("#continue").attr({src:"/media/inca/buttons/btn1_continue-hover.gif"});
});
jQuery("#continue").mouseout(function(){
jQuery("#continue").attr({src:"/media/inca/buttons/btn1_continue.gif"});
});
});

jQuery(document).ready(function(){
jQuery("#edit").attr({src:"/media/inca/buttons/btn2_edit.gif"});
jQuery("#edit").mouseover(function(){
jQuery("#edit").attr({src:"/media/inca/buttons/btn2_edit_hover.gif"});
});
jQuery("#edit").mouseout(function(){
jQuery("#edit").attr({src:"/media/inca/buttons/btn2_edit.gif"});
});
});

jQuery(document).ready(function(){

jQuery("#send").attr({src:"/media/inca/buttons/btn1_send.gif"});
jQuery("#send").mouseover(function(){
jQuery("#send").attr({src:"/media/inca/buttons/btn1_send-hover.gif"});
});
jQuery("#send").mouseout(function(){
jQuery("#send").attr({src:"/media/inca/buttons/btn1_send.gif"});
});
});

jQuery(document).ready(function(){
jQuery("#search_go").click(function(){
jQuery("#search_go").attr({src:"/media/inca/buttons/go_button_hover.gif"});
});
jQuery("#search_go").mouseout(function(){
jQuery("#search_go").attr({src:"/media/inca/buttons/go_button.gif"});
});
});

jQuery(document).ready(function(){
/*jQuery("#proceedTop").attr({src:"/media/inca/buttons/btn2_edit.gif"});*/
jQuery("#proceedTop").mouseover(function(){
jQuery("#proceedTop").attr({src:"/media/inca/buttons/btn0_proceed_hover.gif"});
});
jQuery("#proceedTop").mouseout(function(){
jQuery("#proceedTop").attr({src:"/media/inca/buttons/btn0_proceed.gif"});
});
});

jQuery(document).ready(function(){
jQuery("#proceedBottom").mouseover(function(){
jQuery("#proceedBottom").attr({src:"/media/inca/buttons/btn0_proceed_hover.gif"});
});
jQuery("#proceedBottom").mouseout(function(){
jQuery("#proceedBottom").attr({src:"/media/inca/buttons/btn0_proceed.gif"});
});
});

jQuery(document).ready(function(){
jQuery("#viewBag").mouseover(function(){
jQuery("#viewBag").attr({src:"/media/inca/buttons/btn1_view_your_bag_hover.gif"});
});
jQuery("#viewBag").mouseout(function(){
jQuery("#viewBag").attr({src:"/media/inca/buttons/btn1_view_your_bag.gif"});
});
});

jQuery(document).ready(function(){
jQuery("#shopButton").mouseover(function(){
jQuery("#shopButton").attr({src:"/media/inca/buttons/go_button.gif"});
});
jQuery("#shopButton").mouseout(function(){
jQuery("#shopButton").attr({src:"/media/inca/buttons/go_button_hover.gif"});
});
});

jQuery(document).ready(function(){
jQuery("#searchSizeBtn").mouseover(function(){
jQuery("#searchSizeBtn").attr({src:"/media/inca/buttons/go_button_hover.gif"});
});
jQuery("#searchSizeBtn").mouseout(function(){
jQuery("#searchSizeBtn").attr({src:"/media/inca/buttons/go_button.gif"});
});
});

jQuery(document).ready(function(){
jQuery("#sortOrderBtn").mouseover(function(){
jQuery("#sortOrderBtn").attr({src:"/media/inca/buttons/go_button_hover.gif"});
});
jQuery("#sortOrderBtn").mouseout(function(){
jQuery("#sortOrderBtn").attr({src:"/media/inca/buttons/go_button.gif"});
});
});

jQuery(document).ready(function(){
jQuery(".update_qty").mouseover(function(){
jQuery(".update_qty").attr({src:"/media/inca/buttons/button1_update_hover.gif"});
});
jQuery(".update_qty").mouseout(function(){
jQuery(".update_qty").attr({src:"/media/inca/buttons/button1_update.gif"});
});
});


jQuery(document).ready(function(){
jQuery(".cartEmwaButton .emwa").mouseover(function(){
jQuery(".cartEmwaButton .emwa").attr({src:"/media/inca/cart/btn1_emwa_hover.gif"});
});
jQuery(".cartEmwaButton .emwa").mouseout(function(){
jQuery(".cartEmwaButton .emwa").attr({src:"/media/inca/cart/btn1_emwa.gif"});
});
});

jQuery(document).ready(function(){
jQuery("input[name*=addToCart]").mouseover(function(){
jQuery("input[name*=addToCart]").attr({src:"/media/inca/buttons/btn0_addtobag_hover.gif"});
});
jQuery("input[name*=addToCart]").mouseout(function(){
jQuery("input[name*=addToCart]").attr({src:"/media/inca/buttons/btn0_addtobag.gif"});
});
});

jQuery(document).ready(function(){
jQuery("#DynObject12").css("position","relative");
});

jQuery(document).ready(function(){
jQuery("#zoomViewerDiv").css("position","static");
});

/* JS for continue shopping drop down in cart and upsell pages */
  jQuery(document).ready (
     function() {
              jQuery(".continueShopping").css("display","block");
              jQuery("#tier1dropdown").change( function(){
                  var selectedValue  = this.options[this.selectedIndex].value;
                  if( selectedValue != "" ){
                      window.location.href = selectedValue;
                  }   
              return true;});
           }
  );

/* Cart Error Message slideDown*/ 
jQuery(document).ready(function(){
    var cartErrorPop = jQuery('#CartErrorPopUp');
    var cartPop = jQuery('#cartPopUp');
          if( cartErrorPop != null && cartErrorPop.length != "0"){
                        cartPop.css({
                            "display": "block"
                        });
                        
                        /* swap images when cart starts to slide down*/
                        jQuery("#miniCartBottomContracted", parent.document).css("display","none");
                        jQuery("#miniCartBottomExpanded", parent.document).css("display","block");

                        cartPop.hide();

                        cartPop.slideDown(500);
                        
                    } else {

			// Fix for sev-2 : 0022701480
			try {
                        
                           jQuery("#miniCartBottomContracted", parent.document).css("display","block");
                           jQuery("#miniCartBottomExpanded", parent.document).css("display","none");
			} catch(ex) {
				//This fix is for XSS issue for CSW webstore checkout sev-2 0022701480
			}
                    }
                    
                    jQuery('.close_popup_link').click(function() {
                        window.setTimeout(function(){
                         // swap images back after callback
                         cartPop.slideUp(1000,function(){
                           jQuery("#miniCartBottomContracted", parent.document).css("display","block");
                           jQuery("#miniCartBottomExpanded", parent.document).css("display","none");
                        });
                        });

                    });
});

/* Begin Initialize Carousels */
jQuery(document).ready(function(){
    if(jQuery.fn.productCarousel) {
        // When upgrading to jQuery 1.4, .parents() should change to .parentsUntil()
        jQuery('.productList').parents('.carousel').productCarousel();
    }
});
/* End Initialize Carousels */

console.debug('global.js finished loading');
/* ********************************* */

jQuery(document).ready(function(){
  jQuery("a[href*=/br/]").click(function() {

    window.open(this.href,"Window1","menubar=no,width=550,height=600,toolbar=no,screenX=100,screenY=130");
    
    return false;
  });
});



