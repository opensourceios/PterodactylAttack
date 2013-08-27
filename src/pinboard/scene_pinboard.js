
Ptero.Pinboard.scene_pinboard = (function(){

	var touchHandler = {
		coord: "window",
		start: function(wx,wy) {
		},
		move: function(wx,wy) {
		},
		end: function(wx,wy) {
		},
		cancel: function(wx,wy) {
		},
		scroll: function(wx,wy,delta,deltaX,deltaY) {
			// from: http://stackoverflow.com/questions/2916081/zoom-in-on-a-point-using-scale-and-translate
			var scaleFactor = Math.pow(1 + Math.abs(deltaY)/4 , deltaY > 0 ? 1 : -1);

			var scale = Ptero.screen.getWindowScale() * scaleFactor;
			var maxScale = Ptero.screen.getWindowFitScale();
			var minScale = maxScale / 8;
			scale = Math.max(minScale, Math.min(maxScale, scale));

			Ptero.screen.zoomWindow(scale, wx, wy);
		},
	};

	function init() {
		Ptero.setBackground('menu');

		var s = Ptero.screen;
		s.setWindowScale(s.getCanvasHeight() / (s.getWindowHeight()*1.5));
		s.centerWindowAtPixel(s.getCanvasWidth()/2, s.getCanvasHeight()/2);

		Ptero.input.addTouchHandler(touchHandler);
	}
	
	function cleanup() {
		Ptero.input.removeTouchHandler(touchHandler);
	}

	function draw(ctx) {
		ctx.save();
		Ptero.screen.transformToWindow();
		ctx.save();
		Ptero.screen.clipWindow();
		Ptero.deferredSprites.draw(ctx);
		ctx.restore();
		ctx.strokeStyle = "#000";
		ctx.lineWidth = 10;
		ctx.strokeRect(0,0,Ptero.screen.getWindowWidth(),Ptero.screen.getWindowHeight());

		// TODO: draw images in depth order here

		ctx.restore();
	}

	function update(dt) {
		Ptero.background.update(dt);
	}

	return {
		init: init,
		cleanup: cleanup,
		draw: draw,
		update: update,
	};
})();
