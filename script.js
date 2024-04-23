// 모델을 업로드 하고 웹 주소로 사용해야 함. 웹앱으로 서버에서 
const URL = "https://teachablemachine.withgoogle.com/models/KqzO8JMCh/"; 
// 웹서버를 이용한다면 이렇게 사용하는 것도 가능합니다. 
const URL2 = "./model/"; 

// 각각의 html에 있는 태그를 JS로 가져오기 왜냐하냐 그 태그들을 이용해서 컨트롤을 작성하기 위함. 
const icon = document.querySelector('.icon');
const on = document.querySelector('.fas.fa-video');
const off = document.querySelector('.fas.fa-video-slash');
const camera=document.querySelector('.camera');
const name = document.querySelector('.name');
const percent = document.querySelector('.percent');
const description = document.querySelector('.description');

let model, webcam, labelContainer, maxPredictions;

// icon을 클릭했을때 invisible class의 생성 소멸을 컨트롤 하기 위해서 event를 추가 함.
icon.addEventListener('click', async () => {
    on.classList.toggle('invisible');
    off.classList.toggle('invisible');
  
    if (on.classList.length === 2) {
      await webcam.pause();
    } else {
      await webcam.play();
      window.requestAnimationFrame(loop);
    }
  });

 async function init() {
    const modelURL = URL + 'model.json';
    const metadataURL = URL + 'metadata.json';
  
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
  
    const flip = true;
    webcam = new tmImage.Webcam(380, 380, flip);
    await webcam.setup();  
    camera.appendChild(webcam.canvas);
 }
  
 async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
 }

 // 실행을 위해서 메인 함수를 호출하였음. TM01에서는 버튼을 눌렀을때 init 함수를 호출한것과 다름
init()

// run the webcam image through the image model
async function predict() {
    const prediction = await model.predict(webcam.canvas);
  
    for (let i = 0; i < maxPredictions; i++) {
      const className = prediction[i].className;
      const probability = prediction[i].probability.toFixed(2) * 100;
  
      // 위키백과에서 정보를 가져오는 비동기 함수
      async function fetchWikiData(className) {
        const url = `https://ko.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(className)}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.extract; // 요약 정보를 반환
        } catch (error) {
            return '위키백과에서 정보를 가져오는데 실패했습니다.'; // 오류 처리
        }
    }
  
      if (probability >= 65) {
        if (name.innerHTML !== className) {
          name.innerHTML = className;
          // 위키백과에서 해당 클래스 이름에 대한 설명을 가져와서 표시
          fetchWikiData(className).then(summary => {
            description.innerHTML = summary;
        });
        }
  
        if (percent.innerHTML !== probability + '%') {
          percent.innerHTML = probability + '%';
        }
      }
    }
  }