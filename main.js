const categoryColors = {
  Politics: 'blue',
  Environmental: 'green',
  Health: 'red',
  Finance: 'yellow',
  Conflict: 'black'
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