import React, { useState, useEffect } from 'react';
import './Heading.css';

const Heading = () => {
  const [dateTime, setDateTime] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let interval;

    if (timerRunning) {
      // Function to calculate the countdown
      const calculateCountdown = () => {
        const now = new Date().getTime();
        const targetDate = new Date(dateTime).getTime();

        // Calculate the remaining time in milliseconds
        const remainingTime = targetDate - now;

        // Update the countdown state
        setCountdown(remainingTime);

        // Check if countdown is over
        if (remainingTime <= 0) {
          setTimerRunning(false);
          setMessage("The countdown is over! What's next on your adventure🎉");
          speakMessage("The countdown is over! What's next on your adventure");
        }
      };

      // Call the calculateCountdown function initially and then every second
      interval = setInterval(() => {
        calculateCountdown();
      }, 1000);
    }

    // Cleanup function to clear the interval
    return () => clearInterval(interval);
  }, [dateTime, timerRunning]); // Trigger effect whenever dateTime or timerRunning changes

  const handleDateTimeChange = (event) => {
    const selectedDateTime = event.target.value;
    setDateTime(selectedDateTime);

    const now = new Date().getTime();
    const targetDate = new Date(selectedDateTime).getTime();
    const differenceInDays = Math.floor((targetDate - now) / (1000 * 60 * 60 * 24));

    if (differenceInDays > 100) {
      setMessage('Selected time is more than 100 days');
      speakMessage('Selected time is more than 100 days! Please Enter Less Than 100 days');
    } else {
      setMessage('');
    }
  };

  const toggleTimer = () => {
    if (!timerRunning) {
      // Start the countdown timer
      console.log('Timer started');
      setTimerRunning(true);
    } else {
      // Stop the countdown timer
      console.log('Timer stopped');
      setTimerRunning(false);
    }
  };

  const speakMessage = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className='container'>
      <h1>Countdown <span>Timer</span></h1>
      <div className='input'>
        <input 
          type="datetime-local" 
          value={dateTime} 
          onChange={handleDateTimeChange} 
          min={getMinDateTime()} // Minimum date and time allowed
          max={getMaxDateTime()} // Maximum date and time allowed
        />
      </div>
      <button onClick={toggleTimer}>{timerRunning ? 'Stop Timer' : 'Start Timer'}</button>
      {message && <p className="message">{message}</p>}
      {!message && (
        <div className='card-container'>
          <div className='card'>
            <div className='card-content'>{Math.floor(countdown / (1000 * 60 * 60 * 24))}</div>
            <div className='card-content'>Days</div>
          </div>
          <div className='card'>
            <div className='card-content'>{Math.floor((countdown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}</div>
            <div className='card-content'>Hours</div>
          </div>
          <div className='card'>
            <div className='card-content'>{Math.floor((countdown % (1000 * 60 * 60)) / (1000 * 60))}</div>
            <div className='card-content'>Minutes</div>
          </div>
          <div className='card'>
            <div className='card-content'>{Math.floor((countdown % (1000 * 60)) / 1000)}</div>
            <div className='card-content'>Seconds</div>
          </div>
        </div>
      )}
    </div>
  );
};

// Function to get the minimum date and time allowed (current date and time)
const getMinDateTime = () => {
  const now = new Date();
  const minDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const minTime = now.toTimeString().slice(0, 5);
  return `${minDate}T${minTime}`;
};

// Function to get the maximum date and time allowed (current date + 99 days)
const getMaxDateTime = () => {
  const now = new Date();
  const maxDate = new Date(now.getTime() + (99 * 24 * 60 * 60 * 1000));
  const maxDateFormatted = maxDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const maxTime = maxDate.toTimeString().slice(0, 5);
  return `${maxDateFormatted}T${maxTime}`;
};

export default Heading;
