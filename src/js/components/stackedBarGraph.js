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
 	     
 	var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 	var x = d3.scaleBand()
 	    .rangeRound([0, width]) // set the range of the x-axis
 	    .paddingInner(0.30) // value btw 0 and 1 - ratio of range reserved for blank space
 	    .align(0.5);

 	var y = d3.scaleLinear()
 	    .rangeRound([height, 0]);

 	var z = d3.scaleOrdinal()
 	    .range(bar_settings.colors);
	


 	z.domain(d3.keys(bar_settings.data).filter((key) => {return key !== bar_settings.x }))

 	bar_settings.data.forEach(function(d) {
 	    var y0 = 0;
      console.log(d)
 	    d.values = z.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
 	    d.total = d.values[d.values.length - 1].y1;
 	});
 	// bar_settings.data.sort(function(a, b) { return b.total - a.total; });
	x.domain(bar_settings.data.map((d) => { return d.Month}));
  y.domain([0, d3.max(bar_settings.data, function(d) { return d.total; })]).nice(); // set range for y-axis

 	    // the x-axis labels   
 	    g.append("g")
 	        .attr("class", "axis")
 	        .attr("transform", "translate(0," + height + ")")
 	        .call(d3.axisBottom(x));

 	    g.append("g")
 	      .attr("class", "grid")
 	      .call(make_y_gridlines(y, bar_settings.tick_num)
 	              .tickSize(-width)
 	              .tickFormat("")
 	        ) 
 	      .append("g")
 	        .call(d3.axisLeft(y).ticks(bar_settings.tick_num)) 
    var state = svg.selectAll(".state")
          .data(bar_settings.data)
        .enter().append("g")
          .attr("class", "g")
          .attr("transform", function(d) { return "translate(" + (x(d.Month) + 60) + ",75)"; }); 
    state.selectAll("rect")
         .data(function(d) { return d.values; })
       .enter().append("rect")
         .attr("width", x.bandwidth())
         .attr("y", function(d) { console.log(d); return y(d.y1); })
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