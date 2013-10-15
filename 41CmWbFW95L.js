var swatchPopup = (function(jQuery) {
    
    var SEARCH_ITEM_IDENTIFIER = ".variationSwatchItem";

    var popUp = function() {};
    popUp.swatchImageData = {},
    popUp.ajaxDataCache = {},

    //The searchItemIdentifier parameter is here for backwards
    //compatibility in case sellers were calling this function
    //themselves. It is not used by Webstore code.
    popUp.initialize = function(searchItemIdentifier) {
        var identifier;
        if (typeof searchItemIdentifier !== "undefined") {
            identifier = searchItemIdentifier;
        }
        else {
            identifier = SEARCH_ITEM_IDENTIFIER;
        }
        
        // setup defaults and bind the swatch view events
        popUp.overrideClueTipDefaults();
        popUp.setMouseOverSwatchBinding(identifier);
    },

    popUp.overrideClueTipDefaults = function() {
        // This function overrides the default values set by cluetip plugin.
        jQuery.fn.cluetip.defaults.cluetipClass = "variationSwatch";
        jQuery.fn.cluetip.defaults.dropShadow = false;
        jQuery.fn.cluetip.defaults.positionBy = "fixed";
        jQuery.fn.cluetip.defaults.sticky = true;
        jQuery.fn.cluetip.defaults.mouseOutClose = true;
        jQuery.fn.cluetip.defaults.local = true;
        jQuery.fn.cluetip.defaults.hideLocal = false;

    },
    
    popUp.calculateTopOffset = function(variationSwatchItem, moreColorElemTopOffset) {
        return -(moreColorElemTopOffset - jQuery(variationSwatchItem).offset().top);
    }

    popUp.setOffsets = function(variationSwatchItem, moreColorElemTopOffset) {
        // This function sets the left offsets and cluetip width.
        // Top offset will be adjusted at the time cluetip shows up.
        jQuery.fn.cluetip.defaults.width = jQuery(variationSwatchItem).width();
        jQuery.fn.cluetip.defaults.leftOffset = -(jQuery(variationSwatchItem).width());
    },

    popUp.displaySorryMsg = function(pAsin) {
        // This Function hide's the spinning image and prints the custom we're sorry message.
        if( pAsin == jQuery("#cluetip-inner .variationSwatchItem .productJsonUrl").attr("name").toString().substring(19)){ 
            popUp.ajaxDataCache[pAsin] = undefined;
            jQuery("#variationSwatchLoadingImage").remove();
            if (jQuery(".variationSwatchSorryMsg").length == 0) { 
                var sorryMsgDiv = jQuery("<div/>").attr("class","variationSwatchSorryMsg");
                var sorryMsg = jQuery("<p/>").attr("innerHTML",ws_strings.get("ws2_unable_to_process"));
                sorryMsg.appendTo(sorryMsgDiv);
                sorryMsgDiv.appendTo(jQuery("#cluetip-inner"));
            }
        }
    },

    popUp.displayLoadingMsg = function() {
        // This Function show's the spinning image and prints the loading message.
        if (jQuery("#cluetip-inner").length > 0) { 
            var loadDiv = jQuery("<div/>").attr("id","variationSwatchLoadingImage");
            var loadImg = jQuery("<img/>").attr("class","spinningImage");
            loadImg.attr("src","/media/icons/variatonSwatchLoading.gif");
            var loadMsg = jQuery("<p/>").attr("class","loadingMsg");
            loadMsg.attr("innerHTML",ws_strings.get("ws2_loading_colors"));
            loadImg.appendTo(loadDiv);
            loadMsg.appendTo(loadDiv);
            loadDiv.appendTo(jQuery("#cluetip-inner"));

            popUp.unbindCluetipTrigger();
        }
    },

    popUp.unbindCluetipTrigger = function() {
        //also remove the bind event on no. of colors element in cluetip
        var cluetipMoreColorElem = jQuery("#cluetip-inner").find("dd.colorAvailability").get();
        if (jQuery(cluetipMoreColorElem).length > 0) { 
            jQuery(cluetipMoreColorElem).unbind('mouseenter mouseleave'); 
        }
    },

    popUp.removeQuickView = function() {
        // This Function removes the quick view button from popover
        if (jQuery("#cluetip-inner .productQuickView").length > 0) {
            jQuery("#cluetip-inner .productQuickView").remove();
        }
    },

    popUp.setMouseOverSwatchBinding = function(variationSwatchClass) {
        jQuery(variationSwatchClass).each( function () {

            // get the element which has the url for getting variations.
            var variationSwatchUrlElem = jQuery(this).children("input[name*='variationSwatchURL']").get(); 

            // The moreColorElem identifies the element on which the hover will show the popUp.
            var moreColorElem = jQuery(this).find("dd.colorAvailability").get();

            // get the reference to the for the search items element
            var searchItemIndex = (jQuery(this).prevAll().length + 1);       
            var parentElements = jQuery(this).parents()
            .map(function () { 
                return this.tagName; 
            })
            .get().reverse().join(" > ");
            var currentElementTagName = jQuery(this).get(0).tagName;
            var currentSearchItemReference = parentElements + ' > ' + currentElementTagName + ':nth-child('+ searchItemIndex + ')';

            // check if we have the url and the colors element. 
            if (!variationSwatchUrlElem && !moreColorElem && !currentSearchItemReference) {
                return;
            } 

            //get the url for ajax call
            var variationSwatchUrl = jQuery(variationSwatchUrlElem).val();
            // The pAsin is the variation Parent ASIN.
            var pAsin = jQuery(variationSwatchUrlElem).attr("name").toString().substring(19);

            //setup offsets
            popUp.setOffsets(currentSearchItemReference , jQuery(moreColorElem).offset().top);
            
            var topAdjust = null;
            var topOffset = jQuery.fn.cluetip.defaults.topOffset;
            

            jQuery(moreColorElem).attr("rel", currentSearchItemReference).cluetip({
                onShow : function (ct, c) {
                    /*
                     * Because at page load/ajax content replacement, 
                     * the layout information may be incorrect (i.e. images not loaded yet)
                     * so we may need to adjust the top offset.
                     */
                    if (topAdjust == null) {
                        var oldOffset = topOffset;
                        topOffset = popUp.calculateTopOffset(currentSearchItemReference , jQuery(moreColorElem).offset().top);
                        topAdjust = topOffset - oldOffset; 
                    }
                    if (topAdjust != 0) {
                        var oldTop = parseInt(jQuery("div.cluetip-variationSwatch").css("top"));
                        var newTop = oldTop + topAdjust;
                        jQuery("div.cluetip-variationSwatch").css("top", newTop);
                    }
                    if(!popUp.ajaxDataCache[pAsin]) {

                        //show loading message
                        popUp.displayLoadingMsg();

                        //remove the quickview box 
                        popUp.removeQuickView();

                        jQuery.ajax({
                            url: variationSwatchUrl,
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
                                // check if the data contains the color details. Otherwise show sorry message.
                                if(data == undefined || data.colorData == undefined) {
                                    popUp.displaySorryMsg(pAsin);
                                    return;
                                }

                                //check pAsin below to prevent loading any data from the previous Ajax call. 
                                if( pAsin == jQuery("#cluetip-inner .variationSwatchItem .productJsonUrl").attr("name").toString().substring(19) && popUp.ajaxDataCache[pAsin] == -1) {
                                    var swatchCount = 0, swatchImagesToDisplay = 0, maxSwatchImages = 15;

                                    //check if no images are available then display sorry message
                                    jQuery.each(data.colorData, function(){swatchImagesToDisplay++});
                                    if(swatchImagesToDisplay == 0) {
                                        popUp.displaySorryMsg(pAsin);
                                        return;
                                    }

                                    // Create the Swatch Holder list & append the swatch images to it.
                                    var swatchImagesList = jQuery("<ul/>").attr("class","colorSwatches");

                                    //get the detail page link
                                    var dpLink = jQuery("#cluetip-inner .variationSwatchItem .title a").attr("href");

                                    //loop over each color for creating display html
                                    jQuery.each(data.colorData, function(color,colorDetails){

                                        // We only want to see max of 15
                                        if (swatchCount >= maxSwatchImages) { return;}   
                                        var swatchImageCount = 0;
                                        var mainImageCount = 0;
                                        jQuery.each(colorDetails.swatchImages, function(){swatchImageCount++});
                                        jQuery.each(colorDetails.mainImages, function(){mainImageCount++});

                                        var swatchId = "#swatchColor_"+ colorDetails.Asin;
                                        if (mainImageCount == 0) {
                                            popUp.swatchImageData[swatchId] = data.currentAsinData.mainImages[0].mediumImage.URL;
                                        } else {
                                            popUp.swatchImageData[swatchId] = colorDetails.mainImages[0].mediumImage.URL;
                                        }

                                        //if no swatch images are available then create color text swatch
                                        if(swatchImageCount == 0) {
                                            var noSwatchImageItem = jQuery("<li/>").attr("class","imageUnavailable");
                                            var noSwatchImageAnchor = jQuery("<a/>").attr("href",dpLink+"&intid=variation_swatch_"+colorDetails.Asin + "&childAsin="+colorDetails.Asin);
                                            noSwatchImageAnchor.attr("innerHTML", color);
                                            noSwatchImageAnchor.attr("id",swatchId);
                                            noSwatchImageAnchor.hover(
                                                    function () {
                                                        jQuery("#cluetip-inner img.productImage").attr("src",popUp.swatchImageData[jQuery(this).attr("id")]);
                                                    },
                                                    function () {} 
                                            );                              
                                            noSwatchImageAnchor.appendTo(noSwatchImageItem);
                                            noSwatchImageItem.appendTo(swatchImagesList);
                                            swatchCount++;
                                        } else {
                                            var imageSwatchItem = jQuery("<li/>");
                                            var imageSwatchAnchor = jQuery("<a/>").attr("href",dpLink+"&intid=variation_swatch_"+colorDetails.Asin + "&childAsin="+colorDetails.Asin);
                                            var imageSwatchTag = jQuery("<img/>").attr("src", colorDetails.swatchImages[0].swatchImage.URL);
                                            imageSwatchTag.attr("alt", color);
                                            imageSwatchAnchor.attr("id",swatchId);
                                            imageSwatchAnchor.hover(
                                                    function () {
                                                        jQuery("#cluetip-inner img.productImage").attr("src",popUp.swatchImageData[jQuery(this).attr("id")]);
                                                    },
                                                    function () {} 
                                            );
                                            imageSwatchTag.appendTo(imageSwatchAnchor);
                                            imageSwatchAnchor.appendTo(imageSwatchItem);
                                            imageSwatchItem.appendTo(swatchImagesList);
                                            swatchCount++;
                                        }
                                    });
                                    if(swatchImagesList) {
                                        var swatchImagesDiv = jQuery("<div/>").attr("class","variationSwatches");
                                        swatchImagesList.appendTo(swatchImagesDiv); 
                                        if(data.currentAsinData != undefined && data.currentAsinData.moreColorsAvailable) {
                                            var moreColorsDiv = jQuery("<div/>").attr("class","variationSwatchMoreColorsLink");
                                            var moreColorsLink = jQuery("<a/>").attr("href",dpLink+"&intid=variation_swatch_viewMore");
                                            moreColorsLink.attr("innerHTML",ws_strings.get("ws2_view_more_colors"));
                                            moreColorsLink.appendTo(moreColorsDiv);
                                            moreColorsDiv.appendTo(swatchImagesDiv);
                                        }

                                        popUp.ajaxDataCache[pAsin] = swatchImagesDiv;
                                        jQuery("#variationSwatchLoadingImage").remove();
                                        swatchImagesDiv.appendTo(jQuery("#cluetip-inner"));
                                    } else {
                                        jQuery("#variationSwatchLoadingImage").remove();
                                        popUp.displaySorryMsg(pAsin);
                                    }
                                }
                            }
                        });
                    }//end IF
                    else if(popUp.ajaxDataCache[pAsin] != -1) {
                        popUp.ajaxDataCache[pAsin].appendTo(jQuery("#cluetip-inner"));

                        popUp.unbindCluetipTrigger();

                        //re-attach the hovers
                        jQuery("#cluetip-inner .variationSwatches .colorSwatches > li > a ").hover(
                                function () {
                                    jQuery("#cluetip-inner img.productImage").attr("src",popUp.swatchImageData[jQuery(this).attr("id")]);
                                },
                                function () {} 
                        );

                        //remove the quickview box 
                        popUp.removeQuickView();
                    }
                },// end onShow
                onHide : function(ct, ci){
                    if(popUp.ajaxDataCache[pAsin]) {
                        if(popUp.ajaxDataCache[pAsin] != -1) {
                            popUp.ajaxDataCache[pAsin].remove();
                        }
                        else {
                            popUp.ajaxDataCache[pAsin]=undefined;
                        }
                    }
                }
            });
        });
    }

    //invoke popovers on page load
    jQuery(window).load(function() {
        popUp.initialize();
    });

    return {
        initialize: popUp.initialize
    }

})(jQuery);

//This mapping is here for backwards compatibility
//for any merchants that used this module when it was
//a jQuery function.
jQuery.fn.swatchPopup = swatchPopup.initialize;


