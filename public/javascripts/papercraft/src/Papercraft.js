// Load all required engine components
Engine.include("/rendercontexts/context.canvascontext.js");
Engine.include("/spatial/container.spatialgrid.js");
Engine.include("/resourceloaders/loader.sprite.js");
Engine.include("/engine/engine.timers.js");

Game.load(pathToEngine + "/src/Level.js");
Game.load(pathToEngine + "/src/Player.js");
Game.load(pathToEngine + "/src/HandshakeHost.js");

Engine.initObject("Papercraft", "Game", function(){

   /**
    * @class Tutorial One.  Render a simple filled rectangle to
    *	the Canvas context.
    */
   var Papercraft = Game.extend({

      constructor: null,

      // The rendering context
      renderContext: null,

      // Engine frames per second
      engineFPS: 30,
			// The collision model
      collisionModel: null,
			// Sprite resource loader
      spriteLoader: null,

			handshakeHost: null,
			paused: false,
			currentLevel: null,

      // The play field
      fieldBox: null,
      fieldWidth: 0,
      fieldHeight: 0,
			
			playerSize: 30,
			playerJumpHeight: 90,
			playerMaxSideMovement: 100,
			
			playerTypes: [
				{
					type: "Robin",
					image: pathWithoutSlash + "/src/resources/Robin.jpg"
				},
				{
					type: "Robine",
					image: pathWithoutSlash + "/src/resources/Robine.jpg"
				},
			],

      /**
       * Called to set up the game, download any resources, and initialize
       * the game to its running state.
       */
      setup: function(){
        // Set the FPS of the game
        Engine.setFPS(this.engineFPS);
				
				this.spriteLoader = SpriteLoader.create();
         
        // Load the sprites
        this.spriteLoader.load("platform", this.getFilePath(pathWithoutSlash + "/src/resources/platform.sprite"));
        this.spriteLoader.load("players", this.getFilePath(pathWithoutSlash + "/src/resources/players.sprite"));

        // Don't start until all of the resources are loaded
        Timeout.create("wait", 250, function() {
					if (Papercraft.spriteLoader.isReady()) {
						this.destroy();
						Papercraft.run();
					}
					else {
						// Continue waiting
						this.restart();
					}
        });
      },

			run: function() {
				
				// game should span the whole viewport
				this.fieldWidth = EngineSupport.sysInfo().viewWidth - 400;
				this.fieldHeight = EngineSupport.sysInfo().viewHeight - 160;
        this.fieldBox = Rectangle2D.create(0, 0, this.fieldWidth, this.fieldHeight);
				
        this.renderContext = CanvasContext.create("Playfield", this.fieldWidth, this.fieldHeight);

        Engine.getDefaultContext().add(this.renderContext);
				
				this.collisionModel = SpatialGrid.create(this.fieldWidth, this.fieldHeight, 
																								 Math.round(this.fieldWidth / this.playerSize));
				
				this.handshakeHost = HandshakeHost.create();
				this.setupLevel();
				
				$("#loading").remove();
			},
			
			addPlayer: function(client) {
				client.player = Player.create(client.name, client.playerType.type, 
																	 this.playerSize, this.playerSize, 
																	 this.playerJumpHeight, this.playerMaxSideMovement);
        this.renderContext.add(client.player);
				client.player.setPosition( Point2D.create(this.fieldWidth / 2, this.fieldHeight / 2) );
				this.startLevel();
			},
			
			removePlayer: function(client) {
				client.player.destroy();
			},
			
			setupLevel: function() {
				this.currentLevel = Level.create(this.playerJumpHeight, this.playerMaxSideMovement, this.scrollSpeed);
				this.renderContext.add(this.currentLevel);
				this.currentLevel.setup();
			},
			
			startLevel: function() {
				if(this.currentLevel) {
					this.currentLevel.start();
				}
			},
			
			endLevel: function() {
				if(this.currentLevel) {
					this.currentLevel.end();
				}
			},
			
			pause: function(flag) {
				this.paused = flag;
			},
			
			isPaused: function() {
				return this.paused;
			},
			
			isStarted: function() {
				return this.currentLevel.started;
			},
			
      /**
       * Called when a game is being shut down to allow it to clean up
       * any objects, remove event handlers, destroy the rendering context, etc.
       */
      teardown: function(){
         this.renderContext.destroy();
      },

      /**
       * Return a reference to the render context
       */
      getRenderContext: function(){
         return this.renderContext;
      },

      /**
       * Return a reference to the playfield box
       */
      getFieldBox: function() {
         return this.fieldBox;
      }

   });

   return Papercraft;

});