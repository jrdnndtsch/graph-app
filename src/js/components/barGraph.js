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

 	var x = d3.scaleBand()
 	    .rangeRound([0, width]) // set the range of the x-axis
 	    // .paddingInner(0.30) // value btw 0 and 1 - ratio of range reserved for blank space
 	    // .align(0.5);
  x.domain(bar_settings.data.map((d) => { return d[bar_settings.x]}));    
  g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
  // var bars = svg.selectAll(".bars")
  //           .data(bar_settings.data)
  //         .enter().append("g")
  //           .attr("class", "g") 
            // .attr("transform", function(d) { console.log(x(d[bar_settings.x]), d.percentage);return "translate(" + (x(d[bar_settings.x]) + 60) + ",75)"; });


  g.selectAll('rect')
        .data(bar_settings.data)  
        .enter()
        .append("rect")
        .attr("y", function(d){return height - d[bar_settings.y] }) 
        .attr("width", 20) 
        .attr("height", function(d){ return d[bar_settings.y]})      
        .attr("x", function(d, i) { return (i * (width / bar_settings.data.length))})   
        .attr("fill", "cyan")   
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