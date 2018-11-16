import React, { Component } from 'react';
import styles from './TitleItem.less';
class TitleItem extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className={styles.itemTitle}>
        <span />
        {this.props.title}
      </div>
    );
  }
}
export default TitleItem;
