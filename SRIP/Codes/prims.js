var key = [];
var parent = [];
var selected = [];  //contains vertices in mst

var MAX = 10000000000;
var limit_loop = 20;

function EdgesConstructor(x1, y1, x2, y2) {
    this.source = new Constructor(x1, y1);
    this.destination = new Constructor(x2, y2);
    this.dist = 0;
    this.SI = -1; //source index in testpoint
    this.DI = -1; //destination index in testpoint
}
function makeTree() {
    console.log("In makeTree");
    //we are assuming the total connected graph
    //here we make adjacency Matrix
    var Input_Edges = [];

    //Upto here we have created the 2d Edges and now populating it

    for (var i = 0; i < TestPoints.length; i++) {
        for (var j = 0; j < TestPoints.length; j++) {
            if (i < j) {
                var dist = euclidienDistance(TestPoints[i].x, TestPoints[j].x, TestPoints[i].y, TestPoints[j].y);
                var obj = new EdgesConstructor(TestPoints[i].x, TestPoints[i].y, TestPoints[j].x, TestPoints[j].y);
                obj.dist = dist;
                obj.SI = i;
                obj.DI = j;
                Input_Edges.push(obj);
            }
        }
    }
    //Now we sort the Edges array based on dist
    Input_Edges.sort(function (obj1, obj2) { return obj1.dist - obj2.dist });

    for (var i = 0; i < Input_Edges.length; i++) {
        console.log("**********");
        console.log("S->" + Input_Edges[i].source.x + "  " + Input_Edges[i].source.y);
        console.log("D->" + Input_Edges[i].destination.x + "  " + Input_Edges[i].destination.y);
        console.log("Dist->>" + Input_Edges[i].dist);
    }
    return Input_Edges;
}



function updation(Input_Edges, vertex) {
    console.log("*********************Updating keys and parent********************");
    for (var i = 0; i < Input_Edges.length; i++) {
        var temp1 = euclidienDistance(Input_Edges[i].source.x, vertex.x, Input_Edges[i].source.y, vertex.y);
        var temp2 = euclidienDistance(Input_Edges[i].destination.x, vertex.x, Input_Edges[i].destination.y, vertex.y);
        if (temp1 == 0 | temp2 == 0) {
            //adjacent vertices
            var c1 = Input_Edges[i].DI; //index of destination vertex
            var c2 = Input_Edges[i].SI; //index of destination vertex
            if (selected[c1] == false | selected[c2] == false) {
                //vertex not in MST
                if (temp1 == 0) {
                    if (key[c1] > Input_Edges[i].dist) {
                        key[c1] = Input_Edges[i].dist;
                        var p = Input_Edges[i].SI; //index of source vertex
                        parent[c1] = p;
                    }
                }
                else if (temp2 == 0) {
                    if (key[c2] > Input_Edges[i].dist) {
                        key[c2] = Input_Edges[i].dist;
                        var p = Input_Edges[i].DI; //index of source vertex
                        parent[c2] = p;
                    }
                }

            }
        }

    }
}



function findMinkey() {
    console.log("*********************Finding Minimum Key********************");
    var MIN = MAX;
    var store = -1;

    for (var i = 0; i < key.length; i++) {
        console.log(selected[i]);
        if (selected[i] == false && MIN > key[i]) {
            MIN = key[i];
            store = i;
        }
    }
    return store;
}
function primsAlgoUtil(Input_Edges) {
    console.log("*********************Prims Algo util********************");
    var count = 0;
    var limit = 0;
    while (count != TestPoints.length && limit < limit_loop) {
        limit = limit + 1;
        var index = findMinkey();
        if (index != -1) {
            var vertex = TestPoints[index];
            selected[index] = true;
            //Now we iterate through the adjacent edges of this vertex and update keys and parents
            updation(Input_Edges, vertex);
            count = count + 1;
        }
    }
}

function primsAlgo(Input_Edges) {
    console.log("*********************Prims Algo********************");
    key = [];
    selected = [];
    parent = [];
    var x = false;
    for (var i = 0; i < TestPoints.length; i++) {
        key.push(MAX);
        selected.push(x);
        parent.push(MAX);
    }
    parent[0] = -1;
    key[0] = 0;

    primsAlgoUtil(Input_Edges);

    //now we extract mst edges from parent and key value
    var MST = [];
    for (var i = 0; i < parent.length; i++) {
        console.log("Parent of " + i + "  is ->" + parent[i]);
        if (parent[i] != -1) {
            var index1 = findEdgeUtil(Input_Edges, TestPoints[parent[i]], TestPoints[i]);
            var index2 = findEdgeUtil(Input_Edges, TestPoints[i], TestPoints[parent[i]]);
            if (index1 != -1) {
                MST.push(Input_Edges[index1]);
                stock_Edges.push(Input_Edges[index1]);
            }
            else {
                MST.push(Input_Edges[index2]);
                stock_Edges.push(Input_Edges[index2]);
            }

        }
    }

    console.log("MST Edges->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>." + MST.length);
    for (var i = 0; i < MST.length; i++) {
        console.log("->" + MST[i].source.x + "   " + MST[i].source.y);
        console.log(MST[i].destination.x + "   " + MST[i].destination.y);
    }
    return MST;

}

function findEdgeUtil(Input_Edges, src, dest) {
    var status = -1;
    for (var i = 0; i < Input_Edges.length; i++) {
        if (Input_Edges[i].source.x == src.x && Input_Edges[i].source.y == src.y) {
            if (Input_Edges[i].destination.x == dest.x && Input_Edges[i].destination.y == dest.y) {
                status = i;
            }
        }
    }
    return status;
}


