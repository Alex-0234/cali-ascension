import React, { useState, useEffect, useMemo } from 'react';
import useTerminalStore from '../../store/terminalStore';
import { terminalScenarios } from '../../data/message_db';
import Typewriter from './typewriter';

const Message = ({ scenarios }) => {
  const Typing = useTerminalStore((state) => state.Typing);
  const [activeLineIndex, setActiveLineIndex] = useState(0);

  const activeLines = useMemo(() => {
    let lines = [];
    scenarios.forEach((scenarioKey) => {
      const scenario = terminalScenarios[scenarioKey];
      if (scenario) {
        if (scenario.header) {
          lines.push(`.${scenario.header}`); 
        }
        if (scenario.lines) {
          lines.push(...scenario.lines);
        }
      }
    });
    return lines;
  }, [scenarios]);

  const totalLines = activeLines.length;

  useEffect(() => {
    setActiveLineIndex(0);
    if (totalLines > 0) {
      Typing(true);
    }
  }, [scenarios, totalLines, Typing]);

  useEffect(() => {
    if (totalLines === 0) return;

    if (activeLineIndex >= totalLines) {
      Typing(false);
      return;
    }

    const currentLine = activeLines[activeLineIndex];
    if (currentLine && currentLine.startsWith('.')) {
      setActiveLineIndex((prev) => prev + 1);
    }
  }, [activeLineIndex, activeLines, totalLines, Typing]);

  return (
    <>
      {activeLines.map((line, index) => {
        if (index > activeLineIndex) return null;

        const isHeader = line.startsWith('.');

        return (
          <React.Fragment key={`line_wrapper_${index}`}>
            {isHeader ? (
              <p className="header" style={{ margin: '0.5rem 0', fontWeight: 'bold' }}>
                {line.slice(1)} 
              </p>
            ) : (
              <p style={{ margin: '0.5rem 0' }}>
                <span style={{ marginRight: '0.8rem' }}>&#62;</span>
                <Typewriter 
                  text={line} 
                  speed={20} 
                  onComplete={index === activeLineIndex ? () => {
                    setActiveLineIndex((prev) => prev + 1);
                  } : null}
                />
              </p>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

export default Message;