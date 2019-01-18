bootState = {
  preload: function() {
    game.load.image("progressBar", "assets/sprites/preloader.png"),
    game.load.image("progressBarBg", "assets/sprites/preloaderbg.png"),
    game.load.image("loader", "assets/sprites/loader.png")

  },
  create: function() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.state.start("load")
  }
},

loadState = {
    preload: function() {
      var a = game.add.image(game.world.centerX, 150, "loader");
      a.anchor.setTo(.5, .5);
      var b = game.add.sprite(game.world.centerX, 200, "progressBarBg");
      b.anchor.setTo(.5, .5);
      var c = game.add.sprite(game.world.centerX, 200, "progressBar");
      c.anchor.setTo(.5, .5);
      game.load.setPreloadSprite(c);

      game.load.image("line","assets/images/line.png");
      game.load.image("car1","assets/images/car1.png");
      game.load.image("car2","assets/images/car2.png");
      game.load.image("car3","assets/images/car3.png");

    },
    create: function() {
      game.state.start("play")
    }
  },

playState = {
  create: function() {
    game.stage.backgroundColor = "#333333";
    this.lineX = 320/4;
    this.vSpace = 640/8;
    for(var i = 0; i < 10; i++)
      for(var j = 1; j < 4; j++)
        {
          var line = game.add.image(this.lineX*j,this.vSpace*i,"line");
          line.anchor.setTo(0.5);
        }
    game.time.events.loop(Phaser.Timer.SECOND, this.addCar, this);
  },
  update: function(){
  },
  addCar: function(){
    var cars = ["car1","car2","car3"];

    var c = Math.floor(Math.random()*3);
    var lane = Math.floor(Math.random()*4);

    var car = game.add.image((320/8)+(80*lane), 10, cars[c]);
    car.anchor.setTo(0.5);
    car.scale.set(0.5);
    var tween = game.add.tween(car).to( { y: 600}, 3000, Phaser.Easing.Linear.None, true);
    tween.onComplete.add(()=>{car.destroy();}, this);
  }
}
game = new Phaser.Game(320, 640);

game.state.add("boot", bootState),
game.state.add("load", loadState),
game.state.add("play", playState),

game.state.start("boot");
