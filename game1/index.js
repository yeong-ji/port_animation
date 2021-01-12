let tbody = document.querySelector('#table tbody');
let dataset = [];
let stopFlag = false;
let openSpace = 0;
let codeTable = {  //딕셔너리
    open: -1,
    question: -2,
    exclamation:-3,
    exclamationPetard:-4,
    questionPetard:-5,
    petard: 1,
    normal:0,
}
document.querySelector('#exec').addEventListener('click', () => {
    tbody.innerHTML = ''; //tbody 내부 태그 지우기 (초기화)
    document.querySelector('#result').textContent = '';
    dataset = []; //dataset 도 새롭게
    openSpace = 0;
    stopFlag = false;
    let hor = parseInt(document.querySelector('#hor').value);
    let ver = parseInt(document.querySelector('#ver').value);
    let mine = parseInt(document.querySelector('#mine').value);
    //console.log(hor, ver, mine);

    let candidate = Array(hor * ver)
        .fill() //채우기
        .map((element, index) => { //map 짝지어주는 것
        return index; // 뽑는 수 0 ~ 99
        });
    let shuffle = [];

    while(candidate.length > hor * ver - mine) {
        let movingValue = candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0];
        shuffle.push(movingValue);
    } // 셔플로 지뢰를 심을 20개 위치를 뽑는다.

    //console.log(shuffle);
    //지뢰 테이블 만들기

    //가로세로 10개
    for(let i = 0; i < ver; i++){
        let arr = [];
        let tr = document.createElement('tr');
        dataset.push(arr);
        for(let j = 0; j < hor; j++){
            arr.push(codeTable.normal);
            let td = document.createElement('td');
            //우클릭 이벤트
            td.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                if(stopFlag){
                    return;
                }
                //e.target
                let parentsTr = e.currentTarget.parentNode;
                let parentsTbody = e.currentTarget.parentNode.parentNode;
                let column = Array.prototype.indexOf.call(parentsTr.children, e.currentTarget); //배열이 아닌 곳에 강제로 indexOf를 사용
                let row = Array.prototype.indexOf.call(parentsTbody.children, parentsTr);
                //console.log(parentsTr, parentsTbody, e.currentTarget, column, row);
                if(e.currentTarget.textContent === '' || e.currentTarget.textContent === 'X') {
                    e.currentTarget.textContent = '!';
                    e.currentTarget.classList.add('flag');
                    if (dataset[row][column] === codeTable.petard){
                        dataset[row][column] = codeTable.exclamationPetard;
                    }else {
                        dataset[row][column] = codeTable.exclamation;
                    }
                } else if (e.currentTarget.textContent === '!'){
                    e.currentTarget.textContent = '?';
                    e.currentTarget.classList.remove('flag');
                    e.currentTarget.classList.add('question');
                    if (dataset[row][column] === codeTable.exclamationPetard){
                        dataset[row][column] = codeTable.questionPetard;
                    }else {
                        dataset[row][column] = codeTable.question;
                    }
                } else if (e.currentTarget.textContent === '?'){
                    e.currentTarget.classList.remove('question');
                    if (dataset[row][column] === codeTable.questionPetard) {
                        e.currentTarget.textContent = 'X';
                        dataset[row][column] = codeTable.petard;
                    } else {
                        e.currentTarget.textContent = '';
                        dataset[row][column] = codeTable.normal;
                    }
                } 
            });
            td.addEventListener('click', (e) => {
                if(stopFlag){
                    return;
                }
                //클릭했을 때 주변 지뢰 갯수
                let parentsTr = e.currentTarget.parentNode;
                let parentsTbody = e.currentTarget.parentNode.parentNode;
                let column = Array.prototype.indexOf.call(parentsTr.children, e.currentTarget); //배열이 아닌 곳에 강제로 indexOf를 사용
                let row = Array.prototype.indexOf.call(parentsTbody.children, parentsTr);
                if([codeTable.open, codeTable.exclamation, codeTable.exclamationPetard, codeTable.questionPetard, codeTable.question].includes(dataset[row][column])){
                    return;
                }
                //클릭했을때
                e.currentTarget.classList.add('opened');
                openSpace += 1;
                if (dataset[row][column] === codeTable.petard){
                    e.currentTarget.textContent = '펑';
                    document.querySelector('#result').textContent = '실패';
                    stopFlag = true; //플래그는 코드의 흐름을 좌우하는 변수
                } else {
                    let around = [   
                        //둘러싼 8칸
                        dataset[row][column-1], dataset[row][column+1], 
                    ];
                    if (dataset[row-1]){
                        around = around.concat([dataset[row-1][column-1], dataset[row-1][column], dataset[row-1][column+1]]); //concat 배열과 배열을 합쳐서 새로운 배열을 만든다.
                    } 
                    if (dataset[row+1]) {
                        around = around.concat([dataset[row+1][column-1], dataset[row+1][column], dataset[row+1][column+1]]);
                    }
                    let aroundPetard = around.filter((v) => { //배열에서 필터링 / 배열요소가 x인것
                       return [codeTable.petard, codeTable.exclamationPetard, codeTable.questionPetard].includes(v);
                    }).length;
                    e.currentTarget.textContent = aroundPetard || '';  //거짓인 값: false, '', 0, null, undefined, NaN 이 값들이 오면 뒤에 것을 쓰라는 의미
                    dataset[row][column] = codeTable.open;
                    if(aroundPetard === 0){
                        // 주변 8칸 동시 오픈 
                        let aroundColumn = [];
                        if(tbody.children[row-1]) {
                        aroundColumn = aroundColumn.concat([
                                tbody.children[row - 1].children[column - 1],
                                tbody.children[row - 1].children[column],
                                tbody.children[row - 1].children[column + 1],
                            ]);
                        }
                        aroundColumn = aroundColumn.concat([
                                tbody.children[row].children[column - 1],
                                tbody.children[row].children[column + 1],
                            ]);

                        if(tbody.children[row + 1]){
                        aroundColumn = aroundColumn.concat([
                                tbody.children[row + 1].children[column - 1],
                                tbody.children[row + 1].children[column],
                                tbody.children[row + 1].children[column + 1],
                            ]);
                        }
                        aroundColumn.filter((v) => !!v).forEach((sideColumn) => {    //배열에서 undefined 를 제거하는 코드
                            let parentsTr = sideColumn.parentNode;
                            let parentsTbody = sideColumn.parentNode.parentNode;
                            let sideColumn2 = Array.prototype.indexOf.call(parentsTr.children, sideColumn); //배열이 아닌 곳에 강제로 indexOf를 사용
                            let sideColumnrow = Array.prototype.indexOf.call(parentsTbody.children, parentsTr);
                            if (dataset[sideColumnrow][sideColumn2] !== codeTable.open){
                                sideColumn.click(); //(재귀 함수 형식)
                            }
                        }); 
                    }
                }
                if(openSpace === hor * ver - mine){
                    stopFlag = true;
                    document.querySelector('#result').textContent = '승리';
                }
            });
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
   

    //지뢰심기
    for (let k = 0; k < shuffle.length; k++){ //예 60
        let vertical = Math.floor(shuffle[k] / ver); // 예 7 -> 6
        let horizontal = shuffle[k] % ver; // 예 0 -> 0
        //console.log(vertical, horizontal);
        tbody.children[vertical].children[horizontal].textContent = 'X';
        dataset[vertical][horizontal] = codeTable.petard;
    }

    // console.log(dataset);
});