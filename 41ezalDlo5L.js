//the javascript to support:
// - display the complete review when the content is too long
// - AJAX voting call
// - AJAX reporting abuse call
// - show/hiding reporting popover

//display the complete review.

function readMore(reviewDisplay, divDecider){
    if (reviewDisplay == 1){
        document.getElementById("readmore."+divDecider).style.display = "block";
        document.getElementById("seeless."+divDecider).style.display = "none";
    }
    else {
        document.getElementById("readmore."+divDecider).style.display = "none";
        document.getElementById("seeless."+divDecider).style.display = "block";
    }
}

function hideClueTip() {
	jQuery("#cluetip").hide();
}


//hide report button
function hideReport(divDecider){
    document.getElementById("reportButton."+divDecider).style.display = "none";
}

//report abuse AJAX call
function reportButtons(e, url) {

    if (window.XMLHttpRequest) {
        httpRequest = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
    }

    httpRequest.onreadystatechange=function() {
        if (httpRequest.readyState == 4) {
            if (httpRequest.status == 200)  {
                var reqText= httpRequest.responseText;
                var votepattern = /reportsuccess/;
                if (votepattern.test(reqText)) {
                    newDiv= document.createElement("div");
                    newDiv.className = "reportConfirm";
                    text = document.createTextNode("Thank you. Your report has been sent to Merchant.");
                    newDiv.appendChild(text);
                    while (e.className != "popparent" && e != e.parentNode) {
                        e = e.parentNode;
                    }
                    e.appendChild(newDiv);
                }
                else {
                    newDiv= document.createElement("div");
                    newDiv.className = "reportConfirm";
                    text = document.createTextNode("Your report is not complete. Please try again later.");
                    newDiv.appendChild(text);
                    while (e.className != "popparent" && e != e.parentNode) {
                        e = e.parentNode;
                    }
                    e.appendChild(newDiv);
                }
            }
        } else {
            //do something else
        }
    }
    
    httpRequest.open("POST", url, true );
    httpRequest.send("");
}

//voting AJAX call
function yesNoButtons(e, url) {

    if (window.XMLHttpRequest) {
        httpRequest = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
    }

    var parent;
    while (e.className != "yesNoButtonsContainer" ) e  = e.parentNode;
    parent = e.parentNode;

    var hasVotedOnThisItem = false;
    for( var childNodeIndex = 0; parent.childNodes[childNodeIndex]; childNodeIndex++ ) {
      var child = parent.childNodes[childNodeIndex];
      if (child.className == "voteConfirm") {
	hasVotedOnThisItem = true;
      }
    }

    httpRequest.onreadystatechange=function() {
        if (httpRequest.readyState == 4) {
            if (httpRequest.status == 200 && !hasVotedOnThisItem )  {
                var reqText= httpRequest.responseText;
                var votepattern = /votesuccess/;
                if (votepattern.test(reqText)) {
                    newDiv= document.createElement("div");
                    newDiv.className = "voteConfirm";
                    text = document.createTextNode(ws_strings.get("ws2_thanks_for_feedback"));
                    newDiv.appendChild(text);
                    parent.appendChild(newDiv);
                }
                else {
                    newDiv= document.createElement("div");
                    newDiv.className = "voteConfirm";
                    text = document.createTextNode(ws_strings.get("ws2_vote_not_complete"));
                    newDiv.appendChild(text);
                    parent.appendChild(newDiv);
                }
            }
        } else {
            //do something else
        }
    } 

    httpRequest.open("POST", url, true );
    httpRequest.send("");
}

//display popover
function showFlyOver(e)
{
    var reportLink= e;
                                                                                                                                                             
    // Walk up until we find popparent
    while (e.className != "popparent" && e != e.parentNode) {
        e = e.parentNode;
    }
                                                                                                                                                             
    // Walk the children until we find popover
    e = e.firstChild;
    while (e.className != "popover") {
        e = e.nextSibling;
    }
    e.style.display = "block";
    e.reportLink = reportLink;
}

//hide popover                                                                                                                                   
function hideFlyOver(e)
{
    while (e.className != "popover") e = e.parentNode;
    e.style.display = "none";
}

