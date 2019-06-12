var X = [
    [1, 2, 3, 4, 5, 6, 7, 8],
    [2, 3, 4, 5, 7, 5, 1, 9],
    [1, 2, 4, 5, 12, 9, 15, 12],
    [1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5]
];
var Y = [
    [1, 2, 3, 4, 5, 6, 7, 8],
    [16, 5, 11, 9, 7, 5, 1, 9],
    [12, 9, 15, 12, 9, 15, 12, 11],
    [4, 1, 7, 1, 4, 5, 6, 7]
];
var K = 2;  //initial guessing
var Centroids = [];
var Points = [];
var DataSet = -1;

function Constructor(a, b) {
    this.x = a;
    this.y = b;
    this.indexOfCluster = -1;
}
function plotGraph(newtrace) {
    console.log("In plot graph");
    var newdata = [newtrace];
    var newlayout = {
        autosize: true,
        margin: {
            l: 50,
            r: 50,
            b: 100,
            t: 100,
            pad: 4
        },
    };
    Plotly.newPlot('graph', newdata, newlayout);
}
function plotGraphData(newdata) {
    console.log("In plot graph data");
    var newlayout = {
        autosize: true,
        margin: {
            l: 50,
            r: 50,
            b: 100,
            t: 100,
            pad: 4
        },
    };
    console.log(newdata);
    Plotly.newPlot('graph', newdata, newlayout);
    console.log("GRAPH plotted for ->>" + count_Iteration + " iteration");
}

function InitLoad() {
    console.log("Init Load");
    var trace = {};
    plotGraph(trace);
}
function loadRandomTraces() {
    console.log("load Random Traces");
    var trace = {};
    var t = document.getElementById("traceSelect").value;
    if (t === "L1") {
        trace = {
            x: X[0],
            y: Y[0],
            mode: 'markers',
            type: 'scatter',

            marker: {
                color: 'red'
            }
        };
        DataSet = 0;
    }
    else if (t === "L2") {
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
        DataSet = 1;
    }
    else if (t === "L3") {
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
        DataSet = 2;
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
        DataSet = 3;
    }
    plotGraph(trace);
}

