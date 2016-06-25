import url from 'url';
import { merge, escapeRegExp } from 'lodash';




export default ({ rules = [], apps = {} } = {}) => {
  if (rules.length === 0) {
    return (req, res, next) => {
      next();
    };
  }

  // enhance matches configurations for general rules
  const baseEnhancedRules = enhanceRules(rules);

  const appsEnhancedRules = Object.keys(apps)
    .reduce((allAppRules, appKey) => ({
      ...allAppRules,
      [appKey]: enhanceRules(apps[appKey]),
    }), {});

  return (req, res, next) => {
    const { pathname } = url.parse(req.url);

    const keys = {
      host: req.hostname,
      path: pathname,
    };

    if (pathname === '/login' || pathname === '/logout') {
      keys.host = req.query.host.split(':')[0]; // ignore port
      keys.path = req.query.path;
    }

    // extract proxy rule based in the general configuration
    const baseProxyRule = filterAndCombineRules(baseEnhancedRules, keys);

    // extract the proxy rules based in the apps configurations
    req.proxyRule = Object.keys(appsEnhancedRules).reduce((proxyRule, appKey) => {
      const appRule = appsEnhancedRules[appKey];
      return filterAndCombineRules([ proxyRule, ...appRule ], keys);
    }, baseProxyRule);

    next();
  };
};


function enhanceRules (rules) {
  return rules.map(rule => {
    if (!rule.matches) return rule;

    Object.keys(rule.matches).forEach(key => {
      const { pattern, flags, value } = rule.matches[key];
      if (pattern) rule.matches[key] = new RegExp(pattern, flags);
      if (value) rule.matches[key] = new RegExp(`^${escapeRegExp(value)}$`);
    });
    return rule;
  });
}


function filterAndCombineRules (rules, values) {
  const filtered = rules
    .filter(rule => !rule.matches || matchValues(rule.matches, values));

  const result = {};
  for (const rule of filtered) {
    merge(result, rule);
    if (rule.proxy && rule.proxy.enabled) break;
    if (rule.password && rule.password.enabled) break;
  }

  return result;
}


function matchValues (matches, values) {
  return Object.keys(matches).every(
    key => matches[key].test(values[key])
  );
}
