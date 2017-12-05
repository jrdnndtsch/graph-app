import React from 'react';
import { Link } from 'react-router-dom';
import { make_chart_base } from './../lib/graphHelpers.js';
import { make_y_gridlines } from './../lib/graphHelpers.js';

class BarGraph extends React.Component {	


	componentDidMount() {
		this.makeChart();
	}
	charSettings = () => {
		return {
			colors: this.props.data.colors,
			tick_num: 5, 
			title: this.props.data.graphTitle,
			data: this.props.data.data, 
			target: `#${this.props.data.id}`, 
			x: 'question', 
      y: 'percentage'
		}
	}

 makeChart = () => {
 	let bar_settings = this.charSettings();
 	var svg = d3.select(bar_settings.target),
 	    margin = {top: 75, right: 30, bottom: 30, left: 60},
 	    width = +svg.attr("width") - margin.left - margin.right,
 	    height = +svg.attr("height") - margin.top - margin.bottom     
 	var bg = make_chart_base(svg, bar_settings.title)
 	     
 	var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // this will act as the width for the bars
 	var x = d3.scaleBand()
 	    .rangeRound([0, width]) // set the range of the x-axis
 	    .paddingInner(0.30) // value btw 0 and 1 - ratio of range reserved for blank space
 	    .align(0.5);

  x.domain(bar_settings.data.map((d) => { return d[bar_settings.x]}));    
  
  var y = d3.scaleLinear()
      .rangeRound([height, 0]); 
      
  y.domain([0, d3.max(bar_settings.data, function(d) { return d.percentage; })]).nice(); // set range for y-axis so that it is between 0 and above max rather than 0 - 1        
       
  g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
  
 // ya lines across the graph
 g.append("g")
    .attr("class", "grid")
    .call(make_y_gridlines(y, bar_settings.tick_num)
         .tickSize(-width)
         .tickFormat("")
    ) 
    // y-axis labels
    .append("g")
      .call(d3.axisLeft(y).ticks(bar_settings.tick_num)) 
  var bar_data  = bar_settings.data.map((data) => {
    return [{percentage: data.percentage}]
  })

  console.log(bar_data, 'bar data')
  var bars = svg.selectAll(".bar")
          .data(bar_settings.data)
        .enter().append("g")
          .attr("class", "bar")
          .attr("transform", function(d) { return "translate(" + (x(d[bar_settings.x]) + 60) + ",75)"; })
  bars.selectAll(".rect")
        .data(function(d){return [{percentage: d.percentage}]})
          .enter().append("rect")
       .attr("width", x.bandwidth())
       .attr("y", function(d) {return y(d[bar_settings.y])})
       .attr("height", function(d) {return height - y(d[bar_settings.y]) })
       .style("fill", bar_settings.colors[1]);                 
 }



  render() {
    return (
   <figure>
   	<h2>{this.props.data.title}</h2>
   	<svg width="600" height="400" id={this.props.data.id}></svg>
   	<p>{this.props.data.description}</p>
   </figure>
    );
  }
};

export default BarGraph;