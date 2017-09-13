import React from 'react';

const asyncComponent = (getComponent) => {
  return class AsyncComponent extends React.Component {
    static Component = null;
    state = { Component: AsyncComponent.Component };

    componentWillMount() {
      const { Component } = this.state;
      if (!this.state.Component) {
        getComponent().then(Component => {
          AsyncComponent.Component = Component;
          this.setState({ Component });
        });
      }
    }

    render() {
      const { Component } = this.state;
      if (!Component) return null;
      return <Component {...this.props} />;
    }
  }
};

export default asyncComponent;
