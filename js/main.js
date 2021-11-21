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
    var arrival_time = document.getElementById("a-time").value;
    var burst_time = document.getElementById("b-time").value;

    let process = {id: pid, arrival_time: arrival_time, burst_time: burst_time};
    processes.push(process);
    console.log(process);

    document.getElementById("sjn-form").reset();
    console.log(processes);

  });

  gantt_btn.addEventListener("click", function(e){
    e.preventDefault();
    
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