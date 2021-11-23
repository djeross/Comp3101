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

        if (executed.length === 0) {
          queue[next]["start"] = queue[next].arrival_time;
          console.log(queue[next].start)
        } else {
          queue[next]["start"] = end;
        }
        
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
      console.log("start: " + executed[i].start);
      console.log("ct: " + executed[i].completion_time);
      console.log("tat: " + executed[i].turnaround_time);
      console.log("wt: " + executed[i].waiting_time + "\n\n\n");
    }

    generate_spn_chart(executed);
    generate_spn_table(executed);

  });

}

function generate_spn_chart(processes) {

  var data = [];
  var process;

  for (let i = 0; i < processes.length; i++) {
    process = {
      x: "Process " + processes[i].id, 
      y: [processes[i].start, processes[i].completion_time]
    }

    data.push(process);
  }

  var options = {
    series: [
    {
      data: data
    }
  ],
    chart: {
    height: 350,
    type: 'rangeBar'
  },
  plotOptions: {
    bar: {
      horizontal: true
    }
  },
  xaxis: {
    type: 'int'
  }
  };

  var chart = new ApexCharts(document.querySelector("#sjn-chart"), options);
  chart.render();

}

function generate_spn_table(processes) {
  var table = `
    <table>
    <tr>
      <th>PID</th>
      <th>Arrival Time</th>
      <th>Burst Time</th>
      <th>Completion Time</th>
      <th>Turnaround Time</th>
      <th>Waiting Time</th>
    </tr>
  `;

  for (let i = 0; i < processes.length; i++) {
    table += `
      <tr>
        <td>${processes[i].id}</td>
        <td>${processes[i].arrival_time}</td>
        <td>${processes[i].burst_time}</td>
        <td>${processes[i].completion_time}</td>
        <td>${processes[i].turnaround_time}</td>
        <td>${processes[i].waiting_time}</td>
      </tr>
    `;
  }

  table += `</table>`;

  var div = document.getElementById('sjn-table');
  div.innerHTML = table;
}

function generate_spn_form() {
  var div = document.getElementsByClassName("main")[0];

  div.innerHTML = `
          <div id="sjn-input">
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
          </div>
          <div id="output">
            <div id="sjn-chart"></div>
            <div id="sjn-table"></div>
          </div>
  `;
}