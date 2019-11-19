import React from 'react';
import PropTypes from 'prop-types';

/* fields */
const CustomDescriptionField = ({ id, description }) => (
    <p id={id} style={{ color: '#c1c1c1' }}>
      {description
        .replace(/(\w)/, letter => letter.toLocaleUpperCase() + description.slice(1))}
    </p>
);

CustomDescriptionField.propTypes = {
  id: PropTypes.string,
  description: PropTypes.string,
};

CustomDescriptionField.defaultProps = {
  id: null,
  description: '',
};

const fields = {
  DescriptionField: CustomDescriptionField,
};

export default {
  fields,
};
