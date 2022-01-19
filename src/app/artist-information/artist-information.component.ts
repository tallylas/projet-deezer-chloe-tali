import { Component, OnInit } from '@angular/core';
import { IArtist } from 'src/Interfaces/IArtist';
import { ActivatedRoute, Router } from '@angular/router';
import { IAlbum } from 'src/Interfaces/iAlbum';
import { forkJoin } from 'rxjs';
import { ITrack } from 'src/Interfaces/iTrack';
import {ArtistsService} from "../artists.service";

@Component({
  selector: 'app-artist-information',
  templateUrl: './artist-information.component.html',
  styleUrls: ['./artist-information.component.scss']
})
export class ArtistInformationComponent implements OnInit {

  artist: IArtist | undefined;
  albums: IAlbum[] = [];
  tracks: ITrack[] = [];
  errorMessage: string = "";
  constructor(
    private artistsService: ArtistsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const param = this.route.snapshot.paramMap.get('id');
    if (param) {
      const id = +param;
      this.GetArtistDetails(id);
    }
  }
  GetArtistDetails(id: number) {
    forkJoin([
      this.artistsService.getArtist(id),
      this.artistsService.getAlbums(id),
      this.artistsService.getTopTracks(id)
    ])
      .pipe()
      .subscribe({
        next: Results => {
          (this.artist = Results[0]),
            (this.albums = Results[1]),
            (this.tracks = Results[2]);
        },
        error: err => (this.errorMessage = err)
      });
  }
  onBack(): void {
    this.router.navigate(['/artist']);
  }

}