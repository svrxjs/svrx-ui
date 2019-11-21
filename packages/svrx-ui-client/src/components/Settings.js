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

// const { Sider, Content } = Layout;
const { Content } = Layout;
// const { TreeNode } = Tree;

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
    properties[name].schema.properties[key] = schema[key];
    properties[name].values[key] = values[key];
  });

  return properties;
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
    if (group === 'Plugin') {
      await setPluginsService(changed);
    } else {
      await setBuiltinsService(changed);
    }
    message.success('Settings changed!');
  }, 500);
};

export default function Settings() {
  const [builtins, setBuiltins] = useState([]);
  const [plugins, setPlugins] = useState([]);
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
      /* builtins */
      const builtinsResp = await getBuiltinsService() || [];
      setBuiltins(builtinsResp);
      const pluginsResp = await getPluginsService() || [];
      setPlugins(pluginsResp);
    })();
  }, []);
  const groups = getProperties([...builtins, ...plugins]);

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
