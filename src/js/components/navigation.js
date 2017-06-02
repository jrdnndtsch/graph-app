import React from 'react';
import { Link } from 'react-router-dom';

class Navigation extends React.Component {

  render() {
    return (
    	<nav>
    		<div className="wrapper--flex wrapper">
	    		<div>
	    			<span>Table of Contents</span>
	    		</div>
	    		<div>
	    			<span>{this.props.company}</span>
	    			<span>{this.props.title}</span>
	    		</div>
    		</div>
    	</nav>
    );
  }
};

export default Navigation;