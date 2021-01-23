var b, input, heading
var db, gs=0, pc=0, greet, name1,reset
var c1,c2, ap
var cars=[],link=0

function preload(){
car1=loadImage("car1.png")
car2=loadImage("car3.png")
track=loadImage("track.jpg")

}




function setup() {
  createCanvas(displayWidth,displayHeight-150)

  b=createButton("Submit")
  b.position(650,300)
  b.mousePressed(logic)

  input=createInput().attribute("placeholder", "Enter your username")
  input.position(600,230)

  heading=createElement("h1")
  heading.html("Horizon Run San Andreas")
  heading.position(500,20)

  reset=createButton("RESET")
  reset.position(500,200)
  reset.mousePressed(res)

  db=firebase.database()

  db.ref("gamestate").on("value", function(data){
    gs=data.val()
  })

  db.ref("playercount").on("value", function(data){
    pc=data.val()
  })

 
  
  c1=createSprite(200,200,20,20)
  c2=createSprite(300,200,20,20)
  c1.addImage(car1)
  c2.addImage(car2)
cars=[c1,c2]

}

function draw() {
  background(255,255,255); 
  
  
  if(pc===2){
    db.ref("/").update({
      gamestate:1
    })
  }
  if(gs===1 && ap===undefined){
    db.ref("players").on("value", function(data){
      ap=data.val()
    })
  }
  if(gs===1){
  greet.hide()
  background(74,74,74) 
  image(track,0,-displayHeight,displayWidth,displayWidth*-5)
  heading.hide()
  var index=0
  var x=530
   
  for(var i in ap){
      //cars[0].x=300
      cars[index].x=x
      x=x+482
      
      cars[index].y= ap[i].y
      if(index===link-1){
      textSize(20)
      fill("black")
      stroke("grey")
      text(input.value(),cars[index].x-20,cars[index].y+70)  
      camera.position.y=cars[index].y
    }
      index=index+1
    }
    
  
  
  
    if(keyDown("UP_ARROW")){
cars[link-1].y=cars[link-1].y-20
db.ref("players/player"+link).update({
y:cars[link-1].y


})
  }
  if(cars[link-1].y===-8325){
  alert("you won")
  gs=2
  db.ref("/").update({gamestate:2})
  }
  drawSprites();
  }
if(gs===2){
cars[link-1].y=-8325
}


}

function logic(){
  b.hide()
  input.hide()

  name1=input.value()
  greet=createElement("h1")
  greet.html("Welcome! "+name1 +" Wait for other player to join")
  
  pc++
  link=pc
  db.ref("/").update({
    playercount:pc
  })
  

  db.ref("players/player"+pc).set({
    y:-1045
  })
}

function res(){
db.ref("/").update({
  gamestate:0,
  playercount:0
})

db.ref("players").remove()
}