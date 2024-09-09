import Utils from '../utils/Utils';
import BaseObject from './BaseObject';

export default class BaseDao <T extends BaseObject> {

    private localStorageId;
    protected objects: T[];
    private staticObjects: T[];

    constructor(localStorageId:string, staticObjects: T[]){
        this.localStorageId = localStorageId;
        this.staticObjects = staticObjects;

        this.ensureObjects();
    }        

    public indexOf(object: T): number {
        return this.objects.indexOf(object);
    }

    public getById(id: string):T {
        return this.objects.filter(f => f.id == id).shift();
    }

    public getAll(): T[] {
        return this.objects;
    }

    public reset(): void {
        this.objects = JSON.parse(JSON.stringify(this.staticObjects));
        localStorage.setItem(this.localStorageId, JSON.stringify(this.objects));
        console.log(this.objects)
    }

    public import(json: string):void {
        console.log("import levels")
        this.objects = JSON.parse(json);
        localStorage.setItem(this.localStorageId, json);
    }

    private ensureObjects(): void {
        if (!this.objects) {
            //позже сделать наоборот: если есть интернет - забирать уровни с сервера на LoadingScreen
            
            if(window.location.href.indexOf("edit") == -1){
                //TODO array copy 
                this.objects = JSON.parse(JSON.stringify(this.staticObjects));

            } else {
                let forestsData = localStorage.getItem(this.localStorageId);
                if (forestsData) {
                    this.objects = JSON.parse(forestsData);
                } else {
                    //TODO array copy 
                    this.objects = JSON.parse(JSON.stringify(this.staticObjects));
                    localStorage.setItem(this.localStorageId, JSON.stringify(this.objects));
                }
            }
        }
    }

    public updateAll(){
        localStorage.setItem(this.localStorageId, JSON.stringify(this.objects));
    }

    public update(obj: T):void {
        let objectToReplace = this.objects.filter(f => f.id == obj.id).shift();
        // console.log("OBJECT TO REPLACE: " + objectToReplace)

        if (!objectToReplace) {
            this.objects.push(obj);
        } else {
            let index = this.objects.indexOf(objectToReplace);
            this.objects[index] = obj;
        }

        this.objects = this.objects.sort((f1, f2) => Utils.alphanumCompare(f1.id, f2.id));
        localStorage.setItem(this.localStorageId, JSON.stringify(this.objects));
    }

    public delete(id: string):void {
        let objectToDelete = this.objects.filter(obj => obj.id == id).shift();
        // console.log("OBJECT TO DELETE: " + objectToDelete)

        if (objectToDelete) {
            Utils.delete(this.objects, objectToDelete);
            localStorage.setItem(this.localStorageId, JSON.stringify(this.objects));
        }

    }

}


