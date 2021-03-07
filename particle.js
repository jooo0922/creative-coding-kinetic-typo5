'use strict';

// typo5에서 particle은 색상값이 존재하는 좌표값에서 시작하는 quadratic curve를 생성하는 거로 보면 됨.

// quadratic curve를 만드는 데 필요한 point들의 개수
// 이 값이 작아질수록 point 개수가 적어지니까 더 짧은 quadratic curve들이 그려지게 됨.
const TOTAL = 12;

export class Particle {
  constructor(pos, color, ctx) { // 이전 typo들과 다르게 pos, color, ctx 세 개 전부 생성자에서 동시에 가져옴.
    this.color = color;

    const ranMax = 20; // this.setRandom호출 시 전달받은 prev의 좌표값을 늘려주는 값의 범위를 정해주기 위해 사용

    // 색상값이 존재하는 픽셀들의 좌표값을 this.points 배열에 객체로 담아줌
    this.points = [{
      x: pos.x,
      y: pos.y,
    }];

    // 모든 quadratic curve particle들은 11번의 for loop를 통해 생성된 12개의 point들에 의해서 생성되겠지
    // 왜냐면, 이미 this.points에는 1개의 point 객체가 존재하고, for loop를 돌릴때마다 이전값을 이용해서 랜덤하게 좌표값을 하나 생성하니까
    // 1개의 원래 point 객체 + 11번의 for loop를 돌면서 만든 point들로 총 12개가 this.points 안에 담기겠지
    for (let i = 1; i < TOTAL; i++) {
      const prev = this.points[i - 1]; // 처음에는 prev에는 this.points[0], 즉 색상값이 존재하는 해당 픽셀의 좌표값이 들어가겠지
      this.points.push(this.setRandom(prev, ranMax)); // this.points[0]값을 전달해줘서 this.setRandom에서 새로운 좌표값을 리턴받아 this.points에 push함.
    }

    // 생성자에서 for loop를 돌면 
    // this.points에는 색상값이 존재하는 픽셀의 좌표값에서 시작하는 12개의 point 좌표값들이 만들어짐.
    // 이후 ctx값을 전달하면서 this.draw를 호출함으로써 위에서 생성한 12개의 point들을 연결하는 quadratic curve를 그려줌.
    this.draw(ctx);
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.lineWidth = 0.3; // 선의 굵기 지정. 원래 기본값은 1.0
    ctx.strokeStyle = this.color; // 생성자에서 전달받은 color값을 선의 색상값으로 지정.
    ctx.moveTo(this.points[0].x, this.points[0].y); // quadratic curve의 start point는 항상 색상값이 존재하는 픽셀의 좌표값으로 정의함.

    // for loop를 this.points의 개수, 즉 12번 돌리면서
    // 현재 좌표값과 이전 좌표값의 중간 좌표값을 매번 구해서 quadratic curve를 그려준 뒤 stroke()로 색칠함.
    for (let i = 1; i < this.points.length; i++) {
      const prev = this.points[i - 1]; // 이전 좌표값. 처음에는 start point와 동일함.
      const cur = this.points[i]; // 현재 좌표값. 이전 좌표값과 현재 좌표값 사이의 중간좌표값을 구하기 위해 계산해 놓은 것.
      const cx = (prev.x + cur.x) / 2;
      const cy = (prev.y + cur.y) / 2; // 이전 좌표값과 현재 좌표값 사이의 중간 좌표값을 구해서 cx, cy에 할당.
      ctx.quadraticCurveTo(prev.x, prev.y, cx, cy);
      // 항상 quadratic curve는 '이전 좌표값과 중간 좌표값만' 각각 control point와 end point의 parameter로 전달해줘야 곡선이 생성됨.
      // wave, bouncing-string, sheep에서도 똑같이 for loop 안에서 quadratic curve를 그리는 방법을 정리해놓음. 복습할 때 참고할 것. 
    }

    ctx.stroke(); // for loop를 돌면서 그려준 quadratic curve를 색칠함.
  }

  setRandom(pos, gap) {
    // 매번 for loop에서 이전 좌표값인 prev를 전달받아서
    // prev의 각각의 x, y좌표값에 각각 -20 ~ 20 사이의 랜덤값을 더해줌으로써
    // 새로운 좌표값을 계산한 뒤에 리턴해 줌 
    return {
      x: pos.x + Math.random() * (gap + gap) - gap,
      y: pos.y + Math.random() * (gap + gap) - gap, // gap에는 ranMax값이 전달될테니 리턴받는 랜덤값의 범위는 -20 ~ 20
    };
  }
}