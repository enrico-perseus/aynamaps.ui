import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LocationService } from '../../../../../components/auth/location.service';

@Component({
  selector: '[app-category-item]',
  templateUrl: './category-item.component.html',
  styleUrls: ['./category-item.component.css']
})
export class CategoryItemComponent implements OnInit {

  @Input() category;
  @Output() onCategoryAdded = new EventEmitter<any>();

  toastrService: any
  locationService: LocationService

  constructor(private _toastrService: ToastrService,
              private _locationService: LocationService) { 

    this.toastrService = _toastrService;
    this.locationService = _locationService;
  }

  ngOnInit() {
  }

  saveCategory() {
    console.log(this.category);

    if (this.category.name.trim() == '') {
      this.toastrService.error('Category Name must not be blank.', 'Error!!', {"positionClass": "toast-bottom-right"});
      return;
    }

    if (this.category._id == '') {
      this.addCategory();
    } else {
      this.updateCategory();
    }
  }

  addCategory() {
    let self = this;
    return this.locationService.addCategory({
      customer_id: this.category.createdBy._id,
      status: this.category.status,
      name: this.category.name
    }).then(
      res => {                
        console.log(res.json())
        self.onCategoryAdded.emit(res.json());
      },
      err => {
        console.log(err);
        if (err._body != undefined && err._body != null) {
          self.toastrService.error(err._body, 'Error!!', {"positionClass": "toast-bottom-right"});
        } else {
          self.toastrService.error("Failed to create category.", 'Error!!', {"positionClass": "toast-bottom-right"});
        }
      }
    )
  }

  updateCategory() {
    let self = this;
    return this.locationService.updateCategory({
      _id: this.category._id,      
      status: this.category.status,
      name: this.category.name
    }).then(
      res => {                
        console.log(res.json())
        self.onCategoryAdded.emit(res.json());
      },
      err => {
        console.log(err);
        if (err._body != undefined && err._body != null) {
          self.toastrService.error(err._body, 'Error!!', {"positionClass": "toast-bottom-right"});
        } else {
          self.toastrService.error("Failed to create category.", 'Error!!', {"positionClass": "toast-bottom-right"});
        }
      }
    )
  }

}
