import React, { useState } from "react";

function Sections({ grade }) {
  console.log(grade);
  const [sectionsIsVisible, setSectionsIsVisible] = useState(true);

  const sections = ["A", "B", "C", "D"];

  return (
    <div>
      {sections.map((section) => {
        <div className="bg-blue-200">
          {grade} {section}
        </div>;
      })}
    </div>
  );
}

export default Sections;
