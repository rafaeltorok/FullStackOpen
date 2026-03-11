interface CoursePartBase {
  name: string;
  exerciseCount: number;
};

export interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group";
};

export interface CoursePartWithDescription extends CoursePartBase {
  description: string;
};

export interface CoursePartBasic extends CoursePartWithDescription {
  kind: "basic";
};

export interface CoursePartBackground extends CoursePartWithDescription {
  backgroundMaterial: string;
  kind: "background";
};

export interface CoursePartSpecial extends CoursePartWithDescription {
  requirements: string[];
  kind: "special";
}

export type CoursePart = 
  CoursePartBasic |
  CoursePartGroup |
  CoursePartBackground |
  CoursePartSpecial;