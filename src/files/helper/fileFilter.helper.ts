
export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: Function) => {

    // console.log({file});

    if(!file) return callback(new Error('File no exits'), false);

    const fileExpetension = file.mimetype.split('/')[1];
    const validExtensions = ['jpg', 'jpge', 'png', 'gif'];

    if(validExtensions.includes( fileExpetension ) ){
        return callback(null, true);
    }

    callback(null ,false);

}