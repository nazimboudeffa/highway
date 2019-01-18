var player;
var cars;
var cursors;
var ambulance, urban;

bootState = {
  preload: function() {
    game.load.image("progressBar", "assets/sprites/preloader.png");
    game.load.image("progressBarBg", "assets/sprites/preloaderbg.png");
    game.load.image("loader", "assets/sprites/loader.png");

  },
  create: function() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.state.start("load");
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

      game.load.image("player","assets/images/sprite.png");

      game.load.image("dead", "assets/images/gameover.png");

      game.load.audio("ambulance", "assets/audio/ambulance.mp3");
      game.load.audio("urban", "assets/audio/urban.mp3");

    },
    create: function() {
      game.state.start("play");
    }
  },
playState = {
  create: function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = "#333333";
    game.world.setBounds(0, 0, 320, 640);

    this.lineX = 320/4;
    this.vSpace = 640/8;

    for(var i = 0; i < 10; i++)
      for(var j = 1; j < 4; j++){
          var line = game.add.image(this.lineX * j, this.vSpace * i, "line");
          line.anchor.setTo(0.5);
    };

    player = game.add.sprite((320/2) - 40 , 640/2, "player");
    player.anchor.setTo(0.5);

    game.physics.arcade.enable(player);
    player.body.enable = true;
    player.body.collideWorldBounds = true;

    cars = game.add.group();
    cars.enableBody = true;
    cars.physicsBodyType = Phaser.Physics.ARCADE;

    game.time.events.loop(Phaser.Timer.SECOND, this.addCar, this);


    urban = game.add.audio("urban");
    urban.loop = true;
    urban.play();

    cursors = game.input.keyboard.createCursorKeys();
  },
  update: function(){
    //overlap works only with add.sprite not add.image
    game.physics.arcade.overlap(player, cars, this.crash, null, this);

    if (cursors.right.isDown)
    {
      this.movePlayer("right");
    }

    else if (cursors.left.isDown)
    {
      this.movePlayer("left");
    }

    else if (cursors.up.isDown)
    {
      this.movePlayer("up");
    }

    else if (cursors.down.isDown)
    {
      this.movePlayer("down");
    }
  },
  crash: function(){
    game.state.start("game-over");
  },
  addCar: function(){
    var models = ["car1","car2","car3"];

    var model = Math.floor(Math.random()*3);
    var lane = Math.floor(Math.random()*4);

    var car = game.add.sprite((320/8)+(80*lane), 10, models[model]);
    car.anchor.setTo(0.5);
    car.scale.set(0.5);

    cars.add(car);

    var tween = game.add.tween(car).to( { y: 600}, 3000, Phaser.Easing.Linear.None, true);
    tween.onComplete.add(()=>{car.destroy();}, this);
  },
  movePlayer: function(direction) {
    switch (direction){
      case "right":
        game.add.tween(player).to({x: player.x + 80, y: player.y}, 250, Phaser.Easing.Quadratic.InOut, true);
        break;
      case "left":
        game.add.tween(player).to({x: player.x - 80, y: player.y}, 250, Phaser.Easing.Quadratic.InOut, true);
        break;
      case "up":
        game.add.tween(player).to({x: player.x, y: player.y - 80}, 250, Phaser.Easing.Quadratic.InOut, true);
        break;
      case "down":
        game.add.tween(player).to({x: player.x, y: player.y + 80}, 250, Phaser.Easing.Quadratic.InOut, true);
        break;
    }
  }
},
gameOverState = {
  create: function(){
    urban.stop();
    ambulance = game.add.audio("ambulance");
    ambulance.play();
    game.add.image(0,0,"dead");
  }
}
game = new Phaser.Game(320, 640);

game.state.add("boot", bootState),
game.state.add("load", loadState),
game.state.add("play", playState),
game.state.add("game-over", gameOverState),

game.state.start("boot");
