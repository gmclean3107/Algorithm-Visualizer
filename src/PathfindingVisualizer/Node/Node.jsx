import React, {Component} from 'react';
import './Node.css';

export default class Node extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const{row, col, isFinish, isStart, isVisited, isWall, onMouseDown, onMouseEnter, onMouseUp} = this.props;
        const extraClassNames = isFinish ? 'node-finish' : isStart ? 'node-start' : isVisited ? 'node-visited' : isWall ? 'node-wall' : '';


        return (
        <div
            id = {`node-${row}-${col}`} className={`node ${extraClassNames}`}
            onMouseDown={() => onMouseDown(row, col)}
            onMouseEnter={() => onMouseEnter(row, col)}
            onMouseUp={() => onMouseUp()}
        ></div>
        );
    }

}

export const DEFAULT_NODE = {
    row:0,
    col:0,
};
