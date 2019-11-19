import PropTypes from 'prop-types';
import React from 'react';
import RJSForm from 'react-jsonschema-form';
import {
  Layout,
  Tree,
} from 'antd';
import customFormStyle from '../utils/custom-form-style';

const { Sider, Content } = Layout;
const { TreeNode } = Tree;

const origins = {
  root: {
    type: 'string',
    default: process.cwd(),
    description: 'where to start svrx',
    defaultHint: 'default to the current working directory',
    group: 'CORE',
    cli: false,
    ui: false,
  },
  svrx: {
    type: 'string',
    description: 'the version of svrx you want to use',
    defaultHint: 'default to the latest version installed locally',
    group: 'CORE',
    ui: false,
  },
  registry: {
    type: 'string',
    description: 'the registry of npm',
    group: 'CORE',
  },
  port: {
    type: 'number',
    default: 8000,
    description: 'Specify a port number to listen for requests on',
    group: 'CORE',
  },
  https: {
    description: 'enable https',
    type: 'boolean',
    default: false,
    group: 'CORE',
  },
  route: {
    description: 'the path of routing config file',
    anyOf: [
      {
        title: 'file path',
        type: 'string',
      },
      {
        title: 'multi file path',
        type: 'array',
        items: {
          type: 'string',
          default: 'bazinga',
        },
      },
    ],
    group: 'CORE',
  },
  historyApiFallback: {
    group: 'CORE',
    description: 'Enable historyApiFallback middleware',
    anyOf: [{ type: 'boolean' }, { type: 'object' }],
    default: false,
  },
  plugin: {
    group: 'CORE',
    alias: 'p',
    description: 'Add a plugin by "[@{scope}/]{name}[@{version}][?{optionsQueryString}]"',
    anyOf: [
      { type: 'string' },
      { type: 'array', items: { type: 'string' } },
    ],
    ui: false,
  },
  urls: {
    type: 'object',
    properties: {
      style: {
        type: 'string',
        default: '/svrx/svrx-client.css',
        group: 'CORE',
        cli: false,
        ui: false,
      },
      script: {
        type: 'string',
        default: '/svrx/svrx-client.js',
        group: 'CORE',
        cli: false,
        ui: false,
      },
      external: {
        type: 'string',
        group: 'CORE',
        cli: false,
        ui: false,
      },
      local: {
        type: 'string',
        group: 'CORE',
        cli: false,
        ui: false,
      },
      ui: {
        type: 'string',
        group: 'CORE',
        cli: false,
        ui: false,
      },
    },
  },
  plugins: {
    type: 'array',
    group: 'CORE',
    cli: false,
    ui: false,
  },
  middlewares: {
    type: 'array',
    group: 'CORE',
    cli: false,
    ui: false,
  },

  // built plugin configs
  serve: {
    description: 'dev server configs',
    group: 'COMMON',
    default: true,
    anyOf: [
      {
        type: 'boolean',
      },
      {
        type: 'object',
        properties: {
          base: {
            type: 'string',
            description: 'where to serve static content from',
          },
          index: {
            type: 'string',
            description: 'Name of the index file to serve automatically when visiting the root location',
            defaultHint: 'default to "index.html"',
          },
          directory: {
            type: 'boolean',
            description: 'Enable serveIndex middleware',
          },
        },
      },
    ],
  },

  proxy: {
    description: 'proxy requests configs',
    group: 'COMMON',
    anyOf: [
      {
        type: 'boolean',
      },
      {
        type: 'object',
      },
      {
        type: 'array',
      },
    ],
  },

  livereload: {
    description: 'enable auto live reload',
    group: 'COMMON',
    default: true,
    anyOf: [
      {
        type: 'boolean',
      },
      {
        type: 'object',
        properties: {
          exclude: {
            description: 'specify patterns to exclude from file watchlist',
            anyOf: [
              { type: 'string' },
              { type: 'array', items: { type: 'string' } },
            ],
          },
        },
      },
    ],
  },

  cors: {
    description: 'Cross-Origin Resource Sharing(CORS)',
    group: 'COMMON',
    default: true,
    anyOf: [
      {
        type: 'boolean',
      },
      {
        type: 'object',
      },
    ],
  },
  open: {
    description: 'open target page after server start',
    group: 'COMMON',
    default: 'local',
    anyOf: [
      {
        type: 'boolean',
      },
      {
        type: 'string',
      },
    ],
  },
  logger: {
    description: 'global logger setting',
    group: 'COMMON',
    type: 'object',
    properties: {
      level: {
        type: 'string',
        default: 'warn',
        description: 'set log level, predefined values: \'silent\',\'notify\',\'error\',\'warn\', \'debug\'',
      },
    },
  },
};

const getSchema = (schema) => {
  const displayKeys = Object.keys(schema)
    .filter(key => schema[key].ui !== false);
  const groups = {};

  displayKeys.forEach((key) => {
    const groupName = schema[key].group;
    if (!groups[groupName]) {
      groups[groupName] = {
        schema: {
          type: 'object',
          title: groupName,
          properties: {},
        },
      };
    }
    groups[groupName].schema.properties[key] = schema[key];
  });

  return groups;
};

export default function Settings() {
  // const { schema } = props;
  const groups = getSchema(origins);

  return (
    <Layout style={{ margin: '20px 0' }}>
      <Sider theme="light">
        <Tree
          defaultExpandedKeys={['0-0-0', '0-0-1']}
          defaultSelectedKeys={['0-0-0', '0-0-1']}
          defaultCheckedKeys={['0-0-0', '0-0-1']}
          // onSelect={this.onSelect}
        >
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="parent 1-0" key="0-0-0" disabled>
              <TreeNode title="leaf" key="0-0-0-0" disableCheckbox/>
              <TreeNode title="leaf" key="0-0-0-1"/>
            </TreeNode>
            <TreeNode title="parent 1-1" key="0-0-1">
              <TreeNode title={<span style={{ color: '#1890ff' }}>sss</span>}
                        key="0-0-1-0"/>
            </TreeNode>
          </TreeNode>
        </Tree>
      </Sider>
      <Content style={{ padding: 10, background: 'white' }}>
        {Object.keys(groups).map(key => (
          <RJSForm
            schema={groups[key].schema} key={key}
            {...customFormStyle}
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
