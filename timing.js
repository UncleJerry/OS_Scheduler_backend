function Time(){
    this.wait = 0;
    this.turnaround = 0;
}

Time.prototype.calWait = function(chart, pID, arrival){
    var filteredChart = chart.filter(findID(pID));
    var lastWork = filteredChart.shift();
    this.wait += (lastWork.startTime - arrival);
    while (filteredChart.length > 0){
        this.wait += (filteredChart.startTime - lastWork.endTime);
    }
}

Time.prototype.calTurn = function(chart, pID, arrival){
    const endTime = chart.reverse().find(findID(pID)).endTime;
    this.turnaround = Number(arrival) - endTime;
}


function findID(element, pID){
    return element.pid == pID;
}

exports.Time = Time;