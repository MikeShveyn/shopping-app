import { IsNotEmpty, IsString, Length } from "class-validator";

// todo add checks with validators !!
export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @Length(2, 50)
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @Length(2, 50)
    lastName: string;

    @IsString()
    @IsNotEmpty()
    @Length(3, 50)
    username: string;
}

