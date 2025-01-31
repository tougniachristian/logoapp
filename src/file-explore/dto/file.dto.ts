export class CreateFileDto {
  readonly name: string;
  readonly path: string;
  readonly type: string;
  readonly size: number;
}

export class UpdateFileDto {
  readonly name?: string;
}
