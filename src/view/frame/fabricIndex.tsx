import { useEffect, useRef } from "react";
import * as fabric from "fabric";
import { StageData } from "../../redux/currentStageData";
import { decimalUpToSeven } from "../../util/decimalUpToSeven";

export type FrameProps = {
  data: StageData;
  onSelect?: () => void;
};

const FrameFabric: React.FC<FrameProps> = ({ data, onSelect }) => {
  const canvasRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    const canvas = new fabric.Canvas("canvas-id", {
      preserveObjectStacking: true,
    });
    canvasRef.current = canvas;

    // Frame Rect
    const frameRect = new fabric.Rect({
      left: data.attrs.x,
      top: data.attrs.y,
      width: data.attrs.width,
      height: data.attrs.height,
      fill: data.attrs.fill ?? "#ffffff",
      opacity: data.attrs.opacity ?? 1,
      selectable: true,
      hasControls: false,
      hasBorders: false,
      id: data.id,
    });

    // Label (Tag + Text)
    const labelBg = new fabric.Rect({
      left: data.attrs.x,
      top: data.attrs.y - 20,
      width: 80,
      height: 20,
      fill: "#eee",
      rx: 4,
      ry: 4,
      stroke: "#000",
    });

    const labelText = new fabric.Text(data.attrs["data-frame-type"], {
      fontSize: 10,
      left: data.attrs.x + 5,
      top: data.attrs.y - 17,
      fill: "#000",
    });

    const labelGroup = new fabric.Group([labelBg, labelText], {
      selectable: false,
    });

    // Add items to canvas
    canvas.add(frameRect);
    canvas.add(labelGroup);
    canvas.renderAll();

    // Events
    frameRect.on("mouseover", () => {
      labelText.set("fill", "blue");
      canvas.renderAll();
    });

    frameRect.on("mouseout", () => {
      labelText.set("fill", "#000");
      canvas.renderAll();
    });

    frameRect.on("moving", () => {
      labelGroup.set({
        left: frameRect.left,
        top: frameRect.top! - 20,
      });
      canvas.renderAll();
    });

    frameRect.on("mouseup", () => {
      if (onSelect) onSelect();
      // updateItem logic here
    });

    // Brightness (optional, requires filters)
    // if (data.attrs.brightness !== undefined) {
    //   frameRect.filters = [new fabric.Image..filters.Brightness({ brightness: data.attrs.brightness })];
    //   frameRect.applyFilters();
    // }

    return () => {
      canvas.dispose();
    };
  }, [data]);

  return <canvas id="canvas-id" width={800} height={600} />;
};

export default FrameFabric;

