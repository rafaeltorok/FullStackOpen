import Header from "./components/Header";
import Content from "./components/Content";
import Total from "./components/Total";


const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  const totalExercises = course.parts.reduce((sum, part) => sum + part.exercises, 0);

  return (
    <div>
      <Header course={course.name}/>
      <Content
        course={course.name}
        parts={course.parts}
      />
      <Total exercises={totalExercises}/>
    </div>
  );
}

export default App;