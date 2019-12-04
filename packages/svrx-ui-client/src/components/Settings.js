import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import RJSForm from 'react-jsonschema-form';
import {
  Layout,
  // Tree,
  message,
} from 'antd';
import {
  getBuiltins as getBuiltinsService,
  setBuiltins as setBuiltinsService,
  getPlugins as getPluginsService,
  setPlugins as setPluginsService,
} from '../services';
import customFormStyle from '../utils/custom-form-style';

// fixme testanyof key删除报错
// const { Sider, Content } = Layout;
const { Content } = Layout;
// const { TreeNode } = Tree;

const formSchema = (schema = {}) => {
  const {
    type, properties, anyOf, additionalProperties, items,
  } = schema;

  if (anyOf) {
    schema.anyOf = anyOf.map(one => formSchema(one));
  }
  if (type === 'object') {
    if (!properties && !additionalProperties) {
      schema.additionalProperties = { type: 'string' };
    } else {
      const newProperties = {};
      Object.keys(properties || {}).forEach((o) => {
        newProperties[o] = formSchema(properties[o]);
      });
      schema.properties = newProperties;
    }
  }
  if (type === 'array') {
    schema.items = formSchema(items);
  }
  return schema;
};
const getProperties = (array = []) => {
  const schema = {};
  const values = {};
  array.forEach((b) => {
    schema[b.key] = b.schema;
    values[b.key] = b.value;
  });

  const keys = Object.keys(schema);
  const properties = {};

  keys.forEach((key) => {
    const name = schema[key].group || 'Others';
    if (!properties[name]) {
      properties[name] = {
        schema: {
          type: 'object',
          title: name,
          properties: {},
        },
        values: {},
      };
    }
    properties[name].schema.properties[key] = formSchema(schema[key]);
    properties[name].values[key] = values[key];
  });

  return properties;
};
const stringifyObject = (value) => {
  if (typeof value === 'object') return JSON.stringify(value);
  return value;
};
const encodeAdditionalObject = (schema, values) => {
  if (values === undefined || values === null) return values;
  const {
    type, anyOf, properties, additionalProperties, items,
  } = schema;
  if (type !== 'object' && type !== 'array' && !anyOf) return values;

  if (type === 'object') {
    if (additionalProperties) {
      const newValues = {};
      Object.keys(values).forEach((key) => {
        newValues[key] = stringifyObject(values[key]);
      });
      return newValues;
    }
    if (properties) {
      const newValues = {};
      Object.keys(properties).forEach((key) => {
        newValues[key] = encodeAdditionalObject(properties[key], values[key]);
      });
      return newValues;
    }
  }
  if (type === 'array') {
    if (!items) return values;
    return values.map(v => encodeAdditionalObject(items, v));
  }
  if (anyOf) {
    const fetchSchema = ty => anyOf.find(a => a.type === ty);
    if (typeof values === 'object') { // object and array
      if (Array.isArray(values)) {
        return encodeAdditionalObject(fetchSchema('array'), values);
      }
      return encodeAdditionalObject(fetchSchema('object'), values);
    }
  }

  return values;
};
const decodeAdditionalObject = (value) => {
  const type = typeof value;

  if (type === 'string') {
    let newVal = null;
    try {
      newVal = JSON.parse(value);
    } catch (e) {
      // swallow
    }
    return newVal === null ? value : newVal;
  }
  if (type !== 'object') return value;
  if (Array.isArray(value)) return value.map(v => decodeAdditionalObject(v));
  const newVal = {};
  Object.keys(value).forEach((key) => {
    newVal[key] = decodeAdditionalObject(value[key]);
  });
  return newVal;
};
const lock = {
  id: null,
  status: false,
};

