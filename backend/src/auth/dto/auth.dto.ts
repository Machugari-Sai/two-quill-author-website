import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator'

export class RegisterDto {
  @IsString() @IsNotEmpty() @MaxLength(80) name!: string
  @IsEmail() @MaxLength(254) email!: string
  @IsString() @MinLength(8) @MaxLength(128) @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { message: 'Password must include uppercase, lowercase, and a number.' }) password!: string
}

export class LoginDto {
  @IsEmail() email!: string
  @IsString() @IsNotEmpty() password!: string
}
