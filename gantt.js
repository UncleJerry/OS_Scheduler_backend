// Call the process 
const process = require('./process.js');
const fs = require('fs');
const readline = require('readline');
const fcfs = require('./fcfs.js').scheduler;
const sjf = require('./sjf.js').scheduler;
const nsjf = require('./sjf.js').scheduler_non;
const rr = require('./roundrobin.js').scheduler;
const Time = require('./timing.js').Time;

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
var rl = readline.createInterface(
{
    input: instream,
    terminal: false
});


var quantum = 0;
// Mark for total CPU time requirment
var totalTime = 0;

rl.on('line', function(line){
    
    const info = line.split(' ');
    if(info[0] == '#'){
        // Do nothing
    }else if (info.length == 1){
        model = info[0];
    }else if (info.length == 2){
        model = info[0];
        quantum = Number(info[1]);
    }else{
        processTable.push(new process.Process(info[0], info[1], info[2], info[3], info[4]));
        processID.push(Number(info[0]));
        totalTime += Number(info[2]);
    }
    
    if (ended){
        processTable.sort(function(a, b){
            return a.joinTime > b.joinTime;
        });

        

        if (model == 'fcfs'){
            const chart = fcfs(processTable);
            var time = new Time();

            processID.forEach(function(id) {
                const process = processTable.find(function(element, pID){
                    return element.pid == pID;
                });

                const arrival = process.joinTime;

                time.calWait(chart, id, arrival);
                time.calTurn(chart, id, arrival);
            });

            console.log(time);
        }else if(model == 'nsjf'){
            const chart = nsjf(processTable, totalTime);
        }else if(model == 'sjf'){
            const chart = sjf(processTable, totalTime);
        }else if(model == 'rr'){
            const chart = rr(processTable, 4, totalTime);
        }
    }
});


