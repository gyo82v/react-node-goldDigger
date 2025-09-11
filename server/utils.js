export const  getRandomValue = () =>  {
  const min = 0.5;
  const max = 2.5;
  const random = Math.random() * (max - min) + min;
  return Math.round(random * 1000) / 1000; 
}
