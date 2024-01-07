import * as utils from './utils.js';

// 오늘의 날짜를 가져온다.
const [year, month, day] = utils.getTime();

// 참조하는 폴더 내부에 날짜에 맞는 파일들을 찾는다.
const foundFile = utils.findFiles(month, day);
console.log(foundFile);

// 파일이 없다면 진행하지 않는다.
// 파일들이 있다면 다음으로 진행한다.
// 해당 파일들을 읽어 문서들과, message를 가져온다.
// 해당 문서들 정보로 commit 할 폴더의 유무를 확인한 후 commit할 위치에 파일을 생성한다.
// sh 파일을 실행하여 commit 한다.