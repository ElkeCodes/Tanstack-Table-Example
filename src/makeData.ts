import { faker } from "@faker-js/faker";

export type Person = {
  firstName: string;
  lastName: string;
  age: number;
  favoriteGenre: string;
};

const range = (len: number) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newPerson = (): Person => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    age: faker.datatype.number(40),
    favoriteGenre: faker.music.genre(),
  };
};

export function makeData(len: number) {
  return range(len).map((d): Person => {
    return {
      ...newPerson(),
    };
  });
}
