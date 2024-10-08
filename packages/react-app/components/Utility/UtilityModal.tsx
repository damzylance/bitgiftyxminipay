import {
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerOverlay,
	Text,
	VStack,
} from "@chakra-ui/react";
import Airtime from "./Airtime/Airtime";
import Electricity from "./Power/Power";
import Data from "./Data/Data";
import Cable from "./Cable/Cable";
import PayBill from "./PayBill/PayBill";
import BuyGoods from "./BuyGoods/BuyGoods";
import BetTopUp from "./BetTopup/BetTopup";
import Bet9jaTopup from "./Bet9ja/Bet9ja";
import Momo from "./MoMo/MoMo";

type Props = {
	type: String;
	onClose: any;
	isOpen: any;
};

export const UtilityDrawer = (props: Props) => {
	return (
		<Drawer
			closeOnOverlayClick={false}
			isOpen={props.isOpen}
			onClose={props.onClose}
			placement={"bottom"}
		>
			<DrawerOverlay />
			<DrawerContent borderTopRadius={"24px"}>
				<DrawerCloseButton />
				<DrawerBody>
					<VStack width={"full"}>
						{props.type === "airtime" && <Airtime action={props.onClose} />}
						{props.type === "electricity" && (
							<Electricity action={props.onClose} />
						)}
						{props.type === "data" && <Data action={props.onClose} />}
						{props.type === "cable" && <Cable action={props.onClose} />}
						{props.type === "pay bills" && <PayBill action={props.onClose} />}
						{props.type === "buy goods" && <BuyGoods action={props.onClose} />}
						{props.type === "bettopup" && <BetTopUp action={props.onClose} />}
						{props.type === "bet9ja" && <Bet9jaTopup action={props.onClose} />}
						{props.type === "momo" && <Momo action={props.onClose} />}

						{/* 
            
            */}
					</VStack>
				</DrawerBody>
			</DrawerContent>
		</Drawer>
	);
};
