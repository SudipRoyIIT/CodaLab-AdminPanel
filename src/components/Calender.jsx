import React, { useState } from 'react';
import styled from 'styled-components';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarWrapper = styled.div`
  .react-calendar {
    border: none;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
  .react-calendar__tile--now {
    background: #007bff !important;
    color: white;
  }
`;

const CustomCalendar = () => {
  const [date, setDate] = useState(new Date());

  return (
    <CalendarWrapper>
      <Calendar
        onChange={setDate}
        value={date}
      />
    </CalendarWrapper>
  );
};

export default CustomCalendar;
