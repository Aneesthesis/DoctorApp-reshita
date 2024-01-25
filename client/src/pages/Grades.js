import React, { useState } from "react";

function Grades() {
  const grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [sectionsIsVisible, setSectionsIsVisible] = useState(false);

  const sections = ["A", "B", "C", "D"];

  const gradeClicked = (e) => {
    setSectionsIsVisible(true);
    setSelectedGrade(e.target.id);
  };

  return (
    <div className="flex flex-col">
      <div className="flex">
        {grades.map((grade) => (
          <div
            id={grade}
            onClick={gradeClicked}
            className="bg-rose-300 mx-auto px-4 py-2"
          >
            {grade}
          </div>
        ))}
      </div>{" "}
      {selectedGrade && sectionsIsVisible && (
        <div className="flex mx-auto w-fit px-10 py-4 space-x-4">
          {sections.map((section) => (
            <div className="bg-green-200 py-2 px-6">
              {selectedGrade}
              {section}
            </div>
          ))}
          <button
            onClick={() => setSectionsIsVisible(false)}
            className="bg-black px-4 py-4 rounded-full"
          >
            ❌
          </button>
        </div>
      )}
    </div>
  );
}

export default Grades;
