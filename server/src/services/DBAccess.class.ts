import { 
    CollectionReference,
    Query
} from "@google-cloud/firestore";
import { firestore } from "@databases";
import { Operator } from "@typings";

class DBAccess {
    protected _collection: CollectionReference;
    protected _uid?: string;
    protected _wheres: Array<[field: string, operator: Operator, value: any]>;
    protected _startAfter?: string;
    protected _limit?: number;

    constructor(dbName: string) {
        this._collection = firestore.collection(dbName);
        this._uid = undefined;
        this._wheres = [];
        this._startAfter = undefined;
        this._limit = undefined;
    }

    protected restartAllStates() {
        this._uid = undefined;
        this._wheres = [];
        this._startAfter = undefined;
        this._limit = undefined;
    }

    public doc(uid = ""): DBAccess {
        this._uid = uid;
        return this;
    }

    public where(field: string, operator: Operator, value: any): DBAccess {
        this._wheres.push([field, operator, value]);
        return this;
    }

    public startAfter(uid: string): DBAccess {
        this._startAfter = uid;
        return this;
    }

    public limit(limit = 1000): DBAccess {
        this._limit = limit;
        return this;
    }

    public async update(updates: any): Promise<Date> {
        if (!this._uid) return new Date();

        for (const key in updates) {
            if (updates[key] === undefined)
                delete updates[key];
        }

        const updateTime = await this._collection.doc(this._uid).update({ ...updates, uid: this._uid });
        this.restartAllStates();
        return updateTime.writeTime.toDate();
    }
    
    public async delete(): Promise<Date> {
        if (!this._uid) return new Date();
        const deleteTime = await this._collection.doc(this._uid).delete();
        this.restartAllStates();
        return deleteTime.writeTime.toDate();
    }

    public async create<T>(data: T): Promise<Date> {
        if (!this._uid) return new Date();

        for (const key in data) {
            if (data[key] === undefined)
                delete data[key];
        }

        const createTime = await this._collection.doc(this._uid).set({ ...data, uid: this._uid });
        this.restartAllStates();
        return createTime.writeTime.toDate();
    }
    
    public async get<T>(): Promise<T[]> {
        if (this._uid) {
            const uid = this._uid;
            this.restartAllStates();
            return [(await this._collection.doc(uid).get()).data() as T];
        }

        let lastDoc = undefined;
        if (this._startAfter) {
            lastDoc = await this._collection.doc(this._startAfter).get();
        }

        const results = [];
        
        do {
            let query: Query = this._collection;

            for (const where of this._wheres) {
                const [field, operator, value] = where;
                query = query.where(field, operator, value);
            }
    
            if (lastDoc) {
                query = query.startAfter(lastDoc);
                lastDoc = undefined;
            }

            query = query.limit(1000);

            const { docs } = await query.get();
        
            for (const doc of docs) {
                if (
                    this._limit !== undefined && 
                    results.length >= this._limit
                ) {
                    lastDoc = undefined;
                    break;
                }
                results.push(doc.data());
                lastDoc = doc;
            }
        } while(lastDoc);
   
        this.restartAllStates();
        
        return results as T[];
    }
}

export default DBAccess;