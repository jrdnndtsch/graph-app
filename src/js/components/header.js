import React from 'react';
import { Link } from 'react-router-dom';

class Header extends React.Component {
  render() {
    return (
      <header>
	      <div className="wrapper">
	        <h1><span>Annual Report</span><span>— 2017</span></h1>
	        <h2>Some other details about this annual report can go here.</h2>
	      </div>  
      </header>
    );
  }
};

export default Header;