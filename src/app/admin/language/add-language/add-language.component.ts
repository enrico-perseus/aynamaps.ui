import { Component, OnInit, Input } from '@angular/core';
import {CustomerService} from "../../../../components/auth/customer.service";
import { LanguageService } from '../../../../components/auth/language.service';
import { ToastrService } from 'ngx-toastr';
import { LanguageComponent } from '../language/language.component';

@Component({
  selector: 'app-add-language',
  templateUrl: './add-language.component.html',
  styleUrls: ['./add-language.component.css']
})
export class AddLanguageComponent implements OnInit {

  languageData = {
    language:           '',
    direction:          true,
    inspire_me:         '',
    search:             '',
    easy_access:        '',
    destination:        '',
    top5:               '',
    downloading:        '',
    connect:            '',
    save_lang:          '',
    cancel_lang:        '',
    resync:             '',
    release_license:    '',
    default_view:       '',
    smart_mode:         '',
    normal_mode:        '',
    player_id:          '',
    default_language:   '',
    lang:               ''
  };

  @Input()
  parent: LanguageComponent;

  languageService: LanguageService;
  toastrService: ToastrService;

  constructor(private _languageService: LanguageService,
              private _toastrService: ToastrService) { 
    this.languageService = _languageService;
    this.toastrService = _toastrService;
  }

  ngOnInit() {
  }

  save() {
    let self = this;     
    this.languageService.create(this.languageData).then (
      res => {
        console.log(res);
        this.parent.getLanguages();
        self.cancel();       
      },
      err => {
        console.log(err);
        if (err._body != undefined && err._body != null) {
          self.toastrService.error(err._body, 'Error!!', {"positionClass": "toast-bottom-right"});
        } else {
          self.toastrService.error("Failed to register language information.", 'Error!!', {"positionClass": "toast-bottom-right"});
        }
      }
    )
  }

  cancel() {
    this.parent.bShowLang = true;
    this.parent.bShowAdd = false;
    this.parent.bShowEdit = false;
  }
}
