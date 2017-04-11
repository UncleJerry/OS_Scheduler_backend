/**
 * Create an Process Object
 * @function
 * @param {Number} pid - Process id
 * @param {String} name - Process name
 * @param {Number} requirement - CPU requirement
 * @param {Number} joinTime - When the process to join the scheduler
 * @param {Number} priority - The job priority from 1 to 4, higher number represent higher priority.
 */

function Process(pid, name, requirement, joinTime, priority){
    this.pid = Number(pid);
    this.pName = name;
    this.cpuRequire = Number(requirement);
    this.joinTime = Number(joinTime);
    this.priority = Number(priority);
}

exports.Process = Process;