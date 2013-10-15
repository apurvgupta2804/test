function setElement(key,value){
    with (this) this.flatValues[key] = value;
};

function getElement(key){
    with (this) return this.flatValues[key];
};

function appendList(key,array){
    with (this) {
        var tempArray;
        if(null == this.listVars[key]){
            tempArray = new Array();
        }else{
            tempArray = this.listVars[key];
        }
        tempArray = tempArray.concat(array);
        this.listVars[key] = tempArray;
    }
};

function getList(key){
    with (this) return this.listVars[key];
};

function addToSet(key,array){
    with (this) {
        var tempSet;
        if(null == this.setVars[key]){
            tempSet = new Array();
        }else{
            tempSet = this.setVars[key];
        }
        for(index=array.length-1;index >= 0; index--){
            var push = true;
            for(index2=tempSet.length-1;index2 >= 0; index2--){
                if(tempSet[index2] == array[index]){
                    push = false;
                    break;
                }
            }
            if(push){
                tempSet.push(array[index]);
            }
        }
        this.setVars[key] = tempSet;
    }
};

function getSet(key){
    with (this) return this.setVars[key];
}

function amznAnalyticsObject(){
    this.flatValues = {};
    this.listVars   = {};
    this.setVars    = {};
};

amznAnalyticsObject.prototype.getElement=getElement;
amznAnalyticsObject.prototype.setElement=setElement;
amznAnalyticsObject.prototype.appendList=appendList;
amznAnalyticsObject.prototype.getList=getList;
amznAnalyticsObject.prototype.addToSet=addToSet;
amznAnalyticsObject.prototype.getSet=getSet;

window.amznAnalytics = new amznAnalyticsObject();