/**
 * @author virajs@ jcfant@
 * 
 * Webstore Carousels
 * ------------------
 * This file contains carousel plugins that inherit from a 
 * generic base. The generic base was ported from an existing
 * carousel plugin by jcfant@, but was made object oriented
 * to allow for easier overrides for ajaxy carousels.
 *
 * If, at a later point, these carousels or util methods
 * want to be used outside of this plugin, moving them to 
 * separate files and updating references should be all you need
 * to do.
 *
 */

(function($) {
    // Intentionally not globally namespaced to avoid creating one-off convention
    var Webstore = {util: {}, ui: {}};

    /**
     * YUI/Ext style extends method allow for deep inheritance
     * jQuery options prototype is separately extended to insure inheritance
     * 
     * Example:
     * class1 = function() {
     * }
     * $.extend(class1.prototype, {
     *     hi: function() { alert('hello'); }
     * }
     
     * class2 = function() {
     *     class2.superclass.constructor.apply(this, arugments);
     * }
     * Webstore.util.extend(class2, class1, { 
     *     hi: function() { class2.superclass.hi.call(this); alert('world'); }
     * }
     *
     * class2.hi() will now alert 'hello', and then 'world'
     *
     *
     * @param object subclass
     * @param object superclass to extend
     * @param object override the prototype of the superclass in the subclass
     */
    Webstore.util.extend = function(subclass, superclass, overrides) {
        var F = function(){},
            subclassPrototype,
            superclassPrototype = superclass.prototype;

        F.prototype = superclassPrototype;
        subclassPrototype = subclass.prototype = new F();
        subclassPrototype.constructor = subclass;
        subclass.superclass = superclassPrototype;
        
        if(superclassPrototype.constructor == Object.prototype.constructor){
            superclassPrototype.constructor = superclass;
        }

        $.extend(subclassPrototype, overrides); 
        subclassPrototype.options = $.extend({}, superclassPrototype.options, subclassPrototype.options);
        return subclass;
    };

    /**
     * @author virajs@ jcfant@
     *
     * Base widget
     * -----------
     * The base widget offers basic widget functionality such as logging 
     * and shared hooks method. Meant to be extended.
     *
     * Callbacks:
     *      beforeInit  Executed before init() method
     *      afterInit   Executed after init() method
     *
     * Callbacks should be defined in the options object
     *
     * Options:
     *      See options prototype
     *
     * @param HTMLElement element to be made a carousel
     * @param Object custom options
     */
    Webstore.ui.widget = function(el, options) {
        this._initOptions(options);

        this.element = $(el);
        if(!this.element.data(this.widgetName))
            this.element.data(this.widgetName, this);
        else 
            return;

        var o = this.options; 
        this.hooks(this, o.beforeInit);
        this._init();
        this.hooks(this, o.afterInit);
    };

    $.extend(Webstore.ui.widget.prototype, { 
        /**
         * Name of widget
         * Allows you to access widget object by $(...).data(widgetName);
         */
        widgetName: 'carousel',

        /**
         * Options
         */
        options: {
            /**
             * Enable logging
             */
            debug: false
        },

        /**
         * Performs a deep copy of the options copy to avoid changing 
         * class prototypes. Unfortunately necessary and slightly
         * expensive
         */
        _initOptions: function(options) {
            this.options = $.extend(true, {}, this.options, options);
        },

        /**
         * Initialization method meant to be overriden
         */
        _init: function() {},

        /****
         * debug logging
         * @param Mixed Data to be logged
         ****/
        log: function(data){
            if (this.options.debug) {
                if(window.console && window.console.log) {
                    console.log("%o: %o", data, this);
                } else {
                    $(document.body).append($("<div class='error'>" + data + "</div>"));
                }
            }
        },

        /**
         * Callback handler. If callback is specified in options object, 
         * will execute under given context with any pass parameters.
         *
         * Chaining Calls:
         * Callbacks can be chained by passing an array of handlers.
         * 
         * var options = {
         *                 moveLeft    : [ function (data) { 
         *                                               var carousel = this;
         *                                               // do something ...
         *                                               return { isOK : true, data : "I AM A RETURN VALUE" }
         *                                            },
         *                                 function (data) { // data is now equal to "I AM A RETURN VALUE"
         *                                                var carousel = this;
         *                                                // do something ...
         *                                               return { isOK : true, data : "" }
         *                                            }
         *                                ],
         *                 moveRight   : [ function (data) { 
         *                                               var carousel = this;
         *                                               // do something ...
         *                                               return { isOK : false, data : "I AM A RETURN VALUE" }
         *                                            },
         *                                 function (data) { // this function isn't executed because of the isOK being false;
         *                                                var carousel = this;
         *                                                // do something ...
         *                                               return { isOK : true, data : "" }
         *                                            }
         *                                ],
         *                 };
         *
         * @param {Object} hookList
         */
        hooks: function(thisObject, hookList, args){
            args = args || [];
            if ($.isFunction(hookList)) {
                return hookList.apply(thisObject, args).isOK;
            } else if (/object|array/.test(typeof hookList)) {
                var result = {
                    isOK: true,
                    data: args
                };
                for (var i = 0; i < hookList.length; i++) {
                    if (result.isOK) {
                        result = hookList[i].apply(thisObject, result.data || []);
                    }
                }
                return result.isOK;
            }
            return true;
        }

    });


    /**
     * @author virajs@ jcfant@
     *
     * Carousel Widget
     * ---------------
     * Refactor of jcfants@ carousel widget to be object oriented.
     * Support is dropped for page types (but can easily be added),
     * and the widget is items based in that it makes decisions
     * based on how many items are present. Supports vertical carousels.
     * 
     * Dom Setup:
     *      This plugin expects a certain dom:
     *
     * <div class="carousel">
     *   <div class="previousButton"></div>
     *   <div class="carouselWindow">
     *       <ul class="productList">
     *           <li class="product"> <!-- ANY STRUCTURE HERE --></li>
     *           <li class="product"> <!-- ANY STRUCTURE HERE --></li>
     *           <li clase="product"> <!-- ANY STRUCTURE HERE --></li>
     *       </ul>
     *   </div>
     *   <div class="nextButton"></div>
     * </div>
     *
     * Callbacks:
     *      See Webstore.ui.widget's additional callback methods
     *        beforeMove    Triggered on each left/right arrow click. Return false to prevent movement
     *        movePrev      Triggered on each left arrow click. Return false to prevent movement
     *        moveNext      Triggered on each right arrow click. Return false to prevent movement
     *        afterMove     Triggered after carousel animation is completed
     *
     * Options:
     *      See options prototype and Webstore.ui.widge's option prototype
     *
     * @extends Webstore.ui.widget
     * @param HTMLElement element to be made a carousel
     * @param Object custom options
     */
    Webstore.ui.carousel = function(el, options) {
        Webstore.ui.carousel.superclass.constructor.call(this, el, options);
    };

    Webstore.util.extend(Webstore.ui.carousel, Webstore.ui.widget, {
        /**
         * Options Object
         */
        options: {
            /**
             * Visible window element
             */
            container: '.carouselWindow',

            /**
             * Item container selector (ul)
             */
            content: '.productList',
            
            /**
             * Item selector
             */
            item: '.product',
            
            /**
             * Previous button selector
             */
            buttonPrev: '.previousButton',
            
            /**
             * Next button selector
             */
            buttonNext: '.nextButton',
            
            /**
             * Event to trigger next/previous actions
             */
            buttonAction: 'click',
            /**
             * To prevent default click action on button action
             */
            preventDefault: true,
            
            /**
             * Class when buttons are disabled
             */
            buttonDisabled: 'disabled',
            
            /**
             * Class when buttons are not functional (shouldn't be visible)
             */
            buttonOffline: 'offline',

            /**
             * How many items are shown at a time
             * If an <input name="carouselSize" /> is present, will take 
             * that value, otherwise, will calculate how many are visible.
             * If defined in anyway, will set widths on container elements
             * appropriately.
             */
            visible: null,
            
            /**
             * Number of items to shift carousel by
             * Defaults to number of items visible
             */
            stepSize: null,
            
            /**
             * Display carousel vertically (should be same height)
             */
            vertical: false,
            
            /**
             * When true, continuous scroll is enabled (not true circular)
             */
            circular: false,
            
            /**
             * animation easing type
             */
            easing: 'linear',
            
            /**
             * duration of animation in ms
             */
            duration: 500,

            /**
             * Name of hidden input to specify visible option from dom.
             * If present, will adjust width of carousel. 
             */
            carouselSizeInput: 'carouselSize'
        },
       
        /**
         * Initialization
         */
        _init: function() {
            var o = this.options;

            // Store necessary dom elements
            this.container = $(o.container, this.element).eq(0);
            this.content = $(o.content, this.container).eq(0);
            this.items = $(o.item, this.content); 
            this.itemCount = this.items.length;

            // Get orientation based properties
            this.posProp = o.vertical ? 'top' : 'left';
            this.camelSizeProp = o.vertical ? 'Height' : 'Width';
            this.sizeProp = this.camelSizeProp.toLowerCase();
            if(o.vertical) this.element.addClass('vertical');
            
            // Get element sizes
            this.currentIndex = 0;
            var currentItemEl = this.items.eq(this.currentIndex);
            this.itemSize = currentItemEl['outer' + this.camelSizeProp](true); 

            // If number of visible items is defined, make sure carousel is right size
            var visibleInput = $('input[name=' + o.carouselSizeInput + ']', this.element);
            if(o.visible || visibleInput.length) {
                var visible = o.visible || parseInt(visibleInput.eq(0).val());
                var carouselSize = this.itemSize * visible;
                this.element[this.sizeProp](carouselSize);
                this.container[this.sizeProp](carouselSize);
                o.stepSize = o.stepSize || visible;
            } 

            this.windowSize = this.container[this.sizeProp]();
            this.scrollSize = o.stepSize ? o.stepSize : Math.floor(this.windowSize/this.itemSize); 

            this._initButtons();
        },

        /**
         * Find button elements
         */
        _initButtons: function() {
            var o = this.options;

            this.prevButton = $(o.buttonPrev, this.element).eq(0);
            this.nextButton = $(o.buttonNext, this.element).eq(0);

            this._initButtonEvents();
            this._initButtonsState();
        },

        /**
         * Bind event handlers to buttons
         */
        _initButtonEvents: function() {
            var o = this.options;
            var self = this;
            this.prevButton.bind(o.buttonAction, function(e) {
                self.previous.call(self, e); 
            });
            this.nextButton.bind(o.buttonAction, function(e) {
                self.next.call(self, e); 
            });
        },

        /**
         * Set initial button state by updating classes
         */
        _initButtonsState: function() {
            var o = this.options;
            if(!o.circular) this.disableButton(this.prevButton, true);
            if(this.windowSize > this.itemCount * this.itemSize) {
                this.prevButton.addClass(o.buttonOffline);
                if(!o.circular) this.disableButton(this.nextButton, true);
                this.nextButton.addClass(o.buttonOffline);
            }
        },

        /**
         * Enables button by removing disabled class, and adding href 
         * attribute for an accessible user (which is not actively used)
         *
         * @param jQuery button
         * @param boolean wheather to make accessible change
         */
        enableButton: function(btn, accessible) {
            btn.removeClass(this.options.buttonDisabled);
            if(accessible && btn.length && btn.get(0).tagName.match(/a/i))
                btn.attr('href', '#');
        },
        
        /**
         * Disables button by removing disabled class and removing
         * href attribute so screen readers won't pick it up
         *
         * @param jQuery button
         * @param boolean wheather to make accessible change
         */
        disableButton: function(btn, accessible) {
            btn.addClass(this.options.buttonDisabled);
            if(accessible)
                btn.removeAttr('href');
        },

        /**
         * Based on circularness and current position, updates button
         * states to message valid options to the user
         */
        updateButtonsState: function() {
            if(!this.options.circular) {
                var index = this.currentIndex;
                if(index - this.scrollSize < 0)
                    this.disableButton(this.prevButton, true);
                else
                    this.enableButton(this.prevButton, true);
                if(index + this.scrollSize >= this.itemCount)
                    this.disableButton(this.nextButton, true);
                else
                    this.enableButton(this.nextButton, true);
            }
        },

        /**
         * Scrolls to previous set of items
         *
         * @param Event
         */
        previous: function(e) {
            var o = this.options;
            if(e && o.preventDefault) e.preventDefault();
            if(!this.hooks(this, o.movePrev)) return;
            this.shift(-1 * this.scrollSize);
        },

        /**
         * Scrolls to next set of items
         *
         * @param Event
         */
        next: function(e) {
            var o = this.options;
            if(e && o.preventDefault) e.preventDefault();
            if(!this.hooks(this, o.moveNext)) return;
            this.shift(this.scrollSize);
        },

        /**
         * Shifts number of items based on delta. If negative,
         * moves to previous items.
         *
         * @param int number of items to move by
         */
        shift: function(delta) {
            var o = this.options;
            if(!this.hooks(this, o.beforeMove, delta)) return;

            var newIndex = this.currentIndex + delta; 
            var count = this.itemCount;

            if(newIndex >= 0 && newIndex < count) {
                // If a valid shift, just go to index
                this.goTo(newIndex);
            } else if(delta < 0 && this.currentIndex > 0) {
                // Should never occur. If scrolling is out of sync, and we do not
                // hit the first element, make sure to go to the first element.
                this.goTo(0);
            } else if(o.circular && newIndex < 0) {
                // If at first element, go to last set of items
                this.goTo(this.scrollSize * Math.floor((this.itemCount - 1)/this.scrollSize));
            } else if(o.circular) {
                // If at last element, go to the first element
                this.goTo(0);
            }
        },

        /**
         * Scrolls to specified item
         *
         * @param int Item index to scroll to
         */
        goTo: function(index) {
            this.currentIndex = index;
            this.updateButtonsState();
            this.animate(-1 * index * this.itemSize);
        },

        /**
         * Animation effect
         *
         * @param int new left/top position (delta) of ul element
         */
        animate: function(newPos) {
            var o = this.options;
            var self = this;
            var animProperties= {};
            animProperties[this.posProp] = newPos;
            var animOptions = {
                easing: o.easing,
                duration: o.duration,
                complete: function() { self.hooks(self, o.afterMove); }
            };

            this.content.animate(animProperties, animOptions);
        }
        
    });

    /**
     * @author virajs@
     *
     * Product Carousel Widget
     * -----------------------
     * This is a specialized carousel widget that will dynamically fill itself
     * with content and is accessible. It will also eventually also support
     * vertical carousels (this is implemented, but not heavily tested).
     *
     * The main problem we have is that we can not load too many products
     * at once, but to allow for filtering based on our of stock, emwa, in store,
     * preorder, etc items, we need a definitive list of products. Because this
     * is currently not possible, this plugin will:
     *      1. Fetch next set of asins (based on stepSize)
     *      2. If current visible page is not full, request subsequent pages
     *         until it is.
     * It can only fetch items specified in the dom, and it is very unlikely 
     * more than two requests would be necessary.
     *
     * This is used by the IncaProductListPageletGroup widgets. You can look
     * at IncaProductListPageletGroupLayout for an example dom setup.
     *
     * Dom Setup:
     *      This plugin expects a similar dom as the carousel plugin:
     *
     * <div class="carousel">
     *   <input type="hidden" name="carouselPageSize" value="4" />
     *   <input type="hidden" name="carouselTotalItemsCount" value="16" />
     *   <input type="hidden" name="productListLayoutRetriever" value="http://..." />
     *   <div class="previousButton"></div>
     *   <div class="carouselWindow">
     *       <ul class="productList">
     *           <li class="product loaded"> <!-- ANY STRUCTURE HERE --></li>
     *           <li class="product loading"> 
     *               <input type="hidden" name="asin" value="AAAAAAAAAA" />
     *           </li>
     *           <li class="product loading"> 
     *               <input type="hidden" name="asin" value="BBBBBBBBBB" />
     *           </li>
     *       </ul>
     *   </div>
     *   <div class="nextButton"></div>
     * </div>
     *
     * Callbacks:
     *      See Webstore.ui.carousel's additional callback methods
     *
     * Options:
     *      See options prototype and Webstore.ui.carousel's option prototype
     *
     * @extends Webstore.ui.carousel
     * @param HTMLElement element to be made a carousel
     * @param Object custom options
     */
    Webstore.ui.productCarousel = function(el, config) {
        Webstore.ui.productCarousel.superclass.constructor.call(this, el, config);
    };

    Webstore.util.extend(Webstore.ui.productCarousel, Webstore.ui.carousel, {
        /**
         * Options object
         */
        options: {
            /**
             * Selector indicating an unloaded item
             */
            loading: '.loading',

            /**
             * Selector for loading message
             */
            loadingMessage: '.loadingMessage',

            /**
             * Selector for error message when ajax calls fail
             */
            loadingErrorMessage: '.loadingErrorMessage',

            /**
             * Selector for error message when ajax returns no items
             */
            noContentErrorMessage: '.noContentErrorMessage',

            /**
             * Name of hidden input used to determine item id's
             * Used in ajax calls
             */
            itemIdInput: 'asin',

            /**
             * Name of hidden input used to determine the number of items
             * that are scrollable by the carousel.
             */
            itemCountInput: 'carouselTotalItemsCount',

            /**
             * Url for ajax requests. If provided, overrides value provided
             * by hidden input
             */
            itemRetrievalUrl: null,

            /**
             * Name of hidden input to determine url for ajax requests
             */
            itemRetrievalUrlInput: 'productListLayoutRetriever',

            /**
             * Parameter to specify list of request id's for ajax url
             */
            itemListParam: 'asinList',

            /**
             * Whether to cache ajax requests
             */
            cache: true,

            /**
             * Request type for ajax requests (GET/POST)
             */
            requestType: 'GET',

            /**
             * Whether to apply css to set all unloaded items to have the same
             * height/width as first element. If there is a long list of items,
             * it would be more performant to set these via css. 
             */
            setLoadingItemSize: false,

            /**
             * Default item size {width: w, height: h} to apply to unloaded items.
             * If unloaded items don't have width/height specified, the plugin
             * will assign width/height via $.css with this object. Styles only
             * set if setLoadingItemSize is true. Defaults to size of first item.
             */
            loadingItemSize: null
        },

        /**
         * @override
         *
         * Sets itemCount appropriately and initializes messaging/members
         */
        _init: function() {
            Webstore.ui.productCarousel.superclass._init.apply(this, arguments);
            var o = this.options;

            // If available, get itemsCountLength
            var itemCountInput = $('input[name=' + o.itemCountInput + ']', this.element);

            this.totalItemCount = this.itemCount;
            this.itemCount = itemCountInput.length ? parseInt(itemCountInput.eq(0).val())
                                                   : this.itemCount;

            // Get url for ajax retreival
            this.itemRetrievalUrl = o.itemRetrievalUrl;
            if(!this.itemRetrievalUrl) {
                var itemRetrievalUrlInput = $('input[name=' + o.itemRetrievalUrlInput + ']', this.element);
                this.itemRetrievalUrl = itemRetrievalUrlInput.length ? 
                                        itemRetrievalUrlInput.eq(0).val() : null; 
            }

            this._initLoadingItemSize();
            this._initLoadingMessage();
            this._initRequestStore();
            this._initErrorMessages();

            // Make sure first set of items is loaded
            this.load(0);
        },

        /**
         * If loadingItemSize wasn't specified in options, gets size from first item
         */
        _initLoadingItemSize: function() {
            var o = this.options;
            this.loadingItemSize = o.loadingItemSize;
            if(!this.loadingItemSize) {
                var firstItem = this.items.eq(0);
                this.loadingItemSize = {
                    height: firstItem.height(),
                    width: firstItem.width()
                };
            }
        },

        /**
         * Finds loading message element
         */
        _initLoadingMessage: function() {
            var o = this.options;
            this.loadingMessage = $(o.loadingMessage, this.element).eq(0);
        },

        /**
         * Sets up error message handlers
         */
        _initErrorMessages: function() {
            var self = this;
            this.errorMessages = {};
            this.createErrorMessage('loadingErrorMessage', function(accessible) {
                self.goTo.call(self, self.currentIndex);
            });
            this.createErrorMessage('noContentErrorMessage', function(accessible) {
                self.previous.call(self);
                if(accessible) self.focus.call(self, self.currentIndex);
            });
        },

        /**
         * @override
         *
         * Uses accessibleClick plugin to determine if current event is an accessible
         * click.
         */
        _initButtonEvents: function() {
            var o = this.options;
            var self = this;
            // accessibleClick only executes on a NON-accessible click, so
            // we use multiple handlers to verify an accessible click
            var notAccessibleFlag = false;
            this.nextButton.accessibleClick(function(e, data) {
                notAccessibleFlag = true;
            });
            this.nextButton.click(function(e) {
                self.accessibleClick = !notAccessibleFlag;
                notAccessibleFlag = false;
            });

            Webstore.ui.productCarousel.superclass._initButtonEvents.apply(this, arguments);
        },

        /**
         * Creates batchRequestStore and loadedStore, two objects used to help
         * determine what requests have been made, what they returned, and
         * where new content should be inserted.
         *
         * loadedStore is just an array representation of the visible elements in 
         * the carousel, with unloaded items undefined. As items are loaded, 
         * they're spliced in.
         *
         * batchRequestStore is an array of batch requests to be made. Loaded and
         * unloaded items are partitioned into batches to keep track of their state
         */
        _initRequestStore: function() {
            var o = this.options;
            this.batchRequestStore = [];

            // Get loaded items, and partition them into batches
            this.loadedStore = this.items.filter(':not(' + o.loading +')').get();
            var loadedBatchCount = Math.ceil(this.loadedStore.length/this.scrollSize);
            for(var i = 0; i < loadedBatchCount; i++) {
                this.batchRequestStore[i] = {
                    status: 'done',
                    count: i < loadedBatchCount - 1 ? this.scrollSize
                                                    : (this.loadedStore.length - 1) % this.scrollSize + 1
                };
            }

            // If there are unloaded items, them all as undefined in the loadedStore
            if(this.itemCount != this.loadedStore.length) 
                this.loadedStore[this.itemCount] = undefined;

            // Get unloaded items, and partition them into batches
            var unloadedItems = this.items.filter(o.loading);
            if(this.options.setLoadingItemSize) unloadedItems.css(this.loadingItemSize);
            var unloadedStore = unloadedItems.get();
            var unloadedBatchCount = Math.ceil(unloadedStore.length/this.scrollSize);
            for(var i = 0; i < unloadedBatchCount; i++) {
                var requestItems = unloadedStore.splice(0, this.scrollSize);
                this.batchRequestStore[i + loadedBatchCount] = {
                    status: null,
                    items: requestItems, 
                    count: requestItems.length
                };
            }
        },

        /**
         * @override
         *
         * If we're on the last set of items, a screen reader shouldn't pick up 
         * the next button.
         */
        updateButtonsState: function() {
            Webstore.ui.productCarousel.superclass.updateButtonsState.apply(this, arguments);
            if(this.currentIndex + this.scrollSize >= this.itemCount)
                this.nextButton.removeAttr('href');
        },

        /**
         * @override
         *
         * Starts loading process then scrolls to that index 
         *
         * @param int item index to scroll to
         */
        goTo: function(index) {
            this.hideErrorMessages();
            this.load(index);
            Webstore.ui.productCarousel.superclass.goTo.apply(this, arguments);
        },

        /**
         * Finds next unmade request to fill current set and makes request
         *
         * @param int Item index to be loaded
         */
        load: function(index) {
            if(!this.isLoaded(index)) {
                // Get subsequent unmade request and make request
                var batchIndex = Math.floor(index/this.scrollSize);
                for(var i = batchIndex, len = this.batchRequestStore.length; i < len; i++) {
                    var batchRequest = this.batchRequestStore[i];
                    if(batchRequest.status && batchRequest.status == 'pending') {
                        // If request is already pending, just wait and do nothing
                        return;
                    } else if(!batchRequest.status || batchRequest.status == 'failed') {
                        // If request has never been made or previously failed, try
                        this.loadItems(index, i);
                        return;
                    } 
                }
                if(!this.loadedStore[index]) {
                    // If no requests provided any content to be seen, show an error
                    // This should never happening until filtering is enabled
                    this.accessibleClick = false;
                    this.showErrorMessage('noContentErrorMessage');
                }
            } else {
                // Only on accessible clicks will we focus on the new item
                if(this.accessibleClick) {
                    this.accessibleClick = false;
                    this.focus(index);
                    this.hideLoadingMessage();
                }
            }
        },

        /**
         * Checks loadedStore to see if all items for the particular set are loaded
         * 
         * @param index Item index to scroll to
         * @return boolean Whether current set is loaded
         */
        isLoaded: function(index) {
            var end = index + this.scrollSize;
            end = end >= this.itemCount ? this.itemCount : end;
            if(index >= end) { 
                // Empty page, return false to show error
                return false;
            }
            for(var i = index; i < end; i++) {
                if(typeof(this.loadedStore[i]) == 'undefined') 
                    return false;
            }

            return true;
        },

        /**
         * Makes ajax call to load next set of items
         *
         * @param int Item to scroll to
         * @param int index of batchRequest to make
         */
        loadItems: function(index, batchIndexToLoad) {
            var o = this.options;
            var self = this;
            var batchRequest = this.batchRequestStore[batchIndexToLoad];
            var items = $(batchRequest.items);

            // Show loading message
            this.showLoadingMessage();

            // Construct item list to request
            var itemList = [];
            var itemIds = items.find('input[name=' + o.itemIdInput + ']');
            itemIds.each(function() { itemList.push($(this).val()); });

            // Mark pending and make request
            batchRequest.status = 'pending';
            var data = {};
            data[o.itemListParam] = itemList.join(';');
            $.ajax({
                url: this.itemRetrievalUrl,
                data: data,
                success: function(data, textStatus, request) {
                    self.loadItemsSuccess.call(self, index, batchIndexToLoad, data, textStatus, request);
                },
                error: function(request, textStatus, errorThrown) {
                    self.loadItemsFailure.call(self, index, batchIndexToLoad, request, textStatus, errorThrown);
                },
                cache: o.cache,
                type: o.requestType
                // assume timeout is set globally for application
            });
        },

        /**
         * Ajax success handler. Inserts content into carousel and updates state.
         *
         * @param int Index to scroll to
         * @param int batchIndex of ajax call
         * @param string ajax result
         */
        loadItemsSuccess: function(index, batchIndex, data, textStatus, request) {
            var o = this.options;

            var batchRequest = this.batchRequestStore[batchIndex];
            batchRequest.status = 'done';

            // Create fragment container to hold new items
            var frag = document.createElement('div');
            var fragEl = $(frag);
            fragEl.append(data);

            // Get information about new items
            var resultItems = fragEl.find(o.item);
            var resultCount = resultItems.length;
            batchRequest.count = resultCount;

            // Update loadedStore
            var insertIndex = this.getInsertIndex(batchIndex);
            var spliceArgs = [insertIndex, this.scrollSize].concat(resultItems.get());
            this.loadedStore.splice.apply(this.loadedStore, spliceArgs); 
            
            // Replace loading placeholders with new items
            // Replace one by one as removing after batch insert fails
            var placeholders = $(batchRequest.items);
            for(var i = 0, len = placeholders.length; i < len; i++) {
                var resultItem = resultItems.eq(i);
                var placeholder = placeholders.eq(i);
                if(resultItem.length) {
                    placeholder.replaceWith(resultItem);
                } else {
                    placeholder.remove();
                    this.totalItemCount--;
                }
            }
            this.updateItemCount();
            fragEl.remove();
            
            // Load index again to check if we have enough items
            this.load(index);            
        },

        /**
         * Ajax failure handler. Messages error to user
         *
         * @param int Index to scroll to
         * @param int batchIndex of ajax call
         * @param XMLHttpRequest request
         */
        loadItemsFailure: function(index, batchIndex, request, textStatus, errorThrown) {
            var o = this.options;
            var batchRequest = this.batchRequestStore[batchIndex];
            batchRequest.status = 'failed';

            this.showErrorMessage('loadingErrorMessage');
        },
        
        /**
         * After insertion, checks if total number of items that can possibly
         * be loaded has changed.
         */
        updateItemCount: function() {
            this.itemCount = this.itemCount > this.totalItemCount ? this.totalItemCount
                                                                  : this.itemCount;
        },

        /**
         * Get's index of loadedStore at which to splice in new content by counting
         * result of previous requests.
         *
         * @param int batchIndex of request
         * @return index Index of loadedStore at which to splice in new content
         */
        getInsertIndex: function(batchIndex) {
            var insertIndex = 0;
            for(var i = 0; i < batchIndex; i++)
                insertIndex += this.batchRequestStore[i].count; 

            return insertIndex;
        },

        /**
         * Focuses on the passed item
         *
         * @param int Index of item to be focused
         */
        focus: function(index) {
            if(index == this.currentIndex)
                $(this.loadedStore[index]).find('a:first').focus();
        },

        /**
         * Makes message focusable and focuses on message
         */
        showLoadingMessage: function() {
            this.loadingMessage.css('display', 'block');
        },

        /**
         * Makes message unfocusable
         */
        hideLoadingMessage: function() {
            this.loadingMessage.css('display', 'none');
        },

        /**
         * Initializes error message by positioning/resizing and binding events
         *
         * @param string Error name
         * @param Function handler for error link
         */
        createErrorMessage: function(error, handler) {
            var o = this.options;
            var self = this;
            var msg = $(o[error], this.element).eq(0);
            var notAccessibleFlag = false;

            this.errorMessages[error] = msg;
            this.centerMessage(msg);
            var link = msg.find('a');
            link.accessibleClick(function(e, data) {
                notAccessibleFlag = true;
            });
            link.click(function(e) {
                self.accessibleClick = !notAccessibleFlag;
                notAccessibleFlag = false;
                e.preventDefault();
                handler(self.accessibleClick);
            });
        },
        
        /**
         * Shows error message and focuses on message
         *
         * @param string Error name to show
         */
        showErrorMessage: function(error) {
            var el = this.errorMessages[error];
            el.show();
            el.find('p').focus();
        },

        /**
         * Hide error message
         *
         * @param string Error name to hide
         */
        hideErrorMessage: function(error) {
            this.errorMessages[error].hide();
        },
        
        /**
         * Hides all error messages
         */
        hideErrorMessages: function() {
            for(var error in this.errorMessages)
                this.errorMessages[error].hide();
        },

        /**
         * Centers passed message in carousel
         *
         * @param jQuery jQuery wrapped message object
         */
        centerMessage: function(msg) {
            var el = $(this.element);
            var elSize = {
                height: el.height(),
                width: el.width()
            };
            var msgSize = {
                height: msg.outerHeight(),
                width: msg.outerWidth()
            };
            if(msgSize.width > elSize.width) {
                var padding = msgSize.width - msg.width();
                msgSize.width = elSize.width;
                msg.width(msgSize.width - padding);
            }
            msg.css({
                left: elSize.width/2 - msgSize.width/2,
                top: elSize.height/2 - msgSize.height/2
            });
        }

    });

    $.fn.extend({
        carousel: function(config) {
            return $(this).each(function() {
                new Webstore.ui.carousel(this, config)
            });
        },
        productCarousel: function(config) {
            return $(this).each(function() {
                new Webstore.ui.productCarousel(this, config)
            });
        }
    });

})(jQuery);
