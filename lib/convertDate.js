import React from 'react'

export default function convertDate(date) {

  //"2021-09-01T00:00:00.000Z"
  const newDate = new Date(date);
  const day = newDate.getDate();
  const month = newDate.getMonth();
  const year = newDate.getFullYear();
  const hours = newDate.getHours();
  const minutes = newDate.getMinutes();
  //const seconds = newDate.getSeconds()

  return (
    <span>{day}/{month}/{year} {hours}:{minutes}</span>
  )
}