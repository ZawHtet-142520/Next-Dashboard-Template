export const formatDate = (date: string | Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    };
  
    const formatter = new Intl.DateTimeFormat('en-GB', options);  // 'en-GB' for day-month-year format
    return formatter.format(new Date(date));
  };

 export  const formatDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1);
    const day = String(date.getDate()).padStart(2, "0");
  
    return `${year}-${month}-${day}`;
  };
  