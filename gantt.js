// Call the process 
const process = require('./process');
const fs = require('fs');
const readline = require('readline');
const fcfs = require('./fcfs').scheduler;
const sjf = require('./sjf').scheduler;
const nsjf = require('./sjf').scheduler_non;
const rr = require('./roundrobin').scheduler;
const Time = require('./timing').Time;

// Init the queue
var queue = [];
// Store all processes info
var processTable = [];
var processID = [];
// Mark for model
var model = '';

// Read file
const fileName = 'job';
var instream = fs.createReadStream(fileName);
instream.on('end', () => { ended = true });

var ended = false;

//Init the readline object
var rl = readline.createInterface(
{
    input: instream,
    terminal: false
});


var quantum = 0;
// Mark for total CPU time requirment
var totalTime = 0;

/**
 * Function to generate a gantt chart
 * @return {String} - A gantt chart and a timing report
 */
function generateChart(){
    var text = fs.readFileSync('job', 'utf8');

    text.split('\n').forEach(function(element) {
    
        const info = element.split(' ');
        if(info[0] == '#'){
            // Do nothing
        }else if (info.length == 1){
            model = info[0];
        }else if (info.length == 2){
            model = info[0];
            quantum = Number(info[1]);
        }else{

            // Fill the processes info
            processTable.push(new process.Process(info[0], info[1], info[2], info[3], info[4]));
            processID.push({
                id: Number(info[0]),
                arrival: Number(info[3])
            });
            totalTime += Number(info[2]);
        }
    });

    // If all processes are loaded
    processTable.sort(function(a, b){
        return a.joinTime > b.joinTime;
    });

    var chart = [];

    // Set scheduler model
    if (model == 'fcfs'){
        chart = fcfs(processTable);
    }else if(model == 'nsjf'){
        chart = nsjf(processTable, totalTime);
    }else if(model == 'sjf'){
        chart = sjf(processTable, totalTime);
    }else if(model == 'rr'){
        chart = rr(processTable, quantum, totalTime);
    }
    var report = 'Gantt Chart\n';

    chart.forEach(function(element) {
        report += element.toPrint(); + '\n';
    });
    
    report += timing(chart, processID);
    // Calculate time
    timing(chart, processID);
    return report;
}

/**
 * Time calculation
 * @param {Work} chart - Gantt chart, RRWork is also acceptable.
 * @param {Array} idArr - Array for id and jointime
 */
function timing(chart, idArr){
    var timeArr = [];

    // Sort by pid
    idArr.sort(function(a, b){
        return a.id > b.id;
    });

    // Calculate time for each process
    idArr.forEach(function(element) {
        var time = new Time();
        time.calWait(chart, element.id, element.arrival);
        time.calTurn(chart, element.id, element.arrival);
        timeArr.push(time);
    });

    // Ready for calculate average time
    var avgWait = 0, avgTurn = 0;

    timeArr.forEach(function(element) {
        avgWait += element.wait;
        avgTurn += element.turnaround;
    });

    avgTurn /= timeArr.length;
    avgWait /= timeArr.length;
    var returnStr = 'Timing report\n';

    

    timeArr.forEach(function(element) {
        returnStr += element.toPrint();
    });
    returnStr += 'Average wait time: ' + avgWait.toString() +'\n';
    returnStr += 'Average turnaround time: ' + avgTurn.toString();
    return returnStr;
    console.log(/*'The timing infomation is as followed: \n'+ */timeArr);
    console.log('Average wait time: ' + avgWait.toString());
    console.log('Average turnaround time: ' + avgTurn.toString());
}

exports.generateChart = generateChart;