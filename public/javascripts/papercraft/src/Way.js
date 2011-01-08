// Load the components and engine objects
Engine.include("/engine/engine.baseobject.js");
// Load the timers
Engine.include("/engine/engine.timers.js");

Game.load(pathToEngine + "/src/Platform.js");

Engine.initObject("Way", "BaseObject", function() {

	var Way = BaseObject.extend({
		
		level: null,
		currentColumn: 0,
		platforms: [],
		
	  constructor: function(level, startColumn) {
	    this.base("Way");
			this.level = level;
			this.currentColumn = startColumn;
	  },

		createRandomBrick: function(column) {
			var self = this;
			
			Timeout.create("rowTimer",Math.ceil(Math.random() * (this.level.logic.millisecondsPerRow / 2)), function() {
				var minWidth = self.level.minBrickWidth;
				var width = Math.floor(Math.random() * (self.level.columnWidth - minWidth) + minWidth);
				var xOffset = self.level.columnWidth * column;
				var x = Math.floor(Math.random() * (self.level.columnWidth - width) + xOffset);
				var y = -self.level.rowHeight;
				var platform = Platform.create(self.level, width, x, y);
				Papercraft.renderContext.add(platform);
			});
		},
		
		addRow: function() {
			if(this.level.currentPlacedColumns[this.currentColumn] == false) {
				this.level.currentPlacedColumns[this.currentColumn] = true;
				this.createRandomBrick(this.currentColumn);
			}
			
			this.currentColumn += Math.round(Math.random()*1) == 0 ? -1 : 1;
			
			if(this.currentColumn < 0) {
				this.currentColumn += 2;
			} else if(this.currentColumn >= this.level.numberOfColumns) {
				this.currentColumn -= 2;
			}
		}
	},
		{ 
      getClassName: function() {
         return "Way";
    	}
  });

	return Way;

});