import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { map, Observable } from 'rxjs';

@Injectable()
export class NodeService {

    constructor(private http: HttpClient) { }

    getFiles(): Observable<TreeNode[]> {
        return this.http.get<any>('assets/demo/data/files.json')
            .pipe(
                map(res => res.data as TreeNode[])
            );
    }

    getLazyFiles(): Observable<TreeNode[]> {
        return this.http.get<any>('assets/demo/data/files-lazy.json')
            .pipe(
                map(res => res.data as TreeNode[])
            );
    }

    getFilesystem(): Observable<TreeNode[]> {
        return this.http.get<any>('assets/demo/data/filesystem.json')
            .pipe(
                map(res => res.data as TreeNode[])
            );
    }

    getLazyFilesystem(): Observable<TreeNode[]> {
        return this.http.get<any>('assets/demo/data/filesystem-lazy.json')
            .pipe(
                map(res => res.data as TreeNode[])
            );
    }
}
