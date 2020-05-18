const functions = require('firebase-functions');
const admin = require("firebase-admin");
admin.initializeApp();
const realtimeDatabase = admin.database();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
exports.addToCart = functions.https.onCall(async (data, context) => {
    var price=0
    var uid = context.auth.uid;
    var dataa={};
    const datapassed = JSON.parse(data);
    const itemId = datapassed.itemId;
    const sizeCount = datapassed.sizeCount;
    console.log("before snapshot")
    console.log(context.auth)
    console.log(data)
    const snapshot = await admin.database()
        .ref("/public/items")
        .once("value")
        .then((snap) => {
              console.log(snap.val());
              var items=snap.val();
              dataa[itemId]=sizeCount;
              if(items!==undefined) {
                  Object.keys(items[itemId]["price"]).map((priceId)=>{
                      if(sizeCount[priceId]!==undefined){
                          price += parseInt(items[itemId]["price"][priceId]["price"])*(sizeCount[priceId])
                          console.log(items[itemId]["price"][priceId]["price"]);
                          console.log(sizeCount[priceId]);
                        }
                    })
                }
                return snap;
            })
    console.log("aftersnapshot")
    console.log(snapshot);
    const hello= await admin.database().ref("/users/"+uid+"/cart").once("value")
        .then((snap)=>{
            var updates = {};
            cart=snap.val();
            console.log("cart")
            console.log(snap.exists())
            if(snap.exists() && cart.items) {
                cart.price += price
                if(cart["items"][itemId]!==undefined) 
                Object.keys(sizeCount).map((key)=>{
                        cart["items"][itemId][key]+=sizeCount[key];
                })
                else{
                    cart["items"][itemId]=sizeCount;
                } 
                updates["/users/"+uid+"/cart"]=cart;
            }
            else {
                cart={}
                cart.items={}
                cart.items[itemId]=sizeCount
                cart.price = price
                     
                 //updates["/users/" + uid +"/cart"] = cart // { items: cart.items,price:price };
                            
                var key= admin.database().ref().child("/users/"+uid+"/cart").push().key;
                cart["cartId"]=key;
                //items=dataa;
                updates["/users/" + uid +"/cart"] = cart;
            }
            console.log(updates);
            admin.database().ref().update(updates);
            return "hi";
        })
        console.log("end")  
    return "succesful";
}
);

/**
 *  create new carId
 *  price : 0
 */

 
/*exports.filterItems=functions.https.onCall(async(data,context)=>{
    const snapshot= await admin
        .database()
        .ref("/public/items")
        .once("value")
        .then((snap)=>{
            console.log(snap.val())
            var items=snap.val();
            var res={};            console.log(" am in cloud");
            const datapassed=JSON.parse(data);
            const vendors=datapassed.vendors;
            const menucategories=datapassed.menucategories;
            var minimum=datapassed.minimum;
            var maximum=datapassed.maximum;
            console.log(menucategories);
            console.log(minimum);
            console.log(maximum);
            if(vendors|| menucategories|| minimum|| maximum )
                {

                     Object.keys(items).map((key)=>{
                        var items=item[key] ;                       
                        var  flag= true;
                        flag1=false;
                        if(flag && vendors)
                        {
                           for(vendor in vendors)
                            {
                                if(vendors[vendor]===item.vendor)
                                {

                                    flag1=true;
                                }

                            }                    
                            if(flag1===false)
                            {
                                flag=false;
                            }
                     }
                      
                     flag1=false;

                    if(flag && menucategories)
                    {
                    for(menuCategory in menucategories)
                        {
                                       if(item.menuCategories[menucategories[menuCategory]]!==undefined)
                                        {
                                        flag1=true;
                                        }
                        }
                        // lag1=false;

                        if(flag1===false){
                        flag=false;
                        }
                    }
                
                
                    flag1=false;
                    if(minimum!==null)
                    {
                    minimum=parseInt(minimum);
                    }
                    if(maximum!==null)
                    {
                    maximum=parseInt(maximum);
                    }
                    if(flag && (minimum || maximum) )
                    {
                         flag1 = false;
                         Object.keys(item.price).map((priceKey) => {
                        if (minimum && maximum) {
                        if (
                                minimum <= item.price[priceKey].price &&
                                maximum >= item.price[priceKey].price
                                ) {
                                                flag1 = true;
                                    }
                            } 
                            else {
                            if (
                                 (minimum && minimum <= item.price[priceKey].price) ||
                                (maximum && maximum >= item.price[priceKey].price)
                            ) {
                             flag1 = true;
                            }
                            }
                        });
                        if (flag1 === false) {
                            flag = false;
                        }
                    }
                    if (flag) res[key] = item;
                    
                    });

                }
                else {
                    //return Most Popular
                    //todo
                    res = items;
                  }
                return res;
            });
            return snapshot;

});*/
exports.filterItems=functions.https.onCall(async(data,context)=>{
    const snapshot= await admin
        .database()
        .ref("/public/items")
        .once("value")
        .then((snap)=>{
            console.log(snap.val())
            var items=snap.val();
            var res={};            console.log(" am in cloud");
            const datapassed=JSON.parse(data);
            const vendors=datapassed.vendors;
            const menucategories=datapassed.menucategories;
            var minimum=datapassed.minimum;
            var maximum=datapassed.maximum;
            console.log(menucategories);
            console.log(minimum);
            console.log(maximum);
            if(vendors|| menucategories|| minimum|| maximum )
                {

                     Object.keys(items).map((key)=>{
                        var item=items[key] ;                       
                        var  flag= true;
                        flag1=false;
                        if(flag && vendors)
                        {
                           for(vendor in vendors)
                            {
                                if(vendors[vendor]===item.vendor)
                                {

                                    flag1=true;
                                }

                            }                    
                            if(flag1===false)
                            {
                                flag=false;
                            }
                     }
                      
                     flag1=false;

                    if(flag && menucategories)
                    {
                    for(menuCategory in menucategories)
                        {
                                       if(item.menuCategories[menucategories[menuCategory]]!==undefined)
                                        {
                                        flag1=true;
                                        }
                        }
                        // lag1=false;

                        if(flag1===false){
                        flag=false;
                        }
                    }
                
                
                    flag1=false;
                    if(minimum!==null)
                    {
                    minimum=parseInt(minimum);
                    }
                    if(maximum!==null)
                    {
                    maximum=parseInt(maximum);
                    }
                    if(flag && (minimum || maximum) )
                    {
                         flag1 = false;
                         Object.keys(item.price).map((priceKey) => {
                        if (minimum && maximum) {
                        if (
                                minimum <= item.price[priceKey].price &&
                                maximum >= item.price[priceKey].price
                                ) {
                                                flag1 = true;
                                    }
                            } 
                            else {
                            if (
                                 (minimum && minimum <= item.price[priceKey].price) ||
                                (maximum && maximum >= item.price[priceKey].price)
                            ) {
                             flag1 = true;
                            }
                            }
                        });
                        if (flag1 === false) {
                            flag = false;
                        }
                    }
                    if (flag) res[key] = item;
                    
                    });

                }
                else {
                    //return Most Popular
                    //todo
                    res = items;
                  }
                return res;
            });
            return snapshot;

});


