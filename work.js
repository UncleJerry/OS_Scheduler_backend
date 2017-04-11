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
 * Round Robin creation
 * @param {Number} pid - Process ID
 * @param {Number} current - Current time
 * @param {Number} timer - How long this work
 * @param {Number} total - Total Requirement
 * @param {Number} quantum - Quantum setting
 */
RRWork = function (pid, current, timer, total, quantum){
    Work.call(this, pid, current, timer, total);
    this.quantum = Number(quantum);
}

RRWork.prototype = Object.create(Work.prototype);

RRWork.prototype.done = function (){
    return this.remain <= 0;
}

RRWork.prototype.down = function(time){
    this.quantum -= Number(time) - this.endTime;
    this.update(time);
}

RRWork.prototype.reload = function(){
    return (new RRWork(this.pid, -1, 0, this.remain, 0));
}


exports.Work = Work;
exports.RRWork = RRWork;