'use strict';

function printReceipt(input) {
  var barcodes=input;
  var billarray=calCount(barcodes);
  var sumarray=calSum(billarray);
  var totalprice=calTotalPrice(sumarray);
  var cutprice=calCutPrice(sumarray);
  printSheet(sumarray,totalprice,cutprice);

}

function calCount (barcodeArray) {
  var billArray=loadAllItems();
  for(var i in barcodeArray){
    barcodeArray[i] = barcodeArray[i].split("-");
  }
  for(var i in billArray)
    billArray[i].count=0;
  for(var i in barcodeArray){
    if(barcodeArray[i][1]==null){
      for(var j in billArray){
        if(billArray[j].barcode==barcodeArray[i][0])
          billArray[j].count++;
      }
    }else{
      for(var j in billArray){
        if(billArray[j].barcode==barcodeArray[i][0])
          billArray[j].count+=parseFloat(barcodeArray[i][1]);//1代表后面部分
      }
    }
  }
  for(var i=billArray.length-1;i>=0;i--){
    if(billArray[i].count==0){
     billArray.splice(i,1);
    }
  }
  return billArray;

}

function calSum(billArray) {
  var allPromotion=loadPromotions();
  for(var i in billArray)
    billArray[i].sum=0;

  for(var i in billArray){
    for(var j in allPromotion){
      for(var k in allPromotion[j].barcodes){
        if(billArray[i].barcode==allPromotion[j].barcodes[k]&&billArray[i].count>=2){
          switch (allPromotion[j].type){
            case 'BUY_TWO_GET_ONE_FREE':billArray[i].sum=billArray[i].price*(billArray[i].count-1);break;
          }
        }
      }
    }
  }
  for(var i in billArray){
    if(billArray[i].sum==0){
        billArray[i].sum=billArray[i].price*billArray[i].count;
    }
    }

  var sumArray=billArray;
  return sumArray;
}

function calTotalPrice(sumArray) {
  var totalPrice=0;
  for(var i in sumArray){
    totalPrice+=sumArray[i].sum;
  }
  return totalPrice;
}

function calCutPrice(billArray) {
  var cutPrice=0;
  var allPromotion=loadPromotions();
  for(var i in billArray){
    for(var j in allPromotion){
      for(var k in allPromotion[j].barcodes){
        if(billArray[i].barcode==allPromotion[j].barcodes[k]&&billArray[i].count>=2){
          switch (allPromotion[j].type){
            case 'BUY_TWO_GET_ONE_FREE':cutPrice+=billArray[i].price;break;
          }
        }
      }
    }
  }
  return cutPrice;
}

function printSheet(sumArray,totalPrice,cutPrice) {
  var str="***<没钱赚商店>收据***\n";
  for(var i in sumArray){
      str+="名称："+sumArray[i].name+"，数量："+sumArray[i].count+sumArray[i].unit+"，单价："+sumArray[i].price.toFixed(2)+"(元)"+"，小计："+sumArray[i].sum.toFixed(2)+"(元)\n";
  }
  str+="----------------------\n";
  str+="总计："+totalPrice.toFixed(2)+"(元)\n";
  str+="节省："+cutPrice.toFixed(2)+"(元)\n";
  str+="**********************";
  console.log(str);

}


