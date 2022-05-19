import { useState } from "react";

function SvgCanvas() {
  const [btn, setBtn] = useState(null);
  const [allowSketching, setAllowSketching] = useState(null);
  const [stroke, setStroke] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [shapeCount, setShapeCount] = useState(0);

  const btnClick = (e) => {
    console.log(e.target.id);
    setBtn(e.target.id);
  };

  const getPointerPosition = (evt) => {
    let CTM = evt.target.getScreenCTM();
    return [(evt.clientX - CTM.e) / CTM.a, (evt.clientY - CTM.f) / CTM.d];
  };

  const pointsToPath = (points) => {
    let d = "";
    points.forEach((point) => {
      if (d) {
        d += ` L ${point[0]} ${point[1]}`;
      } else {
        d = `M ${point[0]} ${point[1]}`;
      }
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
      <div>
        <svg
          height="700"
          width="570"
          xmlns="http://www.w3.org/2000/svg"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerMove={handlePointerMove}
        >
          <defs>
            <clipPath id="myClip">
              <path d="M10 10 H 400 V 400 H 10 L 10 10" />
              {shapes.map((shape, index) => {
                return <path d={pointsToPath(shape)} />;
              })}
            </clipPath>

            <image
              id="cat"
              href={`${process.env.PUBLIC_URL}/origin.png`}
              height="700"
              width="570"
            />
          </defs>
          <use clipPath="url(#myClip)" href="#cat"></use>
        </svg>
      </div>
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
