/**
 * @author rduffy
 * Amazon Dynamic Expander Plugin
 * Starting dom:
 * 
 *     <div class="dynamicExpander" rel="maxItems:1...n">
 *         <ws:buttonGroup class="expanderControls"/>
 *         <ws:list/>    
 *     </div>
 *     
 * Options:
 *     
 *     
 * 
 */

(function($){
    
    jQuery.fn.dynamicExpander = function(newOptions){
        /**
         * If we are passed a collection apply the quickinfo to each
         * element in the collection
         */
        if (this.length > 1) {
              for (var i = 0; i < this.length; i++) {
                   $(this[i]).dynamicExpander(newOptions);
              }
              return this;
        }
        
        // Establish closure
        var dynamicExpander = this;

        var baseOptions = {
            controls:         ".expanderControls",
            expandButton:     ".expandButton",
            collapseButton:   ".collapseButton",
            itemList:         ".itemList li",
            activeClass:      "activeExpander",
            maxItems:         1
        }

        var options = $.extend(baseOptions, newOptions);
        
        this.initialize = function(){
            
            // Look for the rel info
            var relInfo = this.attr('rel');
            var relOptions = {};
            if(relInfo){
               var relInfoParts = relInfo.split(';'); 
               for(var i = 0; i < relInfoParts.length; i++){
                   var varPair = relInfoParts[i];
                   var varTuples = varPair.split(":");
                   if(varTuples.length == 2){
                       relOptions[varTuples[0]] = varTuples[1];
                   }
               }
            }
            options = $.extend(options, relOptions);
            
            if(this.modifyDom() && this.addEvents()){
                this.addClass(options.activeClass);
            };
            
            return this;
        }
        
        this.modifyDom = function(){
            var expandables = $(options.itemList, this);
            if(expandables.length < options.maxItems){
                /** There is no need to use the expander **/
               return false;
            }
            var hiddenOnes = $(options.itemList+":gt("+(options.maxItems-1)+")", this);
            hiddenOnes.css("display", "none");
            this.data("hiddenOnes", hiddenOnes);
            return true;
        }
        
        this.addEvents = function(){
            var expandButton = $(options.expandButton, this);
            var collapseButton = $(options.collapseButton, this);
            collapseButton.hide();
            expandButton.click(function(){
                dynamicExpander.data("hiddenOnes").css("display", "block");
                expandButton.hide();
                collapseButton.show();
                return false;
            });
            collapseButton.click(function(){
                dynamicExpander.data("hiddenOnes").css("display", "none");
                expandButton.show();
                collapseButton.hide();
                return false;
            });
            return true;
        }
        
        return this.initialize();
    }
    
})(jQuery);
