//////////////////////

var _callbacks = {};
var _callbackid = 1;

function onYouTubePlayerReady(playerid)
{
	_callbacks[playerid]();
	delete _callbacks[playerid];
}

function youtubevideo(elem, cell)
{
	var ytplayerid = "myytplayer" + _callbackid;
	var ytplayerswf = "http://www.youtube.com/apiplayer?enablejsapi=1&playerapiid=" + _callbackid;
	
	var ytvideo = elem;
	ytvideo.id = ytplayerid;
	
	_callbacks[_callbackid] = function ()
	{
		ytvideo = document.getElementById(ytplayerid);
		ytvideo.style.webkitTransform = vfx.translate3d(-CWIDTH / 2, -CHEIGHT / 2, 0) + " scale(0.5)";
		ytvideo.loadVideoById(cell.info.ytvideoid);
		play_video(cell.video);
	};

	var params = { allowScriptAccess: "always" };
	var attrs = { "id": ytplayerid, "class": "media" };

	swfobject.embedSWF(ytplayerswf, ytplayerid, CWIDTH * 2, CHEIGHT * 2, "8", null, null, params, attrs);

	_callbackid += 1;

	cell.video = {
		play: function () { ytvideo.playVideo(); },
		pause: function () { ytvideo.pauseVideo(); },
		isPaused: function () { return (ytvideo.getPlayerState() == 2); }
	};
}

/////////////////////

