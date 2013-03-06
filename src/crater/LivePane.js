
Ptero.Crater.LivePane = function() {
	this.scene = Ptero.Crater.scene_crater;
	this.nodeRadius = 4;
};

Ptero.Crater.LivePane.prototype = {

	/* COORDINATE FUNCTIONS */

	screenToSpace: function(x,y,spaceZ) {
		var frustum = Ptero.screen.getFrustum();
		var spacePos = Ptero.screen.screenToSpace({x:x,y:y});
		spacePos = frustum.projectToZ(spacePos, spaceZ);
		return {
			x: spacePos.x,
			y: spacePos.y,
		};
	},

	spaceToScreen: function(pos) {
		return Ptero.screen.spaceToScreen(pos);
	},

	/* INPUT FUNCTIONS */

	getNodeSelectOffset: function(x,y,index) {
		if (index == undefined) {
			return;
		}

		var enemy = Ptero.Crater.enemy_model;
		var nodeSprite = enemy.nodeSprites[index];
		var spaceCenter = enemy.points[index];
		var spaceRect = nodeSprite.getBillboard().getSpaceRect(spaceCenter);
		var spaceClick = this.screenToSpace(x,y,spaceCenter.z);
		if (spaceRect.x <= spaceClick.x && spaceClick.x <= spaceRect.x + spaceRect.w &&
			spaceRect.y <= spaceClick.y && spaceClick.y <= spaceRect.y + spaceRect.h) {
			return {
				index: index,
				offset_x: spaceCenter.x - spaceClick.x,
				offset_y: spaceCenter.y - spaceClick.y,
			}
		}
	},

	getNodeInfoFromCursor: function(x,y) {
		var enemy = Ptero.Crater.enemy_model;

		var min_dist_sq = 100;
		var nodes = Ptero.Crater.enemy_model.points;
		var i,len = nodes.length;

		var node,pos;
		var dx,dy,dist_sq;
		var closest_index;
		var offset_x, offset_y;

		for (i=0; i<len; i++) {
			node = nodes[i];
			pos = this.spaceToScreen(node);
			dx = pos.x - x;
			dy = pos.y - y;
			dist_sq = dx*dx + dy*dy;
			if (dist_sq < min_dist_sq) {
				closest_index = i;
				min_dist_sq = dist_sq;
			}
		}

		var node_offset;
		if (node_offset = this.getNodeSelectOffset(x,y,closest_index)) {
			return node_offset;
		}
		else if (node_offset = this.getNodeSelectOffset(x,y,enemy.selectedIndex)) {
			return node_offset;
		}

		for (i=0; i<len; i++) {
			if (node_offset = this.getNodeSelectOffset(x,y,i)) {
				return node_offset;
			}
		}

		return {};
		
	},

	selectNode: function(index,offset_x,offset_y) {
		Ptero.Crater.enemy_model.selectPoint(index);
		this.selectedOffsetX = offset_x;
		this.selectedOffsetY = offset_y;
	},

	updateNodePosition: function(x,y) {
		var point = Ptero.Crater.enemy_model.getSelectedPoint();
		if (point) {
			var spaceClick = this.screenToSpace(x,y,point.z);
			point.x = spaceClick.x + this.selectedOffsetX;
			point.y = spaceClick.y + this.selectedOffsetY;
			Ptero.Crater.enemy_model.refreshPath();
		}
	},

	mouseStart: function(x,y) {
		var i = this.getNodeInfoFromCursor(x,y);
		this.selectNode(i.index, i.offset_x, i.offset_y);
	},

	mouseMove: function(x,y) {
		this.updateNodePosition(x,y);
	},

	mouseEnd: function(x,y) {
	},

	/* PAINTER FUNCTIONS */

	transform: function(pos) {
		// for now, just assume the vector is a 3d space vector.
		return this.spaceToScreen(pos);
	},
	moveTo: function(ctx,pos) {
		var p = this.transform(pos);
		ctx.moveTo(p.x,p.y);
	},
	lineTo: function(ctx,pos) {
		var p = this.transform(pos);
		ctx.lineTo(p.x,p.y);
	},
	line: function(ctx, p1, p2) {
		ctx.beginPath();
		this.moveTo(ctx, p1);
		this.lineTo(ctx, p2);
		ctx.stroke();
	},
	lines: function(ctx, points) {
		var i,len;
		ctx.beginPath();
		this.moveTo(ctx, points[0]);
		for (i=1,len=points.length; i<len; i++) {
			this.lineTo(ctx, points[i]);
		}
		ctx.closePath();
		ctx.stroke();
	},
	fillCircle: function(ctx, spacePos, radius, color) {
		ctx.beginPath();
		var pos = this.transform(spacePos);
		ctx.arc(pos.x, pos.y, radius, 0, Math.PI*2);
		ctx.fillStyle = color;
		ctx.fill();
	},
	strokeCircle: function(ctx, spacePos, radius, color, thickness) {
		ctx.beginPath();
		var pos = this.transform(spacePos);
		ctx.arc(pos.x, pos.y, radius, 0, Math.PI*2);
		ctx.lineWidth = thickness;
		ctx.strokeStyle = color;
		ctx.stroke();
	},

	/* DRAWING FUNCTIONS */

	drawNodes: function(ctx) {
		var nodes = Ptero.Crater.enemy_model.points;
		var i,len = nodes.length;
		var selectedIndex = Ptero.Crater.enemy_model.selectedIndex;
		for (i=0; i<len; i++) {
			if (selectedIndex != i) {
				this.fillCircle(ctx, nodes[i], this.nodeRadius, "#555",2);
			}
		}
		var selectedPoint = Ptero.Crater.enemy_model.getSelectedPoint();
		if (selectedPoint) {
			this.fillCircle(ctx, selectedPoint, this.nodeRadius, "#F00",2);
		}
		else {
			this.fillCircle(ctx, Ptero.Crater.enemy_model.enemy.getPosition(), this.nodeRadius, "#00F",2);
		}
	},

	drawPath: function(ctx) {
		var interp = Ptero.Crater.enemy_model.interp;
		var totalTime = interp.totalTime;
		var numPoints = 100;
		var step = totalTime/numPoints;

		ctx.beginPath();
		this.moveTo(ctx, interp(0));
		for (t=step; t<=totalTime; t+=step) {
			this.lineTo(ctx, interp(t));
		}
		ctx.strokeStyle = "#777";
		ctx.lineWidth = 2;
		ctx.stroke();
	},

	draw: function(ctx) {
		this.scene.draw(ctx);
		if (Ptero.Crater.enemy_model.getSelectedPoint()) {
			this.drawPath(ctx);
			this.drawNodes(ctx);
		}
	},

	update: function(dt) {
		this.scene.update(dt);
	},

	init: function() {
		this.scene.init();
	},
};