//Rating summary histogram AJAX call
function ratingSummaryHistogram(e, url) {

    if (window.XMLHttpRequest) {
        httpRequest = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
    }

    var parent;
    while (e.className != "reviewSummaryHistogramPopover" ) e  = e.parentNode;
    parent = e.parentNode;

    var hasVotedOnThisItem = false;
    for( var childNodeIndex = 0; parent.childNodes[childNodeIndex]; childNodeIndex++ ) {
      var child = parent.childNodes[childNodeIndex];
      if (child.className == "voteConfirm") {
	hasVotedOnThisItem = true;
      }
    }

    httpRequest.onreadystatechange=function() {
        if (httpRequest.readyState == 4) {
            if (httpRequest.status == 200 && !hasVotedOnThisItem )  {
                var reqText= httpRequest.responseText;
                var votepattern = /votesuccess/;
                if (votepattern.test(reqText)) {
                    newDiv= document.createElement("div");
                    newDiv.className = "voteConfirm";
                    text = document.createTextNode("Thank you for the valuable feedback you provided to our other readers and reviewers. Your vote will be counted and will appear on the product page within 24 hours.");
                    newDiv.appendChild(text);
                    parent.appendChild(newDiv);
                }
                else {
                    newDiv= document.createElement("div");
                    newDiv.className = "voteConfirm";
                    text = document.createTextNode("Your vote is not complete. Please try again later.");
                    newDiv.appendChild(text);
                    parent.appendChild(newDiv);
                }
            }
        } else {
            //do something else
        }
    } 

    httpRequest.open("POST", url, true );
    httpRequest.send("");
}

