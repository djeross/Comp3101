"use strict";

window.onload = function() {
  main()
}

function main() {
}

// Shortest Job Next Scheduling
function sjn_scheduling() {
  var processes = []; 
  const enter_btn = document.getElementById("enter-btn");
  const gantt_btn = document.getElementById("gantt-btn");

  enter_btn.addEventListener("click", function(e){
    e.preventDefault();
  
    var pid = document.getElementById("pid").value;
    var arrival_time = Number(document.getElementById("a-time").value);
    var burst_time = Number(document.getElementById("b-time").value);

    let process = {id: pid, arrival_time: arrival_time, burst_time: burst_time};
    processes.push(process);

    document.getElementById("sjn-form").reset();

  });

  gantt_btn.addEventListener("click", function(e){
    e.preventDefault();

    enter_btn.disabled = true;
    var time = 0;
    var end = 0;
    var queue = [];
    var executed = [];
    var burst_times;

    // beginning of implementation
    while (executed.length != processes.length) {

      for (let i = 0; i < processes.length; i++) {
        if (processes[i].arrival_time === time) {
          queue.push(processes[i]);
        }
      }

      burst_times = [];

      for (let i = 0; i < queue.length; i++) {
        burst_times.push(queue[i].burst_time);
      }

      var next = burst_times.indexOf(Math.min.apply(null, burst_times));

      if (next === -1) {
        continue;
      }

      if (time === end) {
        end += queue[next].burst_time;

        queue[next]["completion_time"] = end;
        queue[next]["turnaround_time"] = queue[next].completion_time - queue[next].arrival_time;
        queue[next]["waiting_time"] = queue[next].turnaround_time - queue[next].burst_time;

        executed.push(queue[next]);
        queue.splice(next, 1);
        
      }

      time += 1;

    } // end of implementation

    for (let i = 0; i < executed.length; i++) {
      console.log("id: " + executed[i].id);
      console.log("ct: " + executed[i].completion_time);
      console.log("tat: " + executed[i].turnaround_time);
      console.log("wt: " + executed[i].waiting_time + "\n\n\n");
    }

  });

}

function generate_spn_form() {
  var div = document.getElementsByClassName("main")[0];

  div.innerHTML = `
          <form id="sjn-form" action="" method="post">
            <h1>Shortest Job Next Scheduling</h1>
            <div class="form-field">
                <label for="pid">Process ID:</label><br>
                <input type="text" name="pid" id="pid" placeholder="Enter process ID">
            </div>
            <div class="form-field">
                <label for="a-time">Arrival Time:</label><br>
                <input type="text" name="a-time" id="a-time" placeholder="Enter arrival time">
            </div>
            <div class="form-field">
                <label for="b-time">Burst Time:</label><br>
                <input type="text" name="b-time" id="b-time" placeholder="Enter burst time">
            </div>
            <div>
                <button type="submit" class="btn" id="enter-btn">Enter values</button>
            </div>
            <div>
                <button type="submit" class="btn" id="gantt-btn">Show Gantt Chart</button>
            </div>
          </form>
  `;
}