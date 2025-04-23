import React, { useEffect, useRef } from "react";
import * as fabric from "fabric";
import { StageData } from "../../../redux/currentStageData";
import useItem from "../../../hook/useItem";

export type IconItemProps = {
  data: StageData;
  onSelect?: () => void;
};

const IconItemFabric: React.FC<IconItemProps> = ({ data, onSelect }) => {
  const { attrs } = data;
  const { updateItem } = useItem();
  const canvasRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    const canvas = new fabric.Canvas("icon-canvas", {
      preserveObjectStacking: true,
    });
    canvasRef.current = canvas;

    fabric.Image.fromURL(`/assets/icon/bootstrap/${attrs.icon}`, {
      crossOrigin: "anonymous",
    }, (img) => {
      img.set({
        left: attrs.x,
        top: attrs.y,
        scaleX: attrs.scaleX,
        scaleY: attrs.scaleY,
        opacity: attrs.opacity ?? 1,
        angle: attrs.rotation ?? 0,
        hasBorders: false,
        hasControls: false,
        selectable: true,
        id: data.id,
      });

      // Evento onClick
      img.on("mousedown", () => {
        if (onSelect) onSelect();
      });

      // Evento onDragMove (simulado con moving)
      img.on("moving", () => {
        canvas.renderAll();
      });

      // Evento onDragEnd (mouseup + moved)
      img.on("mouseup", () => {
        updateItem(data.id, () => ({
          x: img.left ?? 0,
          y: img.top ?? 0,
          scaleX: img.scaleX ?? 1,
          scaleY: img.scaleY ?? 1,
          rotation: img.angle ?? 0,
        }));
      });

      canvas.add(img);
      canvas.renderAll();
    });

    return () => {
      canvas.dispose();
    };
  }, [attrs.icon]);

  return <canvas id="icon-canvas" width={800} height={600} />;
};

export default IconItemFabric;

