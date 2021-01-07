const toDoForm = document.querySelector(".js-toDoForm"),
toDoInput = toDoForm.querySelector("input"),
toDoList = document.querySelector(".js-toDoList");

const TODOS_LS = 'toDos';



let toDos = []; //1. 할일 목록에 비어있는 배열 생성. 

//HTML li를 지우는 함수
function deleteToDo(event){
    const btn = event.target;
    const li = btn.parentNode;
    toDoList.removeChild(li);
    const cleanToDos = toDos.filter(function (toDo){  //filter는 마치 forEach에서 처럼 각각의 아이템과 같이 실행.
            //array를 하나만들고 함수가 true를 return하는 아이템들
            return toDo.id !== parseInt(li.id);   //li에 없는 id인 toDos를 체크해서 그것의 저장을 지워야함.   / 모든 toDos가 li의 id와 같지 않을때
        });
        toDos = cleanToDos    // toDos 의 값이 변할 수 있는 let으로 변수 선언을 해줘야함.
        saveToDos();  //toDos 를 저장
}


function saveToDos(){  //localstorage에도 저장
    localStorage.setItem(TODOS_LS, JSON.stringify(toDos));
   //  **localstorage에는 자바스크립트 data를 저장할 수 없고 문자열만 저장가능** object가 string 되도록 만들어야한다.
}

//할일 목록을 저장하고  -> 할일목록은 배열이 되어야함.
// 2. 해야할 일을 생성했을 때 toDos 배열에 추가되도록하기.

function paintToDo(text){
    const li = document.createElement("li"); //li를 생성
    const delBtn = document.createElement("button"); //button 태그 생성
    delBtn.innerText = "X"; //생성한 버튼의 value 값을 넣고
    delBtn.addEventListener("click", deleteToDo); //닫기 버튼을 클릭할때 이벤트
    const span = document.createElement("span");
    const newId = toDos.length + 1; //toDos배열의 배열전체 수에 +1 이라는 뜻
    span.innerText = text;
    li.appendChild(span);  //li태그 안에 span 태그를 넣는다.
    li.appendChild(delBtn); //li태그 안에 버튼태그 넣는다.
    li.id = newId; //생성한 li에 id를 준다.
    toDoList.appendChild(li); //ul안에 li태그를 넣는다.
    const toDoObj = { // 3.할일 객체를 생성
        text: text, //text라는 key에 매개변수의 값 text 가 value
        id: newId   
    };
    toDos.push(toDoObj);  //toDos 배열안에 toDoObj 하나를 넣다.
    saveToDos();   //배열을 추가한다음에 localstorage에 저장을 해야함.
}

function handleSubmit(event){
    event.preventDefault();  //기존 submit 이벤트를 막음
    const currentValue = toDoInput.value; //input value값을 가져옴
    paintToDo(currentValue);
    toDoInput.value = ""; //input에 text를 쓰고 엔터를 눌렀을때 todo를 생성
}


// 정리하면 toDos를 가져온 뒤, parse()로 string을 object로 변환해주고 각각에 대해서 paintToDo()라는 함수가 실행되도록 함.
function loadToDos(){
    const loadToDos = localStorage.getItem(TODOS_LS);
    if(loadToDos !== null){   //toDos를 불러오는 작업
        const parsedToDos = JSON.parse(loadToDos);
        parsedToDos.forEach(function (toDo){  //forEach는 배열에 담겨있는 것들 각각에 한번씩 함수를 실행시켜준다.
            paintToDo(toDo.text);  //toDo.text 실행
        });
    } 
    //만약 toDos가 null 이랑 같을 때 (달라도 form은 항상 보여짐)
}
function init() {
    loadToDos(); // load해 와야하는 함수
    toDoForm.addEventListener("submit", handleSubmit);  //값을 전송했을때 이벤트
}
init();