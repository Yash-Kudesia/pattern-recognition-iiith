var stock_Edges = [];
var MSTEdges = [];
var MSTEdgesSEL = [];
var MSTEdgesREJ = [];
var OUTPUT = [];
var Threshold = 0.4;//optimal
var state = 1;
var count_Iteration_mst = 0;
var IC = "Iteration Count -: ";
var IS = "Iteration Status -: ";
var procedure = 0;

function MST_startIteration() {
    if (TestPoints.length != 0) {
        if (procedure == 0) {
            procedure = 1;
            console.log("***********MST_startIteration**************");
            count_Iteration_mst = count_Iteration_mst + 1;
            main_Algorithm();
            mainIteration_Algorithm();
            document.getElementById("class_mst").innerHTML = IC + count_Iteration_mst.toString();
            document.getElementById("status_mst").innerHTML = IS + "Iterations Started";
        }
        else {
            console.log("Follow the correct procedure by refering documentation");
            alert("Wrong Procedure");
        }
    }
    else {
        alert("Enter some testpoints");
    }
}
function MST_nextIteration() {
    if (TestPoints.length != 0) {
        if (procedure == 1) {
            console.log("***************MST_nextIteration****************");
            if (state == 1 && count_Iteration_mst <= limit_loop) {
                state = mainIteration_Algorithm();
                var x = 'red';
                mstplot(OUTPUT, x);
                count_Iteration_mst = count_Iteration_mst + 1;
                document.getElementById("class_mst").innerHTML = IC + count_Iteration_mst.toString();
                document.getElementById("status_mst").innerHTML = IS + "Iterations Ongoing";
            }
            else {
                var x = 'green';
                mstplot(OUTPUT, x);
                document.getElementById("status_mst").innerHTML = IS + "Iterations Completed";
                console.log("Algorithm completes");

            }
        }
        else {
            console.log("Follow the correct procedure by refering documentation");
            alert("Wrong Procedure");
        }

    } else {
        alert("Enter some testpoints");
    }
}
function MST_finishIteration() {
    if (TestPoints.length != 0) {
        if (procedure == 1) {
            console.log("*****************MST_finishIteration******************");
            while (state == 1 && count_Iteration_mst <= limit_loop) {
                state = mainIteration_Algorithm();
                count_Iteration_mst = count_Iteration_mst + 1;
            }
            var x = 'green';
            mstplot(OUTPUT, x);
            document.getElementById("class_mst").innerHTML = IC + count_Iteration_mst.toString();
            document.getElementById("status_mst").innerHTML = IS + "Iterations Completed";
            console.log("Algorihtm finishes");
        }
        else {
            console.log("Follow the correct procedure by refering documentation");
            alert("Wrong Procedure");
        }
    } else {
        alert("Enter some testpoints");
    }
}

function isCommonUtil(List1, List2) {
    console.log("*********************isCommonUtil**********************");
    var status = 1;
    if (List1.length < List2.length) {
        for (var i = 0; i < List1.length; i++) {
            var ind1 = findEdgeUtil(List2, List1[i].source, List1[i].destination);
            var ind2 = findEdgeUtil(List2, List1[i].destination, List1[i].source);
            if (ind1 == -1 && ind2 == -1) {
                status = 0;
            } else {
                status = 1;
            }
        }
    }
    else if (List1.length >= List2.length) {
        for (var i = 0; i < List2.length; i++) {
            var ind1 = findEdgeUtil(List1, List2[i].source, List2[i].destination);
            var ind2 = findEdgeUtil(List1, List2[i].destination, List2[i].source);
            if (ind1 == -1 && ind2 == -1) {
                status = 0;
            } else {
                status = 1;
            }
        }
    }
    return status;
}

