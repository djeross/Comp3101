"use strict";

window.onload = function() {
  main()
}

function main() {

}

// Shortest Job Next Scheduling
function sjn_scheduling() {
  var processes = []; 
  const enter_btn = document.getElementById("sjf-enter-btn");
  const gantt_btn = document.getElementById("sjf-gantt-btn");
  const table_div = document.getElementById("sjn-table-div");
  var id_track = 1;

  enter_btn.addEventListener("click", function(e){
    e.preventDefault();
  
    var arrival_time = Number(document.getElementById("a-time").value);
    var burst_time = Number(document.getElementById("b-time").value);

    let process = {id: id_track, arrival_time: arrival_time, burst_time: burst_time};
    id_track += 1;
    processes.push(process);

    document.getElementById("sjn-form").reset();

    const sjn_header = document.getElementById("sjn-header");
    sjn_header.innerHTML = "Processes";

    var table = `
      <br>
      <table id="sjn-table" class="table table-bordered">
      <tr>
        <th scope="col">PID</th>
        <th scope="col">Arrival Time</th>
        <th scope="col">Burst Time</th>
      </tr>
    `;

    for (let i = 0; i < processes.length; i++) {
      table += `
        <tr>
          <td>${processes[i].id}</td>
          <td>${processes[i].arrival_time}</td>
          <td>${processes[i].burst_time}</td>
        </tr>
      `;
    }

    table += `</table>`;
    table_div.innerHTML = table;

  });

  gantt_btn.addEventListener("click", function(e){
    e.preventDefault();

    enter_btn.disabled = true;

    var total_processing_time = cal_total_processing_time(processes);
    simulate(processes, total_processing_time);

  });

}

// simulates processing
function simulate(processes, total_processing_time) {

  var container = `
      <div class="col-md-12">
          <div class="card flex-md-row mb-4 box-shadow h-md-250 p-5">
            <div class="card-body d-flex flex-column align-items-start">
              <h4>Ready Queue</h4>
              <ul class="list-group" id="ready_queue"></ul> <!--/.ready_queue-->
            </div><!--/.card-body-->
            <div class="card-img-right flex-auto d-none d-md-block">
              <p class="fw-bold text-primary">CPU</p>
              <svg id="cpu" xmlns="http://www.w3.org/2000/svg" width="150" height="150" fill="currentColor" class="bi bi-cpu" viewBox="0 0 16 16">
                <path d="M5 0a.5.5 0 0 1 .5.5V2h1V.5a.5.5 0 0 1 1 0V2h1V.5a.5.5 0 0 1 1 0V2h1V.5a.5.5 0 0 1 1 0V2A2.5 2.5 0 0 1 14 4.5h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14a2.5 2.5 0 0 1-2.5 2.5v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14A2.5 2.5 0 0 1 2 11.5H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2A2.5 2.5 0 0 1 4.5 2V.5A.5.5 0 0 1 5 0zm-.5 3A1.5 1.5 0 0 0 3 4.5v7A1.5 1.5 0 0 0 4.5 13h7a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 11.5 3h-7zM5 6.5A1.5 1.5 0 0 1 6.5 5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5v-3zM6.5 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/>
              </svg>
              <h5 class="pt-5" id="time_counter">Time: <span class="text-danger">not-started</span></h5>
            </div>

            <div id="current-process-container" class="badge bg-primary" style="position: absolute; left: 1155px; top: 150px; display: none;">
            </div>
          </div><!--/.card-->
        </div><!--/.col-->

      </div>
  `;
  const sjn_header = document.getElementById("sjn-header");
  sjn_header.innerHTML = "Simulation in progress...";
  var div = document.getElementById('sjn-table-div');
  div.innerHTML = container;

  var time = 0;
  var end;
  var ready_queue_ar = [];
  var executed = [];
  var burst_time = 0;
  var current_process_con = $('#current-process-container');
  var burst_times = [];

  function do_processing() {
    var arrived_process = get_process(processes, time);
    console.log(time)
    console.log(arrived_process)

    if (arrived_process.length != 0){
      ready_queue_ar.push(...arrived_process);
    }

    if (ready_queue_ar.length != 0) { // if ready queue has values then lets process
      sort_queue(ready_queue_ar, $("#ready_queue"))
      console.log("ready queue: " + ready_queue_ar[0].id)
      

      if (burst_time == 0) { // if cpu free then take the next process
        console.log("done" + time)

        burst_times = [];
        for (let i = 0; i < ready_queue_ar.length; i++) {
          burst_times.push(ready_queue_ar[i].burst_time);
        }

        var next = burst_times.indexOf(Math.min.apply(null, burst_times));
        console.log(next)

        var current_process = ready_queue_ar[next];
        console.log(current_process)

        if (executed.length === 0) {
          ready_queue_ar[next]["start"] = ready_queue_ar[next].arrival_time;
          end = ready_queue_ar[next].arrival_time;
        } else {
          ready_queue_ar[next]["start"] = end;
        }
        
        end += ready_queue_ar[next].burst_time;

        ready_queue_ar[next]["completion_time"] = end;
        ready_queue_ar[next]["turnaround_time"] = ready_queue_ar[next].completion_time - ready_queue_ar[next].arrival_time;
        ready_queue_ar[next]["waiting_time"] = ready_queue_ar[next].turnaround_time - ready_queue_ar[next].burst_time;

        executed.push(ready_queue_ar[next]);

        var current_process_el = $(`#${current_process.id}`)

        if (current_process_con[0].style.display === 'block'){
          remove_process_from_cpu(current_process_con);
        }

        current_process_el[0].style.position = 'absolute';
        current_process_el.animate({left: '522px', top: '50px'}, 'slow', function() {
          current_process_con[0].innerHTML = current_process.id;
          current_process_con[0].style.display = 'block';
          current_process_con[0].style.left = '1155px';
          current_process_con[0].style.top = '150px';


          burst_time = parseInt(current_process.burst_time) - 1;

          ready_queue_ar = ready_queue_ar.filter((item) => item.id !== current_process.id);
          console.log(ready_queue_ar);
        });

      }

    }

    if (time == total_processing_time) { // end process
      //alert('Processing finished');
      generate_spn_chart(executed);
      generate_spn_table(executed);
    }

    time += 1;
    if (burst_time != 0) burst_time -= 1;
    $("#time_counter")[0].innerHTML = "Time: " + time + "s";

  }

  setInterval(do_processing, 1500);
} // ends simulation

