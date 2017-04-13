/**
 * Add new Work Object
 * @param {Number} pid - Process ID
 * @param {Number} current - Current time
 * @param {Number} timer - How long this work
 * @param {Number} total - Total Requirement
 */
function Work(pid, current, timer, total){
    this.pid = Number(pid);
    if (current >= 0) {
        this.startTime = Number(current);
        this.endTime = this.startTime + Number(timer);
    }
    this.remain = Number(total) - Number(timer);
}
/**
 * update the work on chart
 * @param {Number} time - How long this work
 */
Work.prototype.update = function(time){
    this.remain -= (Number(time) - this.endTime);
    this.endTime = Number(time);
}
/*
Work.prototype.putInto = function(current, timer){
    this.startTime = Number(current);
    this.endTime = current + Number(timer);
    this.remain -= Number(timer);
}*/
Work.prototype.isNotComplete = function(){
    return this.remain > 0;
}

/**
 * A object print function
 */
Work.prototype.toPrint = function(){
    return 'Work { pid: ' + this.pid + ', startTime: ' + this.startTime + ', endTime: ' + this.endTime + ', remain: ' + this.remain + ' }\n'; 
}

/**
 * Round Robin creation
 * @param {Number} pid - Process ID
 * @param {Number} current - Current time
 * @param {Number} timer - How long this work
 * @param {Number} total - Total Requirement
 * @param {Number} quantum - Quantum setting
 */
RRWork = function (pid, current, timer, total, quantum){
    // Inheritance from Work Object
    Work.call(this, pid, current, timer, total);
    this.quantum = Number(quantum);
}

/**
 * Inheritance from Work Object
 */
RRWork.prototype = Object.create(Work.prototype);

/**
 * Chech if the job is done.
 * @return {Bool} - True if remain is 0 or less
 */
RRWork.prototype.done = function (){
    return this.remain <= 0;
}

/**
 * Down the quantum. 
 * @param {Number} time - For compatibility this should be current time.
 */
RRWork.prototype.down = function(time){
    this.quantum -= Number(time) - this.endTime;
    this.update(time);
}

/**
 * Reload the RRWork to queue
 * @return {RRWork} - A queued RRWork object
 */
RRWork.prototype.reload = function(){
    return (new RRWork(this.pid, -1, 0, this.remain, 0));
}


exports.Work = Work;
exports.RRWork = RRWork;