/**
 * @author rduffy
 * Target quick info link jquery plugin
 * 
 * relationship: "quickinfo <ASIN> <reftag>"
 * 
 * Starting dom:
 * 
 *     <a href="url" class="quickinfo" rel="quickinfo ASIN REFTAG"><img src=""/></a>
 *     
 * Final dom:    
 * 
 *     <a href="url" class="quickinfo" rel="..."><div class="quickInfoButton"></div><img src="..."></a>
 *     
 * - Because the a tag allows the :hover psuedo selector this can be used to show/hide
 *   the button on hover if required. 
 * - The active class can be used to provide further control if there is no javscript
 *   enabled.
 * 
 */



(function($){
    
    jQuery.fn.quickinfo = function(newOptions){
        /**
         * If we are passed a collection apply the quickinfo to each
         * element in the collection
         */
        if (this.length > 1) {
              for (var i = 0; i < this.length; i++) {
                   $(this[i]).quickinfo(newOptions);
              }
              return this;
        }
        if(this.length < 1) return this;
 
        // Establish closure
        var quickinfo = this;
        // Variable used to store the active state
        this.active = false;

        var baseOptions = {
            buttonClass:   "quickInfoButton",
            activeClass:   "quickInfoActive",
            buttonOnly:    false,
            invokeFunction: "invokeQuickInfo"
        }

        var options = $.extend(baseOptions, newOptions);
        
        this.initialize = function(){
            
            // Look for the rel info
            var relInfo = this.attr('id');
            var relInfoParts = relInfo.split(':');
            if(relInfoParts.length < 2) return false;
            else{
                this.data("args", relInfoParts);
            }
            this.addDom();
            this.addEvents();
            
            return this;
        }
        
        this.addDom = function(){
            var qiButton = document.createElement("div");
            qiButton.className = options.buttonClass;
            this.prepend(qiButton);
            this.data("qiButton", $(qiButton));
            this.addClass(options.activeClass);
        }
        
        this.addEvents = function(){
            var clickEl;
            if(options.buttonOnly == true) clickEl = this.data("qiButton");
            else clickEl = this;
            clickEl.hover(function(){
                quickinfo.active = true;
            },function(){
                quickinfo.active = false;
            }).keydown(function(){
                quickinfo.active = true;
            }).keyup(function(){
                // Delay until after the click is fired
                window.setTimeout(function(){
                    quickinfo.active = false;
                }, 1);
            }).click(function(event){
                // JAWS will trigger a click but not a hover or a keyboard event
                // if the keycode is not 0 then this was a navigation event from a 
                // non screen reader user and we should open the QI layer otherwise
                // return true to allow normal navigation of the link/bubble
                e = window.event || event;
                if(!quickinfo.active) return true;

                qi = $(this).data("quickinfo");
                args = quickinfo.data("args");
                args.push(this);
                var functionToCall = window[options.invokeFunction];
                if(typeof functionToCall == "function")
                    functionToCall.apply(quickinfo, args);
                return false;
            });
        }
        
        return this.initialize();
    }
    
})(jQuery)
