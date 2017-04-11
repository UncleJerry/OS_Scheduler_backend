const work = require('./work.js');
const Work = work.Work;

/**
 * First-Come, First-Serve Scheduler
 * @param {Object} processTable - Orocess Object
 */

var scheduler = function(processTable){
    // Init the queue for gantt chart 
    var chart = [];
    
    var time = 0;
    processTable.forEach(function(process) {
        chart.push(new Work(process.pid, time, process.cpuRequire, process.cpuRequire));
        time += process.cpuRequire;
    });

    return chart;
}


exports.scheduler = scheduler;
