import { Component, OnInit, Input } from '@angular/core';
import { LanguageService } from '../../../../components/auth/language.service';
import { ToastrService } from 'ngx-toastr';
import { LanguageComponent } from '../language/language.component';

@Component({
  selector: 'app-edit-language',
  templateUrl: './edit-language.component.html',
  styleUrls: ['./edit-language.component.css']
})
export class EditLanguageComponent implements OnInit {

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
  languageId: String;

  @Input()
  parent: LanguageComponent;

  languageService: LanguageService;
  toastrService: ToastrService;

  constructor(private _languageService: LanguageService,
              private _toastrService: ToastrService) { 
    this.toastrService = _toastrService;
    this.languageService = _languageService;
  }

  ngOnInit() {
    this.getLanguage();
  }

  getLanguage() {
    let self = this;
    this.languageService.get(this.languageId).then(
      res => {
        console.log(res.json())
        self.languageData = res.json();
      },
      err => {        
        self.toastrService.error("Failed to get language information.", 'Error!!', {"positionClass": "toast-bottom-right"});
      }
    )
  }

  save() {
    let self = this;    
    this.languageService.update(this.languageData).then(
      res => {        
        self.parent.getLanguages();
        self.cancel();
      },
      err => {
        console.log(err);
        if (err._body != undefined && err._body != null) {
          self.toastrService.error(err._body, 'Error!!', {"positionClass": "toast-bottom-right"});
        } else {
          self.toastrService.error("Failed to update language information.", 'Error!!', {"positionClass": "toast-bottom-right"});
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
