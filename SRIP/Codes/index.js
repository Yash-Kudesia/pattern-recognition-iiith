var X = [
    [1, 2, 3, 4, 5, 6, 7, 8],   //class1
    [2.5, 3.5, 4.5, 5.5, 7.5, 5.5, 1.5, 9.5],   //class2
    [1.6, 2.6, 4.6, 5.6, 12.6, 9.6, 15.6, 12.6],    //class3
    [1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5]    //class4
];
var Y = [
    [1, 2, 3, 4, 5, 6, 7, 8],   //class1
    [16, 5, 11, 9, 7, 5, 1, 9],  //class2
    [12, 9, 15, 12, 9, 15, 12, 11],  //class3
    [4, 1, 7, 1, 4, 5, 6, 7]     //class4
];

var limit = 50;
var Centroids = [];
var temp_Centroid = [];
var POINTS = []; //contains points of each classes in subarray
var DataSet = [];    //contains index of all classes loaded for algorithm
var TestPoints = [];  //contains all the user testpoints

function Constructor(a, b) {
    this.x = a;
    this.y = b;
    this.indexOfCluster = -1;
}
function plotGraph(newdata) {
    console.log("In plot graph");
    var newlayout = {
        autosize: true,
        yaxis: {
            fixedrange: true
        },
        xaxis: {
            fixedrange: true
        }
    };
    Plotly.plot('graph', newdata, newlayout).then(attach);
}
function removetestPoints(){
    console.log(DataSet.length);
    if(DataSet.length!==0){
        var t=DataSet.length+1;
        Plotly.deleteTraces('graph', t);
        console.log("Trace Removed->"+t);
    }
    else{
        console.log("No Trace to Remove");
    }
}
function attach() {
    var gd = document.getElementById('graph');
    gd.addEventListener('mousemove',mouseOverElement );
    gd.addEventListener('click',clickEvent);
}

function clickEvent(evt) {
    if (document.getElementById('TestPoints').checked) {
        var gd = document.getElementById('graph');
        var xaxis = gd._fullLayout.xaxis;
        var yaxis = gd._fullLayout.yaxis;
        var l = gd._fullLayout.margin.l;
        var t = gd._fullLayout.margin.t;

        var xInDataCoord = xaxis.p2c(evt.x - l);
        var yInDataCoord = yaxis.p2c(evt.y - t);
        xInDataCoord = parseFloat(xInDataCoord.toFixed(1));
        yInDataCoord = parseFloat(yInDataCoord.toFixed(1));
        var x_temp = [xInDataCoord];
        var y_temp = [yInDataCoord];
        var trace = {
            x: x_temp,
            y: y_temp,
            mode: 'markers',
            type: 'scatter',

            marker: {
                symbole: "cross-dot",
                color: 'brown'
            }
        };
        console.log("click");
        var obj = new Constructor(xInDataCoord, yInDataCoord);
        TestPoints.push(obj);
        var data = [];
        data.push(trace);
        plotGraph(data);
    }
}

function mouseOverElement(evt) {
    if (document.getElementById('TestPoints').checked) {
        var gd = document.getElementById('graph');
        var xaxis = gd._fullLayout.xaxis;
        var yaxis = gd._fullLayout.yaxis;
        var l = gd._fullLayout.margin.l;
        var t = gd._fullLayout.margin.t;

        var xInDataCoord = xaxis.p2c(evt.x - l);
        var yInDataCoord = yaxis.p2c(evt.y - t);
        xInDataCoord = parseFloat(xInDataCoord.toFixed(1));
        yInDataCoord = parseFloat(yInDataCoord.toFixed(1));
        // Plotly.relayout(gd, 'title', ['x: ' + xInDataCoord, 'y : ' + yInDataCoord].join('<br>'));
        document.getElementById("X").value = "X Coordinates-:" + xInDataCoord;
        document.getElementById("Y").value = "Y Coordinates-:" + yInDataCoord;
    }
}


function InitLoad() {
    console.log("Init Load");
    var trace = {};
    var data = [trace]
    plotGraph(data);

}
function loadRandomTraces() {
    console.log("load Random Traces");
    var trace = {};
    var t = document.getElementById("traceSelect").value;
    if (DataSet.indexOf(parseInt(t)) == -1) {
        if (t === "1") {
            trace = {
                x: X[0],
                y: Y[0],
                mode: 'markers',
                type: 'scatter',

                marker: {
                    color: 'red'
                }
            };
            DataSet.push(0);
        }
        else if (t === "2") {
            trace = {
                x: X[1],
                y: Y[1],
                mode: 'markers',
                type: 'scatter',

                marker: {
                    symbol: "square",
                    color: 'blue'
                }
            };
            DataSet.push(1);
        }
        else if (t === "3") {
            trace = {
                x: X[2],
                y: Y[2],
                mode: 'markers',

                type: 'scatter',
                marker: {
                    symbol: "triangle-up",
                    color: 'green'
                }
            };
            DataSet.push(2);
        }
        else {
            trace = {
                x: X[3],
                y: Y[3],
                mode: 'markers',
                type: 'scatter',
                marker: {
                    symbol: "diamond",
                    color: 'yellow'
                }
            };
            DataSet.push(3);
        }
        var data = [];
        data.push(trace);
        plotGraph(data);
    }

}


