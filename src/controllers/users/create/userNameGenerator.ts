import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const foods = fs.readFileSync(`${__dirname}/foods.txt`, 'utf-8').split('\n').filter(Boolean);
const verbs = fs.readFileSync(`${__dirname}/verbs.txt`, 'utf-8').split('\n').filter(Boolean);
const colors = fs.readFileSync(`${__dirname}/colors.txt`, 'utf-8').split('\n').filter(Boolean);

const getRandomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

const generateRandomDigits = (length = 4): string => {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
};

const capitalize = (word: string): string => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export const generateUniqueUsername = (): string => {
  const food = capitalize(getRandomElement(foods));
  const verb = capitalize(getRandomElement(verbs));
  const color = capitalize(getRandomElement(colors));
  const digits = generateRandomDigits();

  return `${verb}${color}${food}${digits}`;
};
