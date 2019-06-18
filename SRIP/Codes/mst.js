var OutPutEdges = [];   //contains the output mst

var MST_itertaion_count = -1;

var temp_points = [];
var pre_store_points = [];
var store_points = [];

var temp_count = 0;
var temp_centroid_x = -1;
var temp_centroid_y = -1;


function findNextMax() {
    console.log("In findNextMax");
    while (temp_count >= 0 && OutPutEdges[temp_count].out == 1) {
        temp_count = temp_count - 1;
    }
    temp_count = temp_count - 1;
    return temp_count;
}
function findCentroid(index) {
    console.log("In findCentroid");

    var sum_x = 0;
    var sum_y = 0;
    for (var i = 0; i <= index; i++) {
        // if (temp_points.indexOf(OutPutEdges[i].source) == -1 && OutPutEdges[i].out == 0) {
        var t = findIndexTestpoint(temp_points, OutPutEdges[i].source);
        console.log("t S->>" + t);
        if (t == -1 && OutPutEdges[i].out == 0) {
            temp_points.push(OutPutEdges[i].source);
            sum_x = sum_x + OutPutEdges[i].source.x;
            sum_y = sum_y + OutPutEdges[i].source.y;
            console.log(OutPutEdges[i].source.x + "   " + temp_points[i].x + "   " + OutPutEdges[i].source.y + "   " + temp_points[i].y);
            console.log("In temp points S->>" + i);
        }
        // if (temp_points.indexOf(OutPutEdges[i].destination) == -1 && OutPutEdges[i].out == 0) {
        var t = findIndexTestpoint(temp_points, OutPutEdges[i].destination);
        console.log("t D->>" + t);
        if (t == -1 && OutPutEdges[i].out == 0) {
            temp_points.push(OutPutEdges[i].destination);
            sum_x = sum_x + OutPutEdges[i].destination.x;
            sum_y = sum_y + OutPutEdges[i].destination.y;
            console.log(OutPutEdges[i].destination.x + "   " + temp_points[i].x + "   " + OutPutEdges[i].destination.y + "   " + temp_points[i].y);
            console.log("In temp points D->>" + i);
        }
    }
    temp_centroid_x = (sum_x) / (index + 1);
    temp_centroid_y = (sum_y) / (index + 1);
}
function findIntraClusterDist() {
    console.log("In findIntraClusterDist");
    var max = 0;
    for (var i = 0; i < temp_points.length; i++) {
        var temp = euclidienDistance(temp_points[i].x, temp_centroid_x, temp_points[i].y, temp_centroid_y);
        if (max < temp) { max = temp; }
    }
    return max;

}

function findInterClusterDist() {
    console.log("In findInterClusterDist");
    var min = 10000000;
    //tp contains that point which is not in temp points means not in mst cluster or outside the cluster
    var tp = [];
    for (var i = 0; i < TestPoints.length; i++) {
        if (findIndexTestpoint(temp_points, TestPoints[i]) == -1) {
            tp.push(TestPoints[i]);
        }
    }
    for (var i = 0; i < tp.length; i++) {
        var dist = euclidienDistance(temp_centroid_x, tp[i].x, temp_centroid_y, tp[i].y);
        if (dist < min) { min = dist; }
    }
    return min;
}

//We have to find the threshold at each iteration
function findThreshold() {
    console.log("In findThreshold");
    //here we first iterate through all values of threshold to select the value based on ratio
    var index;
    index = findNextMax();
    var min = 1000000000;
    while (index > 0) {
        findCentroid(index);
        var dist1 = findIntraClusterDist();
        var dist2 = findInterClusterDist();
        var ratio = dist1 / dist2;
        if (min > ratio) {
            min = ratio;
            store_points = [];
            for (var i = 0; i < temp_points.length; i++) {
                store_points.push(temp_points[i]);
            }
        }
        index = findNextMax();
        temp_points = [];
        console.log("Index->>" + index);
    }
    //so threshold will be like, all the index after store must be removed from cluster
}


