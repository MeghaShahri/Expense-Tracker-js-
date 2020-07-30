var budgetController=(function(){
//This is Function Constructor

    var Expense=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value,
        this.percentage=-1; //Initially not defined so -1

    }

    Expense.prototype.calcPercentage=function(totalIncome){

        if(totalIncome>0){
            this.percentage=Math.round((this.value/totalIncome)*100) ;
        }else{
            this.percentage=-1;
        }

    };

    Expense.prototype.getPercentage=function(){
        return this.percentage;

    };

    var Income=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;

    }

    var calculateTotal=function(type){
        var sum=0;
        data.allItems[type].forEach(function(cur){
            sum=sum+cur.value;

        });
        data.totals[type]=sum;
    }
     
    var data={
        allItems:{
            exp:[],
            inc:[]
        },
        totals:{
            exp:0,
            inc:0
        },
        budget:0,
        percentage:-1  //-1 for,if we do not have income n expenses
    };

    return {
    addItems:function(type,desc,value){

        var newItem,ID;
        

        // Our ID should be id of the last elemnt in out array +1
        // Thus below line means ,if type=exp
        // exp.length-1 means element at posn length-1 i.e last elemnt .id its id +1
        
        //create ID
        if (data.allItems[type].length>0){
            ID=data.allItems[type][data.allItems[type].length-1].id+1;
        }else{
            ID=0;

        }

        //create new item based on its type
        if (type==='exp'){
        newItem=new Expense(ID,desc,value);
        }else if (type==='inc'){
            newItem=new Income(ID,desc,value);
        }

        //push the new item into its respective array
        data.allItems[type].push(newItem);

        // above stmnt means inside data object in there allitems we have two arrays named same as type
        // so if type is inc push(append) allItems[inc] i.e in exp array our newitem 
        
        //return the new item so tht can be displayed on screen
        return newItem;
        

    },


    //since we determine our element by inc-3 so we need type n id 
    //suppose array is [1 4 6 8] and id=4 means element with index=1 is to  be deleted 
    deleteItem:function(type, id) {
        var ids,index;

        //map is same as forEach but only differenec is map returns  array with function applied on each element of the passed 
        //array whereas forEach does changes in the original array
        //map can accept current(element),index and array.
        //so here,whenever this func is called an element has been clicked and its id is stored in ids array
        
        ids=data.allItems[type].map(function(current){
           
            //current element's id
            return current.id;

        });

        //index of the element we want to deleted 
        //ids array consist of the id of the elements we wanna delete

        index=ids.indexOf(id);

        if (index !== -1) {

            //splice is remove+slice meaning it will remove the element and it takes two arguments;starting position and 
            //no of elements to be deleted;so here index and we want to delete only that element so no is 1

            data.allItems[type].splice(index,1);

        }

    },




    calculateBudget:function(){

            //calculate total income & expense

            calculateTotal('inc');
            calculateTotal('exp');

            //calculate total budget:income-expenses

            data.budget=data.totals.inc-data.totals.exp;

            //calculate percentage of income that we spent in our expenses.
            //if income is 0 and expense is something then percentage would be something/0=infinity.not possible so if else
            if(data.totals.inc>0){
            data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);

            //ex:expense=100 income=200 means spent 50% of income,exp/inc=100/200=0.5 and 0.5 and 100=50%
            //round is to get only integer part if exp/inc=300/200 we'll get 0.3333 so takinhg only 33%
            //above is total expenses % of total income

            }else{
                data.percentage=-1
            }

        },

    calculatePercentages:function(){
            //exp1=20 exp2=10 exp3=50 total inc=100
            //exp1 %=20/100=20%  exp2=10/100=10%...


            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);

            });

        },

    getPercentages:function(){
            var allperc=data.allItems.exp.map(function(cur){
                return cur.getPercentage();

            });
            return allperc; //so allperc is array of all expenses percentages and this will be called as no of expenses
        },

    getBudget:function(){
            return{
                budget:data.budget,
                totalInc:data.totals.inc,
                totalExp:data.totals.exp,
                percentage:data.percentage

            };

        },

    testing:function(){
        console.log(data);
    }
};




})();

