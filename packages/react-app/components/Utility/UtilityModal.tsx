import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  VStack,
} from "@chakra-ui/react";
import Airtime from "./Airtime/Airtime";
import Electricity from "./Power/Power";
import Data from "./Data/Data";
import Cable from "./Cable/Cable";

type Props = {
  type: String;
  onClose: any;
  isOpen: any;
};

export const UtilityModal = (props: Props) => {
  return (
    <Modal closeOnOverlayClick={false} isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody>
          <VStack width={"full"}>
            {" "}
            {props.type === "airtime" && <Airtime action={props.onClose} />}
            {props.type === "electricity" && (
              <Electricity action={props.onClose} />
            )}
            {props.type === "data" && <Data action={props.onClose} />}
            {props.type === "cable" && <Cable action={props.onClose} />}
            {/* 
            
            */}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
