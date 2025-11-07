const categoryColors = {
  Politics: '#0004ffff',
  Environmental: '#0f962eff',
  Health: '#e74c3c',
  Finance: '#f1c40f',
  Conflict: '#000000ff'
};

Papa.parse("Global Affairs.csv", {
  download: true,
  header: true,
  complete: function(results) {
    results.data.forEach(row => {
      const lat = parseFloat(row.Latitude);
      const lng = parseFloat(row.Longitude);
      const category = row.Category?.trim();
      const color = categoryColors[category] || 'gray';

      const title = row.popupText || "Unknown location";
      const description = row.Description || "";
      const link = row["News Link"] || "#";

      if (!isNaN(lat) && !isNaN(lng)) {
        const popupContent = `
          <strong>${title}</strong><br>
          <p>${description}</p>
          <a href="${link}" target="_blank">Read more</a>
        `;
        L.circleMarker([lat, lng], {
          radius: 8,
          color: color,
          fillColor: color,
          fillOpacity: 1
        }).addTo(map).bindPopup(popupContent);
      }
    });
  }
});

const legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
  const div = L.DomUtil.create('div', 'info legend');
  const categories = {
    'Conflict': '#000000ff',
    'Politics': '#0004ffff',
    'Finance': '#f1c40f',
    'Environment': '#0f962eff',
    'Health':'#e74c3c',
  };

  for (const [label, color] of Object.entries(categories)) {
    div.innerHTML += `
      <i style="background:${color}; width: 12px; height: 12px; display: inline-block; margin-right: 6px;"></i>
      ${label}<br>
    `;
  }

  return div;
};

legend.addTo(map);

