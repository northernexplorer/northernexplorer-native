import expoConfig from "eslint-config-expo/flat.js";
import rootConfig from '../../eslint.config.js';

export default [
    ...rootConfig,
    ...expoConfig,
];