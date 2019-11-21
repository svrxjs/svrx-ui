import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import RJSForm from 'react-jsonschema-form';
import {
  Layout,
  // Tree,
  message,
} from 'antd';
import { getBuiltins, setBuiltins } from '../services';
import customFormStyle from '../utils/custom-form-style';

// const { Sider, Content } = Layout;
const { Content } = Layout;
// const { TreeNode } = Tree;

const getGroups = (schema, values) => {
  const displayKeys = Object.keys(schema);
  const groups = {};

  displayKeys.forEach((key) => {
    const groupName = schema[key].group || 'Others';
    if (!groups[groupName]) {
      groups[groupName] = {
        schema: {
          type: 'object',
          title: groupName,
          properties: {},
        },
        values: {},
      };
    }
    groups[groupName].schema.properties[key] = schema[key];
    groups[groupName].values[key] = values[key];
  });

  return groups;
};

const lock = {
  id: null,
  status: false,
};

let saveTimer = null;
const save = (group, settings) => {
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
  saveTimer = setTimeout(async () => {
    const changed = settings[group];
    await setBuiltins(changed);
    message.success('Settings changed!');
  }, 500);
};

export default function Settings() {
  const [builtinSchema, setBuiltinSchema] = useState({});
  const [builtinValues, setBuiltinValues] = useState({});
  const settings = {};

  /* handlers */
  const handleFormFocus = (group, id) => {
    lock.status = true;
    lock.id = id;
  };
  const handleFormBlur = (group, id) => {
    if (lock.id === id) {
      lock.status = false;
      lock.id = null;
      save(group, settings);
    }
  };
  const handleFormChange = (group, formData) => {
    settings[group] = formData;
    if (!lock.status) {
      save(group, settings);
    }
  };

  /* fetch data */
  useEffect(() => {
    (async () => {
      const builtins = await getBuiltins() || [];
      const schema = {};
      const values = {};

      builtins.forEach((b) => {
        schema[b.key] = b.schema;
        values[b.key] = b.value;
      });

      setBuiltinSchema(schema);
      setBuiltinValues(values);
    })();
  }, []);
  const groups = getGroups(builtinSchema, builtinValues);

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
            schema={groups[key].schema}
            formData={groups[key].values}
            {...customFormStyle}
            onChange={({ formData }) => handleFormChange(key, formData)}
            onFocus={id => handleFormFocus(key, id)}
            onBlur={id => handleFormBlur(key, id)}
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
