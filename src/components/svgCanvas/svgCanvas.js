import { useState } from "react";
import { CheckImg } from "./styles";

// 실제적용시 해야할 것
// 1. width/height 스테이트로 관리
// 2. 브러쉬 사이즈 스테이트로 관리
function SvgCanvas() {
  // btn -> 버튼으로 eraser 혹은 restore 관리
  const [btn, setBtn] = useState(null);
  // allowSketching -> 마우스 이동할때 드로잉이 허용되는지
  const [allowSketching, setAllowSketching] = useState(null);
  // stroke -> 마우스 클릭하며 이동할때, 이동 경로
  const [stroke, setStroke] = useState([]);
  // shapes -> 이동 경로(stroke)를 모두 모아둔 곳
  const [shapes, setShapes] = useState([]);
  // colour -> 이동 경로들이 eraser 혹은 restore인지 순차적으로 모두 관리
  const [colour, setColour] = useState([]);
  // shapeCount -> stroke(shape의 개수) 큰 상관없이
  const [shapeCount, setShapeCount] = useState(0);

  // eraser/restore 버튼 클릭 시 변경
  const btnClick = (e) => {
    setBtn(e.target.id);
  };

  // 현재 마우스 포인터 위치 가져오는 함수
  const getPointerPosition = (evt) => {
    let CTM = evt.target.getScreenCTM();
    return [(evt.clientX - CTM.e) / CTM.a, (evt.clientY - CTM.f) / CTM.d];
  };

  // 포인터 위치를 <polyline>(태그)에 적용하기 위해 변환
  const pointsToPath = (points) => {
    let d = "";
    points.forEach((point) => {
      d += point[0] + "," + point[1] + " ";
    });
    return d;
  };

  // 마우스 클릭 시 발생하는 이벤트
  const handlePointerDown = (e) => {
    e.target.setPointerCapture(e.pointerId);
    setAllowSketching(true); // 드로잉 허용
    setColour([...colour, btn]); // setColour는 새로운 eraser/restore 값 추가
    setStroke([]); // setStroke는 새로운 이동 경로 추가
  };

  // 마우스 클릭 해제 시 발생하는 이벤트
  const handlePointerUp = (e) => {
    // 이동 경로가 없을시에는 shapes에 추가 안함
    if (stroke.length) {
      setShapes([...shapes, stroke]);
      setShapeCount(shapeCount + 1);
    }
    // 드로잉 해제
    setAllowSketching(false);
  };

  // 마우스 이동시 발생하는 이벤트
  const handlePointerMove = (e) => {
    // 드로잉이 허용될때만
    if (allowSketching) {
      // 포인터 좌표값을 가져와서 이동 경로에 저장
      const p = getPointerPosition(e);
      setStroke([...stroke, p]);
    }
  };

  return (
    <div className="SvgCanvas">
      <CheckImg>
        <svg
          height="554"
          width="451"
          xmlns="http://www.w3.org/2000/svg"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerMove={handlePointerMove}
        >
          <g>
            <g></g>
          </g>
          <g mask="url(#SvgjsMask1)">
            {/* 1masked.png -> 누끼 딴 이미지  */}
            <image
              height="554"
              width="451"
              href={`${process.env.PUBLIC_URL}/1masked.png`}
            />
          </g>
          {/* 1origin.png -> 원본 이미지 */}
          <image
            height="554"
            width="451"
            href={`${process.env.PUBLIC_URL}/1origin.png`}
            mask="url(#SvgjsMask3)"
          />
          <defs>
            <mask id="SvgjsMask1">
              <rect height="554" width="451" fill="#ffffff"></rect>
              <g id="SvgjsG2">
                {shapes.map((shape, index) => {
                  return (
                    <polyline
                      key={index}
                      points={pointsToPath(shape)}
                      strokeWidth="15"
                      stroke={
                        colour[index] === "eraser" ? "#000000" : "#ffffff"
                      }
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  );
                })}
                <polyline
                  key="current_stroke"
                  id="current_stroke"
                  points={pointsToPath(stroke)}
                  strokeWidth="15"
                  stroke={
                    colour[colour.length - 1] === "eraser"
                      ? "#000000"
                      : "#ffffff"
                  }
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </mask>
            <mask id="SvgjsMask3">
              <rect width="451" height="554" fill="#000000"></rect>
              <use href="#SvgjsG2"></use>
            </mask>
          </defs>
        </svg>
      </CheckImg>
      <div>
        <button id="eraser" onClick={btnClick}>
          eraser
        </button>
        <button id="restore" onClick={btnClick}>
          restore
        </button>
      </div>
    </div>
  );
}

export default SvgCanvas;
