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
  var add_process_form = $('#add_process_form');

  // Handle adding new process
  add_process_form.on("submit", function(e) {
    e.preventDefault();

    var proccess_priority = $('#proccess_priority').val();
    var proccess_arrival_time = $('#proccess_arrival_time').val();
    var proccess_burst_time = $('#proccess_burst_time').val();

    let process_ob = { process_id: "P_" + process_ar.length,
                       process_id: process_ar.length, 
                       proccess_priority: proccess_priority, 
                       proccess_arrival_time: proccess_arrival_time, 
                       proccess_burst_time: proccess_burst_time };

    process_ar.push(process_ob);

    var t_row = [
      "<tr>",
        "<td> P" + process_ob.process_id + "</td>",
        "<td>" + process_ob.proccess_priority + "</td>",
        "<td>" + process_ob.proccess_arrival_time + "</td>",
        "<td>" + process_ob.proccess_burst_time + "</td>",
      "</tr>"
      ].join("\n");

    $('#empty_process_message').hide();
    $('#processes').append(t_row);
    $('#add_process_modal').modal('toggle');

    add_process_form[0].reset();
    return true;
  });
}