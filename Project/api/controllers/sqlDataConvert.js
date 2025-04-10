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
        value: `Kaart ${CARD_ID}!${idCounter++}`,
        label: `Kaart ${CARD_ID}`
      });
  
      return acc;
    }, []);
  }
  