function makeobjects() {
    console.log("make objects");
    Points = [];
    var x_data = X[DataSet];
    var y_data = Y[DataSet];
    for (var i = 0; i < x_data.length; i++) {
        var obj = new Constructor(x_data[i], y_data[i]);
        Points.push(obj);
    }
}
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
        //console.log("points-used for centroid->>"+temp_Points[i].x+"  "+temp_Points[i].y);
        total_X = total_X + temp_Points[i].x;
        total_Y = total_Y + temp_Points[i].y;
    }
    //console.log("->>"+total_X+"  "+total_Y+"  ->> "+temp_Points.length);
    var centroid_X = total_X / temp_Points.length;
    var centroid_Y = total_Y / temp_Points.length;
    console.log("Calcultaed Centroid->>" + centroid_X + "  " + centroid_Y);
    var obj = new Constructor(centroid_X, centroid_Y);
    return obj;
}
function checkConvergence(temp_Centroid) {
    console.log("check Convergence");
    var count = 0;
    for (var i = 0; i < temp_Centroid.length; i++) {
        if (Centroids[i].x == temp_Centroid[i].x) {
            if (Centroids[i].y == temp_Centroid[i].y) {
                count = count + 1;
            }
        }
    }
    if (count == K) {
        return 1;
    }
    else {
        //reintialize the centroid
        Centroids = [];
        for (var i = 0; i < temp_Centroid.length; i++) {
            Centroids.push(temp_Centroid[i]);
        }
    }
    return 0;
}
function kMeans(iterationNo) {
    var status;
    if (K > Points.length) {
        alert("K is greater then the number of Datapoints in Datasets");
    }
    else {

        if (iterationNo == 0) {
            console.log("Kmeans Iteration 1st");
            //inital k centroids for seeding
            var randomIndex = [];
            for (var i = 0; i < K; i++) {
                var randomK = Math.floor(Math.random() * Points.length);
                var temp = randomIndex.indexOf(randomK);
                while (temp !== -1) {
                    randomK = Math.floor(Math.random() * Points.length);
                    temp = randomIndex.indexOf(randomK);
                }
                randomIndex.push(randomK);
                Centroids.push(Points[randomK]);
            }
        }
        else {
            console.log("Kmeans Iteration");
            var temp_Centroid = [];
            //here the centroids will be calculated again
            for (var k = 0; k < K; k++) {   //iterate through all clusters
                var temp_Points = [];
                for (var m = 0; m < Points.length; m++) {   //store all the points of each clusters
                    if (Points[m].indexOfCluster == k) {
                        temp_Points.push(Points[m]);
                    }
                }
                var obj = calculateCentroids(temp_Points);
                temp_Centroid.push(obj);
            }

            status = checkConvergence(temp_Centroid);
        }
        ////////////////////////////////////////////////////////////////////////////////////
        for (var m = 0; m < Centroids.length; m++) {
            console.log("Centroid->>" + Centroids[m].x + "  " + Centroids[m].y);
        }

        ///////////////////////////////////////////////////////////////////////////////////
        if (status == 0 | iterationNo == 0) {
            console.log("Just check");
            //Now the iteration part to assign points to clusters
            for (var i = 0; i < Points.length; i++) {
                var min = 100000000;
                var store = -1;
                for (var j = 0; j < K; j++) {
                    var dist = euclidienDistance(Points[i].x, Centroids[j].x, Points[i].y, Centroids[j].y);
                    if (dist < min) {
                        min = dist;
                        store = j;
                    }
                }
                Points[i].indexOfCluster = store;
                console.log("Points->" + Points[i].x + "  " + Points[i].y + "  " + Points[i].indexOfCluster);
                //updating the index of cluster assigned to each point
            }
            //Upto here all the point have been assigned to diffrent clusters.
        }
        else {
            console.log("Iterations completed");
        }

    }
    return status;

}
function makeTraces() {
    console.log("make traces");
    console.log(Points);
    var data = [];
    for (var i = 0; i < Points.length; i++) {
        var trace = {
            x: Points[i].x,
            y: Points[i].y,
            mode: 'markers',
            type: 'scatter',
            marker: {
                color: color[Points[i].indexOfCluster]
            }
        };
        console.log("Trace->>" + trace.marker.color);
        data.push(trace);
    }
    return data;
}
var count_Iteration = 0;
function KMeans_startIteration() {
    console.log("Start iteration");
    makeobjects();
    kMeans(0);
    count_Iteration = count_Iteration + 1;
    console.log("Iteration->>" + count_Iteration);
    document.getElementById("class").innerHTML = count_Iteration.toString();
    var data = makeTraces();
    plotGraphData(data);
}
function KMeans_nextIteration() {
    console.log("Next iteration");
    if (K == Points.length) {
        alert("Iterations completed");
    }
    else {
        var state = kMeans(count_Iteration);
        if (state !== 0) {
            console.log("No more iteration possible");
        }
        else {
            count_Iteration = count_Iteration + 1;
            document.getElementById("class").innerHTML = count_Iteration.toString();
            var data = makeTraces();
            plotGraphData(data);
        }
    }
}
function KMeans_finishIteration() {
    console.log("Finish iteration");
    if (K == Points.length) {
        alert("Iterations completed");
    }
    else {
        var state = 0;
        if (count_Iteration == -1) {
            console.log("Process already finished");
        }
        while (state == 0) {
            state = kMeans(count_Iteration);
            count_Iteration = count_Iteration + 1;
            document.getElementById("class").innerHTML = count_Iteration.toString();
            var data = makeTraces();
            plotGraphData(data);
        }
        if (state !== 0) {
            count_Iteration = -1;
            console.log("No more iteration possible");
        }
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
    if (t == "kmeans") {
        KMeans_startIteration();
    }
    else {
        MST_startIteration();
    }
}
function nextIteration() {
    var t = document.getElementById("algoSelect").value;
    if (t == "kmeans") {
        KMeans_nextIteration();
    }
    else {
        MST_nextIteration();
    }
}
function finishIteration() {
    var t = document.getElementById("algoSelect").value;
    if (t == "kmeans") {
        KMeans_finishIteration();
    }
    else {
        MST_finishIteration();
    }
}