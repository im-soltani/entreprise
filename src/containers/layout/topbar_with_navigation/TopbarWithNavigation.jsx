import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import TopbarSidebarButton from "./TopbarSidebarButton";
import TopbarProfile from "./TopbarProfile";
const image = `${process.env.PUBLIC_URL}/img/images/SB-2.jpg`;
import TopbarNav from "./tobar_nav/TopbarNav";

export default class TopbarWithNavigation extends PureComponent {
  static propTypes = {
    changeMobileSidebarVisibility: PropTypes.func.isRequired,
    history: PropTypes.object
  };

  render() {
    const { changeMobileSidebarVisibility, history } = this.props;

    return (
      <div className="topbar topbar--navigation">
        <div className="topbar__wrapper">
          <div className="topbar__left">
            <TopbarSidebarButton
              changeMobileSidebarVisibility={changeMobileSidebarVisibility}
            />
            <Link className="topbar__logo" to="/">
              <img src={image} />
            </Link>
          </div>
          <TopbarNav />
          <div className="topbar__right">
            <TopbarProfile history={history} />
          </div>
        </div>
      </div>
    );
  }
}
