import React from 'react';
import { Link } from 'react-router-dom';

class TableItem extends React.Component {
  componentDidMount() {
    
  }

  render() {
    return (
      <div className="table-item">
       <span>{this.props.index}</span>
       <h2>{this.props.title}</h2>
      </div>
    );
  }
};

export default TableItem;