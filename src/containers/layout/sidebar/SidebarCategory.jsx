import React, { Component } from "react";
import { Collapse } from "reactstrap";
import Icon from "../../../shared/components/Icon";
import PropTypes from "prop-types";
import classNames from "classnames";
import ChevronDownIcon from "mdi-react/ChevronDownIcon";
import ChevronUpIcon from "mdi-react/ChevronUpIcon";

export default class SidebarCategory extends Component {
  static propTypes = {
    route: PropTypes.object.isRequired,
    index: PropTypes.string,
    sidebarCollapse: PropTypes.bool,
    children: PropTypes.arrayOf(PropTypes.element).isRequired
  };

  static defaultProps = {
    route: {},
    index: ""
  };

  constructor() {
    super();
    this.state = {
      collapse: false
    };
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.sidebarCollapse) this.setState({ collapse: false });
  }

  toggle = () => {
    this.setState({ collapse: !this.state.collapse });
  };

  render() {
    const { route, children } = this.props;
    const nameA = "sidebar__category-wrap--open" + route.index;
    const categoryClass = classNames({
      "sidebar__category-wrap": true,
      "sidebar__category-wrap-active": route.isActive,
      [nameA]: this.state.collapse
    });

    return (
      <div className={categoryClass}>
        <span
          className={route.className + " sidebar__category"}
          onClick={this.toggle}
        >
          <Icon className="side-bar__icon" name={route.icon} />
          <p className={route.className + "-title"}>{route.label}</p>
          {!this.state.collapse ? (
            <ChevronDownIcon
              style={{
                right: 0,
                position: "absolute",
                top: 10,
                color: "white"
              }}
            />
          ) : (
            <ChevronUpIcon
              style={{
                right: 0,
                position: "absolute",
                top: 10,
                color: "white"
              }}
            />
          )}
        </span>
        <Collapse
          isOpen={this.state.collapse}
          className="sidebar__submenu-wrap"
        >
          <ul className="sidebar__submenu">
            <div>{children}</div>
          </ul>
        </Collapse>
      </div>
    );
  }
}
