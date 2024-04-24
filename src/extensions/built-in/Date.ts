import "./Number";

declare global {
  interface Date {
    isValid: () => boolean;
    getTimeSeconds: () => number;
    toISODateString: () => string;
    wrap: (past?: boolean) => Date;
  }

  interface DateConstructor {
    getTimeSeconds: () => number;
    tryParse: (time: string, timezone?: number) => Date;
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

Date.prototype.wrap = function (past) {
  if (!this.isValid()) {
    return this;
  }

  const now = new Date();
  this.setFullYear(now.getFullYear());

  if (past) {
    if (this.getTime() > now.getTime()) {
      this.setFullYear(now.getFullYear() - 1);
    }
  } else {
    if (this.getTime() < now.getTime()) {
      this.setFullYear(now.getFullYear() + 1);
    }
  }

  return this;
};

Date.getTimeSeconds = () => Math.floor(Date.now() / 1000);

Date.tryParse = (raw: string, timezone = 0) => {
  const parseTimeRegex = {
    "yyyymmddhhmm": / \d{12} /,

    "(y)yyy-(m)m-(d)d | (m)m-(d)d-(yy)yy": / \d{1,4}[-./]\d{1,2}[-./]\d{1,4} /,
    "(m)m-(d)d": / \d{1,2}[-./]\d{1,2} /,
    "mmddyy | (y)yyymmdd": / \d{6,8} /,
    "(m)mdd": / \d{3,4} /,

    "(h)h:(m)m": / \d{1,2}:\d{1,2} /,
    "(h)hmm": / \d{3,4} /g, // using global match
  };

  let dateStr = raw
    .trim()
    .replace(/：/g, ":")
    .replace(/[^-./: \d]/g, "");

  if (!dateStr) {
    throw new TypeError(`Empty date: "${raw}"`);
  }

  // Unix timestamp
  if (/^\d{13}$/.test(dateStr)) {
    return new Date(Number(dateStr));
  }

  if (/^\d{10}$/.test(dateStr)) {
    return new Date(Number(dateStr) * 1000);
  }

  // Data
  dateStr = " " + dateStr.replace(" ", "  ") + " ";
  const tzs = timezone >= 0 ? `UTC+${timezone}` : `UTC${timezone}`;
  const now = new Date();
  now.setUTCMinutes(now.getUTCMinutes() - now.getTimezoneOffset());

  // Native parse
  let res = new Date(`${dateStr} ${tzs}`);
  if (
    res.isValid() &&
    res.getTime().between(0, 4102444800000 /* 2100-01-01 */)
  ) {
    if (!parseTimeRegex["(y)yyy-(m)m-(d)d | (m)m-(d)d-(yy)yy"].test(dateStr)) {
      res.setUTCFullYear(now.getUTCFullYear()); // Fix for non-year input
    }

    return res;
  }

  // Custom parse
  let time = dateStr.match(parseTimeRegex["(h)h:(m)m"])?.pop();
  if (!time) {
    time = dateStr.match(parseTimeRegex["(h)hmm"])?.pop();

    if (!time) {
      throw new TypeError(`Time not found: "${dateStr}"`);
    }

    dateStr = dateStr.replace(time, "");

    time = time.trim();
    time = `${time.slice(0, -2)}:${time.slice(-2)}`;
  }

  let date = dateStr
    .match(parseTimeRegex["(y)yyy-(m)m-(d)d | (m)m-(d)d-(yy)yy"])
    ?.pop();
  if (!date) {
    date = dateStr.match(parseTimeRegex["(m)m-(d)d"])?.pop();

    if (!date) {
      date = dateStr.match(parseTimeRegex["mmddyy | (y)yyymmdd"])?.pop();

      if (!date) {
        date = dateStr.match(parseTimeRegex["(m)mdd"])?.pop();
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
