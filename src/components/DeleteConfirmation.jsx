import { useEffect, useState } from "react";

import ProgressBar from "./ProgressBar";

const TIMER = 3000 ;
export default function DeleteConfirmation({ onConfirm, onCancel }) {


  useEffect(() => {
    console.log('Timer set')
    const timer = setTimeout(() => { // again, it is in-built function on browser
      onConfirm(); 
    } , TIMER); 

    return () => {
      console.log('cleaning up timer')
      clearTimeout(timer);
    }
  } , [onConfirm])  // when a dependency is a function (here onConfirm is a function) , it's a bit tricky .
  //                   functions in JS are just values , specifically they are objects.
  //                   when ever the App component is re-rendered , all the function are executed again making them a new object (or the functions are re-created all the time). 
  //                   *****new function (new object) != old function (old object)*****.
  //                   that's why when a dependency is a function , it goes into infinite loop.
  //                   to solve this problem we use **useCallback** hook.
  //                   to use useCallback hook we just wrap the hook around the function as the first argument. Here the function is in App.jsx (handleRemovePlace).
  //                   useCallback also take the second argument , which is the array of dependencies same as useEffect.
  //                   useCallback returns the function we wrapped but now it's not recreated when ever the surrounding component function is executed again.
  //                   so using useCallback react make sure that the function wrapped around the useCallback hook is not re-created instead it stores it internally in memory and re-use it when ever the component function is executed again


  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
      <ProgressBar timer={TIMER}/>
    </div>
  );
}