function removeEdgesUtil() {
    console.log("*********************removeEdgesUtil***************************");
    //for removing edges from edgeList that belong to edge rej
    var temp_index = [];
    for (var i = 0; i < MSTEdgesREJ.length; i++) {
        var ind1 = findEdgeUtil(MSTEdges, MSTEdgesREJ[i].source, MSTEdgesREJ[i].destination);
        var ind2 = findEdgeUtil(MSTEdges, MSTEdgesREJ[i].destination, MSTEdgesREJ[i].source);
        if (ind1 !== -1) {
            temp_index.push(ind1);
        } else if (ind2 !== -1) {
            temp_index.push(ind2);
        }
    }

    //temp index contain index of elements to be deleted from edge list
    for (var i = 0; i < temp_index.length; i++) {
        MSTEdges.splice(temp_index[i], 1);
    }
}
function removeLargestUtil() {
    console.log("********************removeLargestUtil**********************");
    //remove largest edge from edge sel
    var store = -1;
    var max = 0;
    for (var i = 0; i < MSTEdgesSEL.length; i++) {
        if (MSTEdgesSEL[i].dist > max) {
            max = MSTEdgesSEL[i].dist;
            store = i;
        }
    }
    MSTEdgesSEL.splice(store, 1);
}

function main_Algorithm() {
    console.log("**************************MAIN ALGO****************");
    var Input_Edges = makeTree();

    //step-1 of main algo is to create a mst using prims algorithm
    MSTEdges = primsAlgo(Input_Edges);
    mstplot(MSTEdges, 'red');

    //step-2 of main algo is sorting the mst edges based on distance
    MSTEdges.sort(function (obj1, obj2) { return obj1.dist - obj2.dist });

    //step-3
    MSTEdgesSEL = core_Algorithm();
    console.log("MST EDGE SEL");
    for (var i = 0; i < MSTEdgesSEL.length; i++) {
        console.log("S-> " + MSTEdgesSEL[i].source.x + "  " + MSTEdgesSEL[i].source.y);
        console.log("D-> " + MSTEdgesSEL[i].destination.x + "  " + MSTEdgesSEL[i].destination.y);
    }

    //step-4
    MSTEdges.sort(function (obj1, obj2) { return obj2.dist - obj1.dist });
    MSTEdgesREJ = core_Algorithm();
    console.log("MST EDGE REJ");
    for (var i = 0; i < MSTEdgesREJ.length; i++) {
        console.log("S-> " + MSTEdgesREJ[i].source.x + "  " + MSTEdgesREJ[i].source.y);
        console.log("D-> " + MSTEdgesREJ[i].destination.x + "  " + MSTEdgesREJ[i].destination.y);
    }
    //step-5
    var status = isCommonUtil(MSTEdgesSEL, MSTEdgesREJ);
    if (status == 0) {
        console.log("Nothing is common in SEL and REJ");
        console.log("AFTER REMOVING ->MST EDGE");
        for (var i = 0; i < MSTEdges.length; i++) {
            console.log("->" + MSTEdges[i].source.x + "   " + MSTEdges[i].source.y);
            console.log(MSTEdges[i].destination.x + "   " + MSTEdges[i].destination.y);
        }
        //Nothing is common in list, so remove edges of Edgerej from Edges
        removeEdgesUtil();
    } else {
        //Remove largest edge from EdgeSel
        console.log("Something is common in SEL and REJ");
        removeLargestUtil();
        console.log("AFTER REMOVING ->MST EDGE SEL");
        for (var i = 0; i < MSTEdgesSEL.length; i++) {
            console.log("S-> " + MSTEdgesSEL[i].source.x + "  " + MSTEdgesSEL[i].source.y);
            console.log("D-> " + MSTEdgesSEL[i].destination.x + "  " + MSTEdgesSEL[i].destination.y);
        }
    }


}

