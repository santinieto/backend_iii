export const info = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API de E-commerce Backend III",
            version: "1.0.0",
            description:
                "API completa para gestionar productos, usuarios, carritos, órdenes y autenticación con documentación Swagger",
        },
        servers: [
            {
                url: "http://localhost:8080",
                description: "Servidor local",
            },
        ],
    },
    apis: ["./src/docs/*.yml"],
};
