import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types
interface SupportedCountries {
  country: string;
  currency: string;
  flag: string;
  ticker:string;
  countryCode:string
}

type UserCountryContextType = {
  userCountry: string;
  setUserCountry: (value: string) => void;
  userCountryCode: string;
  setUserCountryCode: (value: string) => void;
  userCurrency: string; // Added for consistency
  setCurrency: (value: string) => void; // Corrected for setting user's currency
  userCurrencyTicker:string;
  setUserCurrencyTicker:(value: string) => void;
  supportedCountries: SupportedCountries[];
  setSupportedCountries: (value: SupportedCountries[]) => void; // Corrected type for setting the entire list
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
  const [userCurrency, setCurrency] = useState<string>(''); // Corrected to match the type
  const [userCurrencyTicker,setUserCurrencyTicker]=useState<string>('')
  const [userCountryCode,setUserCountryCode]=useState<string>('')

  const [supportedCountries, setSupportedCountries] = useState<SupportedCountries[]>([
    { country: "NG", currency: "NGN", flag: "🇳🇬",ticker:"₦",countryCode:"+234" },
    { country: "GH", currency: "GHS", flag: "🇬🇭",ticker:"₵",countryCode:"+233" },
    // { country: "KE", currency: "KES", flag: "🇰🇪",ticker:"KSh",countryCode:"+254" },
    
  ]);

  useEffect(() => {
    const fetchUserCountry = async () => {
      // Assuming this is a placeholder for actual logic to determine user's country and currency
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const city = timeZone.split("/")[1];
      let country = "NG"; // Default
      let currency = "NGN"; // Default
      let ticker = "₦"
      let countryCode="+234"
      
      switch (city) {
        case "Lagos":
          country = "NG";
          currency = "NGN";
          ticker="₦"
          countryCode="+234"
          
          break;
        
        case "Accra":
          country = "GH";
          currency = "GHS";
          ticker = "₵"
          countryCode="+233" 

          break;

        case "Nairobi":
          country = "KE";
          currency = "KES";
          ticker="KSh";
          countryCode="+254" 
          break;

        default:
          country = "NG";
          currency = "NGN";
          ticker="₦"
          countryCode="+234"

      }

      setUserCountry(country);
      setCurrency(currency);
      setUserCurrencyTicker(ticker)
      setUserCountryCode(countryCode)
       // Set currency based on the user's country
    };

    fetchUserCountry();
  }, []);

  return (
    <UserCountryContext.Provider value={{ userCountry, setUserCountry,userCountryCode,setUserCountryCode ,userCurrency, setCurrency,userCurrencyTicker,setUserCurrencyTicker, supportedCountries, setSupportedCountries }}>
      {children}
    </UserCountryContext.Provider>
  );
};
