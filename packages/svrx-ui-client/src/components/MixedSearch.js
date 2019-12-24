import React from 'react';
import {
  Select,
} from 'antd';
import PropTypes from 'prop-types';

const { Option } = Select;

export default function MixedSearch(props) {
  const { results } = props;
  const settingOptions = results.filter((d) => d.type === 'setting')
    .map((d) => <Option key={d.name}>{d.name}</Option>);
  const pluginOptions = results.filter((d) => d.type === 'plugin')
    .map((d) => <Option key={d.name}>{d.name}</Option>);

  return (
    <Select
      size="large"
      showSearch
      style={{ width: '100%' }}
      placeholder="Search settings and plugins"
      defaultActiveFirstOption={false}
      showArrow={false}
      notFoundContent="No Result"
    >
      {settingOptions}
      {pluginOptions}
    </Select>
  );
}

MixedSearch.propTypes = {
  results: PropTypes.array,
};

MixedSearch.defaultProps = {
  results: [],
};
