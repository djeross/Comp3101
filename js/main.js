"use strict";

window.onload = function() {
  main()
}

function main() {
  priority_scheduling();
}


// Priority Scheduling
function priority_scheduling() {
  var process_ar = []; // store process objects

  // Handle adding new process
  $('#add_process_form').on("submit", function(e) {
    e.preventDefault();
    var proccess_priority = $('#proccess_priority').val();
    var proccess_arrival_time = $('#proccess_arrival_time').val();
    var proccess_burst_time = $('#proccess_burst_time').val();

    let process_ob = { process_id: "P" + process_ar.length,
                       proccess_priority: proccess_priority, 
                       proccess_arrival_time: proccess_arrival_time, 
                       proccess_burst_time: proccess_burst_time };

    process_ar.push(process_ob);

    var t_row = [
      "<tr>",
        "<td>" + process_ob.process_id + "</td>",
        "<td>" + process_ob.proccess_priority + "</td>",
        "<td>" + process_ob.proccess_arrival_time + "</td>",
        "<td>" + process_ob.proccess_burst_time + "</td>",
      "</tr>"].join("\n");

    $('#empty_process_message').hide();
    $('#processes').append(t_row);
    $('#add_process_modal').modal('toggle');

    $(this)[0].reset();
    return true;
  });

  $('#simulate').click(function (e) {
    var total_processing_time = cal_total_processing_time();
    e.preventDefault();
    simulate(total_processing_time);
  }); 

  // simulate processing
  function simulate(total_processing_time) {
    var seconds = 0;
    var ready_queue_ar = [];
    var burst_time = 0;
    var current_process_con = $('#current-process-container')

    function do_processing() {
      var arrived_process = get_process(seconds);

      if (arrived_process.length != 0){
        ready_queue_ar.push(...arrived_process);        
      }

      if (ready_queue_ar.length != 0) { // if ready queue has values then lets process
        sort_queue(ready_queue_ar, $("#ready_queue"))
        var current_process = get_highest_priority_process(ready_queue_ar);

        if (burst_time == 0) { // if cpu free then take the next process
          var current_process_el = $(`#${current_process.process_id}`)

          if (current_process_con[0].style.display == 'block') remove_process_from_cpu(current_process_con)

          current_process_el[0].style.position = 'absolute'; 
          current_process_el.animate({left: '1090px', top: '50px'}, 'slow', function() {
            current_process_con[0].innerHTML = current_process.process_id;
            current_process_con[0].style.display = 'block';
            current_process_con[0].style.left = '1155px';
            current_process_con[0].style.top = '150px';

            // current_process_el[0].style.display = 'none';
            burst_time = parseInt(current_process.proccess_burst_time);
            ready_queue_ar = ready_queue_ar.filter((item) => item.process_id !== current_process.process_id);
            console.log(ready_queue_ar);
          });
          
        }
      } 

      if (seconds == total_processing_time + 2) { // end process
        // remove_process_from_cpu(current_process_con)
        alert('Processing finished');
      }
      
      seconds += 1;
      if (burst_time != 0) burst_time -= 1; 
      $("#time_counter")[0].innerHTML = "Time: " + seconds + "s";
    }

    setInterval(do_processing, 1500);
  } // end simulate

  // returns process according to arrival time
  function get_process(current_second) {
    var all_f_processes = [];
    for (var i = 0; i < process_ar.length; i++) {
      var f_process = process_ar[i];
      if (f_process.proccess_arrival_time == current_second) {
        all_f_processes.push(f_process);
      }
    }
    return all_f_processes; // return multiple, incase arrival time is the same
  } 

  // Get highest priorty process
  function get_highest_priority_process(ready_queue_ar) {
    return ready_queue_ar[0];
  }

  // animation to remove process from cpu
  function remove_process_from_cpu(current_process_con) {
    // current_process_con[0].classList.remove('bg-primary');
    // current_process_con[0].classList.add('bg-danger');
    current_process_con.animate({left: '2090px', top: '50px'}, 'slow', function() {
      // current_process_con[0].style.display = 'none';
    });
  } 

  // sort queue by highest priority 
  function sort_queue(ready_queue_ar, ready_queue_show) {
    ready_queue_ar.sort( function(a, b) {
      return a.proccess_priority - b.proccess_priority;
    }); 

    ready_queue_show[0].innerHTML = "";

    for (var i = 0; i < ready_queue_ar.length; i++) {
      var arrived_process = ready_queue_ar[i];
      var queue_entry = [
          "<li class='list-group-item'>",
            "<div class='badge bg-primary' style='position: relative;' id='" + arrived_process.process_id + "'>" ,
              arrived_process.process_id,
            "</div>",
          "</li>"].join("\n");

      ready_queue_show.append(queue_entry);
    }
  } 

  // caculate total processing time
  function cal_total_processing_time() {
    var total_time = 0;
    for (var i = 0; i < process_ar.length; i++) {
      var _process = process_ar[i];
      total_time += parseInt(_process.proccess_arrival_time) + parseInt(_process.proccess_burst_time)
    }
    return total_time;
  }
} // end priority_scheduling