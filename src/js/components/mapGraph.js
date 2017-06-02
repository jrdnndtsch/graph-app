import React from 'react';
import { Link } from 'react-router-dom';
import { make_chart_base } from './../lib/graphHelpers.js';

class MapGraph extends React.Component {

  componentDidMount() {
    this.getMap()
  }
  charSettings = () => {
    return {
      colors: this.props.data.colors, 
      title: this.props.data.title,
      target: `#${this.props.data.id}`
    }
  }
  makeGraph = (data) => {
    let map_settings = this.charSettings()
    var svg = d3.select(map_settings.target),
        width = +svg.attr("width"),
        height = +svg.attr("height")
    var bg = make_chart_base(svg, map_settings.title)        
    
    var projection = d3.geoMercator()
            .translate([width/2, (height + 160)/2])
            .scale([80]);
    // Define default path generator
    var path = d3.geoPath()
            .projection(projection); 

    var max_value = Math.max.apply(Math,data.features.map(function(o){return o.properties.value;}))
    var transform_value = d3.scaleLinear()
                            .domain([0,max_value])
                            .rangeRound([0,3])                             
    var value_color = d3.scaleOrdinal()                                  
                        .domain([0,3])
                        .range(map_settings.colors)
    //Bind data and create one path per GeoJSON feature
    svg.selectAll("path")
            .data(data.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("id", function(d) {
              return d.properties.name
            })
            .attr("fill", function(d){
              return value_color(transform_value(d.properties.value))
            })      
            
                
  }

  getMap = () => {
    fetch('http://localhost:3004/maps')
      .then(data => data.json())
      .then((data) => {
        this.mapData(data)
      })
  }
 
  mapData = (map) => {
    let data = this.props.data.data[0].density
    let map_type = this.props.data.mapType
    data.forEach((c) => {
      map[map_type].features.forEach((val) => {
        if(val.properties.name == c.name) {
          val.properties.value = c.density
        }
      })
    })
    this.makeGraph(map)
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

export default MapGraph;