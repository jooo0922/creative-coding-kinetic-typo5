'use strict';

// 컬러값을 뽑아올 이미지를 렌더할 tmpCanvas를 만든 후,
// tmpCtx, 이미지의 사이즈값을 가져오는 작업을 
// 비동기로 처리하기 위해서 setColor함수 내부의 작업들을 async를 붙여서 프라미스를 반환함.
// 프라미스, await, async 관련 개념은 js-basic공부한 것들과 한국어 튜토리얼 참고하면서 공부할 것.
export async function setColor(url) {
  // 비동기로 처리할 Promise를 하나 생성해주고
  return new Promise(resolve => {
    const image = new Image(); // 이미지 객체 생성
    image.src = url; // parameter로 전달받은 url을 이미지 소스에 할당
    image.onload = () => {
      // 외부 이미지이므로, 로드되는 데 시간이 걸릴 것.
      // 로드가 다 되고나면 tmpCanvas, tmpCtx를 만들어서
      // 로드받은 이미지 객체를 tmpCanvas에 렌더해줌.
      const tmpCanvas = document.createElement('canvas');
      tmpCanvas.width = image.width;
      tmpCanvas.height = image.height;
      const tmpCtx = tmpCanvas.getContext('2d');

      tmpCtx.drawImage(
        image,
        0, 0,
        image.width, image.height
      );

      // 프라미스가 만들어지면서 executor함수가 자동 실행되면
      // 위에 image만들고, tmpCanvas만들고 등등이 자동으로 실행될거임
      // 위에 작업들이 정상적으로 실행되면 거기서 가져온 tmpCtx, image.width,height이 담긴 객체를
      // 최종적으로 전달하는 콜백함수인 resolve()를 호출함.
      resolve({
        colorCtx: tmpCtx,
        width: image.width,
        height: image.height
      });
    };
  });
}

/**
 * 참고로 async를 함수 앞에 붙이면 해당 함수는 항상 명시적으로 프라미스를 반환하거나
 * 또는 프라미스가 아닌 것은 이행 상태의 프라미스(resolved promise)로 감싸 이행된 프라미스를 반환해 줌. 
 * 
 * 그러니 promise가 내부에 존재하는 함수 앞에는 async를 붙여줘야 해당 함수를 비동기적으로 처리할 수 있겠지
 */