/**
 * @author rduffy
 * Amazon Global Navigation Plugin
 * 
 */

(function($){
    
    jQuery.fn.globalNav = function(newOptions){
        /**
         * If we are passed a collection apply the quickinfo to each
         * element in the collection
         */
        if (this.length > 1) {
              for (var i = 0; i < this.length; i++) {
                   $(this[i]).globalNav(newOptions);
              }
              return this;
        }
        
        // Establish closure
        var globalNav = this;

        var baseOptions = {
            subNav:         "div.subNavigation",
            hoverClass:     "navigationHover",
            mainNode:       "li.navigationGroup",
            activeClass:    "enabled"
        }

        var options = $.extend(baseOptions, newOptions);
        
        this.initialize = function(){
            
            if(this.modifyDom() && this.addEvents()){
                this.addClass(options.activeClass);
            };
            
            return this;
        }
        
        this.createIframeShim = function(){
            // used for ie6 z-index workaround
            var iframe = this.iframeShim;
            if (!iframe) {
              iframe = document.createElement('iframe');
              iframe.src = "https://images-na.ssl-images-amazon.com/images/G/01/Starter/en_US/inca/logo.jpg";
              // make transparent so you can use with rounded corners
              iframe.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)';
              this.iframeShim = iframe;
            }
            return iframe.cloneNode(true);
        }
        
        this.modifyDom = function(){
            /** Do any dom modifications here **/
            if($.browser == "msie" && $.browser.version == "6.0"){
                $(options.subNav, this).each(function(){
                    var parentNode = $(this).parent();
                    parentNode.append(globalNav.createIframeShim());  
                });
            }
            return true;
        }
        this.addEvents = function(){
            $(options.mainNode, this).hover(function(){
                $(this).addClass(options.hoverClass).children(options.subNav).show();
                $(this).children("iframe").show();
            }, function(){
                $(this).removeClass(options.hoverClass).children(options.subNav).hide();
                $(this).children("iframe").hide();
            });
            return true;
        }
        return this.initialize();
    }
    
})(jQuery);
