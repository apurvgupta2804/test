
function boolAssignment(args){
        this.amznVar = args['amznVar'];
        this.type = args['type'];
        this.standin = args['replacement'];
        
        this.printObject = function(){
                if('scalar' == this.type){
                        if(null != amznAnalytics.getElement(this.amznVar)){
                                return this.standin;
                        }
                }else if('list' == this.type){
                        if(null != amznAnalytics.getList(this.amznVar)){
                                return this.standin;
                        }
                }else if('set' == this.type){
                        if(null != amznAnalytics.getSet(this.amznVar)){
                                return this.standin;
                        }
                }
                return '';
        }
}

function boolTrueAssignment(args){
        this.amznVar = args['amznVar'];
        this.type = args['type'];
        this.standin = args['replacement'];
        
        this.printObject = function(){
            if('scalar' == this.type){
                if('true' == amznAnalytics.getElement(this.amznVar)){
                    return this.standin;
                }
            }
            return '';
        }
}
                                                                                                                                                             
function boolFalseAssignment(args){
        this.amznVar = args['amznVar'];
        this.type = args['type'];
        this.standin = args['replacement'];
        
        this.printObject = function(){
            if('scalar' == this.type){
                if(null == amznAnalytics.getElement(this.amznVar)){
                    return this.standin;
                }
            }
            return '';
        }
}


function simpleAssignment(args){
        this.pre = args['pre'];
        this.amznVar = args['amznVar'];
        this.post = args['post'];
        
        this.printObject = function(){
                if(amznAnalytics.getElement(this.amznVar)){
                        return this.pre + amznAnalytics.getElement(this.amznVar) + this.post;
                }
                return '';
        };
}

function objectAssignment(args){
        this.pre = args['pre'];
        this.amznVar = args['amznVar'];
        this.index = args['index'];
        this.post = args['post'];
        
        this.printObject = function(){
                if(amznAnalytics.getElement(this.amznVar)){
                        return this.pre + amznAnalytics.getElement(this.amznVar)[this.index] + this.post;
                }
        }
}

function loopListAssignment(args){
       return new loopListAssignmentMaster(args, false);
}

function loopListAssignmentMaster(args, isDedup){
    this.amznVar = args['amznVar'];
    this.format = args['format'];
    this.indices = args['indices'];
    this.separator = args['separator'];
    
    this.printObject = function(){
        var aggregator = '';
        var dedup = new Array();
        if (null != amznAnalytics.getList(this.amznVar)) {
            var arrayInstance = amznAnalytics.getList(this.amznVar);
            if (!this.indices.length && !this.format) {
                for (var index = 0, len = arrayInstance.length; index < len; index++) {
                    if (isDedup) {
                        if (dedup[arrayInstance[index]] != 1) {
                            dedup[arrayInstance[index]] = 1;
                            if ('' == aggregator) {
                                aggregator += arrayInstance[index];
                            }
                            else {
                                aggregator += this.separator + arrayInstance[index];
                            }
                        }
                    }
                    else {
                        if ('' == aggregator) {
                            aggregator += arrayInstance[index];
                        }
                        else {
                            aggregator += this.separator + arrayInstance[index];
                        }
                    }
                }
            }
            else {
                for (var index = 0, len = arrayInstance.length; index < len; index++) {
                    if (isDedup) {
                        if (dedup[arrayInstance[index][this.indices[0]]] != 1) {
                            dedup[arrayInstance[index][this.indices[0]]] = 1;
                            var objectArray = arrayInstance[index];
                            var argArray = [];
                            for (var index2 = 0, len2 = this.indices.length; index2 < len2; index2++) {
                                argArray.push(objectArray[this.indices[index2]]);
                            }
                            if ('' == aggregator) {
                                aggregator += this.format.sprintf(argArray);
                            }
                            else {
                                aggregator += this.separator + this.format.sprintf(argArray);
                            }
                        }
                    }
                    else {
                        for (var index = 0, len = arrayInstance.length; index < len; index++) {
                            var objectArray = arrayInstance[index];
                            var argArray = [];
                            for (var index2 = 0, len2 = this.indices.length; index2 < len2; index2++) {
                                argArray.push(objectArray[this.indices[index2]]);
                            }
                            if ('' == aggregator) {
                                aggregator += this.format.sprintf(argArray);
                            }
                            else {
                                aggregator += this.separator + this.format.sprintf(argArray);
                            }
                        }
                    }
                }
            }
        }
        return aggregator;
    }
}

