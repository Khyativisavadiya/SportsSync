import bcrypt from "bcrypt";
import { users } from "../../config/mongoCollections.js";
import { ObjectId } from "mongodb";

let checkString = (strVal, varName) => {
  if (!strVal) throw `Error: You must supply a ${varName}!`;
  if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
  strVal = strVal.trim();
  if (strVal.length === 0)
    throw `Error: ${varName} cannot be an empty string or string with just spaces`;
  return strVal;
};

let checkId = (id, varName) => {
  if (!id) throw `Error: You must provide a ${varName}`;
  if (typeof id !== "string") throw `Error:${varName} must be a string`;
  id = id.trim();
  if (id.length === 0)
    throw `Error: ${varName} cannot be an empty string or just spaces`;
  if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
  return id;
};
let checkNumber = (numVal, varName) => {
  if (!numVal && numVal !== 0) throw `Error: You must supply a ${varName}!`;
  if (typeof numVal !== "number") {
    try {
      numVal = Number.parseInt(numVal);
    } catch (e) {
      throw `Error: Unable to convert ${varName} to number`;
    }
  }
  if (isNaN(numVal)) throw `Error: ${varName} is not a number.`;
  return numVal;
};

const helperMethodsForSports = {
  checkString(strVal, varName) {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    return strVal;
  },
};

const helperMethodsForClasses = {
  checkId(id, varName) {
    if (!id) throw `Error: You must provide a ${varName}`;
    if (typeof id !== "string") throw `Error:${varName} must be a string`;
    id = id.trim();
    if (id.length === 0)
      throw `Error: ${varName} cannot be an empty string or just spaces`;
    if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
    return id;
  },
  checkString(strVal, varName) {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    return strVal;
  },
  checkTime(time, varName) {
    time = this.checkString(time, varName);

    const hr_min = time.split(":");
    if (!hr_min || hr_min.length !== 2) throw `Error: Invalid ${varName}`;

    const hr = Number.parseInt(hr_min[0]);
    const min = Number.parseInt(hr_min[1]);
    if (isNaN(hr) || hr < 0 || hr > 24)
      throw `Error: Invalid hr for ${varName}`;
    if (isNaN(min) || min < 0 || min > 59)
      throw `Error: Invalid min for ${varName}`;

    return time;
  },
};

const helperMethodsForEvents = {
  checkString(strVal, varName) {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    return strVal;
  },
  checkNumber(numVal, varName) {
    if (!numVal && numVal !== 0) throw `Error: You must supply a ${varName}!`;
    if (typeof numVal !== "number") {
      try {
        numVal = Number.parseInt(numVal);
      } catch (e) {
        throw `Error: Unable to convert ${varName} to number`;
      }
    }
    if (isNaN(numVal)) throw `Error: ${varName} is not a number.`;
    return numVal;
  },

  checkId(id, varName) {
    if (!id) throw `Error: You must provide a ${varName}`;
    if (typeof id !== "string") throw `Error:${varName} must be a string`;
    id = id.trim();
    if (id.length === 0)
      throw `Error: ${varName} cannot be an empty string or just spaces`;
    if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
    return id;
  },
  checkEventName(name, varName) {
    name = checkString(name, varName);
    let newname = name;
    newname = newname.replace(/\s+/g, "");

    if (!/\D/.test(newname))
      throw `Error: ${varName} cannot only contain numbers`;

    return name;
  },
  checkCapacity(capacity, varName) {
    capacity = checkNumber(capacity, varName);
    if (capacity < 1) throw `Error: ${varName} should be greater than 1.`;
    return capacity;
  },

  checkDate(date, varName) {
    date = checkString(date, varName);

    const today = new Date();
    let yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    let inputDate = new Date(date);
    if (inputDate < yesterday) {
      throw new Error("Input date cannot be less than today's date.");
    }

    return date;
  },
  checkEventTime(time, varName) {
    time = checkString(time, varName);
    const hr_min = time.split(":");
    if (!hr_min || hr_min.length !== 2) throw `Error: Invalid ${varName}`;

    const hr = Number.parseInt(hr_min[0]);
    const min = Number.parseInt(hr_min[1]);
    if (isNaN(hr) || hr < 0 || hr > 24)
      throw `Error: Invalid hr for ${varName}`;
    if (isNaN(min) || min < 0 || min > 59)
      throw `Error: Invalid min for ${varName}`;

    return time;
  },
  checkTimeRange(start, end) {
    const s = new Date(`2000-01-01 ${start}`);
    const e = new Date(`2000-01-01 ${end}`);
    if (e <= s)
      throw `Error: Invalid Time Range. Start time cannot exceed end time.`;
  },
  checkURL(url, varName) {
    url = checkString(url, varName);

    const re_url = /[\/\S]+/g;
    if (!url.match(re_url))
      throw `Error: ${varName} is and invalid url or contains spaces.`;
    return url;
  },
  determineSlots(startTime, endTime) {
    const Slot1 = { start: "00:00", end: "08:00" };
    const Slot2 = { start: "08:00", end: "16:00" };
    const Slot3 = { start: "16:00", end: "23:59" };

    let slots = [];

    if (startTime >= endTime) {
      return slots;
    }
    if (endTime > Slot1.start && startTime < Slot1.end) {
      slots.push(1);
    }
    if (endTime > Slot2.start && startTime < Slot2.end) {
      slots.push(2);
    }
    if (endTime > Slot3.start && startTime < Slot3.end) {
      slots.push(3);
    }

    return slots;
  },
};

