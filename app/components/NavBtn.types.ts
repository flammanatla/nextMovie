import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export interface NavBtnProps {
  icon: IconDefinition;
  isActive: boolean;
  onNavBar: (x: string) => void;
  name: string;
}
