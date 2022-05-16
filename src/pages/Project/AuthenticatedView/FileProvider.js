import { createContext, useState } from 'react';

export const FileContext = createContext(null);

export const FileContextProvider = (props) => {
  const value = useState([]);
  return (
    <FileContext.Provider value={value}>{props.children}</FileContext.Provider>
  );
};
