import React, { useState } from 'react';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css'; // Import resizable styles
import './resizable.scss'

const ResizableComponent = ({ width, height, children }) => {
  const [size, setSize] = useState({ width, height });

  const onResize = (event, { size }) => {
    setSize(size);
  };

  return (
    <Resizable
      width={size.width}
      height={size.height}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
      className='react-resizeable'
    >
      <div className='responsive' style={{ width: size.width, height: size.height }}>{children}</div>
    </Resizable>
  );
};

export default ResizableComponent;
