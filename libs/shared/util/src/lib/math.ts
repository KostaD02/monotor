export function findMode(numbers: number[]) {
  const map: Record<string, number> = {};
  const modes: number[] = [];
  let maxFrequency = 0;

  for (const number of numbers) {
    if (map[number]) {
      map[number]++;
    } else {
      map[number] = 1;
    }

    if (map[number] > maxFrequency) {
      maxFrequency = map[number];
    }
  }

  for (const key in map) {
    if (map[key] === maxFrequency) {
      modes.push(+key);
    }
  }

  return modes[0];
}

export function avarage(numbers: number[]) {
  return numbers.reduce((acc, number) => acc + number, 0) / numbers.length;
}