jQuery.fn.reviewsSnapshotPopover = function(searchItemIdentifier) {
    var popUp = function() {};
    popUp.swatchImageData = {},
    popUp.ajaxDataCache = {},
    
    popUp.initialize = function(searchItemIdentifier) {
        // setup defaults and bind the swatch view events
        this.overrideClueTipDefaults();
        this.setMouseOverSwatchBinding(searchItemIdentifier);
    },
    
    popUp.overrideClueTipDefaults = function() {
        // This function overrides the default values set by cluetip plugin.
        jQuery.fn.cluetip.defaults.cluetipClass = "reviewsSnapshot";
        jQuery.fn.cluetip.defaults.dropShadow = false;
        jQuery.fn.cluetip.defaults.positionBy = "fixed";
        jQuery.fn.cluetip.defaults.sticky = true;
        jQuery.fn.cluetip.defaults.mouseOutClose = true;
        jQuery.fn.cluetip.defaults.local = true;
        jQuery.fn.cluetip.defaults.hideLocal = false;
        jQuery.fn.cluetip.defaults.closePosition = "title";
        jQuery.fn.cluetip.defaults.closeText = "X";
    },

    popUp.setOffsets = function() {
        // This function sets the top, left offsets and cluetip width.
        jQuery.fn.cluetip.defaults.width = 230;
        jQuery.fn.cluetip.defaults.leftOffset = -230;
        jQuery.fn.cluetip.defaults.topOffset = 30;
    },
    
    popUp.displaySorryMsg = function(pAsin) {
        // This Function hide's the spinning image and prints the custom we're sorry message.
        popUp.ajaxDataCache[pAsin] = undefined;
        jQuery("#reviewsSnapshotLoadingImage").remove();
        if (jQuery(".reviewsSnapshotSorryMsg").length == 0) { 
            var sorryMsgDiv = jQuery("<div/>").attr("class","reviewsSnapshotSorryMsg");
            var sorryMsg = jQuery("<p/>").attr("innerHTML","Sorry, We're unable to process your request. Please try later.");
            sorryMsg.appendTo(sorryMsgDiv);
            sorryMsgDiv.appendTo(jQuery("#cluetip-inner"));
        }
    },
    
    popUp.displayLoadingMsg = function() {
        // This Function show's the spinning image and prints the loading message.
         if (jQuery("#cluetip-inner").length > 0) { 
             var loadDiv = jQuery("<div/>").attr("id","reviewsSnapshotLoadingImage");
             var loadImg = jQuery("<img/>").attr("class","spinningImage");
             loadImg.attr("src","/media/icons/variatonSwatchLoading.gif");
             var loadMsg = jQuery("<p/>").attr("class","loadingMsg");
             loadMsg.attr("innerHTML",jQuery("#loadingReviewsText").val());
             loadImg.appendTo(loadDiv);
             loadMsg.appendTo(loadDiv);
             loadDiv.appendTo(jQuery("#cluetip-inner"));
         }
    },
    

    popUp.setMouseOverSwatchBinding = function(reviewsSnapshotClass) {
       jQuery(reviewsSnapshotClass).each( function () {

           // get the element which has the url for getting variations.
           var reviewsSnapshotUrlElem = jQuery(this).find("input[id*='reviewsSnapshotURL']");

           // The snapshotBtnElem identifies the element on which the hover will show the popUp.
           var snapshotBtnElem = jQuery(this).find("span.snapshotButton");
          
           // get the reference to the for the search items element
           var searchItemIndex = (jQuery(this).prevAll().length + 1);       
           var parentElements = jQuery(this).parents()
                                              .map(function () { 
                                                 return this.tagName; 
                                               })
                                            .get().reverse().join(" > ");
           var currentElementTagName = jQuery(this).get(0).tagName;
           var currentSearchItemReference = parentElements + ' > ' + currentElementTagName + ':nth-child('+ searchItemIndex + ')';

           // check if we have the url and the snapshotBtn element. 
           if (reviewsSnapshotUrlElem.length == 0 || snapshotBtnElem.length == 0 || !currentSearchItemReference) {
               return;
           }
         
           // Get the url for ajax call
           var reviewSnapshoturl = jQuery(reviewsSnapshotUrlElem).val();
           // The pAsin is the variation Parent ASIN.
           var pAsin = jQuery(reviewsSnapshotUrlElem).attr("id").toString().substring(19);
       
           // Get the detail page link
           var dpLinkElem = jQuery(this).find("input[id*='dpURL']");
           var dpLink = (dpLinkElem.length > 0) ? dpLinkElem.val() : "";
           
           // Setup offsets
           popUp.setOffsets();
           jQuery(snapshotBtnElem).attr("rel", currentSearchItemReference).cluetip({
               onShow : function (ct, c) {
                   jQuery("#cluetip-inner").html("");
                   
                   var popoverHideTimeout = 200; //millisecond
                   jQuery("div.reviewSummary").mouseleave(function() {  
                       var closingTimeout = setTimeout("jQuery(document).trigger('hideCluetip')", popoverHideTimeout);  
                       jQuery("#cluetip").mouseenter(function() {
                    	   clearTimeout(closingTimeout); 
                       });  
                   });
                   
                   if (!popUp.ajaxDataCache[pAsin]) {
                       //show loading message
                       popUp.displayLoadingMsg();
                       
                       jQuery.ajax({
                           url: reviewSnapshoturl,
                           type : "GET",
                           ajaxCache : "true",
                           dataType : "json",
                           beforeSend : function(){
                               popUp.ajaxDataCache[pAsin] = -1;
                           },
                           error : function(){
                               popUp.displaySorryMsg(pAsin);
                           },
                           success : function(data) {
                               // Check if the data contains the reviews details. Otherwise show sorry message.
                               if (data == undefined
                                       || data.numTotalReviews == undefined
                                       || data.averageRating == undefined
                                       || data.fiveStarReviewCount == undefined
                                       || data.fourStarReviewCount == undefined
                                       || data.threeStarReviewCount == undefined
                                       || data.twoStarReviewCount == undefined
                                       || data.oneStarReviewCount == undefined) {
                                   popUp.displaySorryMsg(pAsin);
                                   return;
                               }

                               // Check pAsin below to prevent loading any data from the previous Ajax call. 
                               if (popUp.ajaxDataCache[pAsin] == -1) {
                                   // Check if no reviews are available then display sorry message
                                   if (data.numTotalReviews == 0) {
                                       popUp.displaySorryMsg(pAsin);
                                       return;
                                   }
                                   
                                   // Populate data in template
                                   var reviewSummaryPopoverHtml = jQuery("#reviewsSnapshotPopoverTemplate").clone();
                                   reviewSummaryPopoverHtml.removeClass("reviewsSnapshotPopoverTemplate");
                                   reviewSummaryPopoverHtml.find(".reviewsSnapshotCount").html(data.numTotalReviews);
                                   reviewSummaryPopoverHtml.find(".reviewsSnapshotLineTitle-exact_5 a.reviewLink").attr("href", constructReviewLink(dpLink, "exact_5"));
                                   reviewSummaryPopoverHtml.find(".reviewsSnapshotBar-exact_5").attr("style", "width: " + (data.fiveStarReviewCount / data.numTotalReviews * 100) + "%");
                                   reviewSummaryPopoverHtml.find(".reviewsSnapshotStarCount-exact_5").html(data.fiveStarReviewCount);
                                   reviewSummaryPopoverHtml.find(".reviewsSnapshotLineTitle-exact_4 a.reviewLink").attr("href", constructReviewLink(dpLink, "exact_4"));
                                   reviewSummaryPopoverHtml.find(".reviewsSnapshotBar-exact_4").attr("style", "width: " + (data.fourStarReviewCount / data.numTotalReviews * 100) + "%");
                                   reviewSummaryPopoverHtml.find(".reviewsSnapshotStarCount-exact_4").html(data.fourStarReviewCount);
                                   reviewSummaryPopoverHtml.find(".reviewsSnapshotLineTitle-exact_3 a.reviewLink").attr("href", constructReviewLink(dpLink, "exact_3"));
                                   reviewSummaryPopoverHtml.find(".reviewsSnapshotBar-exact_3").attr("style", "width: " + (data.threeStarReviewCount / data.numTotalReviews * 100) + "%");
                                   reviewSummaryPopoverHtml.find(".reviewsSnapshotStarCount-exact_3").html(data.threeStarReviewCount);
                                   reviewSummaryPopoverHtml.find(".reviewsSnapshotLineTitle-exact_2 a.reviewLink").attr("href", constructReviewLink(dpLink, "exact_2"));
                                   reviewSummaryPopoverHtml.find(".reviewsSnapshotBar-exact_2").attr("style", "width: " + (data.twoStarReviewCount / data.numTotalReviews * 100) + "%");
                                   reviewSummaryPopoverHtml.find(".reviewsSnapshotStarCount-exact_2").html(data.twoStarReviewCount);
                                   reviewSummaryPopoverHtml.find(".reviewsSnapshotLineTitle-exact_1 a.reviewLink").attr("href", constructReviewLink(dpLink, "exact_1"));
                                   reviewSummaryPopoverHtml.find(".reviewsSnapshotBar-exact_1").attr("style", "width: " + (data.oneStarReviewCount / data.numTotalReviews * 100) + "%");
                                   reviewSummaryPopoverHtml.find(".reviewsSnapshotStarCount-exact_1").html(data.oneStarReviewCount);
                                   reviewSummaryPopoverHtml.find(".reviewSeeAllLink").attr("href", dpLink + "/ref=wcr_snpsht_guestReviews#GuestReviews");
                                   
                                   popUp.ajaxDataCache[pAsin] = reviewSummaryPopoverHtml;
                                   jQuery("#reviewsSnapshotLoadingImage").remove();
                                   jQuery("#cluetip-inner").html(reviewSummaryPopoverHtml);
                               } else {
                                   jQuery("#reviewsSnapshotLoadingImage").remove();
                                   popUp.displaySorryMsg(pAsin);
                               }
                           }
                       });
                   }//end IF
                   else if(popUp.ajaxDataCache[pAsin] != undefined && popUp.ajaxDataCache[pAsin] != -1) {
                       popUp.ajaxDataCache[pAsin].appendTo(jQuery("#cluetip-inner"));
                   }
               },// end onShow
               onHide : function(ct, ci){
                   if (popUp.ajaxDataCache[pAsin]) {
                       if (popUp.ajaxDataCache[pAsin] != -1) {
                           popUp.ajaxDataCache[pAsin].remove();
                       } else {
                           popUp.ajaxDataCache[pAsin] = undefined;
                       }
                   }
               }
            });
        });
    }
    
    popUp.initialize(searchItemIdentifier);
};

function constructReviewLink(dpLink, sortReviews) {
    return dpLink + "/ref=wcr_snpsht_" + sortReviews + ((dpLink.indexOf("?") >= 0) ? "&" : "?") + "page=1&sort=show&sortReviews=" + sortReviews + "#GuestReviews";
}

// Invoke popovers on page load
jQuery(window).load(function(){
  var reviewsSnapshotClass = "";
  var bodyElem = jQuery("body");
  if (bodyElem.hasClass("browse") || bodyElem.hasClass("search")) {
    reviewsSnapshotClass = ".product";
  } else if (bodyElem.hasClass("miniDetail") || bodyElem.hasClass("detail") || bodyElem.hasClass("collection")) {
    reviewsSnapshotClass = ".reviewSummary";
  }
  
  if (reviewsSnapshotClass != "") {
    jQuery(document).reviewsSnapshotPopover(reviewsSnapshotClass);
  }
});
