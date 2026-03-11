// Components
import Basic from "./parts/Basic";
import Group from "./parts/Group";
import Background from "./parts/Background";
import Special from "./parts/Special";

// TypeScript types
import type { CoursePart } from "../types";

type PartProps = {
  part: CoursePart;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function assertNever(_part: never): never {
  throw new Error(`Invalid course kind type`);
}

export default function Part(props: PartProps) {
  switch (props.part.kind) {
    case "basic":
      return <Basic part={props.part} />;
    case "group":
      return <Group part={props.part} />;
    case "background":
      return <Background part={props.part} />;
    case "special":
      return <Special part={props.part} />;
    default:
      return assertNever(props.part);
  }
}