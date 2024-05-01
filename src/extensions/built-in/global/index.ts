/* eslint-disable no-var */
import _isErrnoException from "./isErrnoException";
import _i18nWrapper from "./i18nWrapper";
import _wait from "./wait";
import _deepFreeze from "./deepFreeze";

import _logger from "./logger";

declare global {
  var isErrnoException: typeof _isErrnoException;
  var deepFreeze: typeof _deepFreeze;
  var wait: typeof _wait;
  var i18nWrapper: typeof _i18nWrapper;

  var logger: typeof _logger;
}

global.isErrnoException = _isErrnoException;
global.deepFreeze = _deepFreeze;
global.wait = _wait;
global.i18nWrapper = _i18nWrapper;

global.logger = _logger;
