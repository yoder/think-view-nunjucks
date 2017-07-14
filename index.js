/*
* @Author: lushijie
* @Date:   2017-03-10 09:38:38
* @Last Modified by:   lushijie
* @Last Modified time: 2017-07-14 17:42:02
*/
const helper = require('think-helper');
const nunjucks = require('nunjucks');

/**
 * default options for nunjucks
 * all available options via https://mozilla.github.io/nunjucks/api.html#configure
 */
const defaultOptions = {
  autoescape: true,
  watch: false,
  noCache: false,
  throwOnUndefined: false
};

/**
 * nunjucks view adapter
 */
class Nunjucks {
  /**
   * constructor
   * @param {String} viewFile view file, an absolute file path
   * @param {Object} viewData view data for render file
   * @param {Object} config options for nunjucks
   */
  constructor(viewFile, viewData, config) {
    this.viewFile = viewFile;
    this.viewData = viewData;
    this.config = helper.extend({}, defaultOptions, config);
  }
  /**
   * render view file
   */
  render() {
    let env;
    const viewPath = this.config.viewPath;

    const viewFile = this.viewFile;
    if (viewFile.indexOf(viewPath) !== 0) {
      env = nunjucks.configure(this.config);
    } else {
      env = nunjucks.configure(viewPath, this.config);
    }

    const beforeRender = this.config.beforeRender;
    if (beforeRender) {
      beforeRender(env, nunjucks, this.config);
    }

    const fn = helper.promisify(env.render, env);
    return fn(viewFile, this.viewData);
  }
}

module.exports = Nunjucks;
