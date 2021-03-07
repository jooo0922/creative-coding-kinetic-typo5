'use strict';

// 임시 캔버스에 텍스트가 어떻게 렌더되는지 보려고 테스트삼아 작성한 것.
// 나중에 실제 캔버스에 렌더할 때는 지워줄거임.
/*
import {
  Text
} from './text.js';
*/

// 이전과 다르게 Visual 클래스만 가져오는 게 아니라
// Text 클래스랑 이번에 새로 만든 setColor라는 함수도 app.js에서 가져오도록 함.
import {
  Visual
} from './visual.js';

import {
  setColor
} from './color.js';

import {
  Text
} from './text.js';

class App {
  constructor() {
    // 여기에는 particle들을 실제로 렌더해서 화면에 보여줄거임
    this.canvas = document.createElement('canvas');
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    // 현재 모니터가 레티나를 지원할 정도가 되면 2, 아니면 1을 리턴해줌
    this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

    this.thumbs = []; // 하단의 3개의 썸네일 각각의 li element와 이미지 src가 담긴 객체를 담아놓을 배열

    // 윈도우가 로드되면 Web Font Loader Library에서 원하는 폰트를 로드해옴
    WebFont.load({
      google: {
        families: ['Hind:700']
      },
      fontactive: () => { // 폰트가 로드되서 렌더될 때 각각의 폰트에 대해 콜백을 수행하는 이벤트
        // 임시 캔버스에 텍스트가 어떻게 렌더되는지 보려고 테스트삼아 작성한 것.
        // 실제 캔버스에 렌더할 때는 지워줄거임.
        /*
        this.text = new Text();
        this.text.setText(
          'A',
          2,
          document.body.clientWidth,
          document.body.clientHeight,
        );
        */

        // DOM에서 만든 ul element를 가져옴.
        // [0]하는 이유는, 저거 없이 그냥 가져와서 ul을 찍어보면 HTMLCollection이라는 ul을 포함해서 이것저것이 담긴 배열을 얻게 됨.
        // 그 배열에서 0번째에 해당하는 애가 ul element이기 때문에 우리가 원하는 건 그것만 가져오면 되니까 [0]으로 한 것.
        const ul = document.getElementsByTagName('ul')[0];
        const lis = ul.getElementsByTagName('li'); // 얘 역시 ul element안에 담긴 3개의 li를 포함한 이것저것이 담긴 HTMLCollection 배열을 얻게 됨.

        // for loop을 썸네일이 담긴 li element의 개수만큼 돌면서 각각의 li에 이벤트를 걸어주고 this.thumbs를 채워줌.
        for (let i = 0; i < lis.length; i++) {
          const item = lis[i]; // 각각의 li element만 할당해줌.
          const img = item.getElementsByTagName('img')[0]; // 각각의 li element안에 들어있는 HTMLCollection 중에서 img element만 가져옴
          item.addEventListener('click', e => {
            this.show(i); // 각각의 li element를 클릭할 때마다 현재 i값을 전달해서 this.show() 메소드를 호출하는 이벤트를 걸어둠
          }, false);

          // this.thumbs 배열의 i번 index에 li element와 그안의 img element의 src를 객체로 묶어서 넣어줌. 
          this.thumbs[i] = {
            item,
            img: img.src,
          };
        }

        // 이전과는 다르게 app.js에서 Text 인스턴스를 생성하네
        this.text = new Text();

        window.addEventListener('resize', this.resize.bind(this), false);
        this.resize();

        requestAnimationFrame(this.animate.bind(this));
      }
    });
  }

  // async가 붙으면 항상 내부에 명시된 프라미스를 반환하거나,
  // 프라미스가 아니더라도 프라미스로 감싸 반환함.
  // 여기에는 await가 붙은 setColor가 프라미스니까 이것이 처리된 결과가 반환되겠지?
  async show(index) {
    // for loop를 this.thumbs의 개수만큼(= 3개. Why? 위에 생성자에서 for loop를 3번 돌려서 this.thumbs에 추가해 줬으니까)
    // 돌리면서 생성자의 for loop에서 전달받은 i값(index)와 같은 i에 한해서만 selected라는 클래스 이름을 해당 li element에 추가해 줌.
    // 한마디로, 클릭이벤트를 받은 li element에 대해서만 selected라는 클래스를 붙여주고,
    // 나머지는 제거해줌으로써 클릭된 요소에만 해당하는 css가 적용되겠지
    for (let i = 0; i < this.thumbs.length; i++) {
      const item = this.thumbs[i].item;
      if (i == index) {
        item.classList.add('selected');
      } else {
        item.classList.remove('selected');
      }
    }

    // 생성자의 for loop에서 받은 i(index)에 해당하는, 즉 클릭된 li element의 img의 src값도 할당해 줌.
    const img = this.thumbs[index].img;

    // await가 붙은 프라미스를 처리할 때까지 show 메소드 내에서 다음 코드는 읽지 말고 기다렸다가
    // async가 붙은 show 메소드를 제외한 바깥부분의 코드를 비동기적으로 같이 수행할거임.
    // 이때 클릭된 li element의 이미지 src를 parameter로 전달하면서 setColor를 호출함.
    await setColor(img).then(obj => {
      // obj에는 setColor 함수 안에 프라미스를 잘 수행해서 resolve() 콜백함수가 호출되면
      // 리턴되는 객체를 obj라는 임의의 이름으로 받은거임.
      // 얘를 consumer인 then 메소드가 받아서 그걸로 원하는 작업을 수행해주는 거지
      // 또 this.pos는 resize()메소드에서 할당받은 색상값이 존재하는 픽셀들의 좌표값 배열이 들어가있지?
      this.visual = new Visual(this.pos, obj.colorCtx, obj.width, obj.height);
      // 결과적으로 프라미스가 성공적으로 수행되서 resolve가 전달해준 객체인 obj안의 값들과 this.pos를 전달해서
      // Visual 인스턴스를 생성해 줌.
      // 이렇게 하면 this.visual안에 새로운 Visual 인스턴스가 생겼으니 animate 메소드에서 
      // this.visual.animate를 호출할 수 있겠지? 그럼 프레임마다 랜덤하게 10개의 Particle들이 캔버스에 그려지겠네 
    });
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth * this.pixelRatio;
    this.canvas.height = this.stageHeight * this.pixelRatio;
    this.ctx.scale(this.pixelRatio, this.pixelRatio);

    // 이전에는 App 클래스의 생성자에서 Visual 인스턴스를 생성한 다음
    // resize 메소드에서 this.visual.show를 호출해서 리사이징된 브라우저 사이즈를 가져가서
    // Visual 클래스에서 생성한 Text 인스턴스 안에 있는 setText를 show 메소드 안에서 호출했지만
    // typo5에서는 App 클래스 생성자에서 Text 인스턴스를 생성했기 때문에
    // resize 메소드에서 리사이징된 사이즈를 setText에 직접 전달해서 호출해버림
    this.pos = this.text.setText('M', 6, this.stageWidth, this.stageHeight);
  }

  animate(t) {
    requestAnimationFrame(this.animate.bind(this)); // 내부에서 호출해서 반복할 수 있도록 해줌

    // 만약 Visual인스턴스가 생성되서 this.visual에 할당되어 있다면 if block을 수행함.
    if (this.visual) {
      // this.visual.animate 메소드는 뭘까? 
      // 매 프레임마다 랜덤하게 10개의 좌표값을 뽑아서 10개의 Particle을 생성해서 캔버스에 그려줌
      this.visual.animate(this.ctx);
    }
  }
}

window.onload = () => {
  new App();
};