function MSTClustering() {
    console.log("In MSTClustering");
    findThreshold();
    //now we update the out variable of Output Edges based on temp_points
    for (var i = 0; i < OutPutEdges.length; i++) {
        // if (temp_points.indexOf(OutPutEdges[i].source) == -1) {
        if (findIndexTestpoint(store_points, OutPutEdges[i].source) == -1) {
            OutPutEdges[i].out = 1;
        }
        // if (temp_points.indexOf(OutPutEdges[i].destination) == -1) {
        if (findIndexTestpoint(store_points, OutPutEdges[i].destination) == -1) {
            OutPutEdges[i].out = 1;
        }
    }

    temp_count = OutPutEdges.length - 1;
    //upto here we have all the points to be in cluster in store_points variable array
    var state = 1;
    if (pre_store_points.length>0 && pre_store_points.length == store_points.length) {
        for (var i = 0; i < store_points.length; i++) {
            state = 1;
            if (store_points[i].x == pre_store_points[i].x) {
                if (store_points[i].y == pre_store_points[i].y) {
                    state = 0;
                }
            }
        }
    }
    if(pre_store_points.length==0 && store_points.length==0){
        state=0;
    }
    
    pre_store_points = [];
    for (var i = 0; i < store_points.length; i++) {
        pre_store_points.push(store_points[i]);
    }
    return state;
}


//upto here MST clustering is done on the tree created by kruskal algo
/*****************************************************************************************************/

function mstPlot() {
    //now plotting
    console.log("In mstPlot");
    var temp_points_plot = [];
    var temp_x = [];
    var temp_y = [];
    var data = [];

    if (store_points.length > 0) {
        for (var i = 0; i < TestPoints.length; i++) {
            if (findIndexTestpoint(store_points, TestPoints[i]) == -1) {
                temp_points_plot.push(TestPoints[i]);
            }
        }
        console.log(store_points.length);
        for (var i = 0; i < store_points.length; i++) {
            console.log(store_points[i].x + "->>" + store_points[i].y);
            temp_x.push(store_points[i].x);
            temp_y.push(store_points[i].y);
        }
    }
    else {
        console.log(store_points.length);
        for (var i = 0; i < TestPoints.length; i++) {
            temp_x.push(TestPoints[i].x);
            temp_y.push(TestPoints[i].y);
        }
    }
    var trace = {
        x: temp_x,
        y: temp_y,
        mode: 'markers',
        type: 'scatter',
        marker: {
            symbol: "square",
            color: 'blue'
        }
    };
    data.push(trace);
    var newlayout = {
        autosize: true,
        yaxis: {
            fixedrange: true
        },
        xaxis: {
            fixedrange: true
        }
    };
    Plotly.newPlot('graph', data, newlayout);
    if (temp_points_plot.length > 0) {
        temp_x = [];
        temp_y = [];
        for (var i = 0; i < temp_points_plot.length; i++) {
            temp_x.push(temp_points_plot[i].x);
            temp_y.push(temp_points_plot[i].y);
        }
        var trace = {
            x: temp_x,
            y: temp_y,
            mode: 'markers',
            type: 'scatter',
            marker: {
                color: 'red'
            }
        };
        data.push(trace);
        var newlayout = {
            autosize: true,
            yaxis: {
                fixedrange: true
            },
            xaxis: {
                fixedrange: true
            }
        };
        Plotly.plot('graph', data, newlayout);
    }
}

