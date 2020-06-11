const cordObj = {};

// locate lat/lon
(function locationAPIS() {
  if ('geolocation' in navigator) {
    document.getElementById('myH1').textContent = 'Gelocation Notes';
    // call api
    navigator.geolocation.getCurrentPosition(success);
  } else {
    document.getElementById('myH1').textContent = 'Geolocation is not Enabled. Reload and accept to continue';
  }
}());

// success calls map init
async function success(pos) {
  cordObj.lat = await pos.coords.latitude.toFixed(4);
  cordObj.lon = await pos.coords.longitude.toFixed(4);
  mapInit();
}
// create map and show all markers in db
async function mapInit() {
  // add locate user funcntion geolocation
  const mymap = L.map('map').setView([cordObj.lat, cordObj.lon], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mymap);
  // show all current markers
  const url = '/show';
  const data = await fetch(url);
  const locationData = await data.json();
  // add markers
  for (let idx = 0; idx < locationData.length; idx++) {
    const m = L.marker([parseFloat(locationData[idx].lat), parseFloat(locationData[idx].lon)]).addTo(mymap).bindPopup(locationData[idx].note).openPopup();
    m._icon.id = locationData[idx]._id;
  }
  mymap.setView([cordObj.lat, cordObj.lon], 12);
}

// add data to db
async function addData() {
    const note = document.getElementById('note').value;

    if (cordObj.lastClicked != null){
        console.log(cordObj.lastClicked);
        cordObj.note = note;
        const id = cordObj.lastClicked;
        const userInfo = {id, note};
        console.log(userInfo)

        const options = {
            method: 'POST',
            body: JSON.stringify(userInfo),
            headers: {
              'Content-Type': 'application/json',
            },
          };
        const a = await fetch('/update', options);

    }else{
        console.log('add data clicked')
        console.log(cordObj)
        cordObj.note = note;
        const url = `location/${cordObj.lat}/${cordObj.lon}/${cordObj.note}`;
        const resp = await fetch(url);
        console.log('add data done');
    }
};

// edit data


// add path to edit/del
document.body.addEventListener('click', (evt) => {
    if (evt.target.className === 'leaflet-marker-icon leaflet-zoom-animated leaflet-interactive') {
      console.log(evt.target.id);
      cordObj.lastClicked = evt.target.id;
      document.getElementById('form-lable').textContent = 'Write a new responses or delete';
      document.getElementById('form-id').style.backgroundColor = '#bfd0d9';
    }
  }, false);

// changes visual of form
function changeForm() {
  if (document.getElementById('form-lable').textContent === 'Write a new responses or delete') {
    document.getElementById('form-lable').textContent = 'Add Your Location Information';
    document.getElementById('form-id').style.backgroundColor = '#eceeef';
  } else {
    document.getElementById('form-lable').textContent = 'Write a new responses or delete';
    document.getElementById('form-id').style.backgroundColor = '#bfd0d9';
  }
  return false;
}


document.getElementById('form-button').addEventListener('click', addData);
document.getElementById('change-form-button').addEventListener('click', changeForm);