import { useState, useEffect } from 'react';

export function useTyping(
  text: string,
  speed: number = 30,
  delay: number = 0
) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!text) {
      setDisplayedText('');
      setIsComplete(false);
      return;
    }

    setDisplayedText('');
    setIsComplete(false);

    const startTyping = () => {
      let index = 0;
      const timer = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1));
          index++;
        } else {
          setIsComplete(true);
          clearInterval(timer);
        }
      }, speed);

      return timer;
    };

    const delayTimer = setTimeout(startTyping, delay);

    return () => {
      clearTimeout(delayTimer);
    };
  }, [text, speed, delay]);

  return { displayedText, isComplete };
}