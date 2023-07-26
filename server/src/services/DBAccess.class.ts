import { CollectionReference, Query } from "@google-cloud/firestore";
import { firestore } from "@databases";
import { Operator } from "messaging-app-globals";

class DBAccess<T = { [key: string]: any }> {
    protected _index: number;
    protected _collection: CollectionReference;
    protected _uid?: string;
    protected _wheres: Array<
        [field: keyof T, operator: Operator, value: T[keyof T]]
    >[];
    protected _startAfter: string[];
    protected _limit?: number;
    protected _orders: Array<[field: keyof T, direction: "asc" | "desc"]>;

    constructor(dbName: string) {
        this._index = 0;
        this._collection = firestore.collection(dbName);
        this._uid = undefined;
        this._wheres = [];
        this._startAfter = [];
        this._limit = undefined;
        this._orders = [];
    }

    protected restartAllStates() {
        this._index = 0;
        this._uid = undefined;
        this._wheres = [];
        this._startAfter = [];
        this._limit = undefined;
    }

    public doc(uid: string) {
        this._uid = uid;
        return this;
    }

    public byUid(uid: string) {
        return this.doc(uid);
    }

    public uid(uid: string) {
        return this.doc(uid);
    }

    public getByUid(uid: string) {
        this.doc(uid);
        return this.getFirst();
    }

    public where(field: keyof T, operator: Operator, value: T[keyof T]) {
        if (!this._wheres[this._index]) this._wheres[this._index] = [];

        this._wheres[this._index].push([field, operator, value]);

        return this;
    }

    public and(field: keyof T, operator: Operator, value: T[keyof T]) {
        return this.where(field, operator, value);
    }

    public or(field: keyof T, operator: Operator, value: T[keyof T]) {
        this._index++;
        return this.where(field, operator, value);
    }

    public startAfter(uid: string) {
        this._startAfter.push(uid);
        return this;
    }

    public limit(limit: number) {
        this._limit = limit;
        return this;
    }

    public orderBy(field: keyof T, direction: "asc" | "desc") {
        this._orders.push([field, direction]);
        return this;
    }

    public async update(updates: Partial<T>) {
        if (!this._uid) throw new Error("DBAccess.uid required");

        for (const key in updates) {
            if (updates[key] === undefined) delete updates[key];
        }

        const updateTime = await this._collection
            .doc(this._uid)
            .update({ ...updates, uid: this._uid });
        this.restartAllStates();
        return updateTime.writeTime.toDate();
    }

    public async delete() {
        if (!this._uid) throw new Error("DBAccess.uid required");
        const deleteTime = await this._collection.doc(this._uid).delete();
        this.restartAllStates();
        return deleteTime.writeTime.toDate();
    }

    public async create(data: T) {
        if (!this._uid) throw new Error("DBAccess.uid required");

        for (const key in data) {
            if (data[key] === undefined) delete data[key];
        }

        const createTime = await this._collection
            .doc(this._uid)
            .set({ ...data, uid: this._uid });
        this.restartAllStates();
        return createTime.writeTime.toDate();
    }

    public async get() {
        if (this._uid) {
            const uid = this._uid;
            this.restartAllStates();
            return [(await this._collection.doc(uid).get()).data() as T];
        }

        const results = [];

        for (let i = 0; i < this._wheres.length; i++) {
            const whereSet = this._wheres[i];
            const startAfter = this._startAfter[i];

            let lastDoc = undefined;
            if (startAfter) {
                lastDoc = await this._collection.doc(startAfter).get();
            }

            do {
                let query: Query = this._collection;

                for (const where of whereSet) {
                    const [field, operator, value] = where;
                    query = query.where(field as string, operator, value);
                }

                for (const order of this._orders) {
                    const [field, direction] = order;
                    query = query.orderBy(field as string, direction);
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
            } while (lastDoc);
        }

        this.restartAllStates();

        return results as T[];
    }

    public async getFirst(): Promise<T | undefined> {
        const results = await this.get();
        return results[0];
    }

    public async getLast(): Promise<T | undefined> {
        const results = await this.get();
        return results[results.length - 1];
    }
}

export default DBAccess;
