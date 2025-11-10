<script>
const categoryColors = {
  Politics: '#0004ffff',
  Environmental: '#0f962eff',
  Health: '#e74c3c',
  Finance: '#f1c40f',
  Conflict: '#000000ff'
};

const categoryMarkers = {
  Politics: [],
  Environmental: [],
  Health: [],
  Finance: [],
  Conflict: []
};

let allMarkers = []; // ✅ Track all markers globally

const defaultView = {
  center: [30.9375, 14.3754],
  zoom: 2.5
};

const map = L.map('map').setView(defaultView.center, defaultView.zoom);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

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

      if (!isNaN(lat) && !isNaN(lng) && categoryMarkers[category]) {
        const popupContent = `
          <strong>${title}</strong><br>
          <p>${description}</p>
          <a href="${link}" target="_blank">Read more</a>
        `;

        const marker = L.circleMarker([lat, lng], {
          radius: 8,
          color: color,
          fillColor: color,
          fillOpacity: 1
        }).bindPopup(popupContent);

        marker.addTo(map);
        categoryMarkers[category].push(marker);
        allMarkers.push(marker); // ✅ Track all markers
      }
    });

    // ✅ Add legend only after markers are loaded
    addLegend();
  }
});

function addLegend() {
  const legend = L.control({ position: 'bottomleft' });

  legend.onAdd = function (map) {
    const div = L.DomUtil.create('div', 'info legend');
    const categories = {
      Conflict: '#000000ff',
      Politics: '#0004ffff',
      Finance: '#f1c40f',
      Environmental: '#0f962eff',
      Health: '#e74c3c'
    };

    for (const [label, color] of Object.entries(categories)) {
      div.innerHTML += `
        <div style="cursor:pointer;" onclick="filterCategory('${label}')">
          <i style="background:${color}; width: 12px; height: 12px; display: inline-block; margin-right: 6px;"></i>
          ${label}
        </div>
      `;
    }

    div.innerHTML += `
      <div style="cursor:pointer; margin-top: 8px;" onclick="showAllPopups()">
        <strong>Show All</strong>
      </div>
    `;

    return div;
  };

  legend.addTo(map);
}

// Filtering functions
function filterCategory(selectedCategory) {
  allMarkers.forEach(marker => map.removeLayer(marker)); // remove all
  categoryMarkers[selectedCategory]?.forEach(marker => {
    marker.addTo(map);
    marker.openPopup(); // optional
  });
}

function showAllPopups() {
  map.setView(defaultView.center, defaultView.zoom);
  allMarkers.forEach(marker => {
    marker.addTo(map);
    marker.openPopup(); // optional 
    });
    console.log("Resetting map view to default");

}

</script>