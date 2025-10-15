import Part from './Part';

export default function Content({ course, parts }) {
  // Generates a unique key for each Part component
  const generateKey = (course, name) => {
    const key = (course + '-' + name).toLocaleLowerCase().replaceAll(' ', '-');
    // console.log(key); // Debug only
    return key;
  }

  return (
    <div>
      {parts.map(part => (
        <Part
          key={generateKey(course, part.name)}
          part={part.name}
          exercises={part.exercises}
        />
      ))}
    </div>
  );
}