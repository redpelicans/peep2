import React from "react";
import PropTypes from "prop-types";
import Bricks from "bricks.js";

class MasonryLayout extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    packed: PropTypes.string,
    sizes: PropTypes.array,
    style: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.element).isRequired
  };

  static defaultProps = {
    packed: "data-packed",
    sizes: [
      { columns: 2, gutter: 20 },
      { mq: "768px", columns: 3, gutter: 20 },
      { mq: "1024px", columns: 6, gutter: 20 }
    ],
    style: {},
    className: ""
  };

  componentDidMount() {
    const instance = Bricks({
      container: `#${this.props.id}`,
      packed: this.props.packed,
      sizes: this.props.sizes
    });

    instance.resize(true);

    if (this.props.children.length > 0) {
      instance.pack();
    }

    /* eslint react/no-did-mount-set-state: 0 */
    this.brick = instance;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.children.length === 0 && this.props.children.length === 0) {
      return;
    }

    const { brick } = this;

    return brick.pack();

    // if (prevProps.children.length === 0 && this.props.children.length > 0) {
    //   return brick.pack();
    // }
    //
    // if (prevProps.children.length !== this.props.children.length) {
    //   return brick.update();
    // }
  }

  componentWillUnmount() {
    this.brick.resize(false);
  }

  render() {
    const { id, className, style, children } = this.props;
    return (
      <div id={id} className={className} style={style}>
        {children}
      </div>
    );
  }
}

export default MasonryLayout;
