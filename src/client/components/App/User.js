import React from "react";
import { join } from "ramda";
import PropTypes from "prop-types";
import styled from "styled-components";
import classNames from "classnames";
import { Button, Menu, MenuItem, MenuDivider } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/labs";
import Avatar from "../Avatar";

const Layout = styled.div`
  display: grid;
  grid-template-areas: "avatar" "email" "menu";
  justify-items: center;
`;

const StyledAvatar = styled(Avatar)`margin: 10px;`;

const StyledEmail = styled.div`font-size: 0.8em;`;

const UserButton = ({ user, logout }) => {
  const btnClass = classNames("pt-button pt-minimal pt-icon-user", {
    "pt-disabled": !user
  });
  if (!user) return <button className={btnClass} />;
  const fullName = join(" ", [user.firstName, user.lastName]);
  return (
    <Popover2 placement="bottom">
      <Button className={btnClass} />
      <Layout>
        <StyledAvatar name={fullName} color={user.avatar.color} />
        <StyledEmail>{user.email}</StyledEmail>
        <Menu>
          <MenuDivider />
          <MenuItem iconName="log-out" onClick={logout} text="Logout" />
        </Menu>
      </Layout>
    </Popover2>
  );
};

UserButton.propTypes = {
  user: PropTypes.object,
  logout: PropTypes.func.isRequired
};

export default UserButton;
