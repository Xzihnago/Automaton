/* eslint-disable @typescript-eslint/no-magic-numbers */
export type {};
declare global {
  interface Date {
    isValid: () => boolean;
    getTimeSeconds: () => number;
    toISODateString: () => string;
  }

  interface DateConstructor {
    getTimeSeconds: (date?: Date) => number;
    parseTime: (time: string, timezone?: number) => Date;
  }
}

Date.prototype.isValid = function () {
  return !isNaN(this.getTime());
};

Date.prototype.getTimeSeconds = function () {
  return Math.floor(this.getTime() / 1000);
};

Date.prototype.toISODateString = function () {
  return this.toISOString().split("T")[0];
};

Date.getTimeSeconds = (date = new Date()) => date.getTimeSeconds();

Date.parseTime = (raw: string, timezone = 0) => {
  const parseTimeRegex = {
    "(h)h:(m)m": / \d{1,2}:\d{1,2} /,
    "(h)hmm": / \d{3,4} /g, // using global match

    "(y)yyy-(m)m-(d)d | (m)m-(d)d-(yy)yy": / \d{1,4}[-./]\d{1,2}[-./]\d{1,4} /,
    "(m)m-(d)d": / \d{1,2}[-./]\d{1,2} /,
    "mmddyy | (y)yyymmdd": / \d{6,8} /,
    "(m)mdd": / \d{3,4} /,
  };

  raw = raw.trim();

  // Unix timestamp
  if (/^\d{13}$/.test(raw)) {
    return new Date(Number(raw));
  }

  if (/^\d{10}$/.test(raw)) {
    return new Date(Number(raw) * 1000);
  }

  // Data
  raw = ` ${raw.replace(" ", "  ")} `;
  const tzs = timezone >= 0 ? `UTC+${timezone}` : `UTC${timezone}`;
  const now = new Date();
  now.setUTCMinutes(now.getUTCMinutes() - now.getTimezoneOffset());

  // Native parse
  let res = new Date(`${raw} ${tzs}`);
  if (res.isValid() && res.getTime().between(0, 4102444800000 /* 2100-01-01 */)) {
    if (!parseTimeRegex["(y)yyy-(m)m-(d)d | (m)m-(d)d-(yy)yy"].test(raw)) {
      res.setUTCFullYear(now.getUTCFullYear()); // Fix for non-year date input
    }

    return res;
  }

  // Custom parse
  let dateOmitTime = raw;

  let time = raw.match(parseTimeRegex["(h)h:(m)m"])?.pop();
  if (!time) {
    time = raw.match(parseTimeRegex["(h)hmm"])?.pop();

    if (!time) {
      throw new TypeError(`Time not found: "${raw}"`);
    }

    dateOmitTime = raw.replace(time, "");

    time = time.trim();
    time = `${time.slice(0, -2)}:${time.slice(-2)}`;
  }

  let date = dateOmitTime.match(parseTimeRegex["(y)yyy-(m)m-(d)d | (m)m-(d)d-(yy)yy"])?.pop();
  if (!date) {
    date = dateOmitTime.match(parseTimeRegex["(m)m-(d)d"])?.pop();

    if (!date) {
      date = dateOmitTime.match(parseTimeRegex["mmddyy | (y)yyymmdd"])?.pop();

      if (!date) {
        date = dateOmitTime.match(parseTimeRegex["(m)mdd"])?.pop();
      }

      if (date) {
        date = date.trim();
        date = `${date.slice(0, -4) || now.getUTCFullYear()}-${date.slice(-4, -2)}-${date.slice(-2)}`;
      }
    } else {
      date = `${now.getUTCFullYear()}-${date}`;
    }

    if (!date) {
      date = now.toISODateString();
    }
  }

  res = new Date(`${date} ${time} ${tzs}`);
  if (!res.isValid()) {
    res = new Date(`${now.toISODateString()} ${time} ${tzs}`);

    if (!res.isValid()) {
      throw new TypeError(`Invalid date: "${raw}"`);
    }
  }

  return res;
};
