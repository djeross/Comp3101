"use strict";

window.onload = function() {
  main()
}

function main() {
  fcfs();
}


// First Come First Serve Algorithm
function fcfs() {
  var process_ar = []; // stores array containing process attributes

  // Handles adding new process
  $('#add_process_form').on("submit", function(e) {
    e.preventDefault();
    const table_body = document.querySelector("tbody");
    var arrival_time = document.getElementById('process_arrival_time').value;
    var burst_time = document.getElementById('process_burst_time').value;

    var p_name = "P" + process_ar.length;
    let process = [p_name, arrival_time, burst_time];
    process_ar.push(process);

    // Adds new process to table
    table_body.innerHTML += `
      <tr>
        <td>${process[0]}</td>
        <td>${process[1]}</td>
        <td>${process[2]}</td>
      </tr>`;

    // Resets "add process" form
    $(this)[0].reset();
    return true;
  });

  // Functionality to button which initiates simulation
  $('#simulate').click(function (e) {
    var total_processing_time = cal_total_processing_time();
    e.preventDefault();
    simulate(total_processing_time);
  });

  // simulates processing
  function simulate(total_processing_time) {
    var time = 0;
    var ready_queue_ar = [];
    var burst_time = 0;
    var current_process_con = $('#current-process-container')

    function do_processing() {
      var arrived_process = get_process(time);

      if (arrived_process.length != 0){
        ready_queue_ar.push(...arrived_process);
      }

      if (ready_queue_ar.length != 0) { // if ready queue has values then lets process
        sort_queue(ready_queue_ar, $("#ready_queue"))
        var current_process = ready_queue_ar[0];

        if (burst_time == 0) { // if cpu free then take the next process
          var current_process_el = $(`#${current_process[0]}`)

          if (current_process_con[0].style.display === 'block'){
            remove_process_from_cpu(current_process_con);
          }

          current_process_el[0].style.position = 'absolute';
          current_process_el.animate({left: '1090px', top: '50px'}, 'slow', function() {
            current_process_con[0].innerHTML = current_process[0];
            current_process_con[0].style.display = 'block';
            current_process_con[0].style.left = '1155px';
            current_process_con[0].style.top = '150px';


            burst_time = parseInt(current_process[2]);

            ready_queue_ar = ready_queue_ar.filter((item) => item[0] !== current_process[0]);
            console.log(ready_queue_ar);
          });

        }

      }

      if (time == total_processing_time + 2) { // end process
        alert('Processing finished');
      }

      time += 1;
      if (burst_time != 0) burst_time -= 1;
      $("#time_counter")[0].innerHTML = "Time: " + time + "s";

    }

    setInterval(do_processing, 1500);
  } // ends simulation

  // returns process according to arrival time
  function get_process(current_second) {
    var all_f_processes = [];
    for (var i = 0; i < process_ar.length; i++) {
      var f_process = process_ar[i];
      if (f_process[1] == current_second) {
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

  // sort queue by lowest arrival time
  function sort_queue(ready_queue_ar, ready_queue_show) {
    ready_queue_ar.sort( function(a, b) {
      return a[1] - b[1];
    });

    ready_queue_show[0].innerHTML = "";

    for (var i = 0; i < ready_queue_ar.length; i++) {
      var arrived_process = ready_queue_ar[i];
      var queue_entry = [
          "<li class='list-group-item'>",
            "<div class='badge bg-primary' style='position: relative;' id='" + arrived_process[0] + "'>" ,
              arrived_process[0],
            "</div>",
          "</li>"].join("\n");

      ready_queue_show.append(queue_entry);
    }
  }

  // caculates total processing time
  function cal_total_processing_time() {
    var total_time = 0;
    for (var i = 0; i < process_ar.length; i++) {
      var p = process_ar[i];
      if(total_time < parseInt(p[1])){
        total_time = parseInt(p[1]);
      }
      total_time += parseInt(p[2]);
    }
    return total_time;
  }
} // end of first come first serve algorithm
