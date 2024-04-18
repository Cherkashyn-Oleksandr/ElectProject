export function convertArray(originalArray) {
    let result = [];
    let idCounter = 1; // Unique identifier counter


    // Create an object to hold temporary mappings
    let tempMap = {};

    // Iterate over the original array
    originalArray.forEach(item => {
        // Extract relevant properties
        let { Description, Area, Group } = item;
        let nodeId = `${Group} ${Area} (${idCounter++})`;

        // Check if Area already exists in tempMap
        if (!tempMap[Area]) {
            // If not, create a new object
            tempMap[Area] = {
                value: Area,
                label: Area,
                children: []
            };
            result.push(tempMap[Area]);
        }

        // Check if Group already exists in tempMap under the current Area
        let groupIndex = tempMap[Area].children.findIndex(child => child.label === Group);
        if (groupIndex === -1) {
            // If not, create a new object
            tempMap[Area].children.push({
                value: nodeId,
                label: Group,
                children: []
            });
            groupIndex = tempMap[Area].children.length - 1;
        }

        // Add the Description as a child under the current Group
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
    // Создаем объект для хранения результатов по каждой дате
    const result = {};

    // Проходим по исходному массиву и вычисляем разницу для каждой даты
    originalArray.forEach(item => {
        const date = new Date(item.time);
        const formattedDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
        const key = `${item.Area}-${item.Description}-${item.Group}:${formattedDate}`;
        const existingItem = result[key];
        
        // Если для текущей даты уже есть запись, вычисляем разницу и обновляем ее
        if (existingItem) {
            const difference = item.Realvalue - existingItem.Loendur;
            if (difference > 0) {
                existingItem.Loendur = item.Realvalue;
                existingItem.Difference += difference; // Изменяем сумму разницы
            }
        } else {
            // Иначе создаем новую запись для текущей даты
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

    // Проходим по результатам и учитываем разницу между последним значением предыдущего дня и первым значением текущего дня
    const dates = Object.keys(result);
    for (let i = 1; i < dates.length; i++) {
        const currentDate = result[dates[i]];
        const previousDate = result[dates[i - 1]];
        const difference = currentDate.StartLoendur - previousDate.Loendur;
        if (difference > 0) {
            currentDate.Difference += difference;
        }
        // Обновляем последнее значение предыдущего дня для следующей итерации
        
    }
    // Преобразуем объект результатов обратно в массив
    const convertedArray = Object.values(result);
    
    return convertedArray;
}
export function transformArray(originalArray) {
    const transformedArray = [];

    // Создаем объекты для каждой даты
    const dates = {};
    originalArray.forEach(item => {
        const date = item.Kuupaev;
        if (!dates[date]) {
            dates[date] = { Kuupaev: date };
        }
    });

    // Заполняем объекты данными по каждому Description для каждой даты
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

    // Преобразуем объекты в массив
    Object.values(dates).forEach(day => {
        transformedArray.push(day);
    });

    return transformedArray;
}