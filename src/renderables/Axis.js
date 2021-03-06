import {RenderableView} from "./RenderableView";
import {RenderableUtils} from "./RenderableUtils";

const notchDistance = 10;

class AxisView extends RenderableView
{
    // todo: make this a view controlled by data given and assumptions 
    // based on the layout
	constructor(options)
	{
		super(options);

		let defaultOptions = {
			label: '',
			lineColor: 0xAABBFF,
			vertical: true,
			steps: 2,
			thickness: 0.5,
		};
		let required = ['fontFactory', 'range'];

        this.options = RenderableUtils.CreateOptions(options, required, 
            'Axis.options', defaultOptions);

		if (this.options.steps < 2) {
			this.options.steps = 2;
		}

		this._textFields = [];
		this._createGrid();
		this._createTextFields();

		this.on('resize', () => {
			this.empty();
			this._createGrid();
		});
	}

	update()
	{
		this.empty();
		this._textFields = [];
		this._createGrid();
		this._createTextFields();
	}

	updateRange(range)
	{
		this.options.range = range;
		this.empty(this._textFields);
		this._textFields = [];
		this._createTextFields();
	}
}

class VerticalAxis extends AxisView
{
	_createGrid()
	{
		this.axisSteps = [
            {
                posInAxis: 0.1,
                stepIndex: 0
            },
            {
                posInAxis: 0.9,
                stepIndex: 1
            }
		];

		let cameraHeight = this._camera.top,
			cameraWidth = this._camera.right,
			lineColor = this.options.lineColor,
			thick = this.options.thickness;

		let verticalGridPoints = [
			[cameraWidth, this.axisSteps[0].posInAxis * cameraHeight],
			[cameraWidth, this.axisSteps[1].posInAxis * cameraHeight],
		];
        let verticalGrid = RenderableUtils.CreateLine(verticalGridPoints, 
            lineColor, thick);
		this.add(verticalGrid);

		_.forEach(this.axisSteps, (step) => {
			let yPos = step.posInAxis * cameraHeight;
			let points = [
				[cameraWidth, yPos],
				[cameraWidth - notchDistance, yPos],
			];
			let line = RenderableUtils.CreateLine(points, lineColor, thick);
			this.add(line);
		});
	}

	_createTextFields()
	{
		let cameraHeight = this._camera.top,
			cameraWidth = this._camera.right;

		_.forEach(this.axisSteps, (step) => {
			let yPos = step.posInAxis * cameraHeight;
			let textPos = [cameraWidth - notchDistance, yPos];

			let textString = RenderableUtils.Lerp(
				this.options.range.min,
				this.options.range.max,
				step.stepIndex
			).toFixed(2);

			let text = this.options.fontFactory.create('lato', textString);

			text.geometry.computeBoundingBox();
			let bbox = text.geometry.boundingBox;

			text.scale.x = text.scale.y = 0.5;
			text.position.x = textPos[0] - bbox.max.x / 1.5;
			text.position.y = textPos[1] - 5;
			this.add(text);
			this._textFields.push(text);
		});
	}
}

class HorizontalAxis extends AxisView
{
	_createGrid()
	{
		this.endPositions = [
			[0, 0], [1, 1]
		];

		let cameraHeight = this._camera.top,
			cameraWidth = this._camera.right,
			lineColor = this.options.lineColor,
			thick = this.options.thickness;

		let horzGridPoints = [
			[0, cameraHeight],
			[cameraWidth, cameraHeight],
		];
        let horzGrid = RenderableUtils.CreateLine(horzGridPoints, 
            lineColor, thick);
		this.add(horzGrid);

		_.forEach(this.endPositions, (step) => {
			let xPos = step[0] * cameraWidth;
			let points = [
				[xPos, cameraHeight],
				[xPos, cameraHeight - notchDistance],
			];
			let line = RenderableUtils.CreateLine(points, lineColor, thick);
			this.add(line);
		});
	}

	_createTextFields()
	{
		let cameraHeight = this._camera.top,
			cameraWidth = this._camera.right;

		// draw first notch
		let textString = RenderableUtils.Lerp(
			this.options.range.min,
			this.options.range.max,
			this.endPositions[0][1]
		).toFixed(2);

		let text = this.options.fontFactory.create('lato', textString);
		text.scale.x = text.scale.y = 0.5;
		text.position.x = 5;
		text.position.y = cameraHeight - notchDistance - 5;
		this.add(text);
		this._textFields.push(text);

		// draw last notch
		textString = RenderableUtils.Lerp(
			this.options.range.min,
			this.options.range.max,
			this.endPositions[1][1]
		).toFixed(2);

		text = this.options.fontFactory.create('lato', textString);

		text.geometry.computeBoundingBox();
		let bbox = text.geometry.boundingBox;

		text.scale.x = text.scale.y = 0.5;
		text.position.x = cameraWidth - bbox.max.x / 2 - 5;
		text.position.y = cameraHeight - notchDistance - 5;
		this.add(text);
		this._textFields.push(text);
	}
}

export {VerticalAxis, HorizontalAxis};