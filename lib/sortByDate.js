import React from 'react'

export default function sortByDate(arr) {  

  return arr.sort(function(a, b) {
    var c = new Date(a.date);
    var d = new Date(b.date);
    return c-d;
  }).reverse();
}