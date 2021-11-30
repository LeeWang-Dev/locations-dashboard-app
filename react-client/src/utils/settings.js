
//export const BASE_URL = 'http://localhost:8080';

export const BASE_URL = 'https://jp-locations-dashboard.herokuapp.com';

export const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoibGVld2FuZ2RldiIsImEiOiJja2tnbDU2c2gwMHNvMndsdDF1d2pxNTQ2In0.zKeo06DtCh6fLifrbCZCFA';

export const DEFAULT_VIEWPORT = {
    longitude: 135.4159975,
    latitude: 34.6777192,
    zoom: 15
}

export const google = window.google;

export const DEFAULT_DATE = new Date('2021-08-26');

// mapbox gl poi-label layer maki field
export const categories = [
   'All Categories',
   'Bank',   
   'Bar',
   'Cafe',
   'Golf',
   'Grocery',
   'Hospital',
   'Park',
   'Restaurant',
   'School',
   'Shop',
   'Stadium',
   'Station',
   'Theatre'
];

export const category_distances = [5, 10, 20, 50, 100, 200, 500];