function MST_startIteration() {
    console.log("Start iteration for MST");
    makeTree();
    //upto here we have initial mst in output matrix
    mstPlot();
    MST_itertaion_count = MST_itertaion_count + 1;
    document.getElementById("class_mst").innerHTML = MST_itertaion_count;
}
function MST_nextIteration() {
    console.log("Next iteration for MST");
    if (MST_itertaion_count != -1) {
        //upto here we have initial mst in output matrix
        var status = MSTClustering();
        console.log("itertaion status->>" + status);
        if (status == 1) {
            mstPlot();
            MST_itertaion_count = MST_itertaion_count + 1;
            document.getElementById("class_mst").innerHTML = MST_itertaion_count;
        }
        else {
            MST_itertaion_count = -1;
            console.log("Iterations completed");
        }
    }
    else {
        console.log("Iterations completed");
    }

}
function MST_finishIteration() {
    console.log("Finish iteration for MST");
    if (MST_itertaion_count != -1) {
        var status = 1;
        while (status == 1) {
            status = MSTClustering();
            MST_itertaion_count = MST_itertaion_count + 1;
            if(MST_itertaion_count>=limit){
                alert("Iterations exceded safe limit");
                break;
            }
        }
        mstPlot();
        document.getElementById("class_mst").innerHTML = MST_itertaion_count;
        console.log("Iterations completed");
        MST_itertaion_count = -1;
    }
    else {
        console.log("Iterations completed");
    }


}


//************************************************************************************************ */
//from here the tree is constructed using kruskal algorithm



function EdgesConstructor(x1, y1, x2, y2) {
    this.source = new Constructor(x1, y1);
    this.destination = new Constructor(x2, y2);
    this.dist = 0;
    this.out = 0;
}
function makeTree() {
    console.log("In makeTree");
    //we are assuming the total connected graph
    //here we make adjacency Matrix
    var Edges = [];

    //Upto here we have created the 2d Edges and now populating it

    for (var i = 0; i < TestPoints.length; i++) {
        for (var j = 0; j < TestPoints.length; j++) {
            if (i < j) {
                var dist = euclidienDistance(TestPoints[i].x, TestPoints[j].x, TestPoints[i].y, TestPoints[j].y);
                var obj = new EdgesConstructor(TestPoints[i].x, TestPoints[i].y, TestPoints[j].x, TestPoints[j].y);
                obj.dist = dist;
                Edges.push(obj);
            }

        }
    }

    //Now we sort the Edges array based on dist
    Edges.sort(function (obj1, obj2) { return obj1.dist - obj2.dist });

    //Now  make the parent array and initialize it
    var parent = [];
    for (var i = 0; i < TestPoints.length; i++) {
        parent.push(TestPoints[i]);
    }

    kruskalAlgo(Edges, parent);
}

function kruskalAlgo(Edges, parent) {
    console.log("In kruskalAlgo");
    var count = 0;
    var i = 0;

    while (count != TestPoints.length - 1 && i < Edges.length) {

        //check if we can add this edge to MST
        var sourceParent = findParent(Edges[i].source, parent);
        var destParent = findParent(Edges[i].destination, parent);
        var dist_status = euclidienDistance(sourceParent.x, destParent.x, sourceParent.y, destParent.y);
        if (dist_status != 0) {
            OutPutEdges.push(Edges[i]);
            count = count + 1;
            // var index = TestPoints.indexOf(Edges[i].destination);
            var index = findIndexTestpoint(TestPoints, Edges[i].destination);
            parent[index] = Edges[i].source;
        }
        i = i + 1;
    }
    //now sorting the output edges based on distance
    OutPutEdges.sort(function (obj1, obj2) { return obj1.dist - obj2.dist });
    temp_count = OutPutEdges.length - 1;  //to avoid extreme of threshold

}

function findParent(point, parent) {
    console.log("In find parent");
    var index = findIndexTestpoint(TestPoints, point);
    var temp_;
    temp_ = parent[index];

    if (temp_.x == point.x && temp_.y == point.y) {
        return point;
    }

    return findParent(temp_, parent);
}
function findIndexTestpoint(array, obj) {
    console.log("In findIndexTestpoint");
    var status = -1;
    for (var i = 0; i < array.length; i++) {
        if (array[i].x == obj.x && array[i].y == obj.y) {
            status = i;

        }
    }
    return status;
}
function findIndexOutputEdges(array, obj) {
    console.log("In findIndexOutputEdges");
    var status = -1;
    for (var i = 0; i < array.length; i++) {
        if (array[i].source.x == obj.source.x) {
            if (array[i].destination.y == obj.destination.y) {
                status = i;
            }
        }
    }
    return status;
}