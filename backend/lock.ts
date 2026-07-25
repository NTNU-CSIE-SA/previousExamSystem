import ReadWriteLock from 'async-rwlock';

class FileLockManager {
    private locks = new Map<string, ReadWriteLock>();

    private getLock(fileId: number | string): ReadWriteLock {
        const key = String(fileId);
        if (!this.locks.has(key)) {
            this.locks.set(key, new ReadWriteLock());
        }
        return this.locks.get(key)!;
    }

    public async readLock(fileId: number | string) {
        return this.getLock(fileId).readLock();
    }

    public async readUnlock(fileId: number | string) {
        return this.getLock(fileId).unlock();
    }

    public async writeLock(fileId: number | string) {
        return this.getLock(fileId).writeLock();
    }

    public async writeUnlock(fileId: number | string) {
        return this.getLock(fileId).unlock();
    }
}

export const fileLockManager = new FileLockManager();
