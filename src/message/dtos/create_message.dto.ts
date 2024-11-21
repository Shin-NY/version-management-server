import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageInput {
  @ApiProperty({ description: 'Message ID' })
    id: string;

  @ApiProperty({ description: 'The user ID' })
    userId: string;

  @ApiProperty({ description: 'The message text' })
    message: string;

  @ApiProperty({ description: 'The date of the message' })
    date: string;
}
