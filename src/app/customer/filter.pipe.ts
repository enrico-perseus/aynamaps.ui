import { Pipe, PipeTransform } from '@angular/core';
import {forEach} from "@angular/router/src/utils/collection";

@Pipe({
    name: 'filter',
    pure: false
})

export class FilterPipe implements PipeTransform {
    /* transform(items: any[], term: String): any {
        return items.filter(item => item.id.indexOf(term) !== -1);
    } */


   transform(items: any, filter: any): any {
     let self = this;
     if (!filter){
         items.forEach(function(item){
             if(item['id'] && item['id'] != '')
             {
                 var selector = '.viewport div[value=' + item['id'] + ']';
                 $(selector).css('display','block');
             }
         });
         return items;
     }
      if (!filter || !items) return items;
      if (filter && Array.isArray(items)) {
          let serach_text = filter.toLowerCase();
          //return items.filter(item => JSON.stringify(item).toLowerCase().includes(serach_text));
          return items.filter(function (item: any) {

              var selector = '.viewport div[value=' + item['id'] + ']';

                for (let property in item) {


                  if (!item[property]) {
                      if(item['id'] && item['id'] != '')
                        $(selector).css('display','block');
                      continue;
                  }
                  if (JSON.stringify(item[property]).toLowerCase().includes(serach_text)) {
                      if(item['id'] && item['id'] != '')
                        $(selector).css('display','block');
                      return true;
                  }
                }
                if(item['id'] && item['id'] != '')
                    $(selector).css('display','none');
                return false;

            });
      } else {
          return items;
      }
    }
}