var UIController=(function(){

    // since we need to use below values again na gain in querySelector we made an object of it and since
    // we need addbtn in other controller we have to make  getDOMstrings so that we can make these public
 
    var DOMstrings={
     inputType:'.add__type',
     inputDescription:'.add__description',
     inputValue:'.add__value',
     inputBtn:'.add__btn',

     incomeContainer:'.income__list',
     expenseContainer:'.expenses__list',

     budgetLabel:'.budget__value',
     incomeLabel:'.budget__income--value',
     expenseLabel:'.budget__expenses--value',
     percentageLabel:'.budget__expenses--percentage',

     container:'.container',

     expensesPercLabel:'.item__percentage',

     dateLabel:'.budget__title--month'

     
 };

 
 var formatNumber=function(num,type){
    var numSplit,beforedec,afterdec,type;

    //following rules to display no on UI
    // + or - before number
    //exactly 2 decimal points
    //comma separating the thousands

    //eg: 2567.6778--> +2,567.67
    //2000-->+2,000.00

    //here not creating new variables but overriding num only

    num=Math.abs(num);       //removing sign

    //below isn't method of Math,but it is a method of Number Datatype which will give us 2 nos after decimal
    num=num.toFixed(2);

    numSplit=num.split('.');
    beforedec=numSplit[0]
    if(beforedec.length>3){

        //if input=2310.47 length of beforedec(2310)=4 ,length-3=1 so comma after 1st no i.e 2,310 
        //if input=25310.47 length of beforedec(25310)=5 ,length-3=2 so comma after 2nd no i.e 25,310 
        
        beforedec=beforedec.substr(0,beforedec.length-3) + ',' + beforedec.substr(beforedec.length-3,3);
    }


    afterdec=numSplit[1]

    return (type==='exp' ? '-' : '+') +' '+ beforedec +'.'+ afterdec;


};



//writing here so that can be reused in displayPerc and changeType
 //here list is NodeList a separate func for reusability
  nodeListForEach:(function(list,callback){
    console.log(list)
    for(var i =0 ; i <list.length ; i++){
        console.log(list[i]);
        callback(list[i],i);
                                 //callback func needs current and index so list[i] and i
    }

});


// this below 1st return is bcz of IIFE cz we want to call from other scope

return{

    // getInput will return all three values,and since we wanted to return 3 values at a time
    // we have wrote another eturn i.e we are returning an object otherwise creating var for each 
    // can return 1 value and thus type:(this colon and not =) also after .value (no semicolon but comma)
    
    getInput:function(){
        return{
            type:document.querySelector(DOMstrings.inputType).value,  //type will be inc or exp(refer html,+ , -,since 'select' is used)
            description:document.querySelector(DOMstrings.inputDescription).value,
            value:parseFloat(document.querySelector(DOMstrings.inputValue).value)
    };
},

   addListItem:function(obj,type){
    var html,element,newhtml;
    //below line is the html code taken from our html File(income-0,expense-0) and put it in single quotes(no double cz inside we have double) and removed spaces
  
    if (type==='inc'){
        element=DOMstrings.incomeContainer;

    html='<div class="item clearfix" id="inc-%id% "><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
   
    }else if(type==='exp'){
        element=DOMstrings.expenseContainer;

    html='<div class="item clearfix" id="exp-%id% "> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
 }


     newhtml=html.replace('%id%',obj.id);
     newhtml=newhtml.replace('%description%',obj.description);

     //calling formatNumber since whenever an item is added wewant to display it as in format func
     newhtml=newhtml.replace('%value%',formatNumber(obj.value,type));

    // element is either expense list or incomelist depends on type
    // insertAdjacentHTML is  insert json html method in our ui
    // beforeend is the posn which means last child i.e child of container expenselist of incomelist
    //(we have four such positions)
    // and the last onemptied(append like) newhtml is the content that will be added
     
    
    document.querySelector(element).insertAdjacentHTML('beforeend',newhtml);


   },

   deleteListItem:function(selectorid){
       var el=document.getElementById(selectorid);
       el.parentNode.removeChild(el);

   },

    clearFields:function(){
        var fields,fieldsArr;

        //queryselector to select more than 1 element
        fields=document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

        //queryselector returns list thus converting into array using slice(copy array) method
        fieldsArr=Array.prototype.slice.call(fields);

        //forEach is like map of python it will apply this method to each element of array
        //for each takes 3 args,current(current element),index(current index),original array(here it is fieldsArr)
        fieldsArr.forEach(function(current,index,array){

            //value="" means empty means clearing the field
            current.value="";
            
        });
        //to bring back the focus(highlight the element to write) to 1st element i.e description
        fieldsArr[0].focus();
    },

    displayBudget:function(obj){
        var type;

        //we don't know total budget will be positive or neg so we'll check that by ternary operator i.e totalBudget
        //whereas totalInc is inc type so that will be + and same with totalExp so directly sending type inc n exp

        obj.budget >0 ? type='inc' : type='exp';
        document.querySelector(DOMstrings.budgetLabel).textContent=formatNumber(obj.budget,type);
        document.querySelector(DOMstrings.incomeLabel).textContent=formatNumber(obj.totalInc,'inc');
        document.querySelector(DOMstrings.expenseLabel).textContent=formatNumber(obj.totalExp,'exp');

        if(obj.percentage>0){
        document.querySelector(DOMstrings.percentageLabel).textContent=obj.percentage + '%';
    }
        else{
            document.querySelector(DOMstrings.percentageLabel).textContent="--";

        }

    },
    //this argument percentages is the array
    displayPercentages:function(percentages){
        // in ui we have % in each expense so need to select all those,so querySelectorAll & loop over each item
        //and write its respective %
        var fields;
        fields=document.querySelectorAll(DOMstrings.expensesPercLabel);
        var nodeListForEach=function(list,callback){
            console.log(list)
            for(var i =0 ; i <list.length ; i++){
                console.log(list[i]);
                callback(list[i],i);
                                         //callback func needs current and index so list[i] and i
            }
        
        }
        
        nodeListForEach(fields,function(current,index){
            //so here for 1st elemet we want 1st % similary for everyone
            //prcentages array has all %'s so current.textcontent will replace the content of that element
            //with the percentage in the  array at that posn
            if(percentages[index]>0){
                console.log(current,index);
                current.textContent=percentages[index]+'%';
            }else{
                current.textContent="---";
            }

        });

    },

    displayDate:function(){

        var now,year,month,months;
        months=['Januaury','Febrary','March','April','May','June','July','August','September','October','November','December'];

        //creating object of Date Constructor
        now=new Date();

        //Dateconstructor has methods to get date month year hours minutes secs using some below
        month=now.getMonth();
        year=now.getFullYear();

        //getMonth it returns  zero based array i. if month is jan it will return 0 thus creating an array
        document.querySelector(DOMstrings.dateLabel).textContent=months[month] + ' ' +year;
        


    },

    changeType:function(){

        //when a user enters income then the boxes border should be blue which it alreadys is
        //but when user enters expense still the box borders are blue but we want it to be red
        //and which boxes we want,they are inputType,desc and value boxes
        
        //so querySelectorAll cz wanna sleect more than one.Also in css file we have .red and redfocus clss
        //which we want to apply and we can apply it on string.Thus below we are creating a string hence ','+

        //and remember querySelectorAll returns NodeList hence can't use forEach 

        var fields=document.querySelectorAll(
            DOMstrings.inputType + ',' +
            DOMstrings.inputDescription + ',' +
            DOMstrings.inputValue
        );
        document.querySelector(DOMstrings.inputType).classList.toggle('red-focus');
        document.querySelector(DOMstrings.inputDescription).classList.toggle('red-focus');
        document.querySelector(DOMstrings.inputValue).classList.toggle('red-focus');

       
          //below one wasn't working so done above method by seleceting each
            
        //no need of index only cur,current element 
        // nodeListForEach=(fields,function(cur,i) {
        //     console.log(cur,i);
        //     if(DOMstrings.inputType=='exp'){
        //     cur.classList.toggle('red');
        //     }

        // });
        document.querySelector(DOMstrings.inputBtn).classList.toggle('red');

    },


    getDOMstrings:function(){
        return DOMstrings;

    }
};

})();

