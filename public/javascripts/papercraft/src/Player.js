// Load the components and engine objects
Engine.include("/components/component.collider.js");
Engine.include("/components/component.circlecollider.js");
Engine.include("/components/component.keyboardinput.js");

Game.load(pathToEngine + "/src/GameObject.js");

Engine.initObject("Player", "GameObject", function() {

   var Player = GameObject.extend({
		
		jumpHeight: 100,
		maxSideMovement: 5,
		jumpMask: Math2.parseBin("01"),
		jumping: false,
		fallMask: Math2.parseBin("11"),
		sideMovement: 0,
		gravity: 1,
		mover: null,
		points: 0,
		statusElement: null,
		playerName: "",
		playerType: "",
		burnPointAmount: -5,
		jumpPointAmount: 1,
		
    constructor: function(playerName, playerType, width, height, perJumpHeight, sideMovement) {
      this.base("players", width, height);
			this.jumpHeight = this.calcVelocity(perJumpHeight, 1);
			this.burnHeight = this.calcVelocity(perJumpHeight * 3, 1);
			this.maxSideMovement = 10;
			this.sideMovement = 0;
			this.points = 0;
			this.playerName = playerName;
			this.playerType = playerType;
			this.setSprite("baseSprite", playerType, true);
			
      this.add(CircleColliderComponent.create("collider", Papercraft.collisionModel));
			
			this.setBoundingBox(this.getCurrentSprite("baseSprite").getBoundingBox());
			this.setZIndex(10000);
			this.mover = this.getComponent("mover");
			this.mover.setGravity(Vector2D.create(0, this.gravity));
			this.mover.setCheckRestState(false);
			this.mover.setCheckLag(false);
			this.setupPlayerStatus();
			//this.drawBoundingBox = true;
    },

		update: function(renderContext, time) {
			if(Papercraft.paused) {
				this.mover.setResting(true);
			} else {
				this.mover.setResting(false);
				this.mover.setVelocity(Vector2D.create(this.sideMovement, this.mover.getVelocity().y) );
			}
				var pos = this.getPosition();
				renderContext.pushTransform();
					if(pos.y + this.height > Papercraft.fieldHeight) {
						this.burn();
					}
					this.base(renderContext, time);
				renderContext.popTransform();
			
    },
		
		onCollide: function(obj, time, targetMask) {
			var colliderValue = ColliderComponent.CONTINUE;
			if(targetMask == 3 && this.getComponent("mover").getVelocity().y > 0) {
				this.checkForPlatformJump(obj);
			}
      return colliderValue;
    },

		checkForPlatformJump: function(platform) {
			if((this.box.y + this.box.h) - platform.box.y <= 10 && platform.box.y > 100) {
				this.jump();
			}
		},

		onCollideEnd: function() {
			
		},
		
		setDirection: function(direction) {
			this.sideMovement = direction * this.maxSideMovement;
		},
		
		jump: function() {
			this.mover.setVelocity(Vector2D.create(0, -this.jumpHeight));
			this.getComponent("collider").setCollisionMask(this.jumpMask);
			jumping = true;
			this.changePoints(this.jumpPointAmount);
		},
		
		burn: function() {
			this.mover.setVelocity(Vector2D.create(0, -this.burnHeight));
			this.getComponent("collider").setCollisionMask(this.jumpMask);
			this.changePoints(this.burnPointAmount);
		},
		
		setupPlayerStatus: function() {
			var elem = '<div class="playerStatus">';
			elem += '<img class="playerImage" src="'+ pathToEngine + '/src/resources/' + this.playerType + '.png" />';
			elem += '<p class="name">' + this.playerName + '</p>';
			elem += '<p class="points">0</p></div>';
			this.statusElement = $(elem);
			$("#playerTray").append(this.statusElement);
		},
		
		changePoints: function(amount) {
			this.points += amount;
			this.statusElement.find(".points").html(this.points);
		},
		
		calcVelocity: function(aim, decay) {
			var current = 0;
			var vel = 0;
			while(current < aim) {
				current += vel+1
				vel++;
			}
			return vel;
		}
		
   }, { // Static
      getClassName: function() {
         return "Player";
      }
   });

return Player;

});
