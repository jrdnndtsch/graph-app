import React from 'react';
import ReactDOM from 'react-dom';
import Header from './components/header.js';
import Navigation from './components/navigation.js';
import Title from './components/title.js';
import Graph from './components/graph.js';
import Block from './components/block.js';
import TableOfContents from './components/tableOfContents.js';
import StackedBarGraph from './components/stackedBarGraph.js';
import { StickyContainer, Sticky } from 'react-sticky';
class Main extends React.Component {
	constructor() {
	  super();
	  this.state = {
	    blocks: [], 
	    general: {}, 
	    tableContent: [], 
	    menuStatus: false
	  }
	}

	componentWillMount() {
		this.loadData()
	}

	loadData = () => {
		fetch('http://localhost:3004/llc')
			.then(data => data.json())
			.then((data) => {
				let blocks = data.blocks.map((block) => {
					return block
				})

				let table = data.blocks.map((block) => {
					return {index: block.index, title: block.title}
				})
				this.setState({
					blocks: blocks, 
					general: {
						title: data.title, 
						company: data.company
					}, 
					tableContent: table
				})
			})
	}

	menuClick(){
		let newStatus = !this.state.menuStatus
		this.setState({
			menuStatus: newStatus
		})
	}

  render() {
    return (
    		<div>
	        <Header/>
	        <StickyContainer>
	        	<Sticky>
	        		{
								({
								  style
								}) => {
								  return (
								   	<div style={style} onClick={this.menuClick.bind(this)}>
								   		<Navigation company={this.state.general.company} title={this.state.general.title} menu={this.state.menuStatus} />
								   	</div>
								  )
								}
	        		}
	        	</Sticky>
	        	<main className="wrapper">
	        		{this.state.blocks.map((block, i) => {
	        			return <Block data={block} key={i} />
	        		})}
	        	</main>
	        	<TableOfContents data={this.state.tableContent} active={this.state.menuStatus} />
	        </StickyContainer>
        </div>
       

    );
  }
}

const app = document.getElementById('app');
ReactDOM.render(<Main />, app);