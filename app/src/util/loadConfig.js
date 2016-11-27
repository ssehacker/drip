/**
 * Created by ssehacker on 16/7/10.
 */
import devConfig from '../config/config.dev';
import prodConfig from '../config/config.prod';

export default function loadConfig() {
  const NODE_ENV = process.env.NODE_ENV || '';
  let config;
  if (NODE_ENV.toLowerCase() === 'dev') {
    config = devConfig;
  } else {
    config = prodConfig;
  }
  return config;
}
