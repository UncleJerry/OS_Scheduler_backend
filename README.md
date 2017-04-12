# Process Scheduler based on HTML5

> A simulator of process scheduling algorithms.
>
> Course project for CO003 Operationg Systems - Spring 2017.



## Algorithms include

- [x] First-Come First-Serve (FCFS),
- [x] Shortest Job First (SJF), both preemptive and non-preemptive,
- [x] Round-robin (RR),
- [ ] Priority Scheduling: both preemptive and non-preemptive,
- [ ] Multi-queue Scheduling (to be implemented)



## Other Features

- [x] Timing calculations related to turnaround time, wait time and their average time.

- [x] Login System - The Schema is provided by a sql file.

- [x] Basic access control with different users - By identity in account table

- [ ] Further access control.

- [ ] User behaviors tracing and recording by DB.


## Test
The default port to be used is 3223.

You can test login system by access /login.html, if successed the page will redirect to /scheduler.html which can test the scheduler for inplemented algorithms.

For I have no idea about frond end, the input job is done by file reading, but you still can test the page supported by this systerm in a way of input the filename.

Signup design can be testd by /signup.html which share the same redirection to scheduler.html

## Note
The login part is based on [one of my work](https://github.com/UncleJerry/Fish-pool) for an iOS project.

The login status tracing is powered by session, which will store the user connection identity until it exit or out of date (also can be stored in some kind of cache such as Redis). But the tracing is off by default on scheduler.html, you can uncomment the codes to turn on.


The format of job file is as followed:

PID ProcessName CPURequirement JoinTime Priority