const configFileUpload = {
    useTempFiles: true,//vamos a almacenarlo en un archivo temporal por mientras para luego enviarselo a cloudinary u otro servicio.
    tempFileDir: "./api/uploads"
};

module.exports = {configFileUpload}