// Load the components and engine objects
Engine.include("/engine/engine.baseobject.js");

Game.load(pathToEngine + "/papercraft/Way.js");

Engine.initObject("Level", "BaseObject", function() {

	var Level = BaseObject.extend({
		
		columnWidth: 0,
		numberOfColumns: 0,
		rowHeight: 0,
		numberOfRows: 0,
		minBrickWidth: 40,
		ways: [],
		currentPlacedColumns: [],
		startTime: 0,
		scrollSpeed: 50, // pixel per second
		maxScrollSpeed: 80,
		started: false,
		ended: false,
		maxDelta: 2000,
		
		logic: {
			scrollMillisecondsPerPixel: 0,
			millisecondsPerRow: 0,
			timeOfLastRow: 0,
			// the current divisor to speed up spawn time -> higher = more platforms
			rowSpawnTimeDivisor: 2, 
			// the frequency we decrement the spawn time divisor in milliseconds
			decrementSpawnTimeDivisorFrequency: 10000, 
			lastDivisorDecrementTime: 0,
			// the frequency we remove ways till only one is left = harder to play
			currentWayChangeFrequency: 20000,
			wayChangeFrequency: 20000,
			lastTimeWayChanged: 0
		},

	  constructor: function(jumpHeight, maxSideMovement) {
	    this.base("Level");
  		this.calculateLevelGrid(jumpHeight, maxSideMovement);
			this.setScrollSpeed(this.scrollSpeed);
	  },
	
		resetLogic: function() {
			this.startTime = 0;
			this.logic.timeOfLastRow = 0;
			this.logic.rowSpanTimeDivisor = 2;
			this.lastTimeWayChanged = 0;
		},
		
		calculateLevelGrid: function(jumpHeight, maxSideMovement) {
			this.numberOfColumns = Math.ceil(Papercraft.fieldWidth / maxSideMovement);
			this.columnWidth = Papercraft.fieldWidth / this.numberOfColumns;
			this.numberOfRows = Math.ceil(Papercraft.fieldHeight / jumpHeight);
			this.rowHeight = Papercraft.fieldHeight / this.numberOfRows;
		},
		
		setup: function() {
			this.addWay(Math.ceil(Math.random()*this.numberOfColumns));
			this.addWay(Math.ceil(Math.random()*this.numberOfColumns));
			this.resetCurrentPlacedColumns();
		},
		
		start: function() {
			this.started = true;
		},
		
		end: function() {
			this.started = false;
			this.resetLogic();
		},
		
		/**
	   * Update the object within the rendering context. This calls the transform
     * components to position the object on the playfield.
     *
     * @param {RenderContext} renderContext The rendering context
     * @param {Number} time The engine time in milliseconds
     */
    update: function(renderContext, time) {
			if(!Papercraft.paused && this.started) {
				
				this.startTime == 0 && (this.startTime = time);
				var delta = time - this.logic.timeOfLastRow;
				if(delta > this.maxDelta) this.logic.timeOfLastRow = 0;
				
				this.handleWayLogic(time);
				if(delta >= this.logic.millisecondsPerRow) {
					this.tellWaysToAddRow();				
					this.logic.timeOfLastRow = this.logic.timeOfLastRow == 0 ? time : 
						time - (delta - this.logic.millisecondsPerRow / this.logic.rowSpawnTimeDivisor);
				}
				this.resetCurrentPlacedColumns();
			}
    },
		
		/**
		 * Handle level logic. this level is quite simple, it just adds
		 * three ways at the beginning and removes them over while till
		 * one is left. It also slowly increases the distance between the
		 * platforms.
		 * 
		 * @param {number} time The current engine time in milliseconds
		 */
		handleWayLogic: function(time) {
			this.logic.lastTimeWayChanged == 0 && (this.logic.lastTimeWayChanged = time);
			this.logic.lastDivisorDecrementTime == 0 && (this.logic.lastDivisorDecrementTime = time);
			
			if(time - this.logic.lastTimeWayChanged > this.logic.currentWayChangeFrequency) {
				if(this.ways.length > 1) {
					this.removeWay( Math.round( Math.random() * (this.ways.length -1) ) );
				} else {
					this.addWay(Math.ceil(Math.random()*this.numberOfColumns));
					this.logic.currentWayChangeFrenquency = Math.random() * 10000 + this.logic.wayChangeFrequency;
				}
				this.logic.lastTimeWayChanged = time;
			}
			
			if(time - this.logic.lastDivisorDecrementTime > this.logic.decrementSpawnTimeDivisorFrequency){
				if(this.logic.rowSpawnTimeDivisor > 1) {
					this.logic.rowSpawnTimeDivisor -= 0.1;
					this.logic.lastDivisorDecrementTime = time;
					if(this.scrollSpeed < this.maxScrollSpeed) {
						this.setScrollSpeed(this.scrollSpeed +2);
					}
				}
			} 
		},

		addWay: function(startColumn) {
			this.ways[this.ways.length] = Way.create(this, startColumn);
			Papercraft.renderContext.add(this.ways[this.ways.length-1]);
		}, 
		
		removeWay: function(index) {
			if(this.ways[index]) {
				this.ways[index].destroy();
				this.ways.splice(index, 1);
			}
		},

	 	tellWaysToAddRow: function() {
			for(var i = 0; i < this.ways.length; i++) {
				this.ways[i].addRow();
			}
	 	},
		
		resetCurrentPlacedColumns: function() {
			for(var i = 0; i < this.numberOfColumns; i++) {
				this.currentPlacedColumns[i] = false;
			}
		},
		
		setScrollSpeed: function(value) {
			this.scrollSpeed = value;
			this.logic.scrollMillisecondsPerPixel = 1000 / this.scrollSpeed;
			this.logic.millisecondsPerRow = this.logic.scrollMillisecondsPerPixel * this.rowHeight;
		},
		
		destroy: function() {
			for(var i=0; i< this.ways.length; i++) {
				this.ways[i].destroy();
			}
		}
		
	},
		{ 
      getClassName: function() {
         return "Level";
    	}
  });

	return Level;

});