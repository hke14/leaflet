import {AfterViewInit, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import * as L from 'leaflet';
import {LeafletService} from "../leaflet/leaflet.service";
import 'leaflet.markercluster';
import { cantons } from './cantons';
import {orders} from "./orders";
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

  constructor(private leafletService: LeafletService) {
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
      fillOpacity: 0
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
    // let dataCantons = await this.fetchJSON('https://gist.githubusercontent.com/cmutel/a2e0f2e48278deeedf19846c39cee4da/raw/c7469bb06f1e83c3e4f3c81b87f127f787685db0/cantons.geojson');

    L.geoJSON(cantons).addTo(this.map!);

    // Create a GeoJSON layer and add it to the map
    const geoJsonLayer = L.geoJson(data, {style: this.style}).addTo(this.map);
    // L.geoJson(data, {style: this.style}).addTo(this.map);

    // Get the bounds of the GeoJSON layer
    const bounds = geoJsonLayer.getBounds();

    // Use the fitBounds method to zoom to Switzerland
    this.map.fitBounds(bounds);

    const myIcon = L.icon({
      iconUrl: 'assets/migrospin.png',
      iconSize: [30, 30], // size of the icon
      iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
      popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    const markers = L.markerClusterGroup();
    orders.forEach((o) => {
      markers.addLayer(L.marker([o.LATITUDE, o.LONGITUDE]));
    });
    this.map.addLayer(markers);

  }
}
