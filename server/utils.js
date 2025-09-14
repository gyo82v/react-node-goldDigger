
export const  getRandomValue = (x, y) =>  {
  const min = x;
  const max = y;
  const random = Math.random() * (max - min) + min;
  return Math.round(random * 1000) / 1000; 
}

export const serveResponse = (res, statusCode, content_type, payload) => {
  res.statusCode = statusCode
  res.setHeader("Content-Type", content_type) 
  res.end(JSON.stringify(payload))
}
