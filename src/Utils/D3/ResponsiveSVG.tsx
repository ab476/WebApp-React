import React from "react";
import { useState, useEffect, useRef, RefObject, Children, PropsWithChildren } from "react";
export function useContainerDimensions<T extends Element>(containerRef: RefObject<T>): Dimensions {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const container = containerRef.current;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      const { width, height } = entry.contentRect;
      setDimensions({ width, height });
    });

    if (container) {
      resizeObserver.observe(container);
    }

    return () => {
      if (container) {
        resizeObserver.unobserve(container);
      }
    };
  }, [containerRef]);

  return dimensions;
}
export type Dimensions = { width: number; height: number };
const ResponsiveSVGContainer = ({ children }: PropsWithChildren) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useContainerDimensions(containerRef);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "auto" }}>
      
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && typeof child.type === "string" &&  child.type in validSVGElements) {
            return React.cloneElement(child, { containerWidth: width, containerHeight: height });
          } else {
            console.log(child);
            console.warn("Invalid child element passed. Only SVG elements are allowed.");
            return null; // Do not render invalid children
          }
        })}
      <p>Container width: {width}px</p>
      <p>Container height: {height}px</p>
    </div>
  );
};

export default ResponsiveSVGContainer;

const validSVGElements = {
  svg: true,
  circle: true,
  rect: true,
  path: true,
  line: true,
  polygon: true,
  polyline: true,
  ellipse: true,
  g: true, // group element
};
