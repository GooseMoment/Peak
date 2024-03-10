import { useState } from 'react';
import styled from "styled-components"
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "./CommonCalendar.css";
import moment from 'moment';

const CommonCalendar = ({ selectedDate, setSelectedDate }) => {
  
  const dateSelect = (selectedDate) => {
    setSelectedDate(selectedDate);
  };

  return <>
    <Calendar
      onChange={dateSelect}
      value={selectedDate}
      formatDay={(locale, date) => moment(date).format("D")}
      locale='en'
    />
  </>
};

export default CommonCalendar;