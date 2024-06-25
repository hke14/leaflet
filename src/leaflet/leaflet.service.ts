import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import {TileLayerOptions} from "leaflet";
import {Feature} from "geojson";

@Injectable({
  providedIn: 'root'
})
export class LeafletService {

  // private map?: L.Map;

  constructor() { }

  initMap(id: string, options: L.MapOptions): L.Map {
    return L.map(id, options);
  }

  // addMarker(coords: L.LatLngExpression, options?: L.MarkerOptions): L.Marker | undefined{
    // if(this.map) {
    //   return L.marker(coords, options).addTo(this.map);
    // }
    // return undefined;
  // }

  // tileLayer(layer: string, tileLayerOptions: TileLayerOptions) {
  //   return new L.TileLayer(layer,
  //   tileLayerOptions);
  // }

  // zoomToCountry(map: L.Map, countryName: string): void {
  //   fetch('/world.json')
  //     .then(response => response.json())
  //     .then((geoJSONdata: any) => {
  //       const geoJSONgroup = L.geoJSON(geoJSONdata).addTo(map);
  //
  //       geoJSONgroup.eachLayer((layer: L.Layer) => {
  //         if (layer instanceof L.GeoJSON) {
  //           const feature = layer.feature as Feature;
  //           if (feature.properties?.name === countryName) {
  //             map.fitBounds(layer.getBounds());
  //           }
  //         } && layer.feature?.properties.name === countryName) {
  //         }
  //       });
  //     })
  //     .catch(error => {
  //       console.error('Error fetching GeoJSON data:', error);
  //     });
  // }

}
