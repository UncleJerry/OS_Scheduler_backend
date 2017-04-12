/**
 * Create a Time Object
 */

function Time(){
    this.wait = 0;
    this.turnaround = 0;
    this.pid = 0;
}

/**
 * Calculate the wait time for each process
 * @param {Work} chart - The Gantt Chart. RRWork object is also accecptable
 * @param {Number} pID - The process ID
 * @param {Number} arrival - The arrival time
 */
Time.prototype.calWait = function(chart, pID, arrival){

    // Filter all the work objects for this process
    var filteredChart = chart.filter(x => x.pid == pID);
    
    // Sort by start time in case for unexpected order
    filteredChart.sort(function(a, b){
        return a.startTime > b.startTime;
    });
    //console.log(filteredChart);
    // Calculate the wait time from arrival to first execute
    this.wait += (filteredChart[0].startTime - arrival);
    
    // Calculate other between pauses
    for (var index = 1; index < filteredChart.length; index++) {
        this.wait += (filteredChart[index].startTime - filteredChart[index - 1].endTime);
        //console.log(this.wait);
    }
    // Fill the pid
    this.pid = pID;
}

/**
 * Calculate the turnaround time
 * @param {Work} chart - The Gantt Chart. RRWork object is also accecptable
 * @param {Number} pID - The process ID
 * @param {Number} arrival - The arrival time;
 */
Time.prototype.calTurn = function(chart, pID, arrival){
    const endTime = chart.reverse().find(x => x.pid == pID).endTime;
    this.turnaround = endTime - Number(arrival);
    this.pid = pID;
}

exports.Time = Time;