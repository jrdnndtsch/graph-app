import React from 'react';

class PieChart extends React.Component {
	componentDidMount() {
		this.makeChart()
	}

	charSettings = () => {
		return {
			data: [
			  { label: 'Abulia', count: 10 },
			  { label: 'Betelgeuse', count: 20 },
			  { label: 'Cantaloupe', count: 30 },
			  { label: 'Dijkstra', count: 40 }
			], 
			colors:  ["#FAF1D2","#FAE194","#E8B511","#997500"]
		}
	} 

	makeChart = () => {
		var settings = this.charSettings()
		var svg = d3.select("#pie"),
				width = svg.attr("width"),
				height = svg.attr("height"),
				radius = Math.min(width, height) / 2,
				color	= d3.scaleOrdinal()
									.range(settings.colors)
		svg.append("g")
				.attr('transform', 'translate(' + (width / 2) +  ',' + (height / 2) + ')');							
		var arc = d3.arc()							
						.innerRadius(0)
						.outerRadius(radius)
		var pie = d3.pie()				
						.value(function(d) {return d.count})
						.sort(null)
		var path = svg.selectAll("path")				
						.data(pie(settings.data))
						.enter()
						.append("path")
						.attr("d", arc)
						.attr("fill", function(d){
							return color(settings.data.label);
						})
	}

	render() {
		return(
			<figure>
				<p>Pie Chart</p>
				<svg width="360" height="360" id="pie"></svg>
			</figure>
		)
	}
}

export default PieChart;