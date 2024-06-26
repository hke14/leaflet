import {AfterViewInit, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import * as L from 'leaflet';
import {LeafletService} from "../leaflet/leaflet.service";
import 'leaflet.markercluster';
import {cantons} from './cantons';
import {orders} from "./orders";
import {booleanPointInPolygon, multiPolygon, point, polygon} from '@turf/turf';

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
    this.style = this.style.bind(this);
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
    return d > 6000 ? '#800026' :
      d > 4000 ? '#BD0026' :
        d > 2000 ? '#E31A1C' :
          d > 1000 ? '#FC4E2A' :
            d > 500 ? '#FD8D3C' :
              d > 200 ? '#FEB24C' :
                d > 100 ? '#FED976' :
                  '#FFEDA0';
  }

  style(feature: any) {
    let color = this.getColor(feature.properties.density);
    return {
      fillColor: color,
      weight: 5,
      opacity: 3,
      color: '#473a35',
      dashArray: '3',
      stroke: true,
      fillOpacity: 0.7
    };
  }

  async initMap() {
    this.map = this.leafletService.initMap('map', {
      center: [46.8131873, 8.22421],
      zoom: 17
    });

    const osm = L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png");
    osm.addTo(this.map);

    let orangeBorders = await this.fetchJSON('https://raw.githubusercontent.com/ZHB/switzerland-geojson/master/country/switzerland.geojson');
    // let dataCantons = await this.fetchJSON('https://gist.githubusercontent.com/cmutel/a2e0f2e48278deeedf19846c39cee4da/raw/c7469bb06f1e83c3e4f3c81b87f127f787685db0/cantons.geojson');

    for (const o of orders) {
      for (const f of cantons.features) {
        let insidePolygon = this.isInsidePolygon(o.LATITUDE, o.LONGITUDE, f);
        if (insidePolygon) {
          f.properties.density = f.properties.density ? f.properties.density + 1 : 1;
          break
        }
        f.properties.density = f.properties.density ? f.properties.density : 0;
      }
    }

    L.geoJson(cantons, {style: this.style}).addTo(this.map);

    // Create a GeoJSON layer and add it to the map
    const geoJsonLayer = L.geoJson(orangeBorders, {style: this.style}).addTo(this.map);

    // Use the fitBounds method to zoom to Switzerland
    const bounds = geoJsonLayer.getBounds();
    this.map.fitBounds(bounds);

    // const myIcon = L.icon({
    //   iconUrl: 'assets/migrospin.png',
    //   iconSize: [30, 30], // size of the icon
    //   iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    //   popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    // });


    // Adding orders
    var greenIcon = L.icon({
      iconUrl: 'https://www.iconpacks.net/icons/1/free-pin-icon-48-thumb.png',
      // shadowUrl: 'https://www.iconpacks.net/icons/1/free-pin-icon-48-thumb.png',

      iconSize:     [38, 95], // size of the icon
      // shadowSize:   [50, 64], // size of the shadow
      iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      // shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    const markers = L.markerClusterGroup();
    orders.forEach((o) => {
      markers.addLayer(L.marker([o.LATITUDE, o.LONGITUDE], {icon: greenIcon}));
    });
    this.map.addLayer(markers);

  }

  isInsidePolygon(lat: number, lng: number, f: any) {
    console.log(f)
    if (lat && lng) {
      const pt = point([lng, lat]);
      let poly;
      if (f.geometry.type === 'MultiPolygon') {
        const multiPoly = multiPolygon(f.geometry.coordinates);
        return multiPoly.geometry.coordinates.some(polygonCoords => {
          const poly = polygon(polygonCoords);
          return booleanPointInPolygon(pt, poly);
        });
      } else {
        poly = polygon(f.geometry.coordinates);
        return booleanPointInPolygon(pt, poly)
      }
    } else {
      return false;
    }
  }
}
