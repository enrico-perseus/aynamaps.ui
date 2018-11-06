import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LocationService } from '../../../../../components/auth/location.service';

@Component({
  selector: '[app-group-item]',
  templateUrl: './group-item.component.html',
  styleUrls: ['./group-item.component.css']
})
export class GroupItemComponent implements OnInit {

  @Input() group;
  @Output() onGroupAdded = new EventEmitter<any>();

  toastrService: any
  locationService: LocationService

  constructor(private _toastrService: ToastrService,
              private _locationService: LocationService) { 

    this.toastrService = _toastrService;
    this.locationService = _locationService;
  }

  ngOnInit() {
  }

  saveGroup() {
    console.log(this.group);

    if (this.group.group_name.trim() == '') {
      this.toastrService.error('Group Name must not be blank.', 'Error!!', {"positionClass": "toast-bottom-right"});
      return;
    }

    if (this.group._id == '') {
      this.addGroup();
    } else {
      this.updateGroup();
    }
  }

  addGroup() {
    let self = this;
    return this.locationService.addGroup({
      customer_id: this.group.createdBy._id,
      /* status: this.group.status, */
      group_name: this.group.group_name
    }).then(
      res => {                
        console.log(res.json())
        self.onGroupAdded.emit(res.json());
      },
      err => {
        console.log(err);
        if (err._body != undefined && err._body != null) {
          self.toastrService.error(err._body, 'Error!!', {"positionClass": "toast-bottom-right"});
        } else {
          self.toastrService.error("Failed to create group.", 'Error!!', {"positionClass": "toast-bottom-right"});
        }
      }
    )
  }

  updateGroup() {
    let self = this;
    return this.locationService.updateGroup({
      _id: this.group._id,      
      /* status: this.group.status, */
      group_name: this.group.group_name
    }).then(
      res => {                
        console.log(res.json())
        self.onGroupAdded.emit(res.json());
      },
      err => {
        console.log(err);
        if (err._body != undefined && err._body != null) {
          self.toastrService.error(err._body, 'Error!!', {"positionClass": "toast-bottom-right"});
        } else {
          self.toastrService.error("Failed to create group.", 'Error!!', {"positionClass": "toast-bottom-right"});
        }
      }
    )
  }

}
