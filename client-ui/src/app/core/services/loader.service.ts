import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class LoaderService {
    isLoading = new Subject<boolean>();
    number_of_currently_loading_jobs = 0;

    trackALoadingJob() {
        this.number_of_currently_loading_jobs += 1;
        if (this.number_of_currently_loading_jobs == 1) this.isLoading.next(true);
    }

    untrackALoadingJob() {
        this.number_of_currently_loading_jobs -= 1;
        if (this.number_of_currently_loading_jobs == 0) this.isLoading.next(false);
    }

}
