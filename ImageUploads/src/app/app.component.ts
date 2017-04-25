import { AngularFireModule, FirebaseObjectObservable, AngularFire, FirebaseListObservable } from 'angularfire2';
import { Component } from '@angular/core';
import * as firebase from 'firebase';

interface FeaturedPhotoUrls {
  url1?: string
  url2?: string
}

interface Photo {
  url: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public featuredPhotosStream: FirebaseObjectObservable<FeaturedPhotoUrls>
  public photoListStream: FirebaseListObservable<Photo[]>

  constructor(private af: AngularFire) {
    this.featuredPhotosStream = this.af.database.object("/photos/featured")
    this.photoListStream = this.af.database.list("/photos/list")
  }

  // featuredPhotoSelected(event: MSInputMethodContext) {
  //   const target : HTMLInputElement = <HTMLInputElement> event.target
  //   const files: FileList = target.files
  //   const file: File  = files[0]


  //   console.log("Selected File", file)
  // }

  featuredPhotoSelected(event: any, photoNumber: string) {
    const file: File  = event.target.files[0]

    const metadata = {"content-type": file.type}
    const storageRef: firebase.storage.Reference = firebase.storage().ref().child("photos").child("featured").child(photoNumber)
    const uploadTask : firebase.storage.UploadTask = storageRef.put(file, metadata)
    uploadTask.then((snapshot: firebase.storage.UploadTaskSnapshot) => {
      firebase.database().ref().child("photos").child("featured").child(photoNumber).set(snapshot.downloadURL)
    })

    console.log("Uploading", file.name)
  }

  photoSelectedForList(event: any){
    const nextAvailableKey = firebase.database().ref().child("photos").child("list").push({}).key
    const file: File  = event.target.files[0]
    const metadata = {"content-type": file.type}
    const storageRef: firebase.storage.Reference = firebase.storage().ref().child("photos").child("list").child(nextAvailableKey)
    const uploadTask : firebase.storage.UploadTask = storageRef.put(file, metadata)
    uploadTask.then((snapshot: firebase.storage.UploadTaskSnapshot) => {
      const photo: Photo = {url: snapshot.downloadURL}
      firebase.database().ref().child("photos").child("list").child(nextAvailableKey).set(photo)
    })
    console.log("Uploading", file.name)
  }

  triggerInput(input: HTMLInputElement) {
    input.click()
  }
}
