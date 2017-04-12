const RRWork = require('./work').RRWork;


var scheduler = function(processTable, quantum, totalTime){
    var queue = [];
    var chart = [];
    var time = 0;

    while (time <= totalTime){

        while (processTable.length > 0 && processTable[0].joinTime <= time){
            const process = processTable.shift();
            queue.push(new RRWork(process.pid, -1, 0, process.cpuRequire, quantum));
            
        }
        if (chart.length == 0){
            const newWork = queue.shift();
            chart.push(new RRWork(newWork.pid, time, 0, newWork.remain, quantum));
        }else{
            chart[chart.length - 1].down(time);

            if(chart[chart.length - 1].quantum == 0 || chart[chart.length - 1].done() && queue.length > 0){
                if(chart[chart.length - 1].quantum == 0 && !chart[chart.length - 1].done()){
                    queue.push(chart[chart.length - 1].reload());
                    while(queue.length > 0 && queue[0].done()){
                        queue.shift();
                    }
                }
                
                const newWork = queue.shift();
                chart.push(new RRWork(newWork.pid, time, 0, newWork.remain, quantum));
            }
        }

        time++;
    }

    return chart;
}

exports.scheduler = scheduler;