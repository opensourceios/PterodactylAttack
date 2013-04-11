
Ptero.assets = (function(){

	var imageSources = {
		"desert": "img/desert.jpg",
		"grass": "img/grass.png",
		"baby": "img/baby.png",
		"boom1": "img/boom1.png",
		"boom2": "img/boom2.png",
		"boom3": "img/boom3.png",
		"bullet": "img/bullet.png",
		"pause": "img/pause.png",
		"logo": "img/logo.png",
	};

	var images = {};
	var sprites = {};
	var tables = {};
	var mosaics = {};

	function parseMetaData(name, meta) {
		if (meta.rows != undefined) {
			console.log("creating table",name);
			tables[name] = new Ptero.SpriteTable(images[name], meta);
		}
		else if (meta.mosaic != undefined) {
			console.log("creating mosaic",name);
			mosaics[name] = new Ptero.SpriteMosaic(images[name], meta);
		}
		else {
			console.log("creating sprite",name);
			sprites[name] = new Ptero.Sprite(images[name], meta);
		}
	};

	function retrieveMetaData() {
		var name,req,src,metadata;
		for (name in imageSources) {
			if (imageSources.hasOwnProperty(name)) {
				src = imageSources[name] + ".json";
				console.log(src);
				req = new XMLHttpRequest();
				req.open('GET', src, false);
				req.send();
				if (req.status == 200) {
					metadata = JSON.parse(req.responseText);
				}
				parseMetaData(name, metadata);
			}
		}
	};

	function load(callback) {
		var count = 0;
		var name;
		for (name in imageSources) {
			if (imageSources.hasOwnProperty(name)) {
				count++;
			}
		}

		var handleLoad = function() {
			count--;
			if (count == 0) {
				retrieveMetaData();
				callback && callback();
			}
		};

		var img;
		for (name in imageSources) {
			if (imageSources.hasOwnProperty(name)) {
				img = new Image();
				img.src = imageSources[name];
				img.onload = handleLoad;
				images[name] = img;
			}
		}
	};

	return {
		load: load,
		images: images,
		sprites: sprites,
		tables: tables,
		mosaics: mosaics,
	};
})();
