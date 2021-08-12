export function dijkstra(grid, startNode, finishNode){
    //Array for storing the visited nodes.
    const visitedNodesOrdered = [];
    //Set the start node distance.
    startNode.distance = 0;
    //Gets every node and stores it in a variable.
    const unvisitedNodes = getGrid(grid);

    //Runs while there are nodes to visit.
    while (!!unvisitedNodes.length) {
        sortNodesByDistance(unvisitedNodes);
        //Gets the closest node by removing the starting/current node from the unvisitedNodes[] array.
        const closestNode = unvisitedNodes.shift();
        //If the node has a distance of Infinity then we are trapped and must stop.
        if (closestNode.distance === Infinity) return visitedNodesOrdered;
        //The current node will always be visited as we are on it.
        closestNode.isVisited = true;
        /*
        Once a node is visited it is added to the array that stores the visited nodes.
        This is in order due to the while loop.
        */
        visitedNodesOrdered.push(closestNode);
        //Checks if the current node is the target node. Returns the visitedNodesOrdered[] array if it is.
        if (closestNode === finishNode) return visitedNodesOrdered;
        updateUnvisitedNeighbours(grid, closestNode);
    }
}

function getGrid(grid) {
        //Array to store the grid
        const nodes = [];

        //Loops through the grids rows and adds each node to the nodes[] array
        for (const row of grid){
            for (const node of row) {
                nodes.push(node);
            }
        }
        return nodes;
}

function updateUnvisitedNeighbours(grid, node) {
    //Get the array of unvisited neighbours
    const unvisitedNeighbours = getUnvisitedNeighbours(grid, node);
    /*
    Loop through the array and set the distance from the start node to the previous node's distance + 1.
    Set the previous node to the node that neighbours the entire array.
    * */

    for (const neighbour of unvisitedNeighbours){
        neighbour.distance = node.distance + 1;
        neighbour.previousNode = node;
    }
}

function getUnvisitedNeighbours(grid, node) {
    //Create node value and container for the neighbours to be returned
    const neighbours = [];
    const {col, row} = node;

    //Check if the current node is at the edge of the grid. If not, get the respective nodes.
    if (row>0) neighbours.push(grid[row-1][col]);
    if (row<grid.length-1) neighbours.push(grid[row+1][col]);
    if (col>0) neighbours.push(grid[row][col-1]);
    if (col<grid[0].length-1) neighbours.push(grid[row][col+1]);
    //Filters out any nodes who have already been visited by another node.
    return neighbours.filter(neighbour => !neighbour.isVisited);
}

function sortNodesByDistance(unvisitedNodes) {
    //Sort the array of nodes by distance
    unvisitedNodes.sort((currentNode, nextNode) => currentNode.distance - nextNode.distance);
}

export function shortestPathCalculator(finishNode) {
    //Array to store the shortest path
    const shortestPathNodes = [];

    let currentNode = finishNode;

    //Runs while there is still a node available to be added to the path
    while (currentNode !== null){
        //Adds the current node to the end of the array.
        shortestPathNodes.unshift(currentNode);
        //Makes the current node the node that visited the node that was just added.
        currentNode = currentNode.previousNode;
    }
    return shortestPathNodes;
}
