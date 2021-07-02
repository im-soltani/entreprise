import React from "react";
import DownIcon from "mdi-react/ChevronDownIcon";
import { DropdownItem, DropdownToggle, DropdownMenu, UncontrolledDropdown } from "reactstrap";
import TopbarNavLink from "./TopbarNavLink";

const TopbarNavActualité = () => (
	<UncontrolledDropdown className="topbar__nav-dropdown">
		<DropdownToggle className="topbar__nav-dropdown-toggle">
			Actus RH <DownIcon />
		</DropdownToggle>
		<DropdownMenu className="topbar__nav-dropdown-menu dropdown__menu">
			<DropdownItem>
				<TopbarNavLink title="Créer une actualité" icon="create-offer" route="/creation-une-actualité" />
			</DropdownItem>
			<DropdownItem>
				<TopbarNavLink title="Liste des actualités" icon="files" route="/mes-actualités" />
			</DropdownItem>
		</DropdownMenu>
	</UncontrolledDropdown>
);

export default TopbarNavActualité;
