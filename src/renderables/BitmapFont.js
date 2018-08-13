import createTextGeometry from 'three-bmfont-text';
import _ from 'lodash';
import THREE from 'three';
import EventEmitter from 'events';
import {RenderableUtils} from './RenderableUtils.js';

class BitmapFont
{
	constructor(options)
	{
		this._events = new EventEmitter();
		this._setupDefaultOptions(options);
		this._load();
	}

	_setupDefaultOptions(options)
	{
		let requiredOptions = ['name', 'fontPath', 'texturePath'],
			optName = 'BitmapFont.options';
		this.options = RenderableUtils.CreateOptions(options, requiredOptions, optName, {
			text: '',
			width: 200,
			align: 'left',
			color: 0xffffff
		});

		this.name = this.options.name;
	}

	_load()
	{
		let onLoad = (font, texture) => {
			this.font = font;
			this.texture = texture;

			this.material = new THREE.MeshBasicMaterial({
				map: texture,
				transparent: true,
				color: this.options.color,
				side: THREE.DoubleSide,
			});

			this.textGeometry = createTextGeometry({
				width: this.options.width,
				align: this.options.align,
				font: this.font,
				text: this.options.text,
				flipY: texture.flipY
			});

			this.mesh = new THREE.Mesh(this.textGeometry, this.material);
			this.renderable = new THREE.Object3D();
			this.renderable.add(this.mesh);
			this.renderable.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI);
			this._events.emit('load', this);
		};

		let onError = (err) => {
			this._events.emit('error', err);
		};

		RenderableUtils.LoadFont(this.options.fontPath, this.options.texturePath, onLoad, onError);
	}

	updateText(text)
	{
		this.textGeometry.update(text);
		this.renderable = new THREE.Mesh(this.textGeometry, this.material);
	}

	on(eventName, cb)
	{
		this._events.on(eventName, cb);
		return this;
	}
}

export {BitmapFont}