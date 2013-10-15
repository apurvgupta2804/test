/**
 * @author rduffy
 * 
 * This plugin replaces the regular click event handler with an
 * accessible version. When this is used JAWS screen readers are
 * redirected to the standard link and all other users are shown
 * the results of executing the functionToCall.
 */


(function($){
    jQuery.fn.accessibleClick = function(functionToCall, options){
        /**
         * If we are passed a collection apply the quickinfo to each
         * element in the collection
         */
        if (this.length > 1) {
              for (var i = 0; i < this.length; i++) {
                   $(this[i]).accessibleClick(functionToCall, options);
              }
              return this;
        }
        if(this.length < 1) return this;

        // Only one option at the moment
        var enableKeyDown = (options) ? options.disableKeyDown || false : false;

        // Establish closure
        var accessibleClick = this;
        // Variable used to store the active state
        this.data('active', false);
        
        this.initialize = function(){
            this.hover(function(){
                accessibleClick.data('active', true);
            },function(){
                accessibleClick.data('active', false);
            }).keydown(function(){
                if(enableKeyDown)
                    accessibleClick.data('active', true);
            }).keyup(function(){
                // Delay until after the click is fired
                window.setTimeout(function(){
                    if(enableKeyDown)
                        accessibleClick.data('active', false);
                }, 1);
            }).click(function(event, data){
                // JAWS will trigger a click but not a hover or a keyboard event
                // if the keycode is not 0 then this was a navigation event from a
                // non screen reader user and we should open the QI layer otherwise
                // return true to allow normal navigation of the link/bubble             
                var isUserClick = data && (typeof data.isUserClick == "boolean") ? data.isUserClick : true;
                if(isUserClick && accessibleClick.data('active') != true) return true;
                if(typeof functionToCall == "function") 
                    functionToCall.apply(accessibleClick, arguments);
                return false;
            });
        }
        
        return this.initialize();
    }
})(jQuery);
