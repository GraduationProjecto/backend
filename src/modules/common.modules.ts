/* eslint-disable prettier/prettier */
import { Global, Module } from "@nestjs/common";
import { SendEmailService } from "src/common/services/send-email.services";

@Global()
@Module({
    imports:[],
    controllers:[],
    providers:[SendEmailService],
    exports:[SendEmailService]
})

export class CommonModule {}