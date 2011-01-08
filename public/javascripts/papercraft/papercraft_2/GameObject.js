// Load the components and engine objects
Engine.include("/engine/engine.object2d.js");
Engine.include("/components/component.sprite.js");
Engine.include("/components/component.mover2d.js");

Engine.initObject("GameObject", "Object2D", function() {

   var GameObject = Object2D.extend({

		renderScale: 1,
		lastFrameTime: 0,
		timeDelta: 0,
		sprites: null,
		drawBoundingBox: false,
		box: {},
		
    constructor: function(objectName, width, height) {
      this.base("GameObject_" + objectName);
			this.objectName = objectName;
			this.renderScale = 1;
			this.maxWidth = width;
			this.maxHeight = height;
			this.box = {};
			this.sprites = Papercraft.spriteLoader.exportAll(objectName);
			this.add(Mover2DComponent.create("mover"));
			this.add(SpriteComponent.create("baseSprite"));
    },

    setSprite: function(component, spriteName, rescale) {
     var sprite = this.sprites[spriteName];
     this.getComponent(component).setSprite(sprite);
		 if(rescale) {
			 // calculate scale factor from new sprite
			 var box = sprite.getBoundingBox().get();
			 var xFactor = this.maxWidth / box.w;
			 var yFactor = this.maxHeight / box.h;
			 this.renderScale = Math.min(xFactor, yFactor);
			 this.width = box.w * this.renderScale;
			 this.height = box.h * this.renderScale;
			 this.getComponent("mover").setScale(this.renderScale);
			 this.setBoundingBox(sprite.getBoundingBox());
			 var pos = Point2D.create(this.getPosition());
			 var offset = Point2D.create(this.width / 2,  this.height / 2)
			 pos.sub(offset);
			 this.setPosition(pos);
			 pos.destroy();
			 offset.destroy();
		 }
		 this.box.w = this.width;
		 this.box.h = this.height;
    },

		update: function(renderContext, time) {
			var pos = this.getPosition();
			
			this.box.x = pos.x;
			this.box.y = pos.y;
			this.timeDelta = this.lastFrameTime == 0 ? 0 : time - this.lastFrameTime;
			if(this.drawBoundingBox) {
				renderContext.setLineStyle("#000000");
      	renderContext.drawRectangle(Rectangle2D.create(pos.x, pos.y, this.width, this.height));
			}
			this.base(renderContext, time);
		},

		getCurrentSprite: function(component) {
			 return this.getComponent(component).getSprite();
		},

    getPosition: function() {
       return this.getComponent("mover").getPosition();
    },

		getRenderPosition: function() {
			 return this.getPosition();
		},

    setPosition: function(point) {
       this.base(point);
       this.getComponent("mover").setPosition(point);
			 this.box.x = point.x;
			 this.box.y = point.y;
    },
		
		destroy: function() {
			for(var s in this.sprites) {
				this.sprites[s].destroy();
			}
			this.box = null;
			this.base();
		}
		
   }, { // Static

      getClassName: function() {
         return "GameObject";
      }
   });

return GameObject;

});
