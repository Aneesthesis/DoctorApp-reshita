import React, { useState } from "react";
import Grades from "./Grades";

function School({ sections }) {
  const [gradesVisible, setGradesVisible] = useState(false);

  const toggleGrades = () => {
    setGradesVisible(!gradesVisible);
  };
  return (
    <div>
      <div onClick={toggleGrades} className="bg-green-300 p-10 mx-auto">
        School
      </div>
      {gradesVisible && <Grades />}
    </div>
  );
}

export default School;
