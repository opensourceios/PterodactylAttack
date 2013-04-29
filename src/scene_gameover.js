
Ptero.scene_gameover = (function(){

	var scoreBtn,playBtn,quitBtn;

	function cleanup() {
		playBtn.disable();
		quitBtn.disable();
	}

	function init() {
		scoreBtn = new Ptero.TextButton({
			hudPos: {x:0.5, y:0.25},
			font: "monospace",
			fontSize: Ptero.hud.getBaseTextSize()*2,
			textAlign: "center",
			textColor: "#FFF",
			text: ""+Ptero.score.getTotal(),
			width: 400,
			height: 200,
		});

		playBtn = new Ptero.TextButton({
			hudPos: {x:0.25, y:0.5},
			font: "sans-serif",
			textAlign: "center",
			textColor: "#FFF",
			text: "Play again",
			width: 400,
			height: 200,
			onclick: function() {
				Ptero.fadeToScene(Ptero.scene_game,0.5);
			},
		});
		playBtn.enable();
		quitBtn = new Ptero.TextButton({
			hudPos: {x:0.75, y:0.5},
			font: "sans-serif",
			textAlign: "center",
			textColor: "#FFF",
			text: "Quit to Title",
			width: 400,
			height: 200,
			onclick: function() {
				Ptero.fadeToScene(Ptero.scene_menu,0.5);
			},
		});
		quitBtn.enable();
	}

	function draw(ctx) {
		Ptero.assets.keepExplosionsCached(ctx);
		Ptero.background.draw(ctx);
		scoreBtn.draw(ctx);
		playBtn.draw(ctx);
		quitBtn.draw(ctx);
	}

	function update(dt) {
		Ptero.background.update(dt);
	}

	return {
		init:init,
		draw:draw,
		update:update,
		cleanup: cleanup,
	};
})();