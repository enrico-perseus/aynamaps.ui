import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../../../components/auth/language.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.css']
})
export class LanguageComponent implements OnInit {

  bShowLang = true;
  bShowAdd = false;
  bShowEdit = false

  languages = [];
  languageId = '';
  selectedLang = [];
  p = 1;

  languageService: LanguageService;
  toastrService: ToastrService;

  constructor(private _languageService: LanguageService,
              private _toastrService: ToastrService) {

    this.languageService = _languageService;
    this.toastrService = _toastrService;
  }

  ngOnInit() {
    this.getLanguages();
  }

  openMenu() {
    var x = document.getElementById("langNav");    
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
  }

  getLanguages() {
    let self = this;
    this.languageService.query().then(
      res => {                
        self.languages = res.json();
        self.selectedLang = [];
        console.log(this.languages)
      },
      err => {        
        self.toastrService.error('Failed to get language list.', 'Error!!', {"positionClass": "toast-bottom-right"});
      }
    )
  }

  selectLang(id) {
    let index = id + (this.p - 1) * 10;
    this.languages[index].selected = !this.languages[index].selected;
    if (this.languages[index].selected){
      this.selectedLang.push({_id: this.languages[index]._id});
    } else {
      this.selectedLang = this.selectedLang.filter(item => item._id != this.languages[index]._id);
    }
    console.log(this.selectedLang); 
  }

  addLanguage() {
    
    this.bShowAdd = true;
    this.bShowLang = false;
    this.bShowEdit = false;
    this.selectedLang = [];
    
  }

  showLangList() {
    this.bShowAdd = false;
    this.bShowLang = true;
    this.bShowEdit = false;
  }

  editLanguage() {
    if (this.selectedLang.length == 1){
      this.bShowAdd = false;
      this.bShowLang = false;
      this.bShowEdit = true;
      this.languageId = this.selectedLang[0]._id;
      this.selectedLang = [];
    }
  }

  deleteLanguage() {
    let self = this;
    if (this.selectedLang.length == 1){
      this.languageService.remove(this.selectedLang[0]._id).then(
        res => {                
          self.getLanguages();        
        },
        err => {        
          self.toastrService.error('Failed to remove language information.', 'Error!!', {"positionClass": "toast-bottom-right"});
        }
      )
    }
  }
}
