import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Storages3Service } from '../../storages3/storages3.service';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Documents } from '../entities/document.entity';

@Injectable()
export class DocumentsService {
    constructor(
        @InjectRepository(Documents, 'mysqlDB') private docRepo: Repository<Documents>,
        private readonly storageService: Storages3Service,
    ) { }


    async createDocument(files: Array<Express.Multer.File>, userID: string, type: string) {
        if (files.length <= 0 || files.length == undefined) {
            let msgVerify = { message: "Error al cargar los documentos.", userID: userID, description: "No se han seleccionado ficheros." }
            return msgVerify
        }
        try {
            let documents = []
            files.forEach(async (file: any) => {
                if (file.fieldname == "front") {
                    let urls = await this.upLoadsDocuments(userID, files);
                    const newDocument = <Documents><unknown>{
                        id: uuidv4(),
                        type: type,
                        documentURL: await this.storageService.createFileDocument(userID, file),
                        ownerID: userID,
                        side: 'front'
                    };
                    const cDocument = this.docRepo.create(newDocument);
                    await this.docRepo.save(cDocument);
                    documents.push(cDocument);
                }
                if (file.fieldname == "rever") {
                    let urls = await this.upLoadsDocuments(userID, files);
                    const newDocument = <Documents><unknown>{
                        id: uuidv4(),
                        type: type,
                        documentURL: await this.storageService.createFileDocument(userID, file),
                        ownerID: userID,
                        side: 'rever'
                    };
                    console.log(newDocument)
                    const cDocument = this.docRepo.create(newDocument);
                    await this.docRepo.save(cDocument);
                    documents.push(cDocument);
                }
            })
            let res = { message: "documentos cargados", userID: userID }
            return res;
        } catch (e: any) {
            console.log(e.message);
        }
    }


    async upLoadsDocuments(userID: string, files: Array<Express.Multer.File>): Promise<string[]> {
        let urlsFIles = [];
        for await (const fileUrs of files) {
            const url = await this.storageService.createFileDocument(userID, fileUrs)
            urlsFIles = [...urlsFIles, url];

            if (urlsFIles.length == files.length) {
                console.log(urlsFIles)
                return urlsFIles;
            }
        }
    }
}
