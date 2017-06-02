import React from 'react';
import { Link } from 'react-router-dom';
import { make_chart_base } from './../lib/graphHelpers.js';
import { createArcFill } from './../lib/graphHelpers.js';

class RadialGraph extends React.Component {

  componentDidMount() {
    this.makeChart();
  }
  charSettings = () => {
    return {
      width: 130,
      colors: this.props.data.colors, 
      title: this.props.data.graphTitle,
      data: this.props.data.data, 
      target: `#${this.props.data.id}`,
      start: -Math.abs(130), 
      end: Math.abs(130), 
      length: 130 * 2, 
      base_color: this.props.data.baseColor, 
      x: 'percentage', 
      y: 'workshop'
    }
  }

 makeChart = () => {
  let arc_settings = this.charSettings();
  let data = arc_settings.data
  // set up chart base
   var svg = d3.select(arc_settings.target),
       margin = {top: 300, right: 30, bottom: 30, left: 300},
       width = +svg.attr("width") - margin.left - margin.right,
       height = +svg.attr("height") - margin.top - margin.bottom
   var bg = make_chart_base(svg, arc_settings.title)
   var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"); 



   var z = d3.scaleOrdinal()
       .domain([0, 1, 2])
       .range(arc_settings.colors);


   var x = d3.scaleLinear()
     .domain([0, 1, 2])
     .range([160, 120, 80]);

  var legend = svg.append("g")
                  .attr("class", "legend")
                  .attr("transform","translate(0, 60)")

  legend.append("rect")
          .attr("width", '100%')
          .attr("height", 30)
          .attr("x", 0)
          .attr("fill", "#FBFBFB")        
  let mapped_data = data.map((d, i) => {
    let innerRad = x(i), 
        outerRad = innerRad + 10
    return {data: d, innerRad: innerRad, outerRad: outerRad}    
  })  

  mapped_data.forEach((el, i) => {
    let arc = d3.arc()
          .innerRadius(el.innerRad)
          .outerRadius(el.outerRad)
          .startAngle(arc_settings.start * (Math.PI/180)) //converting from degs to 
          .endAngle(arc_settings.end * (Math.PI/180)) 
    let arcData = d3.arc()
          .innerRadius(el.innerRad)
          .outerRadius(el.outerRad)
          .startAngle(arc_settings.start * (Math.PI/180)) //converting from degs to radians
          .endAngle(createArcFill(el.data[arc_settings.x], arc_settings) * (Math.PI/180))            
    g.append("path")    
       .attr("d", arc) 
       .attr("fill", arc_settings.base_color)  
    g.append("path")    
       .attr("d", arcData) 
       .attr("fill", z(i)) 
    var legend_item = legend.append("g")
            .attr("class", "legend_item")        
    legend_item.append("circle")
                .attr("r", 6)
                .attr("fill", z(i))
    legend_item.append("text")
                  .attr("dx", 10)
                  .attr("dy", 5)
                  .attr("fill", "#4A4A4A")
                  .attr("font-size", "13px")
                  .attr("text-anchor", "start")
                  .text(el.data[arc_settings.x] + '%')
    legend_item.append("text")   
                  .attr("dx", 10)
                  .attr("dy", 20)
                  .attr("fill", "#4A4A4A")
                  .attr("font-size", "10px")
                  .text(el.data[arc_settings.y])               
    legend.selectAll("g")
        .attr("transform", function (d, i) {
             var lengend_width = legend.node().getBoundingClientRect().width
             var full = (lengend_width / data.length)
             var half = ((lengend_width / data.length)/2)
             var circle_width = d3.select(this).select("circle").node().getBoundingClientRect().width
             var text_width = d3.select(this).select("text").node().getComputedTextLength()
             var item_width = text_width + circle_width
             return "translate(" + ((half + (full * i)) - (item_width / 2)) + ", 20)" 
    })                

  }) 

 }
  render() {
    return (
      <figure>
        <h2>{this.props.data.title}</h2>
        <svg width="600" height="500" id={this.props.data.id}></svg>
        <p>{this.props.data.description}</p>
      </figure>
    );
  }
};

export default RadialGraph;