document.addEventListener("DOMContentLoaded", () => {
    mapboxgl.accessToken = mapToken;
    
    const map = new mapboxgl.Map({
      container: 'map',
      center: listing.geometry.coordinates,
      zoom: 9
    });
  
    // Create a popup with sun icon
    const popup = new mapboxgl.Popup({ color:"red",offset: 25 }).setHTML(`
      <h4 style="display: flex; align-items: center; gap: 8px;">
        <i class="fas fa-sun" style="color: orange;"></i> ${listing.location}
      </h4>
      <p>Exact location provided after booking.</p>
    `);
  
    // Create a marker and set the popup
    new mapboxgl.Marker()
      .setLngLat(listing.geometry.coordinates)
      .setPopup(popup)
      .addTo(map);
  });
  