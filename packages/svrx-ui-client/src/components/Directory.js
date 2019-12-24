import React from 'react';
import {
  Breadcrumb,
} from 'antd';
import PropTypes from 'prop-types';

export default function Directory(props) {
  const { directoryArray } = props;


  return (
    <Breadcrumb style={{ margin: '20px 0' }}>
      {directoryArray.map((dir, index) => (
        <Breadcrumb.Item key={index}>{dir}</Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
}

Directory.propTypes = {
  directoryArray: PropTypes.array,
};

Directory.defaultProps = {
  directoryArray: [],
};
