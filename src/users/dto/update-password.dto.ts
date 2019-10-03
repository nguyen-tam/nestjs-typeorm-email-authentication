import { ApiModelProperty } from "@nestjs/swagger";

export class UpdatePasswordDto {

  @ApiModelProperty()
  readonly current_password: string;

  @ApiModelProperty()
  readonly password: string;
}