//graph part upto here
function euclidienDistance(x1, x2, y1, y2) {
    console.log("euclidien Distance");
    var x = x2 - x1;
    var y = y2 - y1;
    var sqroot = (x * x) + (y * y);
    return Math.sqrt(sqroot);
}

function calculateCentroids(temp_Points) {
    console.log("calculate Centroids");
    var total_X = 0;
    var total_Y = 0;
    for (var i = 0; i < temp_Points.length; i++) {
        console.log("points-used for centroid->>" + temp_Points[i].x + "  " + temp_Points[i].y);
        total_X = total_X + temp_Points[i].x;
        total_Y = total_Y + temp_Points[i].y;
        console.log("totalX->" + total_X + "  totalY->" + total_Y);
    }
    console.log("->>" + total_X + "  " + total_Y + "  ->> " + temp_Points.length);
    var centroid_X = total_X / temp_Points.length;
    var centroid_Y = total_Y / temp_Points.length;
    console.log("Calcultaed Centroid->>" + centroid_X + "  " + centroid_Y);
    var obj = new Constructor(centroid_X, centroid_Y);
    return obj;
}

function checkConvergence() {
    console.log("check Convergence");
    var state = 0;
    if (temp_Centroid !== null) {
        for (var i = 0; i < temp_Centroid.length; i++) {
            state = 0;
            if (Centroids[i].x == temp_Centroid[i].x) {
                if (Centroids[i].y == temp_Centroid[i].y) {
                    state = 1;
                }
            }
        }
    }

    return state;
}

