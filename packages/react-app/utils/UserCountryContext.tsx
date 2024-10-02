import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import { servicesByCountry } from "./supportedTokens";

// Define types
interface SupportedCountries {
	country: string;
	currency: string;
	flag: string;
	ticker: string;
	countryCode: string;
	cashback: string;
}

type UserCountryContextType = {
	userCountry: string;
	setUserCountry: (value: string) => void;
	userCountryCode: string;
	setUserCountryCode: (value: string) => void;
	userCurrency: string;
	setCurrency: (value: string) => void;
	userCurrencyTicker: string;
	setUserCurrencyTicker: (value: string) => void;
	supportedCountries: SupportedCountries[];
	setSupportedCountries: (value: SupportedCountries[]) => void;
	cashback: string;
	setCashback: (value: string) => void;
	services: { name: string; icon: React.JSX.Element; bg: string }[];
};

// Create the context
const UserCountryContext = createContext<UserCountryContextType | undefined>(
	undefined
);

// Custom hook to consume the context
export const useUserCountry = () => {
	const context = useContext(UserCountryContext);
	if (!context) {
		throw new Error("useUserCountry must be used within a UserCountryProvider");
	}
	return context;
};

// Provider component

export const UserCountryProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [userCountry, setUserCountry] = useState<string>("") || "NG";
	const [userCurrency, setCurrency] = useState<string>("");
	const [userCurrencyTicker, setUserCurrencyTicker] = useState<string>("");
	const [userCountryCode, setUserCountryCode] = useState<string>("");
	const [cashback, setCashback] = useState<string>("");
	const [supportedCountries, setSupportedCountries] = useState<
		SupportedCountries[]
	>([
		{
			country: "NG",
			currency: "NGN",
			flag: "🇳🇬",
			ticker: "₦",
			countryCode: "+234",
			cashback: "1500",
		},
		{
			country: "GH",
			currency: "GHS",
			flag: "🇬🇭",
			ticker: "₵",
			countryCode: "+233",
			cashback: "15",
		},
		{
			country: "KE",
			currency: "KES",
			flag: "🇰🇪",
			ticker: "KSh",
			countryCode: "+254",
			cashback: "150",
		},
		{
			country: "ZA",
			currency: "ZAR",
			flag: "🇿🇦",
			ticker: "R",
			countryCode: "+27",
			cashback: "19",
		}, // South Africa
		{
			country: "UG",
			currency: "UGX",
			flag: "🇺🇬",
			ticker: "USh",
			countryCode: "+256",
			cashback: "3700",
		}, // Uganda
	]);

	// Step 3: Filter services based on userCountry
	const [services, setServices] = useState<
		{ name: string; icon: React.JSX.Element; bg: string }[]
	>([]);

	useEffect(() => {
		const fetchUserCountry = () => {
			const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
			const city = timeZone.split("/")[1];
			let country = "NG"; // Default
			let currency = "NGN"; // Default
			let ticker = "₦";
			let countryCode = "+234";
			let cb = "1500";

			switch (city) {
				case "Lagos":
					country = "NG";
					currency = "NGN";
					ticker = "₦";
					countryCode = "+234";
					cb = "1500";
					break;
				case "Accra":
					country = "GH";
					currency = "GHS";
					ticker = "₵";
					countryCode = "+233";
					cb = "15";
					break;
				case "Nairobi":
					country = "KE";
					currency = "KES";
					ticker = "KSh";
					countryCode = "+254";
					cb = "150";
					break;
				case "Johannesburg":
				case "Cape_Town":
				case "Durban":
					country = "ZA";
					currency = "ZAR";
					ticker = "R";
					countryCode = "+27";
					cb = "200";
					break;
				case "Kampala":
					country = "UG";
					currency = "UGX";
					ticker = "USh";
					countryCode = "+256";
					cb = "500";
					break;
				default:
					country = "NG";
					currency = "NGN";
					ticker = "₦";
					countryCode = "+234";
					cb = "1500";
			}

			setUserCountry(country);
			setCurrency(currency);
			setUserCurrencyTicker(ticker);
			setUserCountryCode(countryCode);
			setCashback(cb);
		};

		fetchUserCountry();
	}, []);

	// Effect to update services based on the selected country
	useEffect(() => {
		const currentServices =
			servicesByCountry.find((entry) => entry.country === userCountry)
				?.services || [];

		setServices(currentServices);
	}, [userCountry]);

	return (
		<UserCountryContext.Provider
			value={{
				userCountry,
				setUserCountry,
				userCountryCode,
				setUserCountryCode,
				userCurrency,
				setCurrency,
				userCurrencyTicker,
				setUserCurrencyTicker,
				supportedCountries,
				setSupportedCountries,
				cashback,
				setCashback,
				services, // Provide services in the context
			}}
		>
			{children}
		</UserCountryContext.Provider>
	);
};