// controller will connect the above both thus sending them as args
//controller will tell the above 2 controllers what to do
var controller=(function(budgetCtrl,UICtrl){
    var setupEventListeners=function(){
        var DOM =UICtrl.getDOMstrings();
       
       document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
         
   
       // We are adding event listener to keypress if.e if any key on keyboard is pressed
       // an event will occur thus accepting an argu event can print n see what event occured
       //keycode 13 is of enter key so we want to do something when enter is clicked
       //and that something is eaxct same which we want to do with add__btn so will put that cmmn thing into a func
        document.addEventListener('keypress',function(event){
           if (event.keyCode===13 || event.which===13){
               ctrlAddItem();
   
           }
   
       });
   
       //Event Delegation here.Income & Expense parent is container so event listener here.
       document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);

       document.querySelector(DOM.inputType).addEventListener('change',UICtrl.changeType);
   };




    // add__btn is the right symbol of ui when we add desc and click on that btn
    //as soon as add__btn or enter key  is clicked following activities should be done:
    // 1.Get  input Data
    // 2.add item to budgetController
    // 3.add item to UI
    // 4.calculate budget
    // 5.display budget to Ui

    var updateBudget=function(){
        //do following using this func
        //1.Calculate Budget
        budgetCtrl.calculateBudget();

        //2.Return Budget
        var budget=budgetCtrl.getBudget();

        //3.Display Budget to UI
        UICtrl.displayBudget(budget);

    };

    //we need below func whenever income or expense is added or deleted
    var updatePercentages=function(){
        //1.Calculate percentages
        budgetCtrl.calculatePercentages();

        //2.Read % from budget controller
        var percentages=budgetCtrl.getPercentages();

        //3.Update UI
        console.log("per");
        console.log(percentages);

        UICtrl.displayPercentages(percentages); //this percentages which we r passing got from budgetctrl above

    };

    

    var ctrlAddItem=function(){

        var input,newitem;

        input =UICtrl.getInput();
        console.log(input);

        // the variable 'input' has all what we have to pass to budgetController

        //all of the below should happen if user puts valid inputs i.e
        //desc can't be empty value can't be empty and value has to be >0
        //to check that value is not empty and is a valid number we use isNan which means (is Not a Number) so
        //it returns true if value is not a no. which we do not want we want opposite of it so !(not equal to)
        //so now it will return true if value is a no and return false if value is not a no(NaN)
        
        if(input.description!="" && !isNaN(input.value) && input.value>0){
        newitem=budgetCtrl.addItems(input.type,input.description,input.value);

        UICtrl.addListItem(newitem,input.type);

        UICtrl.clearFields();

        //it is called each time an item is added
        updateBudget();

        updatePercentages();

        }

        console.log("add_btn or enter is clicked");
    };

    var ctrlDeleteItem=function(event){
        var itemID,splitID,type,ID;

        // to know from where event bubbled i.e target element
        //we want to delete if cross is clicked which is i element i.e the icon
        //so we don't want to delete cross,but on click of it we want its content to be deleted which are
        //parents of this cross(html) so we need to do event traversing.so if we do target.parentNode we reach one step up
        //so go on doing until to reach the parent which u want to delete


        //below is the html we are looking,cross is target i.e i element 
        // i-parent:button(item__delete--btn) its parent item__delete its parent  right clearfix its parent item clearfix (thus 4 .parentNode)
        //so we wanted item clearfix which contans the entire row we wanna delete so now its id
      
       
        // <div class="item clearfix" id="income-0">
        //                     <div class="item__description">Salary</div>
        //                     <div class="right clearfix">
        //                         <div class="item__value">+ 2,100.00</div>
        //                         <div class="item__delete">
        //                             <button class="item__delete--btn">
        //                                 <i class="ion-ios-close-outline"></i>
        //                             </button>
        //                         </div>
        //                     </div>
        //                 </div>
        
       
        console.log(event.target.parentNode.parentNode.parentNode.parentNode.id);
        itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;

        //below won't happen if id doesn't exist
        if(itemID){

            //id's will be inc-0,inc-1.. exp-0,exp-1.. so need to split it as exp and no so type and no i.e using - (same as python)
           
            splitID=itemID.split('-');
            type=splitID[0];            //inc or exp
            ID=parseInt(splitID[1]);              //the no


            //1.Delete from data structure
            budgetCtrl.deleteItem(type,ID);

            //2.Delete from UI
            UICtrl.deleteListItem(itemID);

            //3.Update budget.(We already haded this func)
            updateBudget();

            updatePercentages();

        }

    };
    

    return{
        init:function(){

            UICtrl.displayDate();
            UICtrl.displayBudget({
                budget:0,
                totalInc:0,
                totalExp:0,
                percentage:-1


            });
            setupEventListeners();
        }
    };

})(budgetController,UIController);
controller.init();