function kMeans(iterationNo) {
    var status = checkConvergence();
    //status=0, means no conergence

    if (status == 0) {
        console.log("Just check");
        //Now the iteration part to assign points to clusters
        for (var i = 0; i < TestPoints.length; i++) {
            var min = 100000000;
            var store = -1;
            for (var j = 0; j < Centroids.length; j++) {
                var dist = euclidienDistance(TestPoints[i].x, Centroids[j].x, TestPoints[i].y, Centroids[j].y);
                console.log("Eculidiean distance->" + dist);
                if (dist < min) {
                    min = dist;
                    store = j;
                }
            }
            TestPoints[i].indexOfCluster = store;
            console.log("Points->" + TestPoints[i].x + "  " + TestPoints[i].y + "  " + TestPoints[i].indexOfCluster);
            //updating the index of cluster assigned to each point
        }
        if (iterationNo != 0) {
            //here the intial points of class are updated
            for (var i = 0; i < POINTS.length; i++) {
                var min = 100000000;
                var store = -1;
                for (var j = 0; j < Centroids.length; j++) {
                    var dist = euclidienDistance(POINTS[i].x, Centroids[j].x, POINTS[i].y, Centroids[j].y);
                    if (dist < min) {
                        min = dist;
                        store = j;
                    }
                }
                POINTS[i].indexOfCluster = store;
                console.log("Points->" + POINTS[i].x + "  " + POINTS[i].y + "  " + POINTS[i].indexOfCluster);
                //updating the index of cluster assigned to each point
            }
        }
        //Upto here all the point have been assigned to diffrent clusters.
    }
    else {
        console.log("Iterations completed");
    }

    //here previous centroid will get stored and Centroid variable will be empty to acoomodate new centorids
    temp_Centroid = [];
    for (var i = 0; i < Centroids.length; i++) {
        console.log("Transfering->>" + Centroids[i] + "  Centroid length->" + Centroids.length);
        temp_Centroid.push(Centroids[i]);
    }
    console.log("Points->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    Centroids = [];

    //here the centroids will be calculated again
    for (var k = 0; k < DataSet.length; k++) {   //iterate through all clusters
        var temp_Points = [];
        for (var m = 0; m < POINTS.length; m++) {
            if (POINTS[m].indexOfCluster == DataSet[k]) {
                temp_Points.push(POINTS[m]);
            }
            console.log("X->" + POINTS[m].x + "  Y->>" + POINTS[m].y + "  index of cluster->" + POINTS[m].indexOfCluster);
        }
        for (var m = 0; m < TestPoints.length; m++) {
            if (TestPoints[m].indexOfCluster == DataSet[k]) {
                temp_Points.push(TestPoints[m]);
            }
            console.log("X->" + TestPoints[m].x + "  Y->>" + TestPoints[m].y + "  index of cluster->" + TestPoints[m].indexOfCluster);
        }

        var obj = calculateCentroids(temp_Points);
        Centroids.push(obj);
    }

    return status;

}

function utility_plot(temp_Points, k) {
    var temp_x = [];
    var temp_y = [];
    var data = [];

    for (var i = 0; i < temp_Points.length; i++) {
        temp_x.push(temp_Points[i].x);
        temp_y.push(temp_Points[i].y);
    }
    if (k == 0) {
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
        Plotly.newPlot('graph', data, newlayout);
    }
    else if (k == 1) {
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
        Plotly.plot('graph', data, newlayout);
    }
    else if (k == 2) {
        var trace = {
            x: temp_x,
            y: temp_y,
            mode: 'markers',
            type: 'scatter',
            marker: {
                symbol: "triangle-up",
                color: 'green'
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
    else if (k == 3) {
        var trace = {
            x: temp_x,
            y: temp_y,
            mode: 'markers',
            type: 'scatter',
            marker: {
                symbol: "diamond",
                color: 'yellow'
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

function plotIterationpoints() {
    for (var k = 0; k < DataSet.length; k++) {   //iterate through all clusters
        var temp_Points = [];
        for (var m = 0; m < POINTS.length; m++) {
            if (POINTS[m].indexOfCluster == DataSet[k]) {
                temp_Points.push(POINTS[m]);
            }
        }
        for (var m = 0; m < TestPoints.length; m++) {
            if (TestPoints[m].indexOfCluster == DataSet[k]) {
                temp_Points.push(TestPoints[m]);
            }
        }
        utility_plot(temp_Points, DataSet[k]);
    }
}
function makeobjects(i) {

    for (var j = 0; j < X[i].length; j++) {
        var obj = new Constructor(X[i][j], Y[i][j]);
        obj.indexOfCluster = i;
        POINTS.push(obj);
    }
    //here we have classfied points in class for easy calculations
}
var count_Iteration = 0;

function KMeans_startIteration() {
    console.log("Start iteration for kmeans");
    //collecting points for calculation
    for (var i = 0; i < DataSet.length; i++) {
        makeobjects(DataSet[i]);
    }
    //caculate initial centroids for classes
    var temp_Points = [];
    for (var i = 0; i < DataSet.length; i++) {
        for (var j = 0; j < POINTS.length; j++) {
            if (POINTS[j].indexOfCluster == DataSet[i]) {
                temp_Points.push(POINTS[j]);
            }
        }
        var obj = calculateCentroids(temp_Points);
        temp_Points = [];
        Centroids.push(obj);
    }

    kMeans(0);
    count_Iteration = count_Iteration + 1;
    console.log("Iteration->>" + count_Iteration);
    document.getElementById("class").innerHTML = count_Iteration.toString();
    plotIterationpoints();
}
function KMeans_nextIteration() {
    console.log("Next iteration");

    var state = kMeans(count_Iteration);
    if (state !== 0) {
        console.log("No more iteration possible");
    }
    else {
        count_Iteration = count_Iteration + 1;
        document.getElementById("class").innerHTML = count_Iteration.toString();
        plotIterationpoints();
    }
}
function KMeans_finishIteration() {
    console.log("Finish iteration");

    var state = 0;
    if (count_Iteration == -1) {
        console.log("Process already finished or not started yet");
    }
    var count = 0;
    while (state == 0 && count < limit) {
        state = kMeans(count_Iteration);
        count_Iteration = count_Iteration + 1;
        plotIterationpoints();
        count = count + 1;
    }
    document.getElementById("class").innerHTML = count_Iteration.toString();
    if (state !== 0) {
        count_Iteration = -1;
        console.log("No more iteration possible");
    }

}
function MST_startIteration() {

}
function MST_nextIteration() {

}
function MST_finishIteration() {

}
function startIteration() {
    var t = document.getElementById("algoSelect").value;
    if (t == "Kmeans") {
        KMeans_startIteration();
    }
    else {
        alert("Algo not implemented yet");
    }
}
function nextIteration() {
    var t = document.getElementById("algoSelect").value;
    if (t == "Kmeans") {
        KMeans_nextIteration();
    }
    else {
        alert("Algo not implemented yet");
    }
}
function finishIteration() {
    var t = document.getElementById("algoSelect").value;
    if (t == "Kmeans") {
        KMeans_finishIteration();
    }
    else {
        alert("Algo not implemented yet");
    }
}
