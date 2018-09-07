main();

function main()
{
	new glchart.Chart({
		chart: {
			parentElement: '#renderingArea',
			fontColor: 0x0000ff,
			title: 'RandomData'
		},
		axis: {
			x: {
				lineColor: 0xaabbff,
				label: 'X',
			},
			y: {
				lineColor: 0xaabbff,
				label: 'Y'
			},
		},
		datasets: [
			{
				name: 'Value 1',
				data: createRandomData(10000, 100),
				unit: 1/10,
			}
		]
	});
}

function createRandomData(size, max)
{
	if (max === null || max === undefined) max = 1;

	let data = [];

	for (let x = 0; x < size; x++) {
		data.push([x, Math.random() * max]);
	}

	return data;
}