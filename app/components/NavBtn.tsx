import { NavBtnProps } from "./NavBtn.types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function NavBtn({
  icon,
  isActive,
  onNavBar,
  name,
}: NavBtnProps): JSX.Element {
  return (
    <button className="nav-bar__btn" onClick={() => onNavBar(name)}>
      <FontAwesomeIcon
        className={"btn__icon " + (isActive ? "btn__icon--active" : "")}
        icon={icon}
      />
      <span className={"btn__label " + (isActive ? "btn__label--active" : "")}>
        {name}
      </span>
    </button>
  );
}