function mainIteration_Algorithm() {
    console.log("*********************mainIteration_Algorithm**********************");
    //step-6
    //add all selected edges to output matrix
    for (var i = 0; i < MSTEdgesSEL.length; i++) {
        OUTPUT.push(MSTEdgesSEL[i]);
    }

    //step-7
    for (var i = 0; i < MSTEdgesSEL.length / 2; i++) {
        var ind1 = findEdgeUtil(MSTEdges, MSTEdgesSEL[i].source, MSTEdgesSEL[i].destination);
        var ind2 = findEdgeUtil(MSTEdges, MSTEdgesSEL[i].destination, MSTEdgesSEL[i].source);
        console.log("Indexes for removing->" + ind1 + "  " + ind2);
        if (ind1 !== -1) {
            MSTEdges.splice(ind1, 1);
        } else if (ind2 !== -1) {
            MSTEdges.splice(ind2, 1);
        }
    }
    console.log("AFTER REMOVING SEL ->MST EDGE");
    for (var i = 0; i < MSTEdges.length; i++) {
        console.log("->" + MSTEdges[i].source.x + "   " + MSTEdges[i].source.y);
        console.log(MSTEdges[i].destination.x + "   " + MSTEdges[i].destination.y);
    }
    //step-8
    var temp_SEL = [];
    for (var i = 0; i < MSTEdgesSEL.length; i++) {
        temp_SEL.push(MSTEdgesSEL[i]);
    }
    MSTEdges.sort(function (obj1, obj2) { return obj1.dist - obj2.dist });
    MSTEdgesSEL = core_Algorithm();
    console.log("Again ->MST EDGE SEL");
    for (var i = 0; i < MSTEdgesSEL.length; i++) {
        console.log("S-> " + MSTEdgesSEL[i].source.x + "  " + MSTEdgesSEL[i].source.y);
        console.log("D-> " + MSTEdgesSEL[i].destination.x + "  " + MSTEdgesSEL[i].destination.y);
    }
    //step-9
    var status = 1; //means iterations can be done
    if (temp_SEL.length == MSTEdgesSEL.length) {
        var c = 0;
        for (var i = 0; i < MSTEdgesSEL.length; i++) {
            var ind1 = findEdgeUtil(temp_SEL, MSTEdgesSEL[i].source, MSTEdgesSEL[i].destination);
            var ind2 = findEdgeUtil(temp_SEL, MSTEdgesSEL[i].destination, MSTEdgesSEL[i].source);
            if (ind1 != -1 | ind2 != -1) {
                //encounter here when the edge is same
                c = c + 1;
            }
        }
        if (c == temp_SEL.length) {
            //encounter here when all edges are same
            status = 0;
        }
    }
    console.log("Status of iteration->>" + status);


    return status;

}

function core_Algorithm() {
    console.log("**************************Core Algorithm***********************");

    var tmp_lst = [];
    var Sum1 = 0; var Count = 0; var Sum2 = 0;

    for (var i = 0; i < MSTEdges.length; i++) {

        var t_SUM1 = Sum1 + MSTEdges[i].dist;
        var t_SUM2 = Sum2 + (MSTEdges[i].dist) * (MSTEdges[i].dist);
        var t_count = Count + 1;

        var mean = t_SUM1 / t_count;
        var sd = Math.sqrt((t_SUM2 / t_count) - mean * mean);

        var coffofVariation = sd / mean;
        console.log("Cofficient->" + coffofVariation + "  Threshold->>" + Threshold);
        if (coffofVariation < Threshold) {
            Sum1 = t_SUM1;
            Sum2 = t_SUM2;
            Count = t_count;
            tmp_lst.push(MSTEdges[i]);
        } else {
            break;
        }
    }
    return tmp_lst;
}

function mstplot(MST, x) {
    console.log("*************************mstplot**************************");

    var data = [];
    for (var i = 0; i < MST.length; i++) {

        var temp_1 = [];
        temp_1.push(MST[i].source.x);
        temp_1.push(MST[i].destination.x);
        var temp_2 = [];
        temp_2.push(MST[i].source.y);
        temp_2.push(MST[i].destination.y);

        var trace = {
            x: temp_1,
            y: temp_2,
            mode: 'lines+markers',
            marker: {
                color: 'black'
            },
            line: {
                color: x
            }
        };

        data.push(trace);
    }
    var layout = {
        hovermode: 'none',
        showlegend: false
    };

    Plotly.newPlot('graph', data, layout, { responsive: true });
    //plotting all the points
    var t_x = [];
    var t_y = [];
    for (var i = 0; i < TestPoints.length; i++) {
        t_x.push(TestPoints[i].x);
        t_y.push(TestPoints[i].y);
    }
    data = [];
    var trace = {
        x: t_x,
        y: t_y,
        mode: 'markers',
        type: 'scatter',
        marker: {
            color: 'black'
        }
    };

    data.push(trace);
    Plotly.plot('graph', data, layout, { responsive: true });
}