import React, { useState, useEffect } from 'react';
import useTerminalStore from '../../store/terminalStore';
import { terminalScenarios } from '../../data/message_db';
import Typewriter from './typewriter';

const Message = ({scenarios}) => {
    const Typing = useTerminalStore((state) => state.Typing);
    const [activeLineIndex, setActiveLineIndex] = useState(0);
    let activeLines = []

    const numberOfScenarios = scenarios.length;
    for (let i = 0; i <= numberOfScenarios - 1; i++) {
        for (let x = 0; x <= (terminalScenarios[scenarios[i]].lines).length - 1;x++) {
            activeLines.push(terminalScenarios[scenarios[i]].lines[x]);
        }
    }
    console.log(activeLines)

  useEffect(() => {
    setActiveLineIndex(0);
  }, []);


  const totalLines = activeLines.length;
  Typing(true);

  return (
    <>
      {activeLines.map((line, index) => {
        if (index > activeLineIndex) return null;

        return (
          <p key={`${line}_${index}`} style={{ margin: '0.5rem 0' }}>
            <span style={{ marginRight: '0.8rem' }}>&#62;</span>
            <Typewriter 
              text={line} 
              speed={30} 
              onComplete={index === activeLineIndex ? () => {
                if (activeLineIndex < totalLines - 1) {
                  setActiveLineIndex((prev) => prev + 1);
                } 
                else {
                    Typing(false);
                }
              } : null}
            />
          </p>
        );
      })}
    </>
  );
};

export default Message;