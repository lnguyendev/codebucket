import './resizable.css';
import { useEffect, useState } from 'react';
import { ResizableBox, ResizableBoxProps } from 'react-resizable';

interface ResizableProps {
  direction: 'horizontal' | 'vertical'
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [width, setWidth] = useState(window.innerWidth * 0.75);

  useEffect(() => {
    let timer: any;
    const listener = () => {
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        setInnerHeight(window.innerHeight);
        setInnerWidth(window.innerWidth);
        if (window.innerWidth * 0.75 < width) {
          setWidth(window.innerWidth * 0.75);
        }
      }, 100);
    }

    window.addEventListener('resize', listener);

    return () => {
      window.removeEventListener('resize', listener);
    }
  }, [width]);

  const resizableProps: {
    [key: string]: ResizableBoxProps
  } = {
    vertical: {
      minConstraints: [Infinity, 40],
      maxConstraints: [Infinity, innerHeight * 0.9],
      height: 300,
      width: Infinity,
      resizeHandles: ['s']
    },
    horizontal: {
      className: 'resize-horizontal',
      minConstraints: [innerWidth * 0.2, Infinity],
      maxConstraints: [innerWidth * 0.75, Infinity],
      height: Infinity,
      width,
      resizeHandles: ['e'],
      onResizeStop: (e, data) => {
        setWidth(data.size.width)
      }
    }
  }

  return (
    <ResizableBox
      {...resizableProps[direction]}
    >{children}</ResizableBox>
  )
};

export default Resizable;
