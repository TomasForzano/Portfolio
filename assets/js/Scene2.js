class Scene2 extends Phaser.Scene {
  constructor() {
    super("juego");
  }

  create() {
    this.add.image(400, 300, "sky");

    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, "ground").setScale(2).refreshBody();

    platforms.create(600, 400, "ground");
    platforms.create(50, 300, "ground");
    platforms.create(750, 250, "ground");
    platforms.create(-80, 150, "ground");

    player = this.physics.add.sprite(100, 450, "dude");

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    if ((cursors = !undefined)) {
      cursors = this.input.keyboard.createCursorKeys();
    }

    stars = this.physics.add.group({
      key: "star",
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    stars.children.iterate(function (child) {

      child.setBounceY(Phaser.Math.FloatBetween(0.6, 0.9));

      child.x += Phaser.Math.FloatBetween(-15, 15);

      patron = Phaser.Math.FloatBetween(0, 1);
      if (patron < 0.4) {
        child.score = 15;
        child.extratime = 10;
        child.setTexture("star2");
      } else {
        child.score = 10;
        child.extratime = 0;
      }
    });

    bombs = this.physics.add.group();

    scoreText = this.add.text(16, 16, "Puntuación: 0", {
      fontSize: "28px",
      color: "#ffffff",
      fontFamily: "Century Gothic",
    });

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);


    this.physics.add.overlap(player, stars, this.collectStar, null, this);

    this.physics.add.collider(player, bombs, this.hitBomb, null, this);

    score = 0;
    gameOver = false;

    initialTime = 30;
    timedEvent = this.time.addEvent({
      delay: 1000,
      callback: this.onSecond,
      callbackScope: this,
      loop: true,
    });
    timeText = this.add.text(500, 16, "Countdown: 30", { fontSize: "28px", color: "#ffffff",
    fontFamily: "Century Gothic",});

    this.jumps = 0;

    player.setInteractive();
    this.input.setDraggable(player);

    this.input.on("dragstart", function (pointer, gameObject) {
      gameObject.setTint(0x0000ff);
    });

    this.input.on("drag", function (pointer, gameObject, dragX, dragY) {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on("dragend", function (pointer, gameObject) {
      gameObject.clearTint();

    });

    dudeStateText = this.add.text(16, 550, "", {
      fontSize: "32px",
      fontFamily: "Century Gothic",
      color: "#ffffff",
    });
    player.on("pointerover", function () {
      dudeStateText.setText("Puntero en el jugador");
    });
    player.on("pointerout", function () {
      dudeStateText.setText("Puntero fuera del Jugador");
    });
  }

  update() {
    if (gameOver) {
      return;
    }

    if (cursors.left.isDown) {
      player.setVelocityX(-160);

      player.anims.play("left", true);
    } else if (cursors.right.isDown) {
      player.setVelocityX(160);

      player.anims.play("right", true);
    } else {
      player.setVelocityX(0);

      player.anims.play("turn");
    }

    if (cursors.up.isDown && player.body.touching.down) {
      player.setVelocityY(-330);
    }
  }

  collectStar(player, star) {
    star.disableBody(true, true);

    score += star.score; 
    scoreText.setText("Score: " + score);

    initialTime += star.extratime;
    timeText.setText("Countdown: " + initialTime);
    

    if (stars.countActive(true) === 0) {
      stars.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });

      var x =
        player.x < 400
          ? Phaser.Math.Between(400, 800)
          : Phaser.Math.Between(0, 400);

      var bomb = bombs.create(x, 16, "bomb");
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
      bomb.allowGravity = false;

      initialTime = 30;
    }
  }

  hitBomb(player, bomb) {
    this.gameOver();
  }

  gameOver() {
    gameOver = true;
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play("turn");

    var gameOverButton = this.add
      .text(0, 0, "Game Over", {
        fontFamily: "Century Gothic",
        fontSize: 50,
        color: "#ffffff",
      })
      .setInteractive()
      .on("pointerdown", () => this.scene.start("creditos"));

    Phaser.Display.Align.In.Center(gameOverButton, this.add.zone(400, 300));

    timedEvent.paused = true;
  }

  onSecond() {
    initialTime = initialTime - 1;
    timeText.setText("Countdown: " + initialTime);
    if (initialTime == 0) {
      this.gameOver();
    }
  }
}
