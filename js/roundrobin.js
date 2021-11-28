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
    var front;
    colors=["#c5c59a","#52b0ed","#9d6f7a","#ec28ad","#7893cc","#696941","#d8b286","#8fe306","#6769eb","#d1a966","#d4fda7","#4ebf85","#839ae1","#275bf7","#77f0ad","#515d5d","#febe82","#2d7a5d","#ef594c","#334789","#5dbf92","#34eca0","#4d1910","#7dfebb",'#ec920b","#fde25a","#38749e","#62e8d7","#f43174","#e24b5a"];
    
    

    function addToQueue(process) {
        var service= process.querySelectorAll(".service_value")[0].innerHTML;
        var arrival= process.querySelectorAll(".arrive_value")[0].innerHTML;
        var id_value= process.querySelectorAll(".id_value")[0].innerHTML;
        queue.insertAdjacentHTML( 'beforeend',createPorcess(arrival,service,id_value) );
    }

    function checkReady(process){ //uses add to queue
        var arrival= parseInt(process.querySelectorAll(".arrive_value")[0].innerHTML);
        if (arrival<timer) {
            addToQueue(process);
        }
    }


    function getFrontOfQ(){
        var q=document.querySelector(".square");
        return q;
    }

    

    document.querySelector("#start").addEventListener('click',startScheduling);
    function startScheduling(e){
        e.preventDefault();
        time_qauntum=document.querySelector("#timequantum").value;
       if((created_processes.length!=0) && (time_qauntum!=0 )){
            /* document.querySelector("#start").disabled = true;
            process=created_processes.shift().querySelectorAll(".square")[0];
            addToQueue(process);
            target_process=queue.querySelectorAll(".square")[0];
            startAnimation(target_process);*/ 
           
            for (let index = 0; index < created_processes.length; index++) {
                process=created_processes[index].querySelectorAll(".square")[0];
                addToQueue(process);   
            }
            setTimeout(startAnimation, 1000, getFrontOfQ());
            //console.log(document.querySelectorAll(".square").length);
        }

    }

    function startAnimation(square,quantum){
        //if (document.querySelectorAll(".square").length!=0){
            setTimeout(moveRight, 1500, square);
            setTimeout(processing,3000,square);
            setTimeout(moveDown, 5000, square);
       // }
       // return 1;
         
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
        }

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
            //console.log("moving RIGHT");
            if (pos == 280) {
                clearInterval(id);
                return sqr;
            } else {
                pos++; 
                sqr.style.left = pos + 'px'; 
            }
        }
    }

    function moveDown(sqr){
        if (current_process_rem_time!=0){
            document.querySelector("#linedown").appendChild(sqr);
            sqr.style.left = 12+'px';
            sqr.style.position="absolute";
            var pos1 = 0;
            var id1 = setInterval(frame2, 1);
            function frame2() {
                //console.log("moving DOWN");
                if (pos1 == 220) {
                    clearInterval(id1);
                    return true;
                } else {
                    pos1++; 
                    sqr.style.top = pos1 + 'px'; 
                }
            }
            setTimeout(moveLeft, 1000, sqr);
            setTimeout(moveUP, 3500, sqr);
            setTimeout(joinQueue, 6300, sqr);
            setTimeout(startAnimation, 7000, getFrontOfQ());
        }else{
            var id_value=sqr.querySelectorAll(".id_value")[0].innerHTML;
            ///alert(`Process with id ${id_value}`);
            sqr.style.transition = '1.0s';
            sqr.style.opacity = 0;
            setTimeout(removeFromDom, 1200, sqr);
            setTimeout(startAnimation, 2000, getFrontOfQ());
        }
    }

    function processing(sqr){
        var service_p=sqr.querySelectorAll(".service_value")[0];
        value=service_p.innerHTML;
        var time=time_qauntum;
        while (0!=time) {
            value--;
            timer++;
            service_p.innerHTML=value;
            time--; 
            if(parseInt(value)==0){
                sqr.style.backgroundColor = 'green' ;
                current_process_rem_time=0;
                break;
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
            //console.log("moving LEFT");
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
        /*var service_value=sqr.querySelectorAll(".service_value")[0].innerHTML;
        var arrival_value=sqr.querySelectorAll(".arrive_value")[0].innerHTML;
        var id_value=sqr.querySelectorAll(".id_value")[0].innerHTML;
        var Q = document.querySelector("#queue");
        sqr.remove();
        var new_ps=createPorcess(arrival_value,service_value,id_value)
        Q.insertAdjacentHTML( 'beforeend', new_ps );*/
        var Q = document.querySelector("#queue");
        sqr.style.top =null;
        sqr.style.left = null;
        sqr.style.position = "static";
        Q.appendChild(sqr);

    }
    

    function finished(sqr){
        var service_p=sqr.querySelectorAll(".service_value")[0];
        if (parseInt(service_p)==0){
            return true;
        }
        return false;
    }

    function removeFromDom(sqr) {
        sqr.remove();

    }


});