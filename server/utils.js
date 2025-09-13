export const  getRandomValue = () =>  {
  const min = 0.5;
  const max = 2.5;
  const random = Math.random() * (max - min) + min;
  return Math.round(random * 1000) / 1000; 
}

export const  getRandomGold = () =>  {
  const min = 1.5;
  const max = 3.0;
  const random = Math.random() * (max - min) + min;
  return Math.round(random * 1000) / 1000; 
}

export const  getRandomSilver = () =>  {
  const min = 0.5;
  const max = 2.0;
  const random = Math.random() * (max - min) + min;
  return Math.round(random * 1000) / 1000; 
}

export const  getRandomPlatinum = () =>  {
  const min = 2.5;
  const max = 5.0;
  const random = Math.random() * (max - min) + min;
  return Math.round(random * 1000) / 1000; 
}
