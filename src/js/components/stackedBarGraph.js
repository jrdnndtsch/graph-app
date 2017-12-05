import React from 'react';
import { Link } from 'react-router-dom';
import { make_chart_base } from './../lib/graphHelpers.js';
import { make_y_gridlines } from './../lib/graphHelpers.js';

class StackedBarGraph extends React.Component {	


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
			x: 'Month'
		}
	}

 makeChart = () => {
 	let bar_settings = this.charSettings();
 	var svg = d3.select(bar_settings.target),
 	    margin = {top: 75, right: 30, bottom: 30, left: 60},
 	    width = +svg.attr("width") - margin.left - margin.right,
 	    height = +svg.attr("height") - margin.top - margin.bottom     
 	var bg = make_chart_base(svg, bar_settings.title)
 	
  // appending element to the graph bg and translating it based on the set top and left margins      
 	var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 	var x = d3.scaleBand()
 	    .rangeRound([0, width]) // set the range of the x-axis
 	    .paddingInner(0.30) // value btw 0 and 1 - ratio of range reserved for blank space
 	    .align(0.5);

  var y = d3.scaleLinear()
      .rangeRound([height, 0]);    

 	var z = d3.scaleOrdinal()
 	    .range(bar_settings.colors);    
	
  // take one data set - remove the key for the x-axis value, make a list of the remaining keys - this relies on all data sets having every possible jey value pair.
 	z.domain(d3.keys(bar_settings.data[0]).filter((key) => { return key !== bar_settings.x }))

 	bar_settings.data.forEach(function(d) {
 	    var y0 = 0;
      d.values = z.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
      d.total = d.values[d.values.length - 1].y1;
 	});

  // WHAT DOES THIS DO
 	//bar_settings.data.sort(function(a, b) { return b.total - a.total; });
 

  // make the range for the x-axis the x-axis value defined in the config
	x.domain(bar_settings.data.map((d) => { return d[bar_settings.x]}));


  y.domain([0, d3.max(bar_settings.data, function(d) { return d.total; })]).nice(); // set range for y-axis so that it is between 0 and above max rather than 0 - 1

    //the x-axis labels   
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

    // make the bars      
    var bars = svg.selectAll(".state")
          .data(bar_settings.data)
        .enter().append("g")
          .attr("class", "g")
          .attr("transform", function(d) { return "translate(" + (x(d[bar_settings.x]) + 60) + ",75)"; }); 

    bars.selectAll("rect")
         .data(function(d) {console.log(d.values, 'tme');return d.values; })
       .enter().append("rect")
         .attr("width", x.bandwidth())
         .attr("y", function(d) { return y(d.y1); })
         .attr("height", function(d) { return y(d.y0) - y(d.y1); })
         .style("fill", function(d) { return z(d.name); });         
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

export default StackedBarGraph;