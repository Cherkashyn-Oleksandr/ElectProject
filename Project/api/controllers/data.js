import cron from 'node-cron'
import nodemailer from 'nodemailer'

export function convertArray(originalArray) {
    let result = []
    let idCounter = 1; 
    let tempMap = {};
    
    originalArray.forEach(item => {
        // Extract relevant properties
        let { Description, Area, Group } = item;
        let nodeId = `${Group} ${Area}, ${idCounter++}`;
        //create new object if Area don't exists
        if (!tempMap[Area]) {
            tempMap[Area] = {
                value: Area,
                label: Area,
                children: []
            };
            result.push(tempMap[Area]);
        }
        // add new group to existing Area
        let groupIndex = tempMap[Area].children.findIndex(child => child.label === Group);
        if (groupIndex === -1) {
            tempMap[Area].children.push({
                value: nodeId,
                label: Group,
                children: []
            });
            groupIndex = tempMap[Area].children.length - 1;
        }
        // add new description to existing group
        let descriptionIndex = tempMap[Area].children[groupIndex].children.findIndex(child => child.label === Description);
        if(descriptionIndex === -1) {
        tempMap[Area].children[groupIndex].children.push({
            value: `${Description}, ${idCounter}`,
            label: Description
        });
    }
    });
    return result;
}
export function getArray(originalArray) {
    const result = {};
    // getting difference foreach date 
    originalArray.forEach(item => {
        const date = new Date(item._time);
        const formattedDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
        const key = `${item.Area}-${item.Description}-${item.Group}:${formattedDate}`;
        const existingItem = result[key];
        // adding difference if Loendur grow
        if (existingItem) {
            const difference = item.Realvalue - existingItem.Loendur;
            if (difference > 0) {
                existingItem.Loendur = item.Realvalue;
                existingItem.Difference += difference; 
            }
        } else {
            //create new object
            result[key] = {
                Area: item.Area,
                Description: item.Description, 
                Group: item.Group, 
                Kuupaev: formattedDate,
                Loendur: item.Realvalue,
                Difference: 0,
                StartLoendur: item.Realvalue
            };
        }
    });
    // get difference between last Loendur previous date and first Loendur next day
    const dates = Object.keys(result);
    for (let i = 1; i < dates.length; i++) {
        const currentDate = result[dates[i]];
        const previousDate = result[dates[i - 1]];
        const difference = currentDate.StartLoendur - previousDate.Loendur;
        if (difference > 0) {
            currentDate.Difference += difference;
        }
        //creating array
    }
    const convertedArray = Object.values(result);
    return convertedArray;
}
export function transformArray(originalArray) {
    const transformedArray = [];
    //creating object for every date
    const dates = {};
    originalArray.forEach(item => {
        const date = item.Kuupaev;
        if (!dates[date]) {
            dates[date] = { Kuupaev: date };
        }
    });
    // adding  data to object foreach description
    originalArray.forEach(item => {
        const date = item.Kuupaev;
        const descriptionKey = `${item.Area}/${item.Group}`;
        const descLoendur = `${item.Description} Loendur`;
        if (!dates[date][descriptionKey]) {
            dates[date][descriptionKey] = "";
        }
        dates[date][item.Description] = item.Difference;
        dates[date][descLoendur] = item.Loendur;
    });
    //creating array
    Object.values(dates).forEach(day => {
        transformedArray.push(day);
    });

    return transformedArray;
}
export function getHourlyArray(originalArray) {
    const result = {};

    // Getting difference for each hour
    originalArray.forEach(item => {
        const date = new Date(item._time);
        const formattedHour = `${date.getHours()}:00 ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
        const key = `${item.Area}-${item.Description}-${item.Group}:${date.getHours()}`;
        const existingItem = result[key];

        // Adding difference if Loendur grows
        if (existingItem) {
            const difference = item.Realvalue - existingItem.Loendur;
            if (difference > 0) {
                existingItem.Loendur = item.Realvalue;
                existingItem.Difference += difference;
            }
        } else {
            // Create new object
            result[key] = {
                Area: item.Area,
                Description: item.Description,
                Group: item.Group,
                Kuupaev: formattedHour,
                Loendur: item.Realvalue,
                Difference: 0,
                StartLoendur: item.Realvalue
            };
        }
    });

    // Get difference between last Loendur of previous hour and first Loendur of next hour
    const hours = Object.keys(result);
    for (let i = 1; i < hours.length; i++) {
        const currentHour = result[hours[i]];
        const previousHour = result[hours[i - 1]];
        const difference = currentHour.StartLoendur - previousHour.Loendur;
        if (difference > 0) {
            currentHour.Difference += difference;
        }
    }

    const convertedArray = Object.values(result);
    return convertedArray;
}

export function transformHourlyArray(originalArray) {
    const transformedArray = [];

    // Creating object for every hour
    const hours = {};
    originalArray.forEach(item => {
        const hour = item.Kuupaev;
        if (!hours[hour]) {
            hours[hour] = { Kuupaev: hour };
        }
    });

    // Adding data to object for each description
    originalArray.forEach(item => {
        const hour = item.Kuupaev;
        const descriptionKey = `${item.Area}/${item.Group}`;
        const descLoendur = `${item.Description} Loendur`;
        if (!hours[hour][descriptionKey]) {
            hours[hour][descriptionKey] = "";
        }
        hours[hour][item.Description] = item.Difference;
        hours[hour][descLoendur] = item.Loendur;
    });

    // Creating array
    Object.values(hours).forEach(hour => {
        transformedArray.push(hour);
    });

    return transformedArray;
}
/*let mailOptions = {
    from: 'oleks.cherkashyn@gmail.com',
    to: 'samsungmarvel2@gmail.com',
    subject: 'Email from Node-App: A Test Message!',
    text: 'Some content to send'
};

// e-mail transporter configuration
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'oleks.cherkashyn@gmail.com',
      pass: 'onqj ajcj wtwq xvus'
    }
});

cron.schedule('* * * * *', () => {
// Send e-mail
transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
});
});*/