let saveTimer = null;
const save = (form, group, settings) => {
  if (!form) return;
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
  saveTimer = setTimeout(async () => {
    const { state: { errors } } = form;
    if (errors && errors.length > 0) return;

    const changed = decodeAdditionalObject(settings[group]);
    const result = group === 'Plugin'
      ? await setPluginsService(changed)
      : await setBuiltinsService(changed);
    if (result !== null) {
      message.success('Settings changed!');
    }
  }, 500);
};

export default function Settings() {
  const [builtins, setBuiltins] = useState([]);
  const [plugins, setPlugins] = useState([]);
  const settings = {};
  const forms = {};

  /* handlers */
  const handleFormFocus = (group, id) => {
    lock.status = true;
    lock.id = id;
  };
  const handleFormBlur = (group, id) => {
    if (lock.id === id) {
      lock.status = false;
      lock.id = null;
      save(forms[group], group, settings);
    }
  };
  const handleFormChange = (group, formData) => {
    settings[group] = formData;
    if (!lock.status) {
      save(forms[group], group, settings);
    }
  };

  /* fetch data */
  useEffect(() => {
    (async () => {
      /* builtins */
      const builtinsResp = await getBuiltinsService() || [];
      if (builtinsResp) {
        setBuiltins(builtinsResp);
      }
      const pluginsResp = await getPluginsService() || [];
      if (pluginsResp) {
        setPlugins(pluginsResp);
      }
    })();
  }, []);

  // groups: {Core:{schema,values},Common:{schema,values},...}
  const groups = (() => {
    const groupsOri = getProperties([...builtins, ...plugins]);
    const newgroups = {};
    Object.keys(groupsOri).forEach((key) => {
      const { schema, values } = groupsOri[key];
      newgroups[key] = {
        schema,
        values: encodeAdditionalObject(schema, values),
      };
    });
    return newgroups;
  })();

  return (
    <Layout style={{ margin: '20px 0', background: '#fff' }}>
      {/* <Sider */}
      {/*  theme="light" */}
      {/*  style={{ */}
      {/*    overflowY: 'auto', */}
      {/*    height: '100%', */}
      {/*    top: '20px', */}
      {/*    position: 'sticky', */}
      {/*  }} */}
      {/* > */}
      {/*  <Tree */}
      {/*    defaultExpandedKeys={['0-0-0', '0-0-1']} */}
      {/*    defaultSelectedKeys={['0-0-0', '0-0-1']} */}
      {/*    defaultCheckedKeys={['0-0-0', '0-0-1']} */}
      {/*    // onSelect={this.onSelect} */}
      {/*  > */}
      {/*    <TreeNode title="parent 1" key="0-0"> */}
      {/*      <TreeNode title="parent 1-0" key="0-0-0" disabled> */}
      {/*        <TreeNode title="to-do" key="0-0-0-0" disableCheckbox/> */}
      {/*        <TreeNode title="leaf" key="0-0-0-1"/> */}
      {/*      </TreeNode> */}
      {/*      <TreeNode title="parent 1-1" key="0-0-1"> */}
      {/*        <TreeNode title={<span style={{ color: '#1890ff' }}>sss</span>} */}
      {/*                  key="0-0-1-0"/> */}
      {/*      </TreeNode> */}
      {/*    </TreeNode> */}
      {/*  </Tree> */}
      {/* </Sider> */}
      <Content
        style={{
          padding: 10,
        }}
      >
        {Object.keys(groups).map(key => (
          <RJSForm
            key={key}
            liveValidate={true}
            schema={groups[key].schema}
            formData={groups[key].values}
            {...customFormStyle}
            onChange={({ formData }) => handleFormChange(key, formData)}
            onFocus={id => handleFormFocus(key, id)}
            onBlur={id => handleFormBlur(key, id)}
            ref={(form) => { forms[key] = form; }}
          >
            <button style={{ display: 'none' }}/>
          </RJSForm>
        ))}
      </Content>
    </Layout>
  );
}

Settings.propTypes = {
  schema: PropTypes.object,
};

Settings.defaultProps = {
  schema: {},
};
