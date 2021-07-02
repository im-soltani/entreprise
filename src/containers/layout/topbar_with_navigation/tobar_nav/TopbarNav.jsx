import React from "react";
import { Link } from "react-router-dom";
import TopbarNavDashboards from "./TopbarNavDashboards";

import TopbarNavUIElements from "./TopbarNavUIElements";

const TopbarNav = () => (
  <nav className="topbar__nav">
    <TopbarNavDashboards />
    {/*     <TopbarNavActualité /> */}
    <TopbarNavUIElements />
    {/*  <Link className="topbar__nav-link" to="/compte">
      Mon compte
    </Link> */}
    <Link className="topbar__nav-link" to="/parametres">
      Paramètres
    </Link>
    {/*  <Link className="topbar__nav-link" to="/tutoriel">
      Tutoriel
    </Link> */}
  </nav>
);

export default TopbarNav;
