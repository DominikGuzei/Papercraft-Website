require({ baseUrl: "/javascripts/handshake" }, ['handshake/Client'], function(Client) {
	
	var client = undefined;
	var connected = false;
	var currentDirection = 0;
	var playerTypes = [];
	var playerImages = [];
	var name;
	var gameId = 1;
	
	require.ready(function() {
		connectToHost();
	});
	
	window.onCoverFlowPlayerClicked = function(index) {
		client.send("host", "playerType", { type: playerTypes[index] });
	}
	
	function showPlayerCoverFlow(images) {
		 zflow(images, "#tray");
	}
	
	function connectToHost() {
		if(!connected) {
			name = prompt("Dein Name");
			gameId = prompt("Game Id");
			
			client = new Client("193.170.119.85", 8008, gameId);
	
			client.on("ready", function(id) {
				console.log("connected to game " + gameId + " with id " + id);
				client.send("host", "name", { name: name });
			});
	
			client.on("gameStart", function(event) {
				setupControlListener();
			});
			
			client.on("playerTypes", function(event) {
				playerTypes = event.data.playerTypes;
				for(var i = 0; i < playerTypes.length; i++) {
					playerImages.push(playerTypes[i].image);
				}
				zflow(playerImages, "#tray");
			});
	
			client.connect();
			connected = true;
		}
	}

	var setDirection = function(direction) {
		client.send("host", "dir", { dir: direction });
		currentDirection = direction;
	}

	var handleIphoneMotion = function(event) {
		var direction = event.accelerationIncludingGravity.y / -10;
		setDirection(direction);
	}

	var handleKeyDown = function(event) {
		// handle left key
	  if (event.keyCode == 37 && currentDirection != -1) {
			setDirection(-1);
		}
		// handle right key
		if (event.keyCode == 39 && currentDirection != 1) {	
			setDirection(1);
		}
	}

	var handleKeyUp = function(event) {
		if (event.keyCode == 37 || event.keyCode == 39) {
	      setDirection(0);
	   }
	}

	var setupControlListener = function() {
		// IPHONE ACCELERATOR
		window.ondevicemotion = handleIphoneMotion;
		window.onkeydown = handleKeyDown;
		window.onkeyup = handleKeyUp;
	}
});