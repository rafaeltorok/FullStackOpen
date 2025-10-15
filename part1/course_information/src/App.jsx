import Header from "./components/Header";
import Content from "./components/Content";
import Total from "./components/Total";


// Generates a unique key to use in each Part component, inside Content
const generateKey = (course, part) => {
  const key = course.toLocaleLowerCase().replace(' ', '-') + 
              '-' + part.toLocaleLowerCase().replace(' ', '-');
  return key;
}

const App = () => {
  const course = 'Half Stack application development';
  const part1 = 'Fundamentals of React';
  const exercises1 = 10;
  const part2 = 'Using props to pass data';
  const exercises2 = 7;
  const part3 = 'State of a component';
  const exercises3 = 14;

  return (
    <div>
      <Header course={course}/>
      <Content
        parts={[
          [part1, exercises1, generateKey(course, part1)],
          [part2, exercises2, generateKey(course, part2)],
          [part3, exercises3, generateKey(course, part3)]
        ]}
      />
      <Total exercises={exercises1 + exercises2 + exercises3}/>
    </div>
  );
}

export default App;