import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import classNames from "classnames";
//import Topbar from "./topbar/Topbar";
import Sidebar from "./sidebar/Sidebar";
import PropTypes from "prop-types";
import TopbarWithNavigation from "./topbar_with_navigation/TopbarWithNavigation";
class Layout extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    let { pathname } = props.location;
    this.state = {
      sidebarShow: false,
      sidebarCollapse:
        pathname === "/" || pathname === "/accueil" ? false : true
    };
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.location &&
      nextProps.location.pathname &&
      (nextProps.location.pathname === "/" ||
        nextProps.location.pathname === "/accueil")
    )
      this.setState({ sidebarCollapse: false });
    else this.setState({ sidebarCollapse: true });
  }
  changeSidebarVisibility = () => {
    this.setState({ sidebarCollapse: !this.state.sidebarCollapse });
  };

  changeMobileSidebarVisibility = () => {
    this.setState({ sidebarShow: !this.state.sidebarShow });
  };
  changeSidebarVisibilityTrue = () => {
    this.setState({ sidebarCollapse: false });
  };
  changeSidebarVisibilityFalse = () => {
    this.setState({ sidebarCollapse: true });
  };
  render() {
    const { sidebarShow, sidebarCollapse } = this.state;
    const layoutClass = classNames({
      layout: true,
      "layout--collapse": sidebarCollapse
    });

    return (
      <div className={layoutClass}>
        <TopbarWithNavigation
          history={this.props.history}
          changeMobileSidebarVisibility={this.changeMobileSidebarVisibility}
        />
        <Sidebar
          changeSidebarVisibilityTrue={this.changeSidebarVisibilityTrue}
          sidebarShow={sidebarShow}
          sidebarCollapse={sidebarCollapse}
          changeSidebarVisibility={this.changeSidebarVisibility}
          changeMobileSidebarVisibility={this.changeMobileSidebarVisibility}
        />
      </div>
    );
  }
}

export default withRouter(Layout);
