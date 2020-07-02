class Scene3 extends Phaser.Scene {
    constructor() {
      super("creditos");
    }

    preload ()
    {
      this.load.image('logo2D', '../assets/images/logo2D.png');   
    }
    
    create() {
      this.add.image(400, 300, 'sky');
      this.add.image(400, 568, 'ground').setScale(2)
      this.add.image(400, 100, 'logo2D');


      var puntajefinal = this.add.text(0, 0, 'Score: ' + score,  { fontFamily: '"Century Gothic"', fontSize: 70, color: '#ffffff'});
      Phaser.Display.Align.In.Center(puntajefinal, this.add.zone(400, 300, 800, 600));



      var restartButton = this.add.text(700, 500, 'Restart', { fontFamily: 'Century Gothic', fontSize: 20, color: '#ffffff' })
      .setInteractive()
      .on('pointerdown', () => this.reiniciar() );
    }

    reiniciar() {
      this.scene.start('juego');
    }

    
}
  