// returns process according to arrival time
function get_process(process_ar, current_second) {
  var all_f_processes = [];
  for (var i = 0; i < process_ar.length; i++) {
    var f_process = process_ar[i];
    if (f_process.arrival_time == current_second) {
      all_f_processes.push(f_process);
    }
  }
  return all_f_processes; // returns array of processes with same arrival time
}



// animation to remove process from cpu
function remove_process_from_cpu(current_process_con) {
  current_process_con.animate({left: '2090px', top: '50px'}, 'slow', function() {
  });

}

// sort queue by lowest burst time
function sort_queue(ready_queue_ar, ready_queue_show) {
  ready_queue_ar.sort( function(a, b) {
    return a.burst_time - b.burst_time;
  });

  ready_queue_show[0].innerHTML = "";

  for (var i = 0; i < ready_queue_ar.length; i++) {
    var arrived_process = ready_queue_ar[i];
    var queue_entry = [
        "<li class='list-group-item'>",
          "<div class='badge bg-primary' style='position: relative;' id='" + arrived_process.id + "'>" ,
            arrived_process.id,
          "</div>",
        "</li>"].join("\n");

    ready_queue_show.append(queue_entry);
  }
}

// caculates total processing time
function cal_total_processing_time(process_ar) {
  var total_time = 0;
  for (var i = 0; i < process_ar.length; i++) {
    var p = process_ar[i];
    if(total_time < parseInt(p.arrival_time)){
      total_time = parseInt(p.arrival_time);
    }
    total_time += parseInt(p.burst_time);
  }
  return total_time;
}

function generate_spn_chart(processes) {

  const sjn_header = document.getElementById("sjn-header");
  sjn_header.innerHTML = "Results";

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

  const gantt_header = document.getElementById("gantt-header");
  gantt_header.innerHTML = "GANTT CHART";

  var chart = new ApexCharts(document.querySelector("#sjn-chart"), options);
  chart.render();

}

function generate_spn_table(processes) {
  var avg_wt = 0;
  var avg_tat = 0;
  var table = `
    <br>
    <table id="sjn-table" class="table table-bordered">
    <tr>
      <th scope="col">PID</th>
      <th scope="col">Arrival Time</th>
      <th scope="col">Burst Time</th>
      <th scope="col">Completion Time</th>
      <th scope="col">Turnaround Time</th>
      <th scope="col">Waiting Time</th>
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
    avg_wt += processes[i].waiting_time;
    avg_tat += processes[i].turnaround_time;
  }

  avg_wt /= processes.length;
  avg_tat /= processes.length;

  table += `
        <tr>
          <td colspan="4" style="text-align: right">Average</td>
          <td>${avg_tat}</td>
          <td>${avg_wt}</td>
        </tr>
      </table>
  `;

  var div = document.getElementById('sjn-table-div');
  div.innerHTML = table;
}

function generate_spn_form() {
  var div = document.getElementsByClassName("main")[0];

  div.innerHTML = `
        <h1>Shortest Job Next Scheduling (Non-Preemptive)</h1>
        <div class="d-flex flex-row container gap-4">
          <div id="sjn-input" class="container bg-light p-5 rounded-3 shadow-sm w-50 h-50">
            <form id="sjn-form" action="" method="post">
              <h3>Add process</h3>
              <div class="form-group mt-2">
                  <label for="a-time">Arrival Time:</label><br>
                  <input type="number" class="form-control" name="a-time" id="a-time" placeholder="Enter arrival time">
              </div>
              <div class="form-group mt-2">
                  <label for="b-time">Burst Time:</label><br>
                  <input type="number" class="form-control" name="b-time" id="b-time" placeholder="Enter burst time">
              </div>
              <div class="d-flex flex-row gap-2 mt-3">
                  <button type="submit" class="btn btn-primary" id="sjf-enter-btn">Enter values</button>
                  <button type="submit" class="btn btn-primary" id="sjf-gantt-btn">Show Results</button>
              </div>
            </form>
          </div>
          <div id="output" class="container bg-light p-5 rounded-3 shadow-sm">
            <h3 id="sjn-header">Results</h3>
            <h6 id="gantt-header" class="text-center"></h6>
            <div id="sjn-chart"></div>
            <div id="sjn-table-div">The results will appear here.</div>
          </div>
        </div>
  `;
}