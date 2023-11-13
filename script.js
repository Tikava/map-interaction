let map = document.getElementById('map');
const searchBttn = document.getElementById('search-button');

document.addEventListener('DOMContentLoaded', () => {

    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(handlePosition, handleError);
    } else {
        alert('Geolocation is not supported by your browser');
    }

    DG.then(() => {
        map = DG.map('map', {
            center: [54.98, 82.89],
            zoom: 15,
            animate: true
        });

        map.on('click', function (e) {
            const { lat, lng } = e.latlng;
            DG.marker([lat, lng]).addTo(map).bindPopup(`lat:${lat.toFixed(3)}; lng:${lng.toFixed(3)}`);
        })
    })

    function handlePosition(position) {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
    
        map.setView([userLat, userLng], 15);
    
        DG.marker([userLat, userLng]).addTo(map).bindPopup('You are here!');
    }
    
    function handleError(error) {
        console.warn(`ERROR(${error.code}): ${error.message}`);
        alert('Unable to retrieve your location');
    }

    searchBttn.addEventListener('click', () => {
        const cityName = document.getElementById('city-input').value;
        if (cityName) {
            const encodedCityName = encodeURIComponent(cityName);

            fetch(`https://api.api-ninjas.com/v1/city?name=${encodedCityName}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Key': 'xwJ0vGYCCNGT5U79npv/0w==XBWyvotSSYu8q1HW'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.length > 0 && data[0].latitude && data[0].longitude) {
                    const lat = data[0].latitude;
                    const lng = data[0].longitude;
                    map.setView([lat, lng], 15);
                } else {
                    alert("Couldn't find city :(")
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                alert('Failed to fetch data');
            });
        } else {
            alert('Empty input!');
        }
    });
});

