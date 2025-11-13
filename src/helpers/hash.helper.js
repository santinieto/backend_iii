import bcrypt from "bcrypt";

// Función para generar un hash a partir de una contraseña
export const createHash = (data) => {
    const salt = bcrypt.genSaltSync(10); // Genera el salt de manera síncrona
    return bcrypt.hashSync(data, salt); // Hashea la contraseña usando el salt
};

// Función para validar una contraseña comparándola con el hash almacenado
export const compareHash = (data1, data2) => {
    return bcrypt.compareSync(data1, data2); // Se comparan correctamente los valores
};
