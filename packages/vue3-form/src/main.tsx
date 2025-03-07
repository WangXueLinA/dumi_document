import { ElButton, ElInput } from 'element-plus';
import 'element-plus/dist/index.css';
import 'view-ui-plus/dist/styles/viewuiplus.css';
import { createApp } from 'vue';

import { Input } from 'view-ui-plus';
import './components/index.scss';
import { registerComponents } from './index';

import App from './App.vue';

registerComponents({
  input: ElInput,
  input2: Input,
});
createApp(App).use(ElButton).mount('#dsc-app');
