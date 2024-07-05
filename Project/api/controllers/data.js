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
            value: `${Description}, ${Group}`,
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
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const formattedDate = `${day}.${month}.${date.getFullYear()}`;
        const key = `${item.Area}-${item.Description}-${item.Group}`;
        

        if (!result[key]) {
            result[key] = {};
        }

        const existingItem = result[key][formattedDate];

        // adding difference if Loendur grow
        if (existingItem) {
            const difference = item.Realvalue - existingItem.Loendur;
            if (difference > 0) {
                existingItem.Loendur = item.Realvalue;
                existingItem.Difference += difference; 
            }
        } else {
            // create new object
            result[key][formattedDate] = {
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
    const finalResult = [];
    Object.keys(result).forEach(key => {
        const dates = Object.keys(result[key]).sort((a, b) => new Date(a.split(":")[1]) - new Date(b.split(":")[1]));
        for (let i = 0; i < dates.length; i++) {
            const currentDate = result[key][dates[i]];
            if (i > 0) {
                const previousDate = result[key][dates[i - 1]];
                const difference = currentDate.StartLoendur - previousDate.Loendur;
                if (difference > 0) {
                    currentDate.Difference += difference;
                }
            }
            finalResult.push(currentDate);
        }
    });

    return finalResult;
}
export function transformArray(originalArray) {
    const transformedArray = [];
    const dates = {};

    // Create new object for date
    originalArray.forEach(item => {
        const date = item.Kuupaev;
        if (!dates[date]) {
            dates[date] = { Kuupaev: date };
        }
    });

    // collect unique Area & Group
    const uniqueGroupAreas = Array.from(new Set(originalArray.map(item => `${item.Area}/${item.Group}`)));

    // Add object for each unique Area & Group
    originalArray.forEach(item => {
        const date = item.Kuupaev;
        const groupAreaKey = `${item.Area} ${item.Group}`;
        const groupDescriptionKey = `${item.Group}-${item.Description}`;

        // groupAreaKey is ok
        if (!dates[date][groupAreaKey]) {
            dates[date][groupAreaKey] = '';
        }
        // round data
        const differenceRound = item.Difference - Math.floor(item.Difference)
        const loendurRound = item.Loendur - Math.floor(item.Loendur)

        if (differenceRound < 0.5 && loendurRound < 0.5) {
            dates[date][groupDescriptionKey] = `${Math.round(item.Difference)} (${Math.round(item.Loendur)})`;
        } else if (differenceRound >= 0.5 && loendurRound < 0.5) {
            dates[date][groupDescriptionKey] = `${Math.round(item.Difference * 10) / 10} (${Math.round(item.Loendur)})`;
        } else if (differenceRound >= 0.5 && loendurRound >= 0.5) {
            dates[date][groupDescriptionKey] = `${Math.round(item.Difference * 10) / 10} (${Math.round(item.Loendur * 10) / 10})`;
        } else {
            dates[date][groupDescriptionKey] = `${Math.round(item.Difference)} (${Math.round(item.Loendur * 10) / 10})`;
        }
    });

    // create array
    Object.keys(dates).forEach(dateKey => {
        const day = dates[dateKey];
        const orderedDay = { Kuupaev: day.Kuupaev };

        uniqueGroupAreas.forEach(groupArea => {
            const areaGroupKey = groupArea;

            // areaGroupKey is ok
            if (!day[areaGroupKey]) {
                orderedDay[areaGroupKey] = '';
            }

            // add keys with loendur
            Object.keys(day).forEach(key => {
                if (key.startsWith(groupArea.split('/')[1])) {
                    orderedDay[key] = day[key];
                }
            });
        });

        transformedArray.push(orderedDay);
    });
    return transformedArray;
}
export function getHourlyArray(originalArray) {
    const result = {};

    // Getting difference for each hour
    originalArray.forEach(item => {
        const date = new Date(item._time);
        const hour = date.getHours().toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const formattedHour = `${hour}:00 ${day}.${month}.${year}`;
        const key = `${item.Area}-${item.Description}-${item.Group}`;

        if (!result[key]) {
            result[key] = {};
        }

        const existingItem = result[key][formattedHour];

        // Adding difference if Loendur grows
        if (existingItem) {
            const difference = item.Realvalue - existingItem.Loendur;
            if (difference > 0) {
                existingItem.Loendur = item.Realvalue;
                existingItem.Difference += difference;
            }
        } else {
            // Create new object
            result[key][formattedHour] = {
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
    const finalResult = [];
    Object.keys(result).forEach(key => {
        const hours = Object.keys(result[key]).sort((a, b) => new Date(a.split(" ")[1].split(".").reverse().join("-") + ' ' + a.split(" ")[0]) - new Date(b.split(" ")[1].split(".").reverse().join("-") + ' ' + b.split(" ")[0]));
        console.log(result[key])
        for (let i = 0; i < hours.length; i++) {
            const currentHour = result[key][hours[i]];
            if (i > 0) {
                const previousHour = result[key][hours[i - 1]];
                const difference = currentHour.StartLoendur - previousHour.Loendur;
                if (difference > 0) {
                    currentHour.Difference += difference;
                }
            }
            finalResult.push(currentHour);
        }
    });

    return finalResult;
}
export function splitArray(strings) {
    const result = [];

    strings.forEach(string => {
        const [Description, Group] = string.split(', ');
        result.push({ Group, Description });
    });

    return result;
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