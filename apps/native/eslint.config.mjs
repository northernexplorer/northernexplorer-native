import expoConfig from 'eslint-config-expo/flat.js';
import rootConfig from '../../eslint.config.mjs';

export default [...rootConfig, ...expoConfig];
