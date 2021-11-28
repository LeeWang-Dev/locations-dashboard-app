
//export const BASE_URL = 'http://localhost:8080';

export const BASE_URL = 'https://jp-locations-dashboard.herokuapp.com';

export const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoibGVld2FuZ2RldiIsImEiOiJja2tnbDU2c2gwMHNvMndsdDF1d2pxNTQ2In0.zKeo06DtCh6fLifrbCZCFA';

export const DEFAULT_VIEWPORT = {
    longitude: 135.4159975,
    latitude: 34.6777192,
    zoom: 14
}

export const google = window.google;

export const DEFAULT_DATE = new Date('2021-11-24');

// mapbox gl poi-label layer category_en
export const categories = [
    'All Categories',
    'Bank',
    'Bar',
    'Cafe',
    'Gas Station',
    'Hospital Grounds',
    'Hotel',
    'Mall',
    'Marketplace',
    'Restaurant',
    'Shop',
    'Supermarket',
];

export const category_distances = [5, 10, 20, 50, 100, 200, 500];