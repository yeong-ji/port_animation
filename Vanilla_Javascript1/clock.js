const clockContainer = document.querySelector(".js-clock");
const clockTitle = clockContainer.querySelector("h1");

function getTime(){
    const date = new Date(); //여기서 date 는 class 이다.
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const seconds = date.getSeconds();
    clockTitle.innerText = `${
        hours < 10 ? `0${hours}` : hours
    }:${
        minutes < 10 ? `0${minutes}` : minutes
    }:${
        seconds < 10 ? `0${seconds}` : seconds     // 삼항연산자 -> 만약 초가 10보다 작으면 `0${seconds}` 실행하고 아니면 seconds 실행
    }`;   // 얻음 시간을 갖고 시게부분 HTML변경 
}

function init(){
    getTime();  // 초기화 과정에서 먼저 시간을 얻고
    setInterval(getTime, 1000); // 매초마다 시간을 얻음
}

init();