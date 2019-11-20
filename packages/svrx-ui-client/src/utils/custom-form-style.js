import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Icon } from 'antd';

const DESCRIPTION_COLOR = '#c1c1c1';

/* fields */
const CustomDescriptionField = ({ id, description }) => (description
  ? (
    <p id={id} style={{ color: DESCRIPTION_COLOR }}>
      {description
        .replace(/(\w)(.*)/, (sentence, letter) => letter.toLocaleUpperCase()
          + description.slice(1))}
    </p>
  ) : null);
CustomDescriptionField.propTypes = {
  id: PropTypes.string,
  description: PropTypes.string,
};

CustomDescriptionField.defaultProps = {
  id: null,
  description: '',
};

/* widgets */
const CustomCheckbox = (props) => {
  const {
    id, value, onChange, label, schema,
  } = props;
  return (
    <>
      <label className="control-label" htmlFor={id}>{label}</label>
      <CustomDescriptionField
        id={`${id}__description`}
        description={schema.description}/>
      <Switch
        style={{ marginLeft: 5 }}
        checkedChildren={<Icon type="check"/>}
        unCheckedChildren={<Icon type="close"/>}
        checked={value}
        onChange={() => onChange(!value)}
      />
    </>
  );
};
CustomCheckbox.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  schema: PropTypes.object,
};

const fields = {
  DescriptionField: CustomDescriptionField,
};

const widgets = {
  CheckboxWidget: CustomCheckbox,
};

export default {
  widgets,
  fields,
};
