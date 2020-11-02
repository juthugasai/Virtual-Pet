//Create variables here
var dog,happyDog,doghappy, database, foodS, foodStock;
var feed,addFood;
var fedTime,lastFed;
var foodObj;
var gameState,readState;
var garden,washroom,bedroom;

function preload()
{
  //load images here
  happyDog= loadImage("images/dogImg.png");
  doghappy= loadImage("images/dogImg1.png");
  garden=loadImage("images/Garden.png");
  washroom=loadImage("images/Wash Room.png");
  bedroom=loadImage("images/Bed Room.png");
  
}

function setup() {
  createCanvas(1000,400);


  database= firebase.database();
  foodObj = new Food();

    var foodStock=database.ref('Food');
    foodStock.on("value",readStock);
  dog= createSprite(800,200,150,150)
  dog.addImage(happyDog);
 dog.scale=0.2;

 feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
  
}


function draw() {  
  background(46, 139, 87) ;
 
  foodObj.display();

/*if(keyWentDown(UP_ARROW)){
  writeStock(foodS)
  dog.addImage(doghappy);
}
*/
fedTime=database.ref('FeedTime');
fedTime.on("value",function(data){
  lastFed=data.val();
});

fill(255,255,254);
textSize(15);
if(lastFed>=12){
  text("Last Feed : "+ lastFed%12 + " PM", 350,30);
 }else if(lastFed==0){
   text("Last Feed : 12 AM",350,30);
 }else{
   text("Last Feed : "+ lastFed + " AM", 350,30);
 }
 currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }
 if(gameState!="Hungry"){
  feed.hide();
  addFood.hide();
  dog.remove();
}else{
 feed.show();
 addFood.show();
 dog.addImage(happyDog);
}

  drawSprites();
  //add styles here

  

  
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

/*function writeStock(x){

  if(x<=0){
    x=0;
  }else{
    x=x-1
  }
database.ref('/').update({
Food:x
})

}*/

function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}