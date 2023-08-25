import { readFileSync } from 'fs';
import { parse } from 'csv';

const fileContents = readFileSync('./data/eu-generation/marriage.csv', 'utf8');

const parseAsync = async (fileContents) => {
    return new Promise((resolve, reject) => {
        parse(fileContents, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}


const data = await parseAsync(fileContents);
// The header row contains the column names
const headers = data[0];

// Extract the indices of the necessary columns
const geoIndex = headers.indexOf('GEO');
const valueIndex = headers.indexOf('VALUE');
const lmsIndex = headers.indexOf('LMS');
const ageIndex = headers.indexOf('AGE');

// Initialize an object to hold the sums for each GEO value
const countries = {
};

const correct_status_mapping = {
    "DISREP": "dissolved",
    "MAR": "married",
    "DIV": "divorced",
    "DTHREP": "registered Partner Died",
    "UNK": "unknown",
    "REP": "registered Partnership",
    "SIN": "never Married",
    "WID": "widowed",
    "TOTAL": "total"
}

// Iterate through the data starting from the first row (skipping the header row)
for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const geo = row[geoIndex];
    const value = row[valueIndex];
    const lms = row[lmsIndex];
    const age = row[ageIndex];

    // Convert the value to a number if it's not a special character like ':'
    const numericValue = isNaN(value) ? 0 : +value;
    if (age !== "TOTAL") continue;
    // If the GEO value is already in the sums object, add to it, otherwise initialize it
    if (countries[geo]) {
        if (countries[geo]["marriage-status"][correct_status_mapping[lms]]) {
            countries[geo]["marriage-status"][correct_status_mapping[lms]] += numericValue;
        }
        else {
            countries[geo]["marriage-status"][correct_status_mapping[lms]] = numericValue;
        }
    } else {
        countries[geo] = {
            "marriage-status": {
                [correct_status_mapping[lms]]: numericValue
            }
        }
    }
}
for (let country of Object.keys(countries)) {
    for (let status of Object.keys(countries[country]["marriage-status"])) {
        if (status === "total") continue;
        countries[country]["marriage-status"][status] =
            countries[country]["marriage-status"][status] / countries[country]["marriage-status"]["total"];
    }
    delete countries[country]["marriage-status"]["total"]
}
console.log(countries);