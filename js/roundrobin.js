window.addEventListener('load',()=>{ 
    var time_qauntum=0;
    var processcounter=0;
    created_processes = [];
    number_Queue = [];
    ready=[];
    var queue = document.querySelector("#queue");;
    var timer=0;
    moveready=0;
    current_process_rem_time=99999999;
    
    document.querySelector("#start").addEventListener('click',startScheduling);


    function addToQueue(process) {
        var service= process.querySelectorAll(".service_value")[0].innerHTML;
        var arrival= process.querySelectorAll(".arrive_value")[0].innerHTML;
        var id_value= process.querySelectorAll(".id_value")[0].innerHTML;
        queue.insertAdjacentHTML( 'beforeend',createPorcess(arrival,service,id_value) );
    }

    function checkReady(process){
        var arrival= parseInt(process.querySelectorAll(".arrive_value")[0].innerHTML);
        if (arrival<timer) {
            addToQueue(process);
        }

    }

    function getFront(){
        return created_processes[0];
    }

    function startScheduling(e){
        e.preventDefault();
        time_qauntum=document.querySelector("#timequantum").value;
        if((created_processes.length!=0) && (time_qauntum!=0 )){
            document.querySelector("#start").disabled = true;
            //console.log(created_processes[0].querySelectorAll(".square")[0]);
            process=created_processes.shift().querySelectorAll(".square")[0];
            addToQueue(process);
            target_process=queue.querySelectorAll(".square")[0];
            startAnimation(target_process);
        }
    }





    function startAnimation(square,quantum){
        setTimeout(moveRight, 500, square);
        var value=setTimeout(processing,2500,square);
        setTimeout(moveDown, 3500, square,value); 
    }


    document.querySelector("#add").addEventListener('click',addToCreated);
    function addToCreated(e){
        e.preventDefault();
        var Q = document.querySelector("#queue");
        var service=document.querySelector("#servicetime").value;
        var arrival=document.querySelector("#arrivaltime").value;
        if (!(service=="") && !(arrival=="")) {
            var pcount=document.querySelector("#processcount");
            processcounter=parseInt(pcount.innerHTML)+1;
            pcount.innerHTML= processcounter;
            number_Queue.push(processcounter);
            var new_ps_string=createPorcess(arrival,service,processcounter);
            var ps = new DOMParser().parseFromString(new_ps_string, "text/xml");
            if(created_processes.length==0){
                created_processes.push(ps);
            }else{
                order_push(ps);
            }
        }
        //var s=document.querySelectorAll(".square");
        //var x =s[s.length-2];
        /*var complete= moveRight(x);
        setTimeout(moveDown, 2000, x);
        setTimeout(moveLeft, 4000, x);
        setTimeout(moveUP, 7000, x);
        setTimeout(joinQueue, 8500, x);*/
    }





    document.querySelector("#add").addEventListener('click',addToCreated);
    function addToCreated(e){
        e.preventDefault();
        var Q = document.querySelector("#queue");
        var service=document.querySelector("#servicetime").value;
        var arrival=document.querySelector("#arrivaltime").value;
        if (!(service=="") && !(arrival=="")) {
            document.querySelector("#servicetime").value="";
            document.querySelector("#arrivaltime").value="";
            var pcount=document.querySelector("#processcount");
            processcounter=parseInt(pcount.innerHTML)+1;
            pcount.innerHTML= processcounter;
            number_Queue.push(processcounter);
            var new_ps_string=createPorcess(arrival,service,processcounter);
            var ps = new DOMParser().parseFromString(new_ps_string, "text/xml");
            if(created_processes.length==0){
                created_processes.push(ps);
            }else{
                order_push(ps);
            }

           // for(let i=0;i<created_processes.length;i++){
            //    console.log(created_processes[i]);
            //} 
        }
        //var s=document.querySelectorAll(".square");
        //var x =s[s.length-2];
        /*var complete= moveRight(x);
        setTimeout(moveDown, 2000, x);
        setTimeout(moveLeft, 4000, x);
        setTimeout(moveUP, 7000, x);
        setTimeout(joinQueue, 8500, x);*/
    }

    function order_push(sqr){
        new_value=sqr.querySelectorAll(".arrive_value")[0].innerHTML;
        sizeb4=created_processes.length;
        for(let i=0;i<created_processes.length;i++){
            var item =created_processes[i].querySelectorAll(".arrive_value")[0].innerHTML;
            if(parseInt(new_value)<parseInt(item)){
                created_processes.splice(i, 0, sqr);
                break;
            }
        }
        if(sizeb4==created_processes.length) {
            created_processes.push(sqr);
        }

        //console.log(created_processes.length);
    }
  
    function createPorcess(Atime,Stime,id){
        var ps= `<div class="square" id="a${id}">
        <div class="segment1">
            <p>ID</p>
            <p class="id_value">${id}</p>
        </div>
        <div class="segment2">
            <p>AT</p>
            <p class="arrive_value">${Atime}</p> 
        </div>
        <div class="segment3">
            <p class="service_value">${Stime}</p>
        </div>
    </div>`
    return ps;
    }

    function moveRight(sqr,value){
        document.querySelector("#connect").appendChild(sqr);
        sqr.style.position="absolute";
        /*sqr.animate({transform: `translateX(${280}px)`},{duration:1000,iterations: 1,fill: 'none' });*/
        var pos = 0;
        var id = setInterval(frame, 1);
        function frame() {
            console.log("moving RIGHT");
            if (pos == 280) {
                clearInterval(id);
                return sqr;
            } else {
                pos++; 
                sqr.style.left = pos + 'px'; 
            }
        }
    }

    function moveDown(sqr,value){
        alert(value);
        if (value==0){
            document.querySelector("#linedown").appendChild(sqr);
            sqr.style.left = 12+'px';
            sqr.style.position="absolute";
            var pos1 = 0;
            var id1 = setInterval(frame2, 1);
            function frame2() {
                console.log("moving DOWN");
                if (pos1 == 220) {
                    clearInterval(id1);
                    return true;
                } else {
                    pos1++; 
                    sqr.style.top = pos1 + 'px'; 
                }
            }
            setTimeout(moveLeft, 5000, square);
            setTimeout(moveUP, 8000, square);
            setTimeout(joinQueue, 9500, square);
        }else{
            fade(sqr);
        }
    }

    function processing(sqr){
        var service_p=sqr.querySelectorAll(".service_value")[0];
        value=service_p.innerHTML;
        var time=time_qauntum;
        while (0<time) {
            value--;
            service_p.innerHTML=value;
            time--; 
            if(parseInt(value)==0){
                sqr.style.backgroundColor = 'green' ;
                current_process_rem_time=0;
            }
        }
        current_process_rem_time=value;
    }
    
    function moveLeft(sqr){
        document.querySelector("#lineleft").appendChild(sqr);
        sqr.style.position="absolute";
        sqr.style.top = 10 +'px';
        sqr.style.left = 510 +'px';
        
        
        var pos3 = 0;
        var id3 = setInterval(frame3, 1);
        function frame3() {
            console.log("moving LEFT");
            if (pos3 == 510) {
                clearInterval(id3);
                return true;
            } else {
                pos3++; 
                var sub = 510-pos3;
                sqr.style.left =  sub + 'px'; 

            }
        }
    }

    function moveUP(sqr){
        document.querySelector("#lineup").appendChild(sqr);
        sqr.style.position="absolute";
        sqr.style.top = 230 +'px';
        sqr.style.left = 12 +'px';

        var pos3 = 0;
        var id3 = setInterval(frame3, 1);
        function frame3() {
            console.log("moving LEFT");
            if (pos3 == 230) {
                clearInterval(id3);
                return true;
            } else {
                pos3++; 
                var sub = 230-pos3;
                sqr.style.top =  sub + 'px'; 

            }
        }

    }

    function joinQueue(sqr){ 
        var service_value=sqr.querySelectorAll(".service_value")[0].innerHTML;
        var arrival_value=sqr.querySelectorAll(".arrive_value")[0].innerHTML;
        var id_value=sqr.querySelectorAll(".id_value")[0].innerHTML;
        var Q = document.querySelector("#queue");
        sqr.remove();
        var new_ps=createPorcess(arrival_value,service_value,id_value)
        Q.insertAdjacentHTML( 'beforeend', new_ps );

        
    }
    

    function finished(sqr){
        var service_p=sqr.querySelectorAll(".service_value")[0];
        if (parseInt(service_p)==0){
            return true;
        }
        return false;
    }

    function fade(sqr) {
        sqr.style.transition = '0.8s';
        sqr.style.opacity = 0;
        sqr.remove();

    }


});