/* eslint-disable no-var */
import _isErrnoException from "./isErrnoException";
import _deepFreeze from "./deepFreeze";
import _i18nWrapper from "./i18nWrapper";
import _makeForm from "./makeForm";

import * as _Markdown from "./Markdown";
import _logger from "./logger";

declare global {
  var isErrnoException: typeof _isErrnoException;
  var i18nWrapper: typeof _i18nWrapper;
  var deepFreeze: typeof _deepFreeze;
  var makeForm: typeof _makeForm;

  var logger: typeof _logger;
  var Markdown: typeof _Markdown;
}

global.isErrnoException = _isErrnoException;
global.deepFreeze = _deepFreeze;
global.i18nWrapper = _i18nWrapper;
global.makeForm = _makeForm;

global.logger = _logger;
global.Markdown = _Markdown;
