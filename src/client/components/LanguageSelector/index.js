import React from 'react';
import PropTypes from 'prop-types';
import { Popover2 } from '@blueprintjs/labs';
import {
  Menu,
  MenuItem,
  Position,
  PopoverInteractionKind,
  Button,
} from '@blueprintjs/core';

export const SettingsMenu = ({ langs = [], locale = '', setLocale }) => (
  <Menu>
    {langs.map(lang => locale === lang ?
      <MenuItem
        key={lang}
        iconName={'pt-icon-tick'}
        disabled
        className="menu-item"
        text={lang}
        onClick={event => {
          event.preventDefault();
          setLocale(lang);
        }}
      /> :
      <MenuItem
        key={lang}
        className="menu-item"
        text={lang}
        onClick={event => {
          event.preventDefault();
          setLocale(lang);
        }}
      />,
    )
    }
  </Menu>
);

const LanguageSelector = ({ langs = [], locale = '', setLocale }) => (
  <div>
    <Popover2
      position={Position.auto}
      interactionKind={PopoverInteractionKind.CLICK}
      content={
        <SettingsMenu style={{ zIndex: 1000, position: 'relative' }} langs={langs} locale={locale} setLocale={setLocale} />
      }
    >
      <Button className="dropdown-button pt-button pt-minimal pt-icon-caret-down">{locale}</Button>
    </Popover2>
  </div>
);

LanguageSelector.propTypes = {
  langs: PropTypes.array,
  locale: PropTypes.string,
  setLocale: PropTypes.func,
};

SettingsMenu.propTypes = {
  langs: PropTypes.array,
  locale: PropTypes.string,
  setLocale: PropTypes.func,
};

export default LanguageSelector;
