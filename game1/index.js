let tbody = document.querySelector('#table tbody');
let dataset = [];
let 중단플래그 = false;
let 열은칸 = 0;
let 코드표 = {  //딕셔너리
    연칸: -1,
    물음표: -2,
    깃발:-3,
    깃발지뢰:-4,
    물음표지뢰:-5,
    지뢰: 1,
    보통칸:0,
}
document.querySelector('#exec').addEventListener('click', function(){
    tbody.innerHTML = ''; //tbody 내부 태그 지우기 (초기화)
    document.querySelector('#result').textContent = '';
    dataset = []; //dataset 도 새롭게
    열은칸 = 0;
    중단플래그 = false;
    let hor = parseInt(document.querySelector('#hor').value);
    let ver = parseInt(document.querySelector('#ver').value);
    let mine = parseInt(document.querySelector('#mine').value);
    //console.log(hor, ver, mine);

    let 후보군 = Array(hor * ver)
        .fill() //채우기
        .map(function(요소, 인덱스){ //map 짝지어주는 것
        return 인덱스; // 뽑는 수 0 ~ 99
        });
    let 셔플 = [];

    while(후보군.length > hor * ver - mine) {
        let 이동값 = 후보군.splice(Math.floor(Math.random() * 후보군.length), 1)[0];
        셔플.push(이동값);
    } //피셔예이츠 셔플로 지뢰를 심을 20개 위치를 뽑는다.

    //console.log(셔플);
    //지뢰 테이블 만들기

    //가로세로 10개
    for(let i = 0; i < ver; i++){
        let arr = [];
        let tr = document.createElement('tr');
        dataset.push(arr);
        for(let j = 0; j < hor; j++){
            arr.push(코드표.보통칸);
            let td = document.createElement('td');
            //우클릭 이벤트
            td.addEventListener('contextmenu', function(e){
                e.preventDefault();
                if(중단플래그){
                    return;
                }
                //e.target
                let 부모tr = e.currentTarget.parentNode;
                let 부모tbody = e.currentTarget.parentNode.parentNode;
                let 칸 = Array.prototype.indexOf.call(부모tr.children, e.currentTarget); //배열이 아닌 곳에 강제로 indexOf를 사용
                let 줄 = Array.prototype.indexOf.call(부모tbody.children, 부모tr);
                //console.log(부모tr, 부모tbody, e.currentTarget, 칸, 줄);
                if(e.currentTarget.textContent === '' || e.currentTarget.textContent === 'X') {
                    e.currentTarget.textContent = '!';
                    e.currentTarget.classList.add('flag');
                    if (dataset[줄][칸] === 코드표.지뢰){
                        dataset[줄][칸] = 코드표.깃발지뢰;
                    }else {
                        dataset[줄][칸] = 코드표.깃발;
                    }
                } else if (e.currentTarget.textContent === '!'){
                    e.currentTarget.textContent = '?';
                    e.currentTarget.classList.remove('flag');
                    e.currentTarget.classList.add('question');
                    if (dataset[줄][칸] === 코드표.깃발지뢰){
                        dataset[줄][칸] = 코드표.물음표지뢰;
                    }else {
                        dataset[줄][칸] = 코드표.물음표;
                    }
                } else if (e.currentTarget.textContent === '?'){
                    e.currentTarget.classList.remove('question');
                    if (dataset[줄][칸] === 코드표.물음표지뢰) {
                        e.currentTarget.textContent = 'X';
                        dataset[줄][칸] = 코드표.지뢰;
                    } else {
                        e.currentTarget.textContent = '';
                        dataset[줄][칸] = 코드표.보통칸;
                    }
                } 
            });
            td.addEventListener('click', function(e){
                if(중단플래그){
                    return;
                }
                //클릭했을 때 주변 지뢰 갯수
                let 부모tr = e.currentTarget.parentNode;
                let 부모tbody = e.currentTarget.parentNode.parentNode;
                let 칸 = Array.prototype.indexOf.call(부모tr.children, e.currentTarget); //배열이 아닌 곳에 강제로 indexOf를 사용
                let 줄 = Array.prototype.indexOf.call(부모tbody.children, 부모tr);
                if([코드표.연칸, 코드표.깃발, 코드표.깃발지뢰, 코드표.물음표지뢰, 코드표.물음표].includes(dataset[줄][칸])){
                    return;
                }
                //클릭했을때
                e.currentTarget.classList.add('opened');
                열은칸 += 1;
                if (dataset[줄][칸] === 코드표.지뢰){
                    e.currentTarget.textContent = '펑';
                    document.querySelector('#result').textContent = '실패';
                    중단플래그 = true; //플래그는 코드의 흐름을 좌우하는 변수
                } else {
                    let 주변 = [   
                        //둘러싼 8칸
                        dataset[줄][칸-1], dataset[줄][칸+1], 
                    ];
                    if (dataset[줄-1]){
                        주변 = 주변.concat([dataset[줄-1][칸-1], dataset[줄-1][칸], dataset[줄-1][칸+1]]); //concat 배열과 배열을 합쳐서 새로운 배열을 만든다.
                    } 
                    if (dataset[줄+1]) {
                        주변 = 주변.concat([dataset[줄+1][칸-1], dataset[줄+1][칸], dataset[줄+1][칸+1]]);
                    }
                    let 주변지뢰개수 = 주변.filter(function(v){ //배열에서 필터링 / 배열요소가 x인것
                       return [코드표.지뢰, 코드표.깃발지뢰, 코드표.물음표지뢰].includes(v);
                    }).length;
                    e.currentTarget.textContent = 주변지뢰개수 || '';  //거짓인 값: false, '', 0, null, undefined, NaN 이 값들이 오면 뒤에 것을 쓰라는 의미
                    dataset[줄][칸] = 코드표.연칸;
                    if(주변지뢰개수 === 0){
                        // 주변 8칸 동시 오픈 
                        let 주변칸 = [];
                        if(tbody.children[줄-1]) {
                       주변칸 = 주변칸.concat([
                                tbody.children[줄 - 1].children[칸 - 1],
                                tbody.children[줄 - 1].children[칸],
                                tbody.children[줄 - 1].children[칸 + 1],
                            ]);
                        }
                   주변칸 = 주변칸.concat([
                            tbody.children[줄].children[칸 - 1],
                            tbody.children[줄].children[칸 + 1],
                        ]);

                        if(tbody.children[줄 + 1]){
                       주변칸 = 주변칸.concat([
                                tbody.children[줄 + 1].children[칸 - 1],
                                tbody.children[줄 + 1].children[칸],
                                tbody.children[줄 + 1].children[칸 + 1],
                            ]);
                        }
                        주변칸.filter((v) => !!v).forEach(function(옆칸){    //배열에서 undefined 를 제거하는 코드
                            let 부모tr = 옆칸.parentNode;
                            let 부모tbody = 옆칸.parentNode.parentNode;
                            let 옆칸칸 = Array.prototype.indexOf.call(부모tr.children, 옆칸); //배열이 아닌 곳에 강제로 indexOf를 사용
                            let 옆칸줄 = Array.prototype.indexOf.call(부모tbody.children, 부모tr);
                            if (dataset[옆칸줄][옆칸칸] !== 코드표.연칸){
                                옆칸.click(); //(재귀 함수 형식)
                            }
                        }); 
                    }
                }
                if(열은칸 === hor * ver - mine){
                    중단플래그 = true;
                    document.querySelector('#result').textContent = '승리';
                }
            });
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
   

    //지뢰심기
    for (let k = 0; k < 셔플.length; k++){ //예 60
        let 세로 = Math.floor(셔플[k] / ver); // 예 7 -> 6
        let 가로 = 셔플[k] % ver; // 예 0 -> 0
        //console.log(세로, 가로);
        tbody.children[세로].children[가로].textContent = 'X';
        dataset[세로][가로] = 코드표.지뢰;
    }

    // console.log(dataset);
});