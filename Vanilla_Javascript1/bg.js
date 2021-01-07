const body = document.querySelector("body");

const IMG_NUMBER = 5;

// function handleImgLoad(){

// }

function paintImage(imgNumber) {  
    const image = new Image(); // 새로운 object 를 만듬
    image.src = `images/${imgNumber + 1}.jpg`;  //이미지 경로
    body.appendChild(image);  //body 태그의 자식
    image.classList.add("bgImage");
    body.prepend(image); // 맨위로 이미지 태그 이동?
    // image.addEventListener("loadend", handleImgLoad);
}

function genRandom(){
    const number = Math.floor(Math.random() * IMG_NUMBER);  //랜덤으로 이미지 갯수만큼 호출
    return number;
}

function init(){
    const randomNumber = genRandom(); //숫자를 생성
    paintImage(randomNumber); //숫자를 가져와야함
}

init();