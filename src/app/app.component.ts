import {AfterViewInit, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import * as L from 'leaflet';
import {LeafletService} from "../leaflet/leaflet.service";
import 'leaflet.markercluster';
import {orders} from "./orders";
import { HttpClient } from '@angular/common/http';
import {Feature} from "geojson";

// import * as j from '../assets/switzerland.geojson';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', '../../node_modules/leaflet/dist/leaflet.css'],
  providers: [LeafletService]
})
export class AppComponent implements AfterViewInit {
  private map: L.Map;

  constructor(private leafletService: LeafletService, private http: HttpClient) {
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  fetchJSON(url: string) {
    return fetch(url).then(function (response) {
      return response.json();
    });
  }

  getColor(d: number) {
    return d > 1000 ? '#800026' :
      d > 500 ? '#BD0026' :
        d > 200 ? '#E31A1C' :
          d > 100 ? '#FC4E2A' :
            d > 50 ? '#FD8D3C' :
              d > 20 ? '#FEB24C' :
                d > 10 ? '#FED976' :
                  '#FFEDA0';
  }

  style(feature: any) {
    return {
      // fillColor: '#BD0026',
      weight: 5,
      opacity: 3,
      color: '#F60',
      dashArray: '3',
      stroke: true,
      fillOpacity: 0,
    };
  }

  async initMap() {
    this.map = this.leafletService.initMap('map', {
      center: [46.8131873, 8.22421],
      zoom: 17
    });

    const osm = L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png");
    osm.addTo(this.map);

    let data = await this.fetchJSON('https://raw.githubusercontent.com/ZHB/switzerland-geojson/master/country/switzerland.geojson');

    const geojsonPath = '/assets/cantons.geojson'; // Path to your local GeoJSON file

    this.http.get(geojsonPath).subscribe((data: any) => {
      L.geoJSON(data).addTo(this.map!);
    }, err => console.error(err));

    // Create a GeoJSON layer and add it to the map
    const geoJsonLayer = L.geoJson(data, {style: this.style}).addTo(this.map);

    // Get the bounds of the GeoJSON layer
    const bounds = geoJsonLayer.getBounds();

    // Use the fitBounds method to zoom to Switzerland
    this.map.fitBounds(bounds);

    const markers = L.markerClusterGroup();
    orders.forEach((o) => {
      markers.addLayer(L.marker([o.LATITUDE, o.LONGITUDE]));
    });
    this.map.addLayer(markers);

  }
}
