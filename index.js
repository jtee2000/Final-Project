Promise.all([
	d3.json('map.geojson'),

]).then(data => {
    d3.csv("world_obesity.csv", d3.autoType).then(res => {
        createMap(data, res)
    })
})

tooltip = d3.select('body')
				.append('div')
				.attr('class', 'tooltip')
				.style('opacity', 0)
				.style('padding', '10px')
				.style('font-family', 'Nunito Sans')

function createMap(data, newData) {
	var world = data[0]
    var worldDataObj = {}
    var worldData = newData
    worldData.map(item => worldDataObj[item.Country] = item)

	var width = 1000
	var height = 520
	var total_y = 330

	// var path = d3.geoPath()
	var projection = d3.geoNaturalEarth1()
		.fitExtent([[0, 0], [width, height]], world)

	// var map_data = d3.map()
    console.log(d3.max(worldData.map(d => {return d.value})))
	var colorScale_map = d3.scaleLinear()
		.domain([0, d3.max(worldData.map(d => {return d.value}))])
        .range(["white", "#FF2626"])
	
	width = 1000
	height = 450 

	var svg = d3.select('#map')
		.append('svg')
		.attr('width', width)
		.attr('height', height)
		.attr('viewBox', [0, 0, width, height])
	
	function obesityMap() {
		// clear svg contents
		svg.selectAll('*').remove()

		// draw the map
		svg.append('g')
			.selectAll('path')
			.data(world.features)
			.enter()
			.append('path')
			.attr('d', d3.geoPath()
				.projection(projection)
			)
			// set the color of each country
			.attr('fill', function (d) {
				var country_data = worldDataObj[d.properties.name] || 0
				if (country_data !== 0) {
                    d.pop = country_data.value
					d.percent = country_data.Female
				} else {
					d.pop = 0
					d.percent = 0
				}
				return colorScale_map(d.pop)
			})
			.style('stroke', 'gray')
			.attr('class', 'Country')
			.style('opacity', .8)
			.on('mouseover', function() {
				d3.select(this)
					.style('opacity', 1)
					.style('stroke', '#4d4b47')
			})
			.on('mouseout', function() {
				d3.select(this)
					.style('opacity', 0.9)
					.style('stroke', 'gray')
			})
        console.log(worldDataObj['Uganda'])
		// tooltip on hover
		svg.selectAll('path')
			.on('mouseover.tooltip', function(d, x) {
				tooltip.transition()
					.duration(200)
					.style('opacity', .9)
				tooltip.html('Country: <b>'+ `${x.properties.name}` + '</b><br>' + 'Obesity Rate: <b>' + `${worldDataObj[x.properties.name].value}` + '</b><br>'
                + 'Female Obesity Rate: <b>' + `${worldDataObj[x.properties.name].Female}%` + '</b><br>'
                + 'Male Obesity Rate: <b>' + `${worldDataObj[x.properties.name].Male}%` + '</b><br>'
                )
					.style('left', (d.pageX) + 'px')
					.style('top', (d.pageY + 10) + 'px')
			})
			.on('mouseout.tooltip', function() {
				tooltip.transition()
					.duration(200)
					.style('opacity', 0)
			})
			.on('mousemove', function(d) {
				tooltip.style('left', (d.pageX) + 'px')
					.style('top', (d.pageY + 10) + 'px')
			})
		

		// LEGEND
		// append a defs (for definition) element to your SVG
		var defs = svg.append('defs')

		// append a linearGradient element to the defs and give it a unique id
		var linearGradient = defs.append('linearGradient')
			.attr('id', 'linear-gradient')
			
		// horizontal gradient
		linearGradient
			.attr('x1', '0%')
			.attr('y1', '0%')
			.attr('x2', '100%')
			.attr('y2', '0%')

		linearGradient.append('stop')
			.attr('offset', '0%')
			.attr('stop-color', '#FFE6E6'); 

		linearGradient.append('stop')
			.attr('offset', '100%')
			.attr('stop-color', '#FF2626'); 

		// draw the rectangle and fill with gradient
		svg.append('rect')
			.attr('width', 200)
			.attr('height', 20)
			.attr('x', 400)
			.attr('y', 410)
			.style('fill', 'url(#linear-gradient)')
			
		// legend text (left end)
		svg.append('text')
			.attr('text-anchor', 'right')
			.attr('x', 370)
			.attr('y', 450)
			.attr('class', 'nunito')
			.style('font-size', '14px')
			.style('fill', 'white')
			.text('0')

		// legend text (right end)
		svg.append('text')
			.attr('text-anchor', 'left')
			.attr('x', 600)
			.attr('y', 450)
			.attr('class', 'nunito')
			.style('font-size', '14px')
			.style('fill', 'white')
			.text('50.8')
		
	}

		
	// obseity rate map
	obesityMap()

}