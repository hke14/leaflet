import { Injectable } from '@angular/core';
import * as L from 'leaflet';
@Injectable({
  providedIn: 'root'
})
export class GeoJsonService {

  fetchGeoJSON(url: string): Promise<L.GeoJSON> {
    return new Promise<L.GeoJSON>((resolve, reject) => {
      fetch(url)
        .then(response => response.json())
        .then(geoJSON => {
          const tzLayer = L.geoJSON(geoJSON);
          resolve(tzLayer);
        })
        .catch(error => {
          reject(`Error fetching GeoJSON: ${error}`);
        });
    });
  }
}
