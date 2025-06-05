import React, { useCallback, useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { useHotkeys } from "react-hotkeys-hook";
import { ReactReduxContext, Provider } from "react-redux";
import positionStyles from "../style/position.module.css";
import Drop from "../util/Drop";
import { ITEMS_CONTEXT } from "../hook/useItem";
import useDragAndDrop from "../hook/useDragAndDrop";
import useLocalStorage from "../hook/useLocalStorage";
import useStage, { STAGE_POSITION, STAGE_SCALE } from "../hook/useStage";

const View: React.FC<{
  onSelect: ITEMS_CONTEXT["onSelect"];
  stage: ReturnType<typeof useStage>;
  children: React.ReactNode;
}> = ({ onSelect, stage: { stageRef, dragBackgroundOrigin }, children }) => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const { setValue } = useLocalStorage();
  const { onDropOnStage } = useDragAndDrop(canvasRef, dragBackgroundOrigin);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        backgroundColor: "white",
        preserveObjectStacking: true,
        selection: false,
      });
      setCanvas(fabricCanvas);

      fabricCanvas.on("mouse:down", (e) => {
        if (!e.target) {
          onSelect(undefined, []);
        }
      });

      return () => {
        fabricCanvas.dispose();
      };
    }
  }, [canvasRef]);
  console.log(canvas.getObjects());

  const setCanvasSize = useCallback(() => {
    if (!canvasRef.current?.parentElement) return;
    const { width, height } =
      canvasRef.current.parentElement.getBoundingClientRect();
    canvasRef.current.width = width;
    canvasRef.current.height = height;
    canvas?.setWidth(width);
    canvas?.setHeight(height);
    canvas?.renderAll();
  }, [canvas]);

  useEffect(() => {
    window.addEventListener("resize", setCanvasSize);
    setCanvasSize();
    return () => window.removeEventListener("resize", setCanvasSize);
  }, [setCanvasSize]);

  useHotkeys(
    "ctrl+0",
    () => {
      if (!canvas) return;
      canvas.setZoom(1);
      canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      setValue(STAGE_SCALE, { x: 1, y: 1 });
      setValue(STAGE_POSITION, { x: 0, y: 0 });
    },
    {},
    [canvas],
  );

  const handleWheelZoom = useCallback(
    (e: WheelEvent) => {
      if (!canvas) return;
      e.preventDefault();

      const delta = e.deltaY;
      let zoom = canvas.getZoom();
      zoom *= delta > 0 ? 0.9 : 1.1;
      zoom = Math.max(0.1, Math.min(zoom, 10));

      const rect = canvas.getElement().getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      canvas.zoomToPoint(new fabric.Point(x, y), zoom);
      setValue(STAGE_SCALE, { x: zoom, y: zoom });
    },
    [canvas],
  );

  useEffect(() => {
    const ref = canvasRef.current;
    if (ref) {
      ref.addEventListener("wheel", handleWheelZoom);
      return () => ref.removeEventListener("wheel", handleWheelZoom);
    }
  }, [handleWheelZoom]);

  useEffect(() => {
    if (canvasRef.current) {
      setContainer(canvasRef.current.parentElement);
    }
  }, []);

  return (
    <ReactReduxContext.Consumer>
      {({ store }) => (
        <div
          className={[
            positionStyles.absolute,
            positionStyles.top0,
            positionStyles.left0,
          ].join(" ")}
          style={{ width: "100%", height: "100%" }}
        >
          <Provider store={store}>
            <canvas ref={canvasRef} />
            {canvas &&
              React.Children.map(children, (child) =>
                React.cloneElement(child as React.ReactElement<any>, {
                  canvas,
                }),
              )}
            {container ? (
              <Drop callback={onDropOnStage} targetDOMElement={container} />
            ) : null}
          </Provider>
        </div>
      )}
    </ReactReduxContext.Consumer>
  );
};

export default View;
