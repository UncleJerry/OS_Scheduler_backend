const work = require('./work');
const Work = work.Work;

var chart = [];

// For Job queue 
var queue = [];

/**
 * Non-preemptive Shortest Job First Scheduler
 * @param {Process} processTable - Orocess Object
 */
var scheduler_non = function(processTable, totalTime){
    var time = 0;
    queueClean();

    while (time < totalTime) {
        
        while (processTable.length > 0 && processTable[0].joinTime <= time){
            queue.push(processTable.shift());
        }

        queueSort('non');
        while(queue.length > 0){
            const process = queue.shift();
            
            chart.push(new Work(process.pid, time, process.cpuRequire, process.cpuRequire));
            time += process.cpuRequire;
        }

        
    }
    
    return chart;
    
}

/**
 * Preemptive Shortest Job First Scheduler
 * @param {Process} processTable - Orocess Object
 * @param {Number} totalTime - Total process time
 */
var scheduler = function(processTable, totalTime){

    var minRequire = 999999;

    queueClean();

    for (var time = 0; time <= totalTime; time++) {

        // Update chart for this second
        if (chart.length > 0){
            if(chart[chart.length - 1].isNotComplete()){
                chart[chart.length - 1].update(time);
            
                if (chart[chart.length - 1].remain == 0){
                    // If job've finished, reset the minRequire
                    if (queue.length > 0){
                        minRequire = queue[0].remain;
                    }else{
                        minRequire = 999999;
                    }
                
                }else{
                    minRequire = chart[chart.length - 1].remain;
                }
            }
            
        }


        if (processTable.length > 0 && processTable[0].joinTime == time){
            const process = processTable.shift();

            queue.push(new Work(process.pid, -1, 0, process.cpuRequire));
            queueSort();
        }
        
        if (queue.length > 0 && queue[0].remain < minRequire){
            if(chart.length > 0 && chart[chart.length - 1].isNotComplete()){
                const lastWork = chart[chart.length - 1];
                queue.push(new Work(lastWork.pid, -1, 0, lastWork.remain));
                    
                queueSort();
            }
            
            const minWork = queue.shift();
            chart.push(new Work(minWork.pid, time, 0, minWork.remain));
            minRequire = minWork.remain;
        }else if (chart.length > 0 && !chart[chart.length - 1].isNotComplete() && queue.length > 0){
            const nextWork = queue.shift();
            chart.push(new Work(nextWork.pid, time, 0, nextWork.remain));
            minRequire = nextWork.remain;
        }
        
    }
    
    return chart;
}

/**
 * Sort function for queue
 * @param {String} sortCase - Determine which case to use. Two case is not the same requirement.
 */
function queueSort(sortCase){
    if(sortCase == 'non'){
        queue.sort(function(a, b){
            return a.cpuRequire > b.cpuRequire;
        });
    }else{
        
        queue.sort(function(a, b){
            return a.remain > b.remain;
        });
        
    }
    
}
/**
 * Clean the queue.
 */
function queueClean(){
    // Clean the queue
    while(queue.length > 0){
        queue.pop();
    }
}


exports.scheduler = scheduler;
exports.scheduler_non = scheduler_non;