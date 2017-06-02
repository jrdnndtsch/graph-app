import React from 'react';
import { Link } from 'react-router-dom';

class Title extends React.Component {
 
  render() {
    return (
     <div className="title-block">
      <span className="huge">{this.props.data.index}</span>
      <h2>{this.props.data.title}</h2>
      <p>{this.props.data.description}</p>
     </div>
    );
  }
};

export default Title;