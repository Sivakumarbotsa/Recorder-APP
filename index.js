let video = document.querySelector("video");
let recordBtnCont = document.querySelector(".record-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let  captureBtnCont=document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector(".capture-btn");
let transparentColor="transparent";

let recordFlag= false;

let recorder; //store undefined
let chunks=[]; //media data is stored in chunks

let constraints={
    audio: false,
    video: true,
}
//navigator is a global obj where the gives info about brows
navigator.mediaDevices.getUserMedia(constraints)
.then((stream)=>{
   video.srcObject=stream;

   recorder = new MediaRecorder(stream);
   recorder.addEventListener("start",(e)=>{
        chunks=[];
   })
   recorder.addEventListener("dataavailable",(e)=>{
        chunks.push(e.data);
    })

    recorder.addEventListener("stop",(e)=>{
        //convert the media chunks data to video
        let blob=new Blob(chunks,{type:"video/mp4"});
        let videoURL=URL.createObjectURL(blob);
        let a=document.createElement("a");
        a.href=videoURL;
        a.download="stream.mp4";
        a.click();
    })

    recordBtnCont.addEventListener("click",(e)=>{
        if(!recorder) return;

        recordFlag=!recordFlag;
        if(recordFlag){
            recorder.start();
            recordBtn.classList.add("scale-record");
            startTimer();
        }else{
            recorder.stop();
            recordBtn.classList.remove("scale-record");
            stopTimer();
        }
    })

});
//video is actually captured as chunks, but what these chunks will have,
//each chunk will be having a frame, image is actually frame

captureBtnCont.addEventListener("click",(e)=>{
    captureBtnCont.classList.add("scale-capture");

    let canvas= document.createElement("canvas");
    canvas.width=video.videoWidth;
    canvas.height=video.videoHeight;
    let imageURL= canvas.toDataURL("image/jpeg");

    let tool=canvas.getContext("2d");
    tool.drawImage(video,0,0,canvas.width,canvas.height);
    //filtering
    tool.fillStyle=transparentColor;
    tool.fillRect(0,0,canvas.width,canvas.height);

    let a=document.createElement("a");
    a.href=imageURL;
    a.download="Image.jpeg";
    a.click();

    setTimeout(()=>{
        captureBtn.classList.remove("scale-capture");
    },500);
})
//filtering logic

let filter=document.querySelector(".filter-layer");

let allFilters=document.querySelectorAll(".filter");
allFilters.forEach((filterElem)=>{
    filterElem.addEventListener("click",(e)=>{
        //get style
        transparentColor=getComputedStyle(filterElem).getPropertyValue("background-color");
        filter.style.backgroundColor=transparentColor;
    })
});



let timerID;
let counter=0;// Represents total srconds
let timer=document.querySelector(".timer");
function startTimer(){
    timer.style.display="block";
    function displayTimer(){
        /*
            how to cal time 
            1) initialize a var that actually stores no of seconds
            2) when ever this fun displaytimer is called then we need to increment the counter variable
            as each call of this func is considered as 1sec in regular  time. why?
            because we need to get the actual time when this need counted
            3)how to count Hours, Minutes &seconds?
            counter=3725 seconds,
            we know 1hr=3600 seconds ,
            to count 1hr using counter val, we use /(divison operator) btw counter and 3600sec
            but div operator is used to perform floor divisionn
             3725/3600=>1
             remaindere 3725%3600= no of minutes
             to find no of seconds
         */
        let  totalSeconds = counter;
        let hours= Number.parseInt(totalSeconds / 3600);
        totalSeconds=totalSeconds % 3600;
        let minutes=Number.parseInt(totalSeconds / 60);
        totalSeconds=totalSeconds % 60;
        let seconds=totalSeconds;

        hours= (hours < 10) ? `0${hours}` : hours;
        minutes= (minutes < 10)? `0${minutes}` : minutes;
        seconds= seconds < 10 ? `0${seconds}` : seconds;

        timer.innerText=`${hours}:${minutes}:${seconds}`;
        counter++;
    } 
    timerID = setInterval(displayTimer,1000); 
}
function stopTimer(){
    clearInterval(timerID);
    timer.innerText="00:00:00";
    timer.style.display="none";
    
}