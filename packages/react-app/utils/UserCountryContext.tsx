// UserCountryContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types
type UserCountryContextType = {
  userCountry: string;
};

// Create the context
const UserCountryContext = createContext<UserCountryContextType | undefined>(undefined);

// Custom hook to consume the context
export const useUserCountry = () => {
  const context = useContext(UserCountryContext);
  if (!context) {
    throw new Error('useUserCountry must be used within a UserCountryProvider');
  }
  return context;
};

// Provider component
export const UserCountryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userCountry, setUserCountry] = useState<string>('');

  useEffect(() => {
    const fetchUserCountry = async () => {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;;
      const city=timeZone.split("/")[1]
      switch(city){
        case "Lagos":
          setUserCountry("Nigeria")
          break;
        
        case "Accra":
          setUserCountry("Ghana")
          break;
        case "Nairobi":
          setUserCountry("Kenya")
          break
        default:
          setUserCountry("Nigeria")   
      }
    };

    fetchUserCountry();
  }, []);

  return (
    <UserCountryContext.Provider value={{ userCountry }}>
      {children}
    </UserCountryContext.Provider>
  );
};
