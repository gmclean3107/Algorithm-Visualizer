import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, shortestPathCalculator} from "../Algorithms/dijkstra";

import './PathfindingVisualizer.css';

let START_NODE_ROW = 3;
let START_NODE_COL = 8;
let FINISH_NODE_ROW = 17;
let FINISH_NODE_COL = 48;

export default class PathfindingVisualizer extends Component{
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            mousePressed: false,
            moveStartNode: false,
            moveEndNode: false,
        };
    }

    componentDidMount() {
        const grid = getInitialGrid();
        this.setState({grid});
    }

    visualizeDijkstra() {
        this.setState({mousePressed: false, moveStartNode: false});
        document.getElementById("start-node-move").disabled = true;
        document.getElementById("end-node-move").disabled = true;

        const {grid} = this.state;

        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];

        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        const shortestPath = shortestPathCalculator(finishNode);

        this.animatedDijkstra(visitedNodesInOrder, shortestPath);
    }

    animatedDijkstra(visitedNodesInOrder, shortestPath) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(shortestPath);
                }, 10 * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-visited';
            }, 10 * i);
        }
    }

    animateShortestPath(shortestPath) {
        for (let i = 0; i < shortestPath.length; i++) {
            setTimeout(() => {
                const node = shortestPath[i];
                console.log(node);
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-shortest-path';
            }, 50 * i);
        }
        document.getElementById("start-node-move").disabled = false;
        document.getElementById("end-node-move").disabled = false;
    }

    mouseDown(row, col) {
        if(this.state.moveStartNode === false && this.state.moveEndNode == false) {
            const newGrid = getGridWithWalls(this.state.grid, row, col);
            this.setState({grid: newGrid, mousePressed: true});
        }
        if (this.state.moveStartNode === true){
            const newGrid = moveStartNode(this.state.grid, row, col);
            this.setState({grid: newGrid, mousePressed: true, moveStartNode: false});
        }
        if (this.state.moveEndNode === true){
            const newGrid = moveEndNode(this.state.grid, row, col);
            this.setState({grid: newGrid, mousePressed: true, moveEndNode: false});
        }
    }

    mouseHeldDown(row, col) {
        if(this.state.moveStartNode === false && this.state.moveEndNode == false) {
            if (!this.state.mousePressed) return;
            const newGrid = getGridWithWalls(this.state.grid, row, col);
            this.setState({grid: newGrid});
        }
        if (this.state.moveStartNode === true){
            if (!this.state.mousePressed) return;
            const newGrid = moveStartNode(this.state.grid, row, col);
            this.setState({grid: newGrid, moveStartNode: false});
        }
        if (this.state.moveEndNode === true){
            if (!this.state.mousePressed) return;
            const newGrid = moveEndNode(this.state.grid, row, col);
            this.setState({grid: newGrid, moveEndNode: false});
        }
    }

    mouseUp() {
        this.setState({mousePressed: false});
    }

    changeMoveStartNode(){
        this.setState({moveEndNode: false,moveStartNode: !this.state.moveStartNode});
    }

    changeMoveEndNode(){
        this.setState({moveStartNode: false, moveEndNode: !this.state.moveEndNode});
    }

    render() {
        const{grid, mousePressed} = this.state;

        return (
            <>
                <button onClick={() => this.visualizeDijkstra()}>
                    Visualize Dijkstra's Algo
                </button>
                <button onClick={() => this.changeMoveStartNode()} id="start-node-move">Move Start Node</button>
                <button onClick={() => this.changeMoveEndNode()} id="end-node-move">Move End Node</button>
                <div className="grid">
                    {grid.map((row, rowIdx) => {
                        return (
                            <div key={rowIdx}>
                                {row.map((node, nodeIdx) => {
                                    const {row, col, isFinish, isStart, isWall} = node;
                                    return (
                                        <Node
                                            key={nodeIdx}
                                            col={col}
                                            row={row}
                                            isFinish={isFinish}
                                            isStart={isStart}
                                            isWall={isWall}
                                            mousePressed={mousePressed}
                                            onMouseDown={(row, col) => this.mouseDown(row, col)}
                                            onMouseEnter={(row, col) => this.mouseHeldDown(row, col)}
                                            onMouseUp={() => this.mouseUp()}
                                            ></Node>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </>
        );
    }
}

//Method that creates nodes
const createNode = (col, row) => {
    return {
        col,
        row,
        isStart: col === START_NODE_COL && row === START_NODE_ROW,
        isFinish: col === FINISH_NODE_COL && row === FINISH_NODE_ROW,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null
    };
};

//Creates the grid
const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 20; row++) {
        const currentRow = [];
        for (let col = 0; col < 50; col++) {
            currentRow.push(createNode(col, row));
        }
        grid.push(currentRow);
    }
    return grid;
};
//Adds walls
const getGridWithWalls = (grid,row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};

const moveStartNode = (grid, row, col) => {
    document.getElementById(`node-${START_NODE_ROW}-${START_NODE_COL}`).className="node";
    START_NODE_ROW = row;
    START_NODE_COL = col;
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newStartNode = {
        ...node,
        isStart: !node.isStart,
    };
    newGrid[row][col] = newStartNode;
    return newGrid;
};

const moveEndNode = (grid, row, col) => {
    document.getElementById(`node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`).className="node";
    FINISH_NODE_ROW = row;
    FINISH_NODE_COL = col;
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newFinishNode = {
        ...node,
        isFinish: !node.isFinish,
    };
    newGrid[row][col] = newFinishNode;
    return newGrid;
};