function loopSetAssignment(args) {
        this.amznVar = args['amznVar'];
        this.format = args['format'];
        this.indices = args['indices'];
        this.separator = args['separator'];
        
        this.printObject=function(){
                var aggregator = '';
                if(null != amznAnalytics.getSet(this.amznVar)){
                        var arrayInstance = amznAnalytics.getSet(this.amznVar);
                        for(var index=0,len=arrayInstance.length;index<len;index++){
                                var objectArray = arrayInstance[index];
                                var argArray = [];
                                for (var index2 = 0, len2 = this.indices.length; index2 < len2; index2++) {
                                    argArray.push(objectArray[this.indices[index2]]);
                                }
                                if('' == aggregator){
                                        aggregator += this.format.sprintf(argArray);
                                }else{
                                        aggregator += this.separator + this.format.sprintf(argArray);
                                }
                        }
                }
                return aggregator;
        }
}

function assignmentRHS(assignmentParts, separator){
    this.separator = separator;
    this.parsedAssigns = [];
    for (var index = 0, len = assignmentParts.length; index < len; index++) {
        var assignmentPart = assignmentParts[index];
        var type = assignmentPart['type'];
        var pushVar = {};
        if ('onExists' == type) {
            pushVar = new boolAssignment(assignmentPart['args']);
        }
        else 
            if ('scalar' == type) {
                pushVar = new simpleAssignment(assignmentPart['args']);
            }
            else 
                if ('object' == type) {
                    pushVar = new objectAssignment(assignmentPart['args']);
                }
                else 
                    if ('list' == type) {
                        pushVar = new loopListAssignment(assignmentPart['args']);
                    }
                    else 
                        if ('set' == type) {
                            pushVar = new loopSetAssignment(assignmentPart['args']);
                        }
                        else 
                            if ('onBooleanTrue' == type) {
                                pushVar = new boolTrueAssignment(assignmentPart['args']);
                            }
                            else 
                                if ('onBooleanFalse' == type) {
                                    pushVar = new boolFalseAssignment(assignmentPart['args']);
                                }
        this.parsedAssigns.push(pushVar);
    }
    
    this.printObject = function(){
        var aggregator = '';
        for (var index = 0, len = this.parsedAssigns.length; index < len; index++) {
            var appendage = this.parsedAssigns[index].printObject();
            if ('' != appendage) {
                if ('' != aggregator) {
                    aggregator += this.separator;
                }
                aggregator += appendage;
            }
        }
        return aggregator;
    }
}

function omnitureAccount(accountVar){
        this.accountVar=accountVar;
        this.parsedAssignments={};
        this.eventsAssignments={};
        this.eventsSeparator;
        
        this.addAssignments=function(assignmentArray){
                for(var index=0,len=assignmentArray.length;index<len;index++){
                        var assignmentTemp = assignmentArray[index];
                        if('events' == assignmentTemp[0]){
                                var eventsTemp = assignmentTemp[1];
                                this.eventsSeparator=assignmentTemp[2];
                                for(var eventsIndex=0,eventsLen=eventsTemp.length;eventsIndex<eventsLen;eventsIndex++){
                                        this.eventsAssignments[eventsTemp[eventsIndex]['args']['replacement']] = eventsTemp[eventsIndex];
                                }
                        }else{
                                this.parsedAssignments[this.accountVar + "." + assignmentTemp[0]] = new assignmentRHS(assignmentTemp[1],assignmentTemp[2]);
                        }
                }
        }
        
        this.printObject=function(){
                this.constructEvents();
                for(var key in this.parsedAssignments){
                        var aggregate = this.parsedAssignments[key].printObject();
                        if(aggregate == 'undefined') continue;
                        aggregate = aggregate.replace(/\'/g, "\\'");
                        eval(key + "='" + aggregate + "';");
                }
                
                return 1;
        }
        
        this.constructEvents=function(){
                var eventsAssignmentsArray = [];
                for(var key in this.eventsAssignments){
                        eventsAssignmentsArray.push(this.eventsAssignments[key]);
                }
                this.parsedAssignments[this.accountVar + ".events"] = new assignmentRHS(eventsAssignmentsArray,this.eventsSeparator);
        }
}

/**
 * This is a string function which takes an array of values and replaces each
 * instance of %s in the string with a corresponding value in the array.
 */

String.prototype.sprintf = function () {
  var fstring = this.toString();
  
  var argumentList = arguments[0];
  var farr = fstring.split('%s');
  var retstr = farr[0];
  
  for(var i = 1; i<farr.length && argumentList[i-1]; i++) {
      retstr+=argumentList[i-1] + farr[i];
  }
  
  return retstr;
}


