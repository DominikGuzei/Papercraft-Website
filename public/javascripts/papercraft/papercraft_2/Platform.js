// Load the components and engine objects
Engine.include("/components/component.collider.js");
Engine.include("/components/component.boxcollider.js");

Game.load(pathToEngine + "/papercraft/GameObject.js");

Engine.initObject("Platform", "GameObject", function() {

   var Platform = GameObject.extend({

		lastFrameOverTime: 0,
		level: null,
		
    constructor: function(level, width, x, y) {
      this.base("platform", width, 45);
			this.setSprite("baseSprite", "normal", true);
			this.level = level;
			this.add(BoxColliderComponent.create("collide", Papercraft.collisionModel));
			this.getComponent("collide").setCollisionMask(Math2.parseBin("11"));
			// initialize values
			this.lastFrameTime = 0;
			this.lastFrameOverTime = 0;
			this.setPosition(Point2D.create(x, y));
			//this.drawBoundingBox = true;
    },

    update: function(renderContext, time) {
			var pos = this.getPosition();

			renderContext.pushTransform();
				if(!Papercraft.paused) {
					this.move(pos);
				}
				this.base(renderContext, time);
			renderContext.popTransform();

			var fieldBox = Papercraft.getFieldBox().get();
			this.lastFrameTime = time;
			if ((pos.y > fieldBox.b)) {
				this.destroy();
			}
    },

		move: function(pos) {
			var currentDelta = Math.floor(this.timeDelta + this.lastFrameOverTime);
			var pixelsToMove = currentDelta > 0 ? Math.round(currentDelta / this.level.logic.scrollMillisecondsPerPixel) : 0;
			var scrollMovement = Vector2D.create(0, pixelsToMove);
			this.lastFrameOverTime = currentDelta - this.level.logic.scrollMillisecondsPerPixel * pixelsToMove;
			pos.add(scrollMovement);
			this.setPosition(pos);
			scrollMovement.destroy();
		}
		
   }, { // Static

      getClassName: function() {
         return "Platform";
      }
   });

return Platform;

});
