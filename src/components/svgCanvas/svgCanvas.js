import { useState } from "react";
import { CheckImg } from "./styles";

function SvgCanvas() {
  const [btn, setBtn] = useState(null);
  const [allowSketching, setAllowSketching] = useState(null);
  const [stroke, setStroke] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [shapeCount, setShapeCount] = useState(0);

  const btnClick = (e) => {
    setBtn(e.target.id);
  };

  const getPointerPosition = (evt) => {
    let CTM = evt.target.getScreenCTM();
    return [(evt.clientX - CTM.e) / CTM.a, (evt.clientY - CTM.f) / CTM.d];
  };

  const pointsToPath = (points) => {
    let d = "";
    points.forEach((point) => {
      d += point[0] + "," + point[1] + " ";
      // if (d) {
      //   d += ` L ${point[0]} ${point[1]}`;
      // } else {
      //   d = `M ${point[0]} ${point[1]}`;
      // }
    });
    return d;
  };

  const handlePointerDown = (e) => {
    console.log(e.pointerId);
    e.target.setPointerCapture(e.pointerId);
    setAllowSketching(true);
    setStroke([]);
  };

  const handlePointerUp = (e) => {
    if (stroke.length) {
      setShapes([...shapes, stroke]);
      setShapeCount(shapeCount + 1);
    }
    setAllowSketching(false);
  };

  const handlePointerMove = (e) => {
    if (allowSketching && btn === "eraser") {
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
          {/* <defs>
            <clipPath id="myClip">
              <path d="M10 10 H 400 V 400 H 10 L 10 10" />
              {shapes.map((shape, index) => {
                return <path d={pointsToPath(shape)} />;
              })}
            </clipPath>

            <image
              id="cat"
              href={`${process.env.PUBLIC_URL}/origin.png`}
              height="554"
              width="451"
            />
          </defs>
          <use clipPath="url(#myClip)" href="#cat"></use> */}
          <g>
            <g></g>
          </g>
          <g mask="url(#SvgjsMask1)">
            <image
              height="554"
              width="451"
              href={`${process.env.PUBLIC_URL}/1masked.png`}
            />
          </g>
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
                {/* 맵 함수 추가 */}
                {shapes.map((shape, index) => {
                  return (
                    <polyline
                      points={pointsToPath(shape)}
                      stroke-width="5"
                      stroke={btn === "eraser" ? "#000000" : "#ffffff"}
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  );
                })}
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
