import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bgi'
})
export class BgiPipe implements PipeTransform {

  transform(url: string): any {
    return `url(${url})`;
  }

}
