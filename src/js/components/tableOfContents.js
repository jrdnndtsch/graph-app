import React from 'react';
import { Link } from 'react-router-dom';
import TableItem from './tableItem.js';

class TableContent extends React.Component {
  componentDidMount() {
    
  }

  render() {
    return (
      <div className={this.props.active? "table-content active" : "table-content off"}>
        <div className="wrapper wrapper--flex">
          {this.props.data.map((el, i) => {
            return <TableItem title={el.title} index={el.index} key={i} />
          })}
        </div>
      </div>
    );
  }
};

export default TableContent;