function geocode(location) {
    const bingMapsKey = 'AuK2Azrt3w9gxRMlMrgjzXZ0f2to9NbfewreFM1qp_nVcPKgcJZCWj_AC5gdRfX9';
    const geocodeUrl = `https://dev.virtualearth.net/REST/v1/Locations?q=${encodeURIComponent(location)}&key=${bingMapsKey}`;
    return fetch(geocodeUrl)
      .then(response => response.json())
      .then(data => {
        const resourceSets = data.resourceSets || [];
        const resources = resourceSets[0].resources || [];
        if (resources.length > 0) {
          const point = resources[0].point || {};
          return { latitude: point.coordinates[0], longitude: point.coordinates[1] };
        } else {
          throw new Error('Location not found');
        }
      });
  }
  
  const form = document.querySelector('form');
  const locationInput = document.querySelector('#location-input');
  
  form.addEventListener('submit', event => {
    event.preventDefault();
    const location = locationInput.value;
    geocode(location)
      .then(({ latitude, longitude }) => {
        redirectToMap(location);
      })
      .catch(error => {
        console.error(`Error geocoding location '${location}': ${error.message}`);
      });
  });
  