export const getDateOfBirthFromSAID = (idNumber) => {
  if (!idNumber || idNumber.length < 6) return null;
  
  const year = idNumber.substring(0, 2);
  const month = idNumber.substring(2, 4);
  const day = idNumber.substring(4, 6);
  
  const fullYear = parseInt(year) <= 21 ? '20' + year : '19' + year;
  
  return new Date(fullYear, parseInt(month) - 1, parseInt(day)).toDateString();
};