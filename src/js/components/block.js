import React from 'react';
import { Link } from 'react-router-dom';
import Title from './title.js';
import StackedBarGraph from './stackedBarGraph.js';
import RadialGraph from './radialGraph.js';
import BarGraph from './barGraph.js';
import MapGraph from './mapGraph.js';
import CanadaGraph from './canadaGraph.js';
import { StickyContainer, Sticky } from 'react-sticky';

class Block extends React.Component {
 	
 	componentWillMount() {
 		// this.makeGraphs()
 	}

 	makeTitle = () => {
 		let titleData = {
 			title: this.props.data.title, 
 			description: this.props.data.description, 
 			index: this.props.data.index
 		}
 		return titleData
 	}

 	makeGraphs = (key) => {

 		let charts = this.props.data.graphs.map((chart, i) => {
 			chart.id = `block${key}graph${i}`
 			return chart
 		})

 		return charts
 	}

 

  render() {
    return (
   <div className="block wrapper--flex">
   		<Title data={this.makeTitle()} />
   		<div className="graph-block">
	   		{this.makeGraphs(this.props.data.index).map((chart, i) => {
	   			if(chart.chartType == "stackedBar") {
	   				return <StackedBarGraph data={chart} key={i} />
	   			} else if(chart.chartType == "radial") {
	   				return <RadialGraph data={chart} key={i} />
	   			} else if(chart.chartType == "map"){
	   				return <CanadaGraph data={chart} key={i} />
	   			} else if (chart.chartType == "bar") {
	   				return <BarGraph data={chart} key={i} />
	   			}
	   		})}
   		</div>
   </div>
    );
  }
};

export default Block;