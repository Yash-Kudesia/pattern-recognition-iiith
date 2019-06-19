var limit = 50;
var Centroids = [];
var temp_Centroid = [];
var POINTS = []; //contains points of each classes in subarray


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
                    store = DataSet[j];
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
                        store = DataSet[j];
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

function utility_plot(temp_Points, k,it) {
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

    }
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
    if(it==0){
        Plotly.newPlot('graph', data, newlayout);
    }
    else{
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
        utility_plot(temp_Points, DataSet[k],k);
    }
}

var count_Iteration = 0;
function makeobjects(i) {

    for (var j = 0; j < X[i].length; j++) {
        var obj = new Constructor(X[i][j], Y[i][j]);
        obj.indexOfCluster = i;
        POINTS.push(obj);
    }
    //here we have classfied points in class for easy calculations
}
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
    document.getElementById("status_kmeans").innerHTML = "Iterations Started";
    plotIterationpoints();
}
function KMeans_nextIteration() {
    console.log("Next iteration");

    var state = kMeans(count_Iteration);
    if (state !== 0) {
        document.getElementById("status_kmeans").innerHTML = "Iterations Completed";
        console.log("No more iteration possible");
    }
    else {
        count_Iteration = count_Iteration + 1;
        document.getElementById("class").innerHTML = count_Iteration.toString();
        plotIterationpoints();
        document.getElementById("status_kmeans").innerHTML = count_Iteration + " iteration completed";
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
        document.getElementById("status_kmeans").innerHTML = "Iterations Completed";
    }
    document.getElementById("status_kmeans").innerHTML = "Iterations Completed";
}