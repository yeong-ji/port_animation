const form = document.querySelector(".js-form"),
input = form.querySelector("input"),
greeting = document.querySelector(".js-greetings");

const USER_LS = "currentUser",
      SHOWING_CN = "showing";

function saveName(text){
    localStorage.setItem(USER_LS, text);   // 저장하는 방법
}


function handleSubmit(event){ //이 함수는 전에 만들어둔 event와 같이 실행된다.
    event.preventDefault(); //input의 기존 event 동작을 막음
    const currentValue = input.value; //input의 값을 변수에 담음
    paintGreeting(currentValue); //paintGreeting함수의 인자값으로 해서 HTML 텍스트로 보여줌 * 하지만 여기까지는 내가 입력한 내용을 기억하지 못함
    saveName(currentValue); // value 값을 저장
}
function askForName(){
    form.classList.add(SHOWING_CN);
    form.addEventListener("submit", handleSubmit); //무언가를 form에 전송하면
}

function paintGreeting(text){
    form.classList.remove(SHOWING_CN);
    greeting.classList.add(SHOWING_CN);
    greeting.innerText = `안녕하세요. ${text} 님`;
}

function loadName() {
    const currentUser = localStorage.getItem(USER_LS);
    if(currentUser === null){
        //이름 없을때
        askForName();
    }else {
        paintGreeting(currentUser);
    }
}



function init(){
 loadName();

}
init();