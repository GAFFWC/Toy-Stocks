import { Inject, Injectable, Scope } from '@nestjs/common';
import { ClientRedis } from '@nestjs/microservices';
import { IsString } from 'class-validator';
import { Subject } from 'rxjs';
import { promisify } from 'util';
@Injectable({})
export class RedisService {
    constructor(@Inject('redis') private readonly redis: ClientRedis) {}

    private readonly client = this.redis.createClient(new Subject<Error>());

    ping() {
        return this.client.ping();
    }

    async get(key: string) {
        const getAsync = promisify(this.client.get).bind(this.client);

        console.log(await getAsync(key));
        this.client.get(key, (err, res) => {
            if (err) {
                console.error(err);
            }

            return res;
        });
    }
}
