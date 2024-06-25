import { AfterViewInit, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as L from 'leaflet';
import { LeafletService } from "../leaflet/leaflet.service";
import 'leaflet.markercluster';

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

  constructor(private leafletService: LeafletService) { }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = this.leafletService.initMap('map', {
      center: [0, 0],
      zoom: 2
    });

    const osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png");
    osm.addTo(this.map);

    const markers = L.markerClusterGroup();

    markers.addLayer(L.marker([47.3769, 8.5417]));
    markers.addLayer(L.marker([47.2769, 9.4417]));
    markers.addLayer(L.marker([47.4769, 9.6417]));
    // add more markers here...

    markers.addLayer(L.marker([46.5197, 8.5417]));
    markers.addLayer(L.marker([46.4197, 8.5417]));


    this.map.addLayer(markers);

  }
}
