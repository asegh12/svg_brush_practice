import { useState } from "react";
import { CheckImg } from "./styles";

function SvgCanvas() {
  const [btn, setBtn] = useState(null);
  const [allowSketching, setAllowSketching] = useState(null);
  const [stroke, setStroke] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [colour, setColour] = useState([]);
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
    });
    return d;
  };

  const handlePointerDown = (e) => {
    e.target.setPointerCapture(e.pointerId);
    setAllowSketching(true);
    setColour([...colour, btn]);
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
    if (allowSketching) {
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
