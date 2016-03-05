
var game = (function (){

  var instructionText = document.getElementById("inst-text");
  var viewport = document.getElementById("game");
  var cups = [document.getElementById("cup1"),
              document.getElementById("cup2"),
              document.getElementById("cup3")];
  var cupWidth = cups[0].width;
  var aaron = document.getElementById("aaron");

  var gameCounter = 0;
  var positions = [0, 0, 0];
  var time = 0;
  var increment = 1;
  var timeLimit = 16;

  var resetGame = function() {
    instructionText.onclick = null;
    setText("Play a game with HHX!!")
    var i;
    for(i=0; i<3; i++){
      positions[i] = cupWidth * i;
    }

    for(i=0; i<3; i++){
      cups[i].style.position = "absolute";
      cups[i].style.left = positions[i].toString() + "px";
      cups[i].style.top = "0px";
      cups[i].style.transition = "left 0.3s, top 0.8s";
      cups[i].onclick = null;
    }

    aaron.style.position = "absolute";
    aaron.style.left = positions[1].toString() + "px";
    aaron.src = "img/aa_s.png"
    document.getElementById('hhx').src = "img/hh4_s.png";

    time = 3;
    increment = 1;
    timeLimit = 16;

  }

  var getShuffleFunc = function (cnt) {
    var validTransformations = [[1,2], [0,2],[0,1]];

    return function () {
      var count = cnt;
      (function swapCups () {
        var swapCup_i = Math.floor(Math.random() * 3);
        var destCup_i = Math.floor(Math.random() * 2);

        var tmp = cups[swapCup_i].style.left;
        cups[swapCup_i].style.left = cups[validTransformations[swapCup_i][destCup_i]].style.left;
        cups[validTransformations[swapCup_i][destCup_i]].style.left = tmp;

        if (count > 0){
          count--;
          setTimeout(swapCups, 333);
        }
      }())
    }
  }

  var setText = function (text) {
    instructionText.innerText = text;
  }

  var makeVisible = function (obj) {
    obj.style.visibility = "";
  }

  var makeInvisible = function (obj) {
    obj.style.visibility = "hidden";
  }

  var setVertPos = function (obj, height) {
    obj.style.top = (-1*height).toString() +"px";
  }

  var set = function (property, value) {
    property.onclick = value;
  }

  var replay = function() {
      setText("Click to play again!");
      gameCounter++;
      instructionText.onclick = playGame;
  }

  var chooseCup = function(){
    cups[0].onclick = null;
    cups[1].onclick = null;
    cups[2].onclick = null;

    if ((gameCounter < 3) || (Math.random() < 0.5)){
      var hit_cup = Math.floor(Math.random() * 3);
      aaron.style.left = positions[hit_cup];
      makeVisible(aaron);
      setVertPos(this, 400);
      if(parseInt(this.style.left) === parseInt(aaron.style.left)){
        setText("You win!");
        document.getElementById('hhx').src = "img/hh2_s.png";
      }else {
        setText("Nope. HHX wins!");
        document.getElementById('hhx').src = "img/hh1_s.png";
      }
    }else{
      aaron.src = "img/koala_s.png"
      aaron.style.left = this.style.left;
      makeVisible(aaron);
      setVertPos(this, 400);
      setText("You found a Koala! What a majestic beast!");
      document.getElementById('hhx').src = "img/hh3_s.png";
    }

    setTimeout(replay, 2000);
  }

  var animSchedule = {
      "5": [ [setText, ["Try to find the AA-ron!"]], [makeVisible, [aaron]], [setVertPos, [cups[1], 400]]],
      "7": [ [setVertPos, [cups[1], 0]] ],
      "9": [ [setText, ["Watch Closely!"]], [makeInvisible, [aaron]] ],
      "10": [ [getShuffleFunc(15), []] ],
      "15": [ [setText, ["Where did the AA-ron go???"]], [set, [cups[0], chooseCup]], [set, [cups[1], chooseCup]], [set, [cups[2], chooseCup]]]
  }

  var animFunc = function(){
    var currentAnimItems = animSchedule[time.toString()];
    if (currentAnimItems !== undefined){
        var i;
        for(i=0; i<currentAnimItems.length; i++){
          currentAnimItems[i][0].apply(null, currentAnimItems[i][1]);
        }
    }
    if(time <= timeLimit){
      time += increment;
      setTimeout(animFunc, increment * 1000);
    }
  }

  var playGame = function() {
    resetGame();
    animFunc();
  }

  return {
    start: function() {
      playGame();
    },

  }
}())

// var translate = function (obj, fromPos, toPos, length) {
//   var x = fromPos;
//   var frames = length * 24
//   var posStep = (toPos-fromPos) / frames;
//   var timeStep = (length *1000)/frames;
//
//   var currentFrame = 1;
//   var step = function (){
//     obj.style.left = (fromPos+(currentFrame * posStep)).toString() + "px";
//     if(currentFrame < frames){
//       currentFrame++;
//       setTimeout(step, timeStep)
//     }
//   }
//
//   setTimeout(step, timeStep)
// }

document.addEventListener('DOMContentLoaded', game.start);
