
function gup( name )
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return results[1];
}


var amznAnalyticsLib = {




/* Global Functions */
getGlobalDomain : function(){
    return document.domain;
},

getCustomerAccountPoolType : function(){
    return amznAnalytics.getElement("customerAccountPool");
},

getAnalyticsDomain : function(){
    if ( amznAnalytics.getElement("storeName") == "webstore1")
        return amznAnalytics.getElement("marketplaceName");
    return document.domain;
},

getGlobalMerchant : function(){
    return amznAnalytics.getElement("merchantId");
},

getGlobalMarketplace : function(){
    return amznAnalytics.getElement("marketplaceId");
},

getGlobalMarketplaceName : function(){
    return amznAnalytics.getElement("marketplaceName");
},

getGlobalPageName : function(){
    return amznAnalytics.getElement("pageName");
},

getGlobalChannel: function(){
    return amznAnalytics.getElement("channel");
},

getGlobalCategory: function(){
    return amznAnalytics.getElement("category");
},

getGlobalSubcategory: function(){
    return amznAnalytics.getElement("subcategory");
},

getGlobalPageType: function(){
    return amznAnalytics.getElement("pageType");
},

getGlobalLastInternalReferences: function(){
   if(null != amznAnalytics.getElement("internalReferences")){
        return amznAnalytics.getElement("internalReferences")["last"];
   } else {
       return gup("ref");
   }     
},

getGlobalFirstInternalReferences: function(){

   if(null != amznAnalytics.getElement("internalReferences")){
        return amznAnalytics.getElement("internalReferences")["first"];
   } else {
       return gup("ref");
   }     
},

getGlobalCustomerID: function(){
    return amznAnalytics.getElement("customerID");
},

getGlobalCustomerTrackingID: function(){
    return amznAnalytics.getElement("customerTrackingID");
},

getGlobalSearchTerms: function(){
    return amznAnalytics.getElement("searchTerms");
},


getGlobalSearchResults: function() {
    return amznAnalytics.getElement("searchResults");
},


getGlobalBrowseNodeName: function(){
    return amznAnalytics.getElement("browseNodeName"); 
},

getBrowsePageType : function(){
    var tree = amznAnalytics.getList("browseTree");
    if(null == tree) {
        return "";
    }
    if(tree.length == 0) {
        return "Homepage";
    }
    if(tree.length == 1) {
        return "Department";
    }
    if(tree.length == 2) {
        return "Category";
    }
    //if(tree.length > 2) {
        return "Subcategory";
    //}
},

getGlobalCartAddMethod: function(){
    return amznAnalytics.getElement("cartAddMethod");
},

getServerName : function(){
    return amznAnalytics.getElement("server");
},


/* Browse Functions */

 getBrowseProp6: function(){
 
    var args= new Array();
    args["amznVar"] = "browseTree";
    args["separator"] = " > ";
    args["indices"] = "";
    args["format"] = "";
    
    var pushVar = new loopListAssignment(args);
    
    return pushVar.printObject();
},

getAggregateBrowsePageName : function() {
    return this.getGlobalDomain() + ":" + this.getBrowsePageName();
},

getBrowsePageName : function(){
    var args= new Array();
    args["amznVar"] = "browseTree";
    args["separator"] = ":";
    args["indices"] = "";
    args["format"] = "";
    
    var pushVar = new loopListAssignment(args);
    return pushVar.printObject();
},

getBrowseProductFindingMethod: function(){
    if( null != amznAnalytics.getElement("pageType")){
        return "Browse";
    }
},

getBrowseSearchTerms: function(){
    return "non search - browse";
},


/* Gateway Functions */
getGatewayPageName: function(){
    if( null != amznAnalytics.getElement("language")){
        return "HomePage";
    }
},

getGatewayProductFindingMethod: function(){
    if( null != amznAnalytics.getElement("language")){
        return "Browse";
    }
},


/* Search Functions */
getSearchProductFindingMethod: function(){
    if( null != amznAnalytics.getElement("pageType")){
        return "Search";
    }
},

getSearchPageName: function(){
    return amznAnalytics.getElement("pageType") + ":" + amznAnalytics.getElement("pageNumber");
},
  
getSearchEvent: function(){
    return "event6";
},

  getNullSearchEvent: function(){
      if(amznAnalytics.getElement("searchResults") == null || amznAnalytics.getElement("searchResults") == "zero")
          return "event7";
  },
 

getAggregateSearchEvent: function(){
    if(this.getSearchSubcategory() == "") {
        return "event2";
    }
    return "";
},

  getAggregateNullSearchEvent: function(){
      if(amznAnalytics.getElement("searchResults") == null || amznAnalytics.getElement("searchResults") == "zero")
          return "event3";
      return "";
  },

  getSearchSubcategory: function(){
      var searchSubcat = "";
      if (null != amznAnalytics.getElement("searchRefinementType")) {
          searchSubcat = "search-" + amznAnalytics.getElement("searchRefinementType");
      }
      return searchSubcat;
  },


getSearchRefinementType : function(){
    var searchSubcat = "";
    if (null != amznAnalytics.getElement("searchRefinementType")) {
        searchSubcat = amznAnalytics.getElement("searchRefinementType");
    }
    return searchSubcat;
},

getSearchRefinementValue : function(){
    var searchSubcat = "";
    if (null != amznAnalytics.getElement("searchRefinementValue")) {
        searchSubcat = amznAnalytics.getElement("searchRefinementValue");
    }
    return searchSubcat;
},

/* Global Detail Pages Functions */
     getDetailPageName: function(){
        return "Product:" + amznAnalytics.getElement("productTitle");
    },

     getDetailChannel: function(){
        if( null != amznAnalytics.getElement("productTitle")){
            return "Product Details Page";
        }
    },
    
    
     getDetailEventProdView: function(){
        if(null != amznAnalytics.getElement("productView")){
            return "prodView";
        }
    },
    
    getDetailEvent: function(){
        if(null != amznAnalytics.getElement("productView")){
            return "event4";
        }
    },
    
    getDetailCartAddMethod: function(){
        if(null != amznAnalytics.getElement("productView")){
            return "Detail Page";
        }
    },    

/* Collections Functions */

   getCollectionProp3: function(){
        if( null != amznAnalytics.getElement("productTitle")){
            return "Product Collection";
        }
    },

   getCollectionProductsVar: function(){
       var returnValue = "";
       var args= new Array();
       args["amznVar"] = "collectionChildren";
       args["format"] = ";%s;;;;evar10=Collection Page";
       args["indices"] = new Array("SKU");
       args["separator"] = ",";
       
       var pushVar1 = new loopListAssignment(args);
       returnValue += pushVar1.printObject();
       
       return returnValue;
  },
  

/* Detail Functions */

   getDetailProductsVar: function(){
      var productKey = "";
            
      if( null != amznAnalytics.getElement("productView")) {
          if (null != amznAnalytics.getElement("productView")["SKU"]) {
              productKey = ";" + amznAnalytics.getElement("productView")["SKU"];
          }
          else if (null != amznAnalytics.getElement("productView")["pASIN"]) {
              productKey = ";" + amznAnalytics.getElement("productView")["pASIN"];
          }
      }   
      return productKey + ";;;;evar10=Detail Page"
  },

/* Image Functions */

/* MiniDetail Functions */
   getMiniDetailProp3: function(){
        if( null != amznAnalytics.getElement("productTitle")){
            return "Product Quick View";
        }
    },

   getMiniDetailProductsVar: function(){
      var productKey = "";
            
      if( null != amznAnalytics.getElement("productView")) {
          if (null != amznAnalytics.getElement("productView")["SKU"]) {
              productKey = ";" + amznAnalytics.getElement("productView")["SKU"];
          }
          else if (null != amznAnalytics.getElement("productView")["pASIN"]) {
              productKey = ";" + amznAnalytics.getElement("productView")["pASIN"];
          }
      }   
      return productKey + ";;;;evar10=Mini Detail Page"
  },

/* Cart Functions */

   getCartEventItemsRemove: function(){
       if( null != amznAnalytics.getList("cartRemoves")){
           return "scRemove";
       }
   },

   getCartPageName: function(){
           return "Checkout: Shopping Cart";
   },

   getCartChannel: function(){
           return "Checkout";
   },
   
   getCartPageType: function(){
           return "Checkout";
   },
   
   getCartCategory: function(){
           return "Shopping Cart";
   },
   
   getCartProductsVar: function(){
       var returnValue = "";
       var args= new Array();
       args["amznVar"] = "cartRemoves";
       args["format"] = ";%s";
       args["indices"] = new Array("pSKU");
       args["separator"] = ",";
       
       var pushVar1 = new loopListAssignmentMaster(args, true);
       returnValue += pushVar1.printObject();
       
       args["amznVar"] = "saveForLater";
       args["format"] = ";%s";
       args["indices"] = new Array("pASIN");
       args["separator"] = ",";
       
       var pushVar2 = new loopListAssignmentMaster(args, true);
       
       if(returnValue != "" && pushVar2.printObject() != ""){
           returnValue += ","+pushVar2.printObject();
       } else if ( pushVar2.printObject() != ""){
           returnValue += pushVar2.printObject();
       }
       
       
      return returnValue;
  },   

/* CartPreview Functions */
   getCartPreviewPageName: function(){
           return "Checkout: Shopping Cart HUC";
   },

   getCartPreviewChannel: function(){
           return "Checkout";
   },
   
   getCartPreviewCategory: function(){
           return "Shopping Cart HUC";
   },


/* Checkout Functions */

    getCheckoutPageName: function(){
        return amznAnalytics.getElement("channel") + ":" + amznAnalytics.getElement("pageName");
    },
    
    getCheckoutCategory: function(){
        return "Checkout: Shopping Cart";
    },
  
    getCheckoutPageType: function(){
        return "Checkout";
    },

/* Customer Reviews Functions */

    getItemRating: function(){
        if( null != amznAnalytics.getElement("itemRating"))
            return amznAnalytics.getElement("itemRating");
        else
            return null
    },

    getItemNumberOfReviews: function(){
        if( null != amznAnalytics.getElement("numOfReviews"))
            return amznAnalytics.getElement("numOfReviews");
        else
            return null
    },


    getCustomerReviewSubmitEvent: function(){
        return "event15";
    },

    getRatedProductViewedEvent: function() {
        if(( null != this.getItemRating())&&(0 != this.getItemRating()))
            return "event17";
        else
           return null;
    },

    getRatingIncrementEvent: function(){
        return "event16=" + this.getItemRating();
    },

/* ThankYouPage Functions */

    getThankYouPageName: function(){
         if( null != amznAnalytics.getElement("purchaseID")){
            return "Checkout:Order Confirmation";
        }
   },
   
    getThankYouChannel: function(){
         if( null != amznAnalytics.getElement("purchaseID")){
            return "Checkout: Confirmation";
        }
   },
   
   
    getThankYouCategory: function(){
         if( null != amznAnalytics.getElement("purchaseID")){
            return "Checkout: Shopping Cart";
        }
   },
   
    getThankYouPageType: function(){
         if( null != amznAnalytics.getElement("purchaseID")){
            return "Checkout: Confirmation";
        }
   },  
   
   
    getThankYouPurchaseId: function(){
       return amznAnalytics.getElement("purchaseID");
   },
   
    getThankYouState: function(){
       return amznAnalytics.getElement("billingRegion");
   },
   
   
    getThankYouZip: function(){
       return amznAnalytics.getElement("billingPostalCode");
   },
   
    getThankYouPaymentMethod: function(){
       return amznAnalytics.getElement("paymentMethod");
   },
   
   
    getThankYouFullfilmentMethod: function(){
       return amznAnalytics.getElement("fullfilmentMethod");
   },
   
    getThankYouPromotions: function(){
       
       var args= new Array();
       args["amznVar"] = "promotions";
       args["format"] = "%s";
       args["indices"] = new Array("code");
       args["separator"] = ",";
       
       var pushVar = new loopListAssignment(args);
       return pushVar.printObject();
   },
      
    getThankYouProductsVar: function(){
       var args= new Array();
       args["amznVar"] = "purchases";
       args["format"] = ";%s;%s;%s;;eVar18=%s";
       args["indices"] = new Array("pASIN","quantity","revenue","SKU");
       args["separator"] = ",";
       
       var pushVar = new loopSetAssignment(args);
       
       var returnValue = pushVar.printObject();

       if ( '' != returnValue){
           returnValue = returnValue + args["separator"];
       }
       
        if( null != amznAnalytics.getElement("taxRevenue")){
            returnValue = returnValue + ";Tax;;;event2=" + amznAnalytics.getElement("taxRevenue") + args["separator"];
        }
        
        if( null != amznAnalytics.getElement("shippingRevenue")){
            returnValue = returnValue + ";Shipping;;;event3=" + amznAnalytics.getElement("shippingRevenue") + args["separator"];
        }
        
        if( null != amznAnalytics.getElement("totalPromotionAmount") && null != amznAnalytics.getList("promotions")){
            returnValue = returnValue + ";Order Discount;;;event1=" + amznAnalytics.getElement("totalPromotionAmount") + args["separator"];
        }
        return returnValue;
   },  
      
    getThankYouEventPromotion: function(){
        if( null != amznAnalytics.getList("promotions")){
            return "event1";
        }
   },   
   
    getThankYouEventTaxRevenue: function(){
        if( null != amznAnalytics.getElement("taxRevenue")){
            return "event2";
        }       
   },
   
    getThankYouEventShippingRevenue: function(){
        if( null != amznAnalytics.getElement("shippingRevenue")){
            return "event3";
        }       
   },   
   
    getThankYouEventPurchase: function(){
        if( null != amznAnalytics.getElement("purchaseID")){
            return "purchase";
        }       
   },  

/* SignIn Functions */

    getSignInStarterCheckout: function(){
        if( null != amznAnalytics.getElement("startOPLSignIn")){
            return "scCheckout";
        }        
   },

   getSignInPageName: function(){
       return "Checkout: Sign in";
   },
   
   getYASignInPageName: function(){
       return "Sign in";
   },
   
   getSignInCategory: function(){
       return "Checkout Sign In";
   },
   


/* YourAccount Functions */
    getEditProfilePageName : function(){
        return "Account:Edit Profile";
    },

/* 404 Page */

    get404PageType: function(){
       return "errorPage";
   },



/* Aggregate Functions */

getAggregateCartPageName: function(){
    return this.getGlobalDomain() + ":Checkout: Shopping Cart";
},

getAggregateCartChannel: function(){
    return this.getGlobalDomain() + ":Checkout: Shopping Cart";
},

getAggregateGatewayPageName: function(){
    return this.getGlobalDomain() + ":HomePage";
},

getAggregateGlobalChannel : function(){
    return this.getGlobalDomain() + ":" + this.getGlobalChannel();
},

getAggregateGlobalPageType : function(){
    return this.getGlobalDomain() + ":" + this.getGlobalPageType();
},

getAggregateDetailProductsVar: function(){
    var productKey = "";
    
    if( null != amznAnalytics.getElement("productView")) {
        if (null != amznAnalytics.getElement("productView")["pASIN"]) {
             productKey = ";" + amznAnalytics.getElement("productView")["pASIN"];
         }
     }    
    return productKey;
},

getAggregate404PageType: function(){
    return this.getGlobalDomain() + ":errorPage";
},

getAggregateBrowsePageName : function(){
    return this.getGlobalDomain() + ":" + this.getBrowsePageName();
},

getAggregateBrowsePageType : function() {
    return this.getGlobalDomain() + ":" + this.getBrowsePageType();
},

getAggregateBrowseSiteSubSection : function(){
    var subsection = this.getGlobalDomain() + ":" + this.getGlobalChannel();
    if(this.getGlobalCategory()) {
        subsection = subsection + ":" + this.getGlobalCategory();
    }
    return subsection;
},

getAggregateBrowseSiteSubSection2 : function(){
    var subsection = this.getAggregateBrowseSiteSubSection();
    if(this.getGlobalSubcategory()) {
        subsection = subsection + ":" + this.getGlobalSubcategory();
    }
    return subsection;
},

getAggregateBrowseSiteSubSection3 : function(){
    return this.getGlobalDomain() + ":" + this.getBrowsePageName();
},

getAggregateSearchPageName : function() {
    return this.getGlobalDomain() + ":" + this.getSearchPageName();
},

getAggregateDetailPageName : function(){
    return this.getGlobalDomain() + ":" + this.getDetailPageName();
},

getAggregateDetailChannel : function(){
    return this.getGlobalDomain() + ":" + this.getDetailChannel();
},

getAggregateCheckoutPageName: function(){
    return this.getGlobalDomain() + ":" + this.getCheckoutPageName();
},

getAggregateCheckoutCategory: function(){
    return this.getGlobalDomain() + ":Checkout: Shopping Cart";
},

getAggregateCheckoutPageType: function(){
    return this.getGlobalDomain() + ":Checkout";
},

getAggregateThankYouChannel: function(){
    if( null != amznAnalytics.getElement("purchaseID")){
        return this.getGlobalDomain() + ":Checkout: Order Confirmation";
    }
},
   
getAggregateSignInPageName: function(){
    return this.getGlobalDomain() + ":Checkout:Login";
},

getAggregateYASignInPageName: function(){
    return this.getGlobalDomain() + ":Your Account:Login";
},

getAggregateGlobalPageName : function(){
    return this.getGlobalDomain() + ":" + amznAnalytics.getElement("pageName");
},

getAggregateThankYouEventPromotion: function(){
    if( null != amznAnalytics.getList("promotions")){
        return "event9";
    }
},   

getAggregateThankYouEventTaxRevenue: function(){
    if( null != amznAnalytics.getElement("taxRevenue")){
        return "event6";
    }       
},

getAggregateThankYouEventShippingRevenue: function(){
    if( null != amznAnalytics.getElement("shippingRevenue")){
        return "event7";
    }       
},

    getAggregateThankYouProductsVar: function(){
       var args= new Array();
       args["amznVar"] = "purchases";
       args["format"] = ";%s;%s;%s;;eVar18=%s";
       args["indices"] = new Array("pASIN","quantity","revenue","SKU");
       args["separator"] = ",";
       
       var pushVar = new loopSetAssignment(args);
       
       var returnValue = pushVar.printObject();

       if ( '' != returnValue){
           returnValue = returnValue + args["separator"];
       }
       
        if( null != amznAnalytics.getElement("taxRevenue")){
            returnValue = returnValue + ";Tax;;;event6=" + amznAnalytics.getElement("taxRevenue") + args["separator"];
        }
        
        if( null != amznAnalytics.getElement("shippingRevenue")){
            returnValue = returnValue + ";Shipping;;;event7=" + amznAnalytics.getElement("shippingRevenue") + args["separator"];
        }
        if( null != amznAnalytics.getElement("totalPromotionAmount") && null != amznAnalytics.getList("promotions")){
            returnValue = returnValue + ";Order Discount;;;event9=" + amznAnalytics.getElement("totalPromotionAmount") + args["separator"];
        }
        return returnValue;
   },
getAggregateOrderReview: function(){
       return "event8";           
},
getAggregateSigninConfirmation: function(){
    return "event10";           
},
getAggregateThankYouPageName: function(){
    return this.getGlobalDomain() + ":Checkout:Order Confirmation";
},
   getAggregate500PageType: function(){
	     return this.getGlobalDomain() + ": Internal errorPage";
	 },
	 
	 get500PageType: function(){
	     return this.getGlobalDomain() + ": Internal errorPage";
	 },
getAggregateMiniDetailProductsVar: function(){
      var productKey = "";
            
      if( null != amznAnalytics.getElement("productView")) {
              productKey = ";" + amznAnalytics.getElement("productView")["SKU"];
      }   
      return productKey;
},
  /* Info pages functions */
  getInfoPageName: function() {
      return amznAnalytics.getElement("server") + ":" + amznAnalytics.getElement("channel") + ":" + amznAnalytics.getElement("pageTitle");
  },

  getInfoChannel: function() {
      return amznAnalytics.getElement("server") + ":" + amznAnalytics.getElement("channel");
  },

  getInfoCategory: function() {
      return amznAnalytics.getElement("channel");
  }

};
