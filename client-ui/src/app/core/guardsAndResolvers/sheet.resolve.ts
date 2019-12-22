import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { SheetService } from '../services/sheet.service';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
// import 'rxjs/add/operator/map';

@Injectable()
export class SheetResolver implements Resolve<any> {

    constructor(private sheetService: SheetService) {}

    resolve() {
        const request = this.sheetService.loadSheetMenu().pipe(
          mergeMap(responseBody => {
            const sheets = responseBody['result']['sheetNames'];
            if(sheets.length > 0)
              return this.sheetService.setSelectedSheet(sheets[0]);
            else return [];
          })
        );
        // mergeMap()
        // const request = this.sheetService.loadSheetMenu().subscribe((responseBody) => {
        //     const sheets = responseBody['result']['sheetNames'];
        //     this.sheetService.setSelectedSheet(sheets[0]);
        // }, () => {});
        return request;
    }
}
