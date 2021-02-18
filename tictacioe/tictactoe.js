const body = document.querySelector('body');
const table = document.createElement('table');
let tr = [];
let td = [];
let tern = 'X';
let result = document.createElement('div');

function resultCheck(line, spaces){
    //세칸 다 채워졌나?
    let full = false;
    //가로줄 검사
    if(
        td[line][0].textContent === tern && 
        td[line][1].textContent === tern && 
        td[line][2].textContent === tern
    ){
        full = true;
    }
    //세로줄 검사
    if(
        td[0][spaces].textContent === tern && 
        td[1][spaces].textContent === tern && 
        td[2][spaces].textContent === tern
    ){
        full = true;
    }
    //대각선 검사 
    if(
        td[0][0].textContent === tern &&
        td[1][1].textContent === tern &&
        td[2][2].textContent === tern
    ){
        full = true;
    }
    if(
        td[0][2].textContent === tern &&
        td[1][1].textContent === tern &&
        td[2][0].textContent === tern
    ){
        full = true;
    }

    return full;
};

function reset(draw){ //초기화
    if(draw){
        result.textContent = '무승부';
    } else {  //승리
        //console.log(턴 + '님이 승리!');
        result.textContent = `${tern}님의 승리!`;
    }

     //초기화
     setTimeout(function() {
        result.textContent = '';
        td.forEach(function(line){
            line.forEach(function (space){
                space.textContent = '';
            });
        });
        tern = 'X';
     }, 1000);
};

const callBack = function(event){//target클릭이벤트가 일어난 태그  
    if (tern === 'O'){ //컴퓨터의 턴일때 유저가 클릭하지 않도록
        return;
    }
    //console.log(이벤트.target); //칸
    //console.log(이벤트.target.parentNode); //줄
    //console.log(이벤트.target.parentNode.parentNode); //테이블
    let line = tr.indexOf(event.target.parentNode);
    console.log('몇줄', line);
    let spaces = td[line].indexOf(event.target);
    console.log('몇칸',spaces);


    //칸이 이미 채워져 있는가?
    if(td[line][spaces].textContent !== ''){
        console.log('빈칸아닙니다');
    }else { //빈 칸이면
        console.log('빈칸입니다');
        td[line][spaces].textContent = tern;
    
    let victory = resultCheck(line, spaces);

    //모든 칸이 다 찼는지 검사
    let candidate = [];
    td.forEach(function (line) {
        line.forEach(function (space) {
            candidate.push(space);
        });
    });
    candidate = candidate.filter(function (space){ return !space.textContent }); //textContent가 false 인 값이 아닌것

    if(victory === true){ // 이겼을 경우
        reset(false);
    } else if (candidate.length === 0) { //칸을 더이상 선택할 수 없음.
        reset(true);
    } else {  // 다 안 찼으면
        if(tern === 'X') {
            tern = 'O';
        }
        setTimeout(function(){
            //컴퓨터 turn
            console.log('컴퓨터의 턴 입니다.');
            //빈 칸중에 하나를 고른다.
            
            
            let select = candidate[Math.floor(Math.random() * candidate.length)]; //후보칸 갯수중에 하나 선택
            select.textContent = 'O';
            //컴퓨터가 승리했는지 체크
            let line = tr.indexOf(select.parentNode);
            let spaces = td[line].indexOf(select);
            
            let victory = resultCheck(line, spaces);
        
            //다 찼으면
            if(victory){ //컴퓨터가 이겼을 경우
                reset();
            }
            //턴을 나한테 넘긴다.
            tern = 'X';
        },1000);
    }
  
    }
};

for( let i = 1; i <= 3; i++){
    const line = document.createElement('tr'); //줄 하나에
    tr.push(line);
    td.push([]);
    for(let j = 1; j <= 3; j++){  //칸 3개 추가
        const space = document.createElement('td');
        //칸들 클릭
        space.addEventListener('click', callBack);
        td[i - 1].push(space);
        line.appendChild(space);
    }
    table.appendChild(line);
}
body.appendChild(table);

body.appendChild(result);

