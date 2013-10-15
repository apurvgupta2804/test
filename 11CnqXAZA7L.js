function publishCartAddEvent(){
    if(typeof(s_account) !=  'undefined'){
        if(s != undefined) {
            if(s.clearVars != undefined) {
                s.clearVars();
            }
        } else {
            s = s_gi(s_account);
        }
        var s = s_gi(s_account);
        s.linkTrackVars = 'events,products,eVar16';
        s.linkTrackEvents = 'scAdd,scOpen';
        var events = 'scAdd';
        if(null != amznAnalytics.getElement('cartOpen')){
            events += ',scOpen';
        }
        s.events = events;
        s.eVar16 = amznAnalytics.getElement('cartAddMethod');
        //Produce the Products string using our Analytics Platform
        var productsTemp = '';
        var cartAdds = amznAnalytics.getList("cartAdds");
        var product,key;
        for(key in cartAdds){
            if('' != productsTemp){
                productsTemp += ",";
            }
            product = cartAdds[key];
            if (null != amznAnalytics.getElement("productView") && "" != amznAnalytics.getElement("productView")["SKU"]) {
                productsTemp += ";" + amznAnalytics.getElement("productView")["SKU"] + ";;;;evar18=" + product['SKU'];
            }
            else if (null != amznAnalytics.getList("collectionChildren")) {
                var collectionChildSKU = "";
                
                //looking for the SKU in collection children mapping
                for (i = 0; i < amznAnalytics.getList("collectionChildren").length; i++) {
                    if (amznAnalytics.getList("collectionChildren")[i]["cASIN"] == product['pASIN']) {
                        collectionChildSKU = amznAnalytics.getList("collectionChildren")[i]['SKU'];
                        break;
                    }
                }
                
                if ("" == collectionChildSKU) {
                    productsTemp += ";" + product['SKU'] + ";;;;evar18=" + product['SKU'];
                }
                else {
                    productsTemp += ";" + collectionChildSKU + ";;;;evar18=" + product['SKU'];
                }
            }
            else {
                productsTemp += ";" + product['SKU'] + ";;;;evar18=" + product['SKU'];
            }
        }
        s.products=productsTemp;
        s.tl(true,'o', 'Cart Add');
    }
    //Aggregate Reporting
    if(typeof(s_am_account) !=  'undefined'){
        s_am.clearVars();
        s_am.linkTrackVars = 'events,products,eVar16';
        s_am.linkTrackEvents = 'scAdd,scOpen';
        var events = 'scAdd';
        if(null != amznAnalytics.getElement('cartOpen')){
            events += ',scOpen';
        }
        s_am.events = events;
        s_am.eVar16 = amznAnalytics.getElement('cartAddMethod');
        //Produce the Products string using our Analytics Platform
        var productsTemp = '';
        var cartAdds = amznAnalytics.getList("cartAdds");
        var product,key;
        for(key in cartAdds){
            if('' != productsTemp){
                productsTemp += ",";
            }
            product = cartAdds[key];
            productsTemp += ";" + product['cASIN'];
        }
        s_am.products=productsTemp;
        s_am.tl(true,'o', 'Cart Add');
    }
}
