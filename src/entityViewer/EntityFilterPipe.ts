import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'entityFilterPipe'
})
export class EntityFilterPipe implements PipeTransform {

    transform(items: any[], filter: string, primary? : string, secondary? : string): any {
        if (!items || !filter) {
            return items;
        }

        return items.filter(item => (item[primary].toLowerCase().indexOf(filter.toLowerCase()) !== -1) ||
                                        item[secondary].toLowerCase().indexOf(filter.toLowerCase()) !== -1);
    }
}