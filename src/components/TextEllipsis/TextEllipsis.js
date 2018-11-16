import * as React from 'react';
import { Tooltip } from 'antd';
import styles from './TextEllipsis.less';

const TextEllipsis = ({ text, title, width, color, cursor }) => {
  const tooltipTitle = title === undefined ? text : title;
  const tooltipWidth = width === undefined ? 106 : width;
  const tooltipColor = color === undefined ? 'rgba(0, 0, 0, 0.65)' : color;
  const tooltipCursor = cursor === undefined ? 'text' : cursor;
  return (
    <span
      className={styles.detailColStyle}
      style={{ width: tooltipWidth, cursor: tooltipCursor, color: tooltipColor }}
    >
      <Tooltip placement="bottomLeft" title={tooltipTitle}>
        {text}
      </Tooltip>
    </span>
  );
};
export default TextEllipsis;
