export function prepTree(data) {
    var idCounter = 0
    return data.reduce((acc, { STATION_ADDRESS, FIRM_NAME, CARD_ID }) => {
      let station = acc.find(item => item.label === STATION_ADDRESS);
      if (!station) {
        station = { value: `${STATION_ADDRESS}!${idCounter++}`, label: STATION_ADDRESS, children: [] };
        acc.push(station);
      }

      let firm = station.children.find(item => item.label === FIRM_NAME);
      if (!firm) {
        firm = { value: `${FIRM_NAME}!${idCounter++}`, label: FIRM_NAME, children: [] };
        station.children.push(firm);
      }
  
      firm.children.push({
        value: `${CARD_ID}!${STATION_ADDRESS}`,
        label: `Kaart ${CARD_ID}`
      });
  
      return acc;
    }, []);
  };

  export function prepData(data) {
    const allData = data.map(item => ({
      ...item,
      KUUPAEV: item.KUUPAEV.trim(),
      KOGUS: Math.round(item.KOGUS * 10) / 10
    }));
  
    const uniqueKey = item => `${item.FIRMA}|${item.KAARDI_NUMBER}|${item.KUUPAEV}`;
    const seen = new Set();
    const Data = allData.filter(item => {
      const key = uniqueKey(item);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  
    const grouped = {};
    for (const item of Data) {
      if (!grouped[item.FIRMA]) grouped[item.FIRMA] = [];
      grouped[item.FIRMA].push(item);
    }
  
    const result = [];
    let grandTotal = 0;
  
    for (const firma in grouped) {
      const items = grouped[firma];
      items.sort((a, b) => new Date(a.KUUPAEV) - new Date(b.KUUPAEV));
  
      let subTotal = 0;
      for (const item of items) {
        result.push({
          FIRMA: item.FIRMA,
          'KAARDI NUMBER': item.KAARDI_NUMBER,
          OBJEKT: item.OBJEKT,
          KUUPAEV: item.KUUPAEV,
          KOGUS: item.KOGUS
        });
        subTotal += item.KOGUS;
      }
  
      result.push({
        FIRMA: '',
        'KAARDI NUMBER': '',
        OBJEKT: '',
        KUUPAEV: 'Kokku',
        KOGUS: Math.round(subTotal * 10) / 10
      });
  
      result.push({
        FIRMA: '',
        'KAARDI NUMBER': '',
        OBJEKT: '',
        KUUPAEV: '',
        KOGUS: ''
      });
  
      grandTotal += subTotal;
    }
  
    result.push({
      FIRMA: '',
      'KAARDI NUMBER': '',
      OBJEKT: '',
      KUUPAEV: 'Kokku',
      KOGUS: Math.round(grandTotal * 10) / 10
    });
  
    return result;
  }