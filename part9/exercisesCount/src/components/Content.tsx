// Components
import Part from "./Part";

// TypeScript types
import type { CoursePart } from "../types";

type CourseParts = {
  courseParts: CoursePart[];
};

export default function Content(props: CourseParts) {
  return (
    <div>
      {props.courseParts.map((part: CoursePart) => (
        <Part
          key={part.name}
          part={part} 
        />
      ))}
    </div>
  );
}