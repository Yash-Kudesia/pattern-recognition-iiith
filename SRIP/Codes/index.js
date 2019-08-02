function OFFAlgo(str) {
    document.getElementById(str.concat("Div")).style.display = "none";
}
function ONAlgo(str) {
    document.getElementById(str.concat("Div")).style.display = "block";
}
function selectAlgo() {
    InitLoad();
    var temp = document.getElementById("algoSelect").value;
    document.getElementById("cancelAlgo").style.display = "block";
    document.getElementById("algoselectionDiv").style.display = "none";
    ONAlgo(temp);
    if (temp == "Kmeans") {
        OFFAlgo("MST");
        document.getElementById("algo_name").innerHTML="Kmeans Clustering";
      
    } else {
        OFFAlgo("Kmeans");
        document.getElementById("algo_name").innerHTML="MST Clustering";
    }
    document.getElementById("UserDiv").style.display = "block";
}
function cancelAlgo() {
    document.getElementById("cancelAlgo").style.display = "none";
    document.getElementById("algoselectionDiv").style.display = "block";
    InitLoad();
    OFFAlgo("MST");
    OFFAlgo("Kmeans");
    document.getElementById("UserDiv").style.display = "none";
    var newdata = [];
    var newlayout = {
        autosize: false,
        yaxis: {
            fixedrange: true
        },
        xaxis: {
            fixedrange: true
        },
        showlegend: false
    };
    Plotly.newPlot('graph', newdata, newlayout,{responsive: true}).then(attach);
}


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
        autosize: false,
        yaxis: {
            fixedrange: true
        },
        xaxis: {
            fixedrange: true
        },
        showlegend: false
    };
    Plotly.plot('graph', newdata, newlayout,{responsive: true}).then(attach);
}
function removetestPoints() {
    if (document.getElementById('TestPoints').checked) {
        if (document.getElementById("algoSelect").value == "Kmeans") {
            console.log(DataSet.length);
            if (DataSet.length !== 0) {
                var t = DataSet.length + 1;
                Plotly.deleteTraces('graph', t);
                console.log("Trace Removed->" + t);
            }
            else {
                console.log("No Trace to Remove");
            }
        }
        else {
            Plotly.deleteTraces('graph', 0);
            console.log("Trace Removed");
        }
    }
    else {
        console.log("Can't remove Traces");
    }

}
function attach() {
    var gd = document.getElementById('graph');
    gd.addEventListener('mousemove', mouseOverElement);
    gd.addEventListener('click', clickEvent);
    console.log("Function attached");
}

function clickEvent(evt) {
    console.log("In click");
    if (document.getElementById('TestPoints').checked) {
        var gd = document.getElementById('graph');
        var xaxis = gd._fullLayout.xaxis;
        var yaxis = gd._fullLayout.yaxis;
        var l = gd._fullLayout.margin.l;
        var t = gd._fullLayout.margin.t;

        var xInDataCoord = xaxis.p2c(evt.x - l);
        var yInDataCoord = yaxis.p2c(evt.y - t);
        xInDataCoord = parseFloat(xInDataCoord.toFixed(3));
        yInDataCoord = parseFloat(yInDataCoord.toFixed(3));
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
        xInDataCoord = parseFloat(xInDataCoord.toFixed(3));
        yInDataCoord = parseFloat(yInDataCoord.toFixed(3));
        // Plotly.relayout(gd, 'title', ['x: ' + xInDataCoord, 'y : ' + yInDataCoord].join('<br>'));
        if (document.getElementById("algoSelect").value == "Kmeans") {
            document.getElementById("X").value = "X Coordinates-:" + xInDataCoord;
            document.getElementById("Y").value = "Y Coordinates-:" + yInDataCoord;
        } else {
            document.getElementById("X_MST").value = "X Coordinates-:" + xInDataCoord;
            document.getElementById("Y_MST").value = "Y Coordinates-:" + yInDataCoord;
        }

    }
}


function InitLoad() {
    OFFAlgo("Kmeans");
    OFFAlgo("MST");
    console.log("Init Load");
    var trace = {};
    var data = [trace]
    var newlayout = {
        autosize: false,
        yaxis: {
            fixedrange: true
        },
        xaxis: {
            fixedrange: true
        },
        showlegend: false
    };
    Plotly.plot('graph', data, newlayout,{responsive: true}).then(attach);


    //variable for kmeans
    Centroids = [];
    temp_Centroid = [];
    POINTS = []; //contains points of each classes in subarray
    DataSet = [];    //contains index of all classes loaded for algorithm
    TestPoints = [];  //contains all the user testpoints
    procedurK=0;

    //variable for mst clustering
    stock_Edges = [];
    MSTEdges = [];
    MSTEdgesSEL = [];
    MSTEdgesREJ = [];
    OUTPUT = [];
    Threshold = 0.4;//optimal value
    state = 1;
    count_Iteration_mst = 0;
    key = [];
    parent = [];
    selected = [];  //contains vertices in mst
    procedure=0;
}
function loadRandomTraces() {
    var trace = {};
    var t = document.getElementById("traceSelect").value;
    console.log("load Random Traces->" + t);
    if (DataSet.indexOf(parseInt(t) - 1) == -1) {
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
                    color: 'orange'
                }
            };
            DataSet.push(3);
        }
        var data = [];
        data.push(trace);
        plotGraph(data);
        console.log("trace loading");
    }
    console.log("trace loaded");
}


function euclidienDistance(x1, x2, y1, y2) {
    console.log("euclidien Distance");
    var x = x2 - x1;
    var y = y2 - y1;
    var sqroot = (x * x) + (y * y);
    return Math.sqrt(sqroot);
}
function calculateCentroids(temp_points_) {
    console.log("calculate Centroids");
    var total_X = 0;
    var total_Y = 0;
    for (var i = 0; i < temp_points_.length; i++) {
        // console.log("points-used for centroid->>" + temp_points_[i].x + "  " + temp_points_[i].y);
        total_X = total_X + temp_points_[i].x;
        total_Y = total_Y + temp_points_[i].y;
        //console.log("totalX->" + total_X + "  totalY->" + total_Y);
    }
    //console.log("->>" + total_X + "  " + total_Y + "  ->> " + temp_points_.length);
    var centroid_X = total_X / temp_points_.length;
    var centroid_Y = total_Y / temp_points_.length;
    console.log("Calcultaed Centroid->>" + centroid_X + "  " + centroid_Y);
    var obj = new Constructor(centroid_X, centroid_Y);
    return obj;
}
window.onresize = function() {
    Plotly.relayout(myDiv, {
      width: 0.9 * window.innerWidth,
      height: 0.9 * window.innerHeight
    })
  }