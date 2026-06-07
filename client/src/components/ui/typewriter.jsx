import { useState, useEffect, useRef } from 'react';

const Typewriter = ({ text, speed = 30, onComplete }) => {
  const [index, setIndex] = useState(0);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setIndex(0);
  }, [text]);

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setIndex((prev) => prev + 1);
      }, speed);
      
      return () => clearTimeout(timer);
    } 
    else if (index === text.length && onCompleteRef.current) {
      onCompleteRef.current();
    }
  }, [index, text.length, speed]);

  return <span>{text.slice(0, index)}</span>;
};

export default Typewriter;