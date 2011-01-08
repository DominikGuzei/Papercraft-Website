Engine.include("/engine/engine.baseobject.js");

Game.load(pathToEngine + "/src/Player.js");
	
Engine.initObject("HandshakeHost", "BaseObject", function() {
	
	var HandshakeHost = BaseObject.extend({
		
		ip: "193.170.119.85",
		port: 8008,
		id: undefined,
		host: null,
		clients: {},
		
		constructor: function() {
			self = this;
			
			require({baseUrl: "/javascripts/handshake"}, ['handshake/Host'], function(Host) {
				
				self.host = new Host(self.ip, self.port);
				
				self.host.on("ready", function(hostId) {
					self.id = hostId;
					console.log("host id", self.id);
				});
				
				self.host.on("closed", function(event) {
					console.log("Handshake Server closed connection");
				});

				self.host.on("clientConnect", function(client) {
					console.log("client " + client.id + " connected with device: " + client.deviceType);
				});

				self.host.on("clientDisconnect", function(client) {
					console.log("client " + client.id + " disconnected");
				});

				self.host.on("name", function(event) {
					var client = self.host.getClient(event.sender);
					client.name = event.data.name;
					console.log("client connected with name ", event.data.name);
					client.send("playerTypes", { playerTypes: Papercraft.playerTypes });
					
				});
				
				
				self.host.on("playerType", function(event) {
					var client = self.host.getClient(event.sender);
					client.playerType = event.data.type;
					console.log("player chose type " + event.data.type.type);
					Papercraft.addPlayer(client);
					self.host.send("all", "gameStart", {});
				});

				self.host.on("dir", function(event) {
					var client = self.host.getClient(event.sender);
					client.player.setDirection(event.data.dir);
				});
				
				self.host.connect();
			});
		}
	},{ 
      getClassName: function() {
         return "Level";
    	}
  });

	return HandshakeHost;
});