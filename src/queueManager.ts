interface QueueItem<T> {
    item: T;
    priority?: number;
}

class FIFOQueue<T> {
    private queue: QueueItem<T>[] = [];

    enqueue(item: T): void {
        this.queue.push({ item });
    }

    dequeue(): T | undefined {
        return this.queue.shift()?.item;
    }

    isEmpty(): boolean {
        return this.queue.length === 0;
    }
}

class PriorityQueue<T> {
    private queue: QueueItem<T>[] = [];

    enqueue(item: T, priority: number): void {
        this.queue.push({ item, priority });
        this.queue.sort((a, b) => (a.priority! - b.priority!));
    }

    dequeue(): T | undefined {
        return this.queue.shift()?.item;
    }

    isEmpty(): boolean {
        return this.queue.length === 0;
    }
}

class RoundRobinQueue<T> {
    private queues: Record<string, QueueItem<T>[]> = {};
    private currentQueue = 0;

    addQueue(queueId: string): void {
        this.queues[queueId] = [];
    }

    enqueue(queueId: string, item: T): void {
        if (this.queues[queueId]) {
            this.queues[queueId].push({ item });
        }
    }

    dequeue(): T | undefined {
        const queueIds = Object.keys(this.queues);
        const queue = this.queues[queueIds[this.currentQueue]];

        if (queue && queue.length > 0) {
            this.currentQueue = (this.currentQueue + 1) % queueIds.length;
            return queue.shift()?.item;
        }

        this.currentQueue = (this.currentQueue + 1) % queueIds.length;
        return this.dequeue();
    }

    isEmpty(): boolean {
        return Object.values(this.queues).every(queue => queue.length === 0);
    }
}

export { FIFOQueue, PriorityQueue, RoundRobinQueue };
