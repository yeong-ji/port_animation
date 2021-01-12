const span = document.querySelectorAll("span");

document.querySelector('#start').addEventListener('click', (e) => {
e.preventDefault;
document.querySelector('#start').style.display = 'none';
span[0].style.display = 'block';
// span.forEach( span => {
//     span.style.display = 'block';
// })


//let candidate = Array(45);   //[]보통은 대괄호 너무 많을땐 Array라는 함수를 이용 empty는 완전히 빈값
//mapping 맵
let candidate = Array(45)
    .fill()
    .map((element, index) => {
    return index + 1;
});

// console.log(candidate);

let shuffle = [];
while(candidate.length > 0) {
    let movingValue = candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0];
    shuffle.push(movingValue);
}

//console.log(shuffle);

let bonus = shuffle[shuffle.length - 1];
let passNum = shuffle
    .slice(0, 6)  //실제로는 0~5까지 자른다.
    .sort((p, c) => { 
        return p - c 
    });

//console.log('당첨숫자들',passNum,'보너스', bonus)


let result = document.getElementById('result');

ballColor = (num, result) => {
    let ball = document.createElement('div');
        ball.textContent = num;
        // ball.style.display = 'inline-block';
        // ball.style.border = '1px solid black';
        // ball.style.borderRadius = '50%';
        // ball.style.width = '20px';
        // ball.style.height = '20px';
        // ball.style.textAlign = 'center';
        // ball.style.marginRight = '10px';
        // ball.style.fontSize = '12px';
        let backColor;
        if(num <= 10){
            backColor = 'red';
        } else if(num <= 20) {
            backColor = 'orange';
        } else if(num <= 30) {
            backColor = 'yellowgreen';
        } else if(num <= 40) {
            backColor = 'blue';
        } else {
            backColor = 'green';
        }
        ball.style.backgroundColor = backColor;
        result.appendChild(ball);
}   
    for (let i = 0; i < passNum.length; i++) {
        (closure = (j) => {
            setTimeout(callback = () => {
                ballColor(passNum[j], result);
            },(j + 1) * 1000); //밀리초
        })(i);
    }
   
    setTimeout(callback = () => {
        span[1].style.display = 'block';
        let column = document.getElementsByClassName('bonus')[0]
        ballColor(bonus, column)
    },7000);

});