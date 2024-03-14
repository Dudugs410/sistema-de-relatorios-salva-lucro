import React, { useState, Children, cloneElement } from 'react';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css'; // Import resizable styles

const ResizableComponent = ({ width, height, children }) => {
  const [size, setSize] = useState({ width, height });

  const onResize = (event, { size }) => {
    setSize(size);
  };

  // Clone and pass size prop to children
  const resizableChildren = Children.map(children, child => {
    return cloneElement(child, { size });
  });

  return (
    <Resizable
      width={size.width}
      height={size.height}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
      className='react-resizeable'
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: `${size.height}px`,
        }}
        className='custom-resize'
      >
        {resizableChildren}
      </div>
    </Resizable>
  );
};

export default ResizableComponent;
