'use strict';

// 이전에 했던 것들과 약간 다르게 visual.js에서 Particle 인스턴스만 생성해줌.
import {
  Particle
} from './particle.js';

// 매 프레임마다 생성할 Particle 인스턴스의 개수
// 이 값이 작아질수록 한 프레임에 생성하는 quadratic curve의 개수들이 적어짐.
const TOTAL = 10;

export class Visual {
  // 이전과 다르게 생성자에서 여러 개의 parameter를 전달받음.
  constructor(pos, colorCtx, width, height) {
    this.colorCtx = colorCtx; // 여기에는 고흐 그림들이 렌더된 상태에서 색상값만 뽑아오려고 만든 ctx같음.
    this.width = width;
    this.height = height;
    this.pos = pos; // 밑에 animate의 for loop를 보니까 pos는 어떤 배열이고, 그걸 this.pos에 할당하는 거 같은데...
  }

  animate(ctx) {
    // for loop를 10번 돌리는 걸 보니 매 프레임마다 animate를 호출함으로써
    // this.pos안에 들어있는 좌표값들 중 무작위로 10개를 뽑아서 Particle 인스턴스를 만드려는 것. 
    for (let i = 0; i < TOTAL; i++) {
      // 0 ~ this.pos의 마지막 인덱스 사이의 랜덤값을 받아서 정수로 반올림하고, 그거를 this.pos의 인덱스로 할당해줌.
      const myPos = this.pos[Math.round(Math.random() * (this.pos.length - 1))];
      new Particle(myPos, this.getColor(), ctx); // 즉, this.pos의 좌표값을 무작위로 10개 뽑아서 Particle 인스턴스 생성
    }
  }

  // 고흐 그림들이 렌더된 colorCtx의 픽셀 색상값 데이터를 가져와 리턴해주는 메소드인거 같음.
  getColor() {
    const x = Math.round(Math.random() * (this.width - 1));
    const y = Math.round(Math.random() * (this.height - 1)); // 랜덤하게 좌표값을 할당받음
    const data = this.colorCtx.getImageData(x, y, 4, 4).data; // 랜덤하게 받은 좌표값을 기준으로 총 16개(4*4)의 pixel 색상데이터를 가져옴. 왜 16개지?
    return `rgba(${data[0]}, ${data[1]}, ${data[2]})`; // x,y좌표값에 해당하는 pixel의 r,g,b값만 리턴해줌. 뭐하러 16개를???
  }
}