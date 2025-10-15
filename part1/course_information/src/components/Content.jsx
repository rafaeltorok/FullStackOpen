import Part from './Part';

export default function Content({ parts }) {
  return (
    <div>
      {parts.map(([part, exercises, key]) => (
        <Part
          key={key}
          part={part}
          exercises={exercises}
        />
      ))}
    </div>
  );
}