const helperMethodsForSportPlaces = {};

const helperMethodsForUsers = {
  checkId(id, varName) {
    if (!id) throw `Error: You must provide a ${varName}`;
    if (typeof id !== "string") throw `Error:${varName} must be a string`;
    id = id.trim();
    if (id.length === 0)
      throw `Error: ${varName} cannot be an empty string or just spaces`;
    if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
    return id;
  },

  checkString(strVal, varName) {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    return strVal;
  },

  checkName(name, varName) {
    name = this.checkString(name, varName);

    const re_name = /[a-zA-Z ]{2,25}/g;
    if (!name.match(re_name))
      throw `Error: ${varName} should be at least 2 characters long with a max of 25 characters`;

    return name;
  },

  checkEmail(email, varName) {
    email = this.checkString(email, varName);

    const re_email = /[\S]+@[\S]+\.[\S]+/g;
    if (!email.match(re_email)) throw `Error: invalid ${varName}`;

    return email.toLowerCase();
  },

  checkDateOfBirth(dateOfBirth, varName) {
    dateOfBirth = this.checkString(dateOfBirth, varName);

    const dob = new Date(dateOfBirth);
    if (!dob) throw `Error: Invalid ${varName}.`;

    const today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0
    let yyyy = today.getFullYear() - 13; // user shouldn't be less than 13 year-old

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    const minDate = new Date("1900-01-01");
    const maxDate = new Date(`${yyyy + "-" + mm + "-" + dd}`);

    if (dob < minDate || dob > maxDate)
      throw `Error: Invalid ${varName}. Make sure you're over 13 years old.`;

    return dateOfBirth;
  },

  checkContactNumber(contactNumber, varName) {
    contactNumber = this.checkString(contactNumber, varName);

    contactNumber = contactNumber.replace(" ", "");
    const re_contactNumber = /^[\d]{8,20}$/g;
    if (!contactNumber.match(re_contactNumber))
      throw `Error: ${varName} should contain only digits.`;
    return contactNumber;
  },

  checkGender(gender, varName) {
    gender = this.checkString(gender, varName);
    gender = gender.toLowerCase();

    const gender_domain = [
      "male",
      "female",
      "transgender",
      "non-binary",
      "prefer not to respond",
    ];

    if (!gender_domain.includes(gender)) throw `Error: invalid ${varName}`;

    return gender;
  },

  checkPassword(password, varName) {
    password = this.checkString(password, varName);

    const re_password = /[\S]{8,}/g;
    if (!password.match(re_password))
      throw `Error: ${varName} should be a minimum of 8 characters long`;

    const re_upper = /[A-Z]/g;
    if (!re_upper.test(password))
      throw `Error: ${varName} should contain at least one uppercase character`;

    const re_lower = /[a-z]/g;
    if (!re_lower.test(password))
      throw `Error: ${varName} should contain at least one lowercase character`;

    const re_specialChar = /[^a-zA-Z\d\s]/g;
    if (!re_specialChar.test(password))
      throw `Error: ${varName} should contain at least one special character`;

    return password;
  },

  async checkUsedEmail(email) {
    const userCollection = await users();
    const user = await userCollection.findOne({ email: email });
    if (user) throw "Error: Email address already been used.";
    return true;
  },

  async encryptPassword(password, sr = 10) {
    const saltRounds = sr;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  },

  async comparePassword(orig_pw, hashed_pw) {
    return await bcrypt.compare(orig_pw, hashed_pw);
  },
};

export {
  helperMethodsForUsers,
  helperMethodsForClasses,
  helperMethodsForEvents,
  helperMethodsForSportPlaces,
  helperMethodsForSports,
  checkId,
  checkString,
  checkNumber,
};
