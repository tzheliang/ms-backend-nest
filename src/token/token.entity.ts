import { Expose } from 'class-transformer';

export class Token {
  @Expose()
  